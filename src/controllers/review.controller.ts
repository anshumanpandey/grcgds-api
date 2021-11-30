import Axios, { AxiosRequestConfig } from "axios";
import { getDbFor } from "../utils/DB";
import { findBussinessByReviewId, generateAccessToken, saveRefreshToken, refreshAccessToken,supplierTokenHasExpired } from "../utils/ReviewTracker";

export const replyReview = async (body: any) => {
  const reviewId = body.ReviewID;
  const answerText = body.Answer;

  const supplierBesiness = await findBussinessByReviewId({ reviewId })
  let accessToken = supplierBesiness.accessToken;

  let tokenData: any | undefined = undefined

  if (
    !supplierBesiness.accessToken ||
    !supplierBesiness.refreshToken ||
    !supplierBesiness.expiresIn || 
    !supplierBesiness.updatedAt
  ) {
    const credentials = await generateAccessToken();
    accessToken = credentials.access_token;

    tokenData = {
      refreshToken: credentials.refresh_token,
      accessToken: credentials.access_token,
      expiresIn: credentials.expires_in,
      id: supplierBesiness.id,
    }

  } else if (supplierTokenHasExpired({ business: supplierBesiness })) {
    const refresh = await refreshAccessToken("");
    accessToken = refresh.access_token;

    tokenData = {
      refreshToken: refresh.refresh_token,
      accessToken: refresh.access_token,
      expiresIn: refresh.expires_in,
      id: supplierBesiness.id,
    };
  }

  console.log({ tokenData });
  console.log({ accessToken });
  if (tokenData) {
    await saveRefreshToken(tokenData); 
  }

  const data = {
    message: answerText,
    authorBusinessUserId: supplierBesiness.trustpilotId,
  };

  const axiosConfig: AxiosRequestConfig = {
    method: "post",
    url: `https://api.trustpilot.com/v1/private/reviews/${reviewId}/reply`,
    data,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  await Axios(axiosConfig)
    .then(() => {
      getDbFor()?.("TrustpilotReviewReplies").insert({
        authorBusinessUserId: data.authorBusinessUserId,
        text: data.message,
        createdAt: new Date().toISOString(),
        reviewId: reviewId,
      });

    })
    .catch((err) => {
      console.log(err.response.data);
    });

    return [
      { Success: "Yes" },
      200,
      "OTA_ReviewRes",
      {
        "xsi:schemaLocation":
          "http://www.opentravel.org/OTA/2003/05 OTA_VehAvailRateRS.xsd",
      },
    ];
};


export const getReviews = async (body: any) => {
  const query = getDbFor()
    ?.select([
      "TrustpilotReview.id as Id",
      "TrustpilotReview.stars as Stars",
      "TrustpilotReviewBody.title as Title",
      "TrustpilotReviewBody.text as Text",
      "TrustpilotConsumer.id as ConsumerId",
      "TrustpilotConsumer.displayName as ConsumerDisplayName",
      "TrustpilotIdSupplierMap.supplierName as SupplierName",
      getDbFor()?.raw(
        "(CASE WHEN isVerified <> 0 THEN 'True' ELSE 'False' END) as IsVerified"
      ),
      getDbFor()?.raw(
        "(CASE WHEN reviewVerificationLevel <> 0 THEN 'True' ELSE 'False' END) as ReviewVerificationLevel"
      ),
    ])
    .from("TrustpilotReview")
    .innerJoin(
      "TrustpilotReviewBody",
      "TrustpilotReview.id",
      "=",
      "TrustpilotReviewBody.reviewId"
    )
    .innerJoin(
      "TrustpilotConsumer",
      "TrustpilotReview.consumerId",
      "=",
      "TrustpilotConsumer.id"
    )
    .innerJoin(
      "TrustpilotIdSupplierMap",
      "TrustpilotReview.businessId",
      "=",
      "TrustpilotIdSupplierMap.trustpilotId"
    );

  const Review = await query;

  const parse = (el: any) => ({ Review: el });

  return [
    { Reviews: [Review.map(parse)] },
    200,
    "OTA_ReviewRes",
    {
      "xsi:schemaLocation":
        "http://www.opentravel.org/OTA/2003/05 OTA_VehAvailRateRS.xsd",
    },
  ];
};
