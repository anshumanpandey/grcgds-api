import Axios, { AxiosRequestConfig } from "axios";
const allSettled = require("promise.allsettled");
import { ApiError } from "../utils/ApiError";
import { getDbFor } from "../utils/DB";
import { getClientData } from "../utils/getClientData";
import {
  findBussinessByReviewId,
  getCachedTokenForBusiness,
  getBusiness,
  SupplierBusiness,
  sendInvtiationLink,
} from "../utils/ReviewTracker";

export const replyReview = async (body: any) => {
  const reviewId = body.ReviewID;
  const answerText = body.Answer;
  const publish = body.Publish;
  const refNumber = body.RefNumber;
  const branchID = body.BranchID;

  const found = await getDbFor()?.("TrustpilotReviewReplies")
    .select()
    .where({ reviewId })
    .first();
  if (found) {
    throw new ApiError("Review already answered");
  }

  const supplierBesiness = await findBussinessByReviewId({
    reviewId: reviewId,
  });

  const dbRecord = {
    authorBusinessUserId: supplierBesiness.trustpilotId,
    text: answerText,
    createdAt: new Date().toISOString(),
    reviewId: reviewId,
    posted: false,
    refNumber: null,
    branchID: null,
  };
  if (refNumber) {
    dbRecord.refNumber = refNumber;
  }
  if (branchID) {
    dbRecord.branchID = branchID;
  }

  if (publish === "1") {
    const clientId = body.POS.Source.RequestorID.ID.replace("GRC-", "").slice(
      0,
      -4
    );
    const client = await getClientData({ id: clientId });

    const accessToken = await getCachedTokenForBusiness({
      client,
      supplierBesiness,
    });

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
        dbRecord.posted = true;
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  await getDbFor()?.("TrustpilotReviewReplies").insert(dbRecord);

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

export const sendInvitations = async (body: any) => {
  type ReviewData = { Email: string; RefNumber: string; BranchLocation: string };
  const reviewData = Array.isArray(body.CustomersData.CustomerData)
    ? body.CustomersData.CustomerData
    : ([body.CustomersData.CustomerData] as ReviewData[]);

  const clientId = body.POS.Source.RequestorID.ID.replace("GRC-", "").slice(
    0,
    -4
  );
  const client = await getClientData({ id: clientId });

  const trustpilotEmail = client.trustpilotEmail;
  if (!trustpilotEmail || !client.trustpilotPassword) {
    throw new ApiError("Client has not defined Trustpilot credentials");
  }
  const businesses = await getBusiness();

  const dispatchEmails = async (b: SupplierBusiness) => {
    const accessToken = await getCachedTokenForBusiness({
      client,
      supplierBesiness: b,
    });

    const filterFn = (d: ReviewData) =>
      d.RefNumber.includes(b.supplierName === "Zezgo" ? "EZ" : "RC");

    const reviewers = reviewData.filter(filterFn);

    const doSend = (d: ReviewData) => {
      return sendInvtiationLink({
        supplierName: b.supplierName,
        referenceId: d.RefNumber,
        emailFrom: trustpilotEmail,
        emailTo: d.Email,
        branchLocation: d.BranchLocation || "",
        name: client.clientname,
        business: b,
        accessToken,
      });
    };
    return allSettled(reviewers.map(doSend)).then((promises: any) => {
      console.log(promises);
      return promises.filter((p: any) => p.status == "fulfilled");
    });
  };

  const result = (await allSettled(businesses.map(dispatchEmails)))
    .filter((p: any) => p.status == "fulfilled")
    .map((d: any) => {
      return d.value;
    })
    .reduce((sum: number, next: any) => {
      return sum + next.length;
    }, 0);

  return [
    {
      Success: `${result} emails sended`,
    },
    200,
    "OTA_ReviewRes",
    {
      "xsi:schemaLocation":
        "http://www.opentravel.org/OTA/2003/05 OTA_VehAvailRateRS.xsd",
    },
  ];
};
