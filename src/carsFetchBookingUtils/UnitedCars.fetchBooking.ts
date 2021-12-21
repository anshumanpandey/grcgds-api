import axios from "axios";
import { FetchBookingsParams, GRCBooking } from "../services/bookings.service";
import { ApiError } from "../utils/ApiError";
import { getPaypalCredentials } from "../utils/getPaypalCredentials";
import { xmlToJson } from "../utils/XmlConfig";

export default async ({
  ResNumber,
  RequestorId,
  AccountCode,
  SupplierName,
  clientSurname,
  clientName,
}: FetchBookingsParams): Promise<GRCBooking> => {
  const xml = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:req="http://request.rentacar.karve.com/">
        <soap:Header>
            <req:Password>ALAMHnK03</req:Password>
            <req:User>MC03MC03</req:User>
        </soap:Header>
        <soap:Body>
            <req:ModifyReserveInformationRequest>
                <ReserveId>${ResNumber}</ReserveId>
            </req:ModifyReserveInformationRequest>
        </soap:Body>
    </soap:Envelope>`;

  try {
    const { data } = await axios.post(
      "http://ws.karveinformatica.com:186/Union5/soap/RentaCarPort",
      xml
    );

    if (data.includes("Reserve Not Exist")) throw new ApiError("Reserve Not Exist");
    
    const json = await xmlToJson(data, { charkey: "" });

    return {
      customer: {
        firstname:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].Customer[0]
            .Primary[0].PersonName[0].GivenName[0],
        lastname:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].Customer[0]
            .Primary[0].PersonName[0].Surname[0],
        email:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].Customer[0]
            .Primary[0].Email[0],
        address: {
          addressLine:
            json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
              .Customer[0].Primary[0].Address[0].AddressLine[0],
          postalCode:
            json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
              .Customer[0].Primary[0].Address[0].PostalCode[0],
          cityName:
            json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
              .Customer[0].Primary[0].Address[0].CityName[0],
        },
      },
      extras: [],
      taxData: {
        total:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
            .VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0]
            .TaxAmounts[0].TaxAmount[0].Total[0],
        currencyCode:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
            .VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0]
            .TaxAmounts[0].TaxAmount[0].CurrencyCode[0],
        percentage:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
            .VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0]
            .TaxAmounts[0].TaxAmount[0].Percentage[0],
        description:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
            .VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0]
            .TaxAmounts[0].TaxAmount[0].Description[0],
      },
      vehicle: {
        code: json.OTA_VehRetResRS.OTA_VehRetResRS.VehRetResRSCore[0]
          .VehReservation[0].VehSegmentCore[0].Vehicle[0].Code[0],
        makeModel:
          json.OTA_VehRetResRS.OTA_VehRetResRS.VehRetResRSCore[0]
            .VehReservation[0].VehSegmentCore[0].Vehicle[0].MakeModel[0],
      },
      calculation: {
        unitCharge:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
            .VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0]
            .Calculation[0].UnitCharge[0],
        quantity:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
            .VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0]
            .Calculation[0].Quantity[0],
        unitName:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
            .VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0]
            .Calculation[0].UnitName[0],
      },
      rateQualifier: {
        rateCategory:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
            .VehSegmentCore[0].RentalRate[0].RateQualifier[0].RateCategory[0],
        rateQualifier:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
            .VehSegmentCore[0].RentalRate[0].RateQualifier[0].RateQualifier[0],
        ratePeriod:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
            .VehSegmentCore[0].RentalRate[0].RateQualifier[0].RatePeriod[0],
        vendorRateID:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
            .VehSegmentCore[0].RentalRate[0].RateQualifier[0].VendorRateID[0],
      },
      resNumber:
        json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
          .VehSegmentCore[0].ConfID[0].ResNumber[0],
      carCode:
        json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
          .VehSegmentCore[0].Vehicle[0].Code[0],
      carPrice:
        json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
          .VehSegmentCore[0].TotalCharge[0].EstimatedTotalAmount[0],
      supplier: {
        phonenumber:
          json.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0]
            .VehSegmentInfo[0].LocationDetails[0].Telephone[0].PhoneNumber[0],
        id: `GRC-${AccountCode}`,
        name: SupplierName,
        rateId: RequestorId,
      },
      pickupLocation: {
        code: "",
        countryCode: "",
        countryName: "",
        pickupInstructions: "",
        locationName: "",
        date: {
          day: "",
          month: "",
          year: "",
          hour: "",
          minutes: "",
          seconds: "",
        },
        address: {
          addressLine: "",
          cityName: "",
          postalCode: "",
          countryName: {
            name: "",
            code: "",
          },
        },
      },
      dropoffLocation: {
        code: "",
        countryCode: "",
        countryName: "",
        pickupInstructions: "",
        locationName: "",
        date: {
          day: "",
          month: "",
          year: "",
          hour: "",
          minutes: "",
          seconds: "",
        },
        address: {
          addressLine: "",
          cityName: "",
          postalCode: "",
          countryName: {
            name: "",
            code: "",
          },
        },
      },
    };
  } catch (error) {
    if (error.response) {
      throw new ApiError(error.response.data.error);
    } else {
      throw error;
    }
  }
};
