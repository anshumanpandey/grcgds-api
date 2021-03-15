import axios from "axios"
import { xmlToJson } from "../utils/XmlConfig"
import { XmlError } from "../utils/XmlError"
import { DB } from '../utils/DB';
import { ApiError } from "../utils/ApiError";
import LogBookingToDb from "../utils/LogBookingToDb";
import { getHannkUserByEmail } from "../services/requestor.service";
const { v4: uuidv4 } = require('uuid');

const getCodeForGrcCode = async (grcCode: string) => {
    const r = await DB?.select().from("companies_locations")
        .where("GRCGDSlocatincode", grcCode)
        .where("clientId", 58)
    return r && r.length != 0 ? r[0].internal_code : null
}

export default async (body: any) => {
    const { VehResRQCore, RentalPaymentPref, POS } = body
    const { VehPref, Customer } = VehResRQCore
    const { Primary: { Email, PersonName: { GivenName, Surname, NamePrefix } } } = Customer

    const pickLocation = VehResRQCore.VehRentalCore.PickUpLocation.LocationCode
    const dropLocation = VehResRQCore.VehRentalCore.ReturnLocation.LocationCode
    const [pickupDate, pickupTime] = VehResRQCore.VehRentalCore.PickUpDateTime.split('T')
    const [dropoffDate, dropoffTime] = VehResRQCore.VehRentalCore.ReturnDateTime.split('T')
    const resNumber = uuidv4();
    const [pickupCode, dropoffCode] = await Promise.all([
        getCodeForGrcCode(pickLocation),
        getCodeForGrcCode(dropLocation)
    ]);

    if (!pickupCode || !dropoffCode) throw new ApiError(`UnitedCars Internal Code not found for code ${pickLocation}`)

    const xml = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:req="http://request.rentacar.karve.com/">
        <soap:Header>
            <req:Password>ALAMHnK03</req:Password>
            <req:User>MC03MC03</req:User>
        </soap:Header>
        <soap:Body>
            <req:CreateReserveRequest>
                <ReserveId>${resNumber}</ReserveId>
                <ClientName>Hannk</ClientName>
                <PickUpOfficeId>${pickupCode}</PickUpOfficeId>
                <PickUpDate>${pickupDate}</PickUpDate>
                <PickUpTime>${pickupTime.slice(0,5)}</PickUpTime>
                <DropOffOfficeId>${dropoffCode}</DropOffOfficeId>
                <DropOffDate>${dropoffDate}</DropOffDate>
                <DropOffTime>${dropoffTime.slice(0,5)}</DropOffTime>
                <CarTypeId>${VehPref.Acriss}</CarTypeId>
                <RateId>${VehPref.RateId}</RateId>
                <PaymentMethod>${Math.floor(100000 + Math.random() * 900000)}</PaymentMethod>
                <ChargedAmount>${RentalPaymentPref.Voucher.PaymentCard.AmountPaid}</ChargedAmount>
            </req:CreateReserveRequest>
        </soap:Body>
    </soap:Envelope>`;


    try {
        const { data } = await axios.post('http://ws.karveinformatica.com:186/Union5/soap/RentaCarPort', xml)

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
            price: RentalPaymentPref.Voucher.PaymentCard.AmountPaid,
            hannkUser: await getHannkUserByEmail({ email: Email }),
            grcgdsClient: "58",
            resNumber: resNumber,
            extras: []
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

export const cancelUnitedCarBooking = async (body: any) => {
    const { VehCancelRQCore, POS } = body

    const xml = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
    xmlns:req="http://request.rentacar.karve.com/">
        <soap:Header>
            <req:Password>ALAMHnK03</req:Password>
            <req:User>MC03MC03</req:User>
        </soap:Header>
        <soap:Body>
            <req:CancelReserveRequest>
                <ReserveId>${VehCancelRQCore.ResNumber.Number}</ReserveId>
            </req:CancelReserveRequest>
        </soap:Body>
    </soap:Envelope>`;

    try {
        const { data } = await axios.post('http://ws.karveinformatica.com:186/Union5/soap/RentaCarPort', xml)

        return true
    } catch (error) {
        if (error.response) {
            throw new ApiError(error.response.data.error)
        } else {
            throw error
        }
    }
}