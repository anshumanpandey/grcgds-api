require("dotenv").config();
import Axios, { AxiosRequestConfig } from "axios";
import { addSeconds, isAfter } from "date-fns";
import { getDbFor } from "./DB";

export const generateAccessToken = async () => {
  const axiosConfig: AxiosRequestConfig = {
    method: "post",
    url: `https://api.trustpilot.com/v1/oauth/oauth-business-users-for-applications/accesstoken`,
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.TRUSTPILOT_KEY}:${process.env.TRUSTPILOT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: `grant_type=password&username=${process.env.TRUSTPILOT_EMAIL}&password=${process.env.TRUSTPILOT_PASSWORD}`,
  };
  const { data } = await Axios(axiosConfig);

  return data;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const axiosConfig: AxiosRequestConfig = {
    method: "post",
    url: `https://api.trustpilot.com/v1/oauth/oauth-business-users-for-applications/refresh`,
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.TRUSTPILOT_KEY}:${process.env.TRUSTPILOT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
  };
  const { data } = await Axios(axiosConfig);

  return data as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
};

export const getTrustpilotBusinesses = async () => {
  return getDbFor()?.("TrustpilotIdSupplierMap");
};

export const fetchReviews = async (
  business: SupplierBusiness
): Promise<Review[]> => {
  let tokenData: any | undefined = undefined;
  let accessToken = business.accessToken;

  if (
    !business.accessToken ||
    !business.refreshToken ||
    !business.expiresIn ||
    !business.updatedAt
  ) {
    const credentials = await generateAccessToken();
    accessToken = credentials.access_token;

    tokenData = {
      refreshToken: credentials.refresh_token,
      accessToken: credentials.access_token,
      expiresIn: parseInt(credentials.expires_in, 10),
      id: business.id,
    };
  } else if (supplierTokenHasExpired({ business })) {
    const refresh = await refreshAccessToken(business.refreshToken);
    accessToken = refresh.access_token;

    tokenData = {
      refreshToken: refresh.refresh_token,
      accessToken: refresh.access_token,
      expiresIn: parseInt(refresh.expires_in.toString(), 10),
      id: business.id,
    };
  }

    console.log({ isExpired: supplierTokenHasExpired({ business }) });
  if (tokenData) {
    await saveRefreshToken(tokenData);
  }
  const params = {
    count: 100,
    language: "en",
    token: accessToken,
  };
  const { data } = await Axios({
    method: "get",
    url: `https://api.trustpilot.com/v1/private/business-units/${business.trustpilotId}/reviews`,
    params,
  });

  return data.reviews;
};

const saveReviews = async (d: Review[]) => {
  const reviewsBodies = await getDbFor()?.("TrustpilotReviewBody").whereIn(
    "reviewId",
    d.map((r) => r.id)
  );

  const repliesBodies = await getDbFor()?.("TrustpilotReviewReplies").whereIn(
    "reviewId",
    d.map((r) => r.id)
  );

  const findRecordPerReviewId = (review: Review) => (b: any) =>
    b.reviewId === review.id;

  const findRecordPerDate =
    (review: { updatedAt: string | null; createdAt: string }) =>
    (reviewBody: any) => {
      const reviewDate = review.updatedAt || review.createdAt;
      return reviewDate.toString() === reviewBody.createdAt.toString();
    };

  const parseData = (r: Review[]) => {
    const data = {
      reviews: [] as any[],
      bodies: [] as any[],
      replies: [] as any[],
      locations: [] as { id: string; name: string }[],
      consumers: [] as Pick<
        Consumer,
        "id" | "displayName" | "displayLocation" | "numberOfReviews"
      >[],
    };

    for (let i = 0, len = r.length; i < len; i++) {
      const review = r[i];
      if (review.location) {
        data.locations.push({
          id: review.location.id,
          name: review.location.name,
        });
      }

      data.consumers.push({
        id: review.consumer.id,
        displayName: review.consumer.displayName,
        displayLocation: review.consumer.displayLocation,
        numberOfReviews: review.consumer.numberOfReviews,
      });
      data.reviews.push({
        id: review.id,
        stars: review.stars,
        businessId: review.businessUnit.id,
        language: review.language,
        isVerified: review.isVerified,
        source: review.source,
        reviewVerificationLevel: review.reviewVerificationLevel,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        locationName: review.location?.name,
        consumerName: review.consumer.displayName,
      });

      const currentReviewsBodies = reviewsBodies.filter(
        findRecordPerReviewId(review)
      );
      const reviewFound = currentReviewsBodies.find(findRecordPerDate(review));
      if (reviewFound === undefined) {
        data.bodies.push({
          title: review.title,
          text: review.text,
          createdAt: review.updatedAt || review.createdAt,
          reviewId: review.id,
        });
      }

      if (review.companyReply) {
        const currentReviewsReplies = repliesBodies.filter(
          findRecordPerReviewId(review)
        );
        const replyFound = currentReviewsReplies.find(
          findRecordPerDate(review.companyReply)
        );
        if (replyFound === undefined) {
          data.replies.push({
            authorBusinessUserId: review.companyReply.authorBusinessUserId,
            text: review.companyReply.text,
            createdAt:
              review.companyReply.updatedAt || review.companyReply.createdAt,
            reviewId: review.id,
          });
        }
      }
    }
    return data;
  };
  const review = parseData(d);
  return getDbFor()?.transaction((trx) => {
    return trx("TrustpilotLocation")
      .insert(review.locations)
      .onConflict("id")
      .merge()
      .then(() => {
        return trx("TrustpilotConsumer")
          .insert(review.consumers)
          .onConflict("id")
          .merge();
      })
      .then(() => {
        const addLocationQuery = (r: any) => {
          const { locationName, consumerName, ...data } = r;
          if (locationName) {
            data.locationId = trx("TrustpilotLocation")
              .select(["id"])
              .where("name", locationName);
          }
          data.consumerId = trx("TrustpilotConsumer")
            .select(["id"])
            .where("displayName", consumerName)
            .first();
          return data;
        };
        const records = review.reviews.map(addLocationQuery);
        return trx("TrustpilotReview").insert(records).onConflict("id").merge();
      })
      .then(() => {
        return trx("TrustpilotReviewBody").insert(review.bodies);
      })
      .then(() => {
        return trx("TrustpilotReviewReplies").insert(review.replies);
      });
  });
};

const job = async () => {
  const perform = (v: any) => {
    return fetchReviews(v).then((reviews) => {
      return saveReviews(reviews);
    });
  };
  const names = ["right-cars.com", "www.zezgo.com"];
  const businesses = await getTrustpilotBusinesses();
  for (let i = 0; i < businesses.length; i++) {
    const b = businesses[i];
    await perform(b);
  }
  console.log("success!");
};

export const saveRefreshToken = (data: {
  refreshToken: string;
  id: string;
  accessToken: string;
  expiresIn: number;
}) => {
  const { id, ...all } = data;
  const update = {
    ...all,
    updatedAt: new Date().valueOf(),
  };
  const query = getDbFor()?.("TrustpilotIdSupplierMap")
    .update(update)
    .where("id", id);

  return query;
};

type SupplierBusiness = {
  id: string;
  trustpilotId: string;
  supplierName: string;
  refreshToken?: string;
  accessToken?: string;
  expiresIn?: number;
  updatedAt?: string;
};
export const findBussinessByReviewId = (data: {
  reviewId: string;
}): Promise<SupplierBusiness> => {
  return getDbFor()?.("TrustpilotReview")
    .select("TrustpilotIdSupplierMap.*")
    .where("TrustpilotReview.id", data.reviewId)
    .innerJoin(
      "TrustpilotIdSupplierMap",
      "TrustpilotReview.businessId",
      "=",
      "TrustpilotIdSupplierMap.trustpilotId"
    )
    .first();
};

export const supplierTokenHasExpired = (data: {
  business: SupplierBusiness;
}) => {
  if (!data.business.updatedAt) return false;
  if (!data.business.expiresIn) return false;

  const expireDate = addSeconds(
    new Date(parseInt(data.business.updatedAt, 10)),
    data.business.expiresIn
  );

  return isAfter(new Date(), expireDate);
};

const FETCH_INTERVAL_HOURS = 24;

export const startReviewTracker = () => {
  job().catch((err) => console.log("error: ", err));
  setInterval(() => {
    job().catch((err) => console.log("error: ", err));
  }, 1000 * 60 * 60 * FETCH_INTERVAL_HOURS);
};

export interface Review {
  links: Link[];
  id: string;
  consumer: Consumer;
  businessUnit: BusinessUnit;
  stars: number;
  title: string;
  text: string;
  location: null | {
    id: string;
    name: string;
    urlFormattedName: string;
  };
  language: string;
  createdAt: string;
  updatedAt: string | null;
  companyReply: null | {
    text: string;
    authorBusinessUserId: string;
    createdAt: string;
    updatedAt: string;
  };
  isVerified: boolean;
  source: string;
  invitation: Invitation;
  businessUnitHistory: any[];
  reviewVerificationLevel: string;
}

export interface BusinessUnit {
  links: Link[];
  id: string;
  displayName: string;
  name: Name;
}

export interface Link {
  href: string;
  method: string;
  rel: string;
}

export interface Name {
  identifying: string;
  referring: string[];
}

export interface Consumer {
  links: Link[];
  id: string;
  displayName: string;
  profileUrl: string;
  profileImage: ProfileImage;
  displayLocation: undefined | string;
  numberOfReviews: undefined | string;
}

export interface ProfileImage {
  image24x24: null;
  image35x35: null;
  image64x64: null;
  image73x73: null;
}

export interface Invitation {
  businessUnitId: string;
}
