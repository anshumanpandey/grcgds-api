import axios from "axios";
import { xmlToJson } from "../utils/XmlConfig";
import { XmlError } from "../utils/XmlError";
import { ApiError } from "../utils/ApiError";
import LogBookingToDb, { bookingExistOnDd } from "../utils/LogBookingToDb";
import { getHannkUserByEmail } from "../services/requestor.service";
import { getBrokerData } from "../utils/getBrokerData";
import { DB } from "../utils/DB";

const getCodeForGrcCode = async (grcCode: string) => {
  const r = await DB?.select()
    .from("companies_locations")
    .where("GRCGDSlocatincode", grcCode)
    .where("clientId", 57);
  return r && r.length != 0 ? r[0].internal_code : null;
};

export default async (body: any) => {
  const { VehResRQCore, RentalPaymentPref, POS } = body;
  const {
    Source: { RequestorID },
  } = POS;
  const { Customer } = VehResRQCore;
  const {
    Primary: {
      Email,
      Telephone,
      PersonName: { GivenName, Surname },
    },
  } = Customer;

  const pickLocation = VehResRQCore.VehRentalCore.PickUpLocation.LocationCode;
  const dropLocation = VehResRQCore.VehRentalCore.ReturnLocation.LocationCode;

  const [brokerData, pickLocationObj, dropLocationObj] = await Promise.all([
    getBrokerData({
      brokerAccountCode: RequestorID.RATEID.slice(4),
      locationCode: pickLocation,
    }),
    getCodeForGrcCode(pickLocation),
    getCodeForGrcCode(dropLocation),
  ]);

  const [pickDate, pickTime] =
    VehResRQCore.VehRentalCore.PickUpDateTime.split("T");
  const [dropDate, dropTime] =
    VehResRQCore.VehRentalCore.ReturnDateTime.split("T");

  const xml = `<MakeReservation>
            <bcode>$BRO166</bcode>
            <reservation>
                <agencyreference>IM12345</agencyreference>
                <customer>
                    <name>${GivenName}</name>
                    <surname>${Surname}</surname>
                    <phone>~${Telephone.MobileNumber}</phone>
                </customer>
                <vehicle>
                  <id>${body.VehResRQCore.VehPref.Code}</id>
                  <group>${body.VehResRQCore.VehPref.Acriss}</group>
                </vehicle>
                <pickup>
                    <location>${pickLocationObj}</location>
                    <date>${pickDate}</date>
                    <time>${pickTime}</time>
                </pickup>
                <dropoff>
                    <location>${dropLocationObj}</location>
                    <date>${dropDate}</date>
                    <time>${dropTime}</time>
                </dropoff>
                <days>9</days>
                <price>${body.RentalPaymentPref.Voucher.PaymentCard.AmountPaid}</price>
                <currency>${body.RentalPaymentPref.Voucher.PaymentCard.CurrencyUsed}</currency>
            </reservation>
        </MakeReservation>`;

  const { data } = await axios.post(
    "https://easirent.com/broker/hannk/livefeed.asp",
    xml,
    {
      headers: {
        "Content-Type": "application/xml",
        Cookie:
          "ASPSESSIONIDSWCRDAAA=AJFEHJNBMDHINDFICLDHEFHL; ASPSESSIONIDSWCSACAB=PCEOJEPBIBBBLFDJAMFHMNGL; ASPSESSIONIDAUDTACCC=FJNBPOGCADJBPJHNGCDDOCFL",
      },
    }
  );

  if (data == "") {
    throw new ApiError("Could not create the booking");
  }

  if (data.includes("Error")) {
    throw new XmlError(data);
  }

  const [pickupDate, pickupTime] =
    VehResRQCore.VehRentalCore.PickUpDateTime.split("T");
  const [dropoffDate, dropoffTime] =
    VehResRQCore.VehRentalCore.ReturnDateTime.split("T");

  const res = await xmlToJson(data);

  const toInsert = {
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    pickLocation,
    dropLocation,
    POS,
    xml,
    price: RentalPaymentPref.Voucher.PaymentCard.AmountPaid,
    grcgdsClient: "10",
    hannkUser: await getHannkUserByEmail({ email: Email }),
    extras: [],
    pickupInstructions: "",
    returninstructions:
      "",
    resNumber: "",
    brokerInternalCode: brokerData?.internalCode,
  };

  await LogBookingToDb(toInsert);

  return res;
};

export const cancelZezgoBooking = async (body: any) => {
  const { VehCancelRQCore, POS } = body;
  const {
    Source: { RequestorID },
  } = POS;
  const brokerData = await getBrokerData({
    brokerAccountCode: RequestorID.RATEID.slice(4),
  });

  const xml = `<OTA_VehCancelRQ xmlns="http://www.opentravel.org/OTA/2003/05"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05
    VehCancelRQ.xsd">
    <POS>
    <Source>
    <RequestorID Type="5" ID="${brokerData.internalCode}" />
    </Source>
    </POS>
    <VehCancelRQCore>
    <ResNumber Number="${VehCancelRQCore.ResNumber.Number}"/>
    </VehCancelCore>
    <VehCancelRQInfo>
    </VehCancelRQInfo>
    </OTA_VehCancelRQ>`;

  try {
    const { data } = await axios.post("https://OTA.zezgo.com/", xml, {
      headers: {
        "Content-Type": "application/soap+xml;charset=utf-8",
      },
    });

    if (data.includes("Error")) {
      console.log(`RC cancel failed with ${data}`);
      throw new XmlError(data);
    }

    const reservation = await xmlToJson(data);

    return reservation;
  } catch (error) {
    if (error.response) {
      throw new ApiError(error.response.data.error);
    } else {
      throw error;
    }
  }
};
