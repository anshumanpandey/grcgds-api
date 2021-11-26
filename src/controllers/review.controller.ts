import Axios, { AxiosRequestConfig } from "axios";
import { getDbFor } from "../utils/DB";

export const replyReview = async (body: any) => {
  const reviewId = body.ReviewID;
  const answerText = body.Answer;

  const [business, credentials] = await Promise.all([
    getBusinessId(),
    getCredentials(),
  ]);

  const data = {
    message: answerText,
    authorBusinessUserId: business.id,
  };

  const axiosConfig: AxiosRequestConfig = {
    method: "post",
    url: `https://api.trustpilot.com/v1/private/reviews/${reviewId}/reply`,
    data,
    headers: {
      Authorization: `Bearer ${credentials.access_token}`,
    },
  };

  await Axios(axiosConfig)
    .then(({ data: responseBody }) => {
      console.log(responseBody);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

const getCredentials = async () => {
  const { data } = await Axios({
    method: "post",
    url: `https://api.trustpilot.com/v1/oauth/oauth-business-users-for-applications/accesstoken`,
    headers: {
      Authorization: `Basic ${Buffer.from(
        "aYJy0oD9JI4Rm9PjBjdiIZtGIin6gLF5:nlKRljtRbzZdlYWq"
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=password&username=alison.lee@tlinternationalgroup.com&password=Vaccine21!",
  });

  return data;
};

const getBusinessId = async () => {
  const params = {
    apikey: "aYJy0oD9JI4Rm9PjBjdiIZtGIin6gLF5",
    name: "right-cars.com",
  };
  const { data } = await Axios({
    method: "get",
    url: "https://api.trustpilot.com/v1/business-units/find",
    params,
  });

  return data;
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
