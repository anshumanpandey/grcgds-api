import axios from "axios"
import { xmlToJson } from "../utils/XmlConfig"
import { XmlError } from "../utils/XmlError"
import { DB } from '../utils/DB';
import { ApiError } from "../utils/ApiError";
import LogBookingToDb from "../utils/LogBookingToDb";

export default async (body: any) => {
    const { VehResRQCore, RentalPaymentPref, POS } = body
    const { VehPref, Customer } = VehResRQCore
    const { Primary: { Email, Telephone,PersonName: { GivenName, Surname, NamePrefix } } } = Customer

    const pickLocation = VehResRQCore.VehRentalCore.PickUpLocation.LocationCode
    const dropLocation = VehResRQCore.VehRentalCore.ReturnLocation.LocationCode

    const axiosBody = {
        "SearchUID": "3f708a46-a0ee-4e9c-be68-7c8b1df3d71e",
        "CarUID": VehPref.Code,
        "Title": NamePrefix.includes('.') ? `${NamePrefix}.` : NamePrefix,
        "Name": GivenName,
        "Surname": Surname,
        "PhoneCountryCode": Telephone.split(' ')[0],
        "Phone": Telephone.split(' ')[1],
        "Email": Email,
        "BirthDate": "1985-11-20T08:50:32.263Z",
        "ResidenceCountryCode": "GB",
        "FlightNumber": "123",
        "CustomerComment": "",
        "ReferenceNumber": "1",
        "CoverageOfferID": 10
    };


    try {
        const { data } = await axios.post('https://www.grcgds.com/XML/', axiosBody, {
            headers: {
                "Content-Type": "application/soap+xml;charset=utf-8"
            }
        })

        if (data.includes("Error")) {
            throw new XmlError(data)
        }

        const [pickupDate, pickupTime] = VehResRQCore.VehRentalCore.PickUpDateTime.split('T')
        const [dropoffDate, dropoffTime] = VehResRQCore.VehRentalCore.ReturnDateTime.split('T')

        const reservation = await xmlToJson(data);

        const toInsert = {
            pickupDate,
            pickupTime,
            dropoffDate,
            dropoffTime,
            pickLocation,
            dropLocation,
            POS,
            xml,
            grcgdsClient: "36",
            resNumber: reservation.OTA_VehResRS.VehResRSCore[0].VehReservation[0].VehSegmentCore[0].ConfID[0].Resnumber[0]
        }
        await LogBookingToDb(toInsert)

        return reservation
    } catch (error) {
        if (error.response) {
            throw new ApiError(error.response.data.error)
        } else {
            throw error
        }
    }
}