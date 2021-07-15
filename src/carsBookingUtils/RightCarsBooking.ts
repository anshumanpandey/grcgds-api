import axios from "axios"
import { xmlToJson } from "../utils/XmlConfig"
import { XmlError } from "../utils/XmlError"
import { fromUnixTime, lightFormat } from 'date-fns'
import { ApiError } from "../utils/ApiError";
import LogBookingToDb, { bookingExistOnDd, LogbookingParams } from "../utils/LogBookingToDb";
import { getHannkUserByEmail } from "../services/requestor.service";
import { getBookings } from "../services/bookings.service";
import { getBrokerData } from "../utils/getBrokerData";

export default async (body: any) => {
    const { VehResRQCore, RentalPaymentPref, POS } = body
    const { Source: { RequestorID } } = POS
    const { VehPref, Customer } = VehResRQCore
    const { Primary: { Email, Telephone, Address, PersonName: { GivenName, Surname, NamePrefix } } } = Customer

    const pickLocation = VehResRQCore.VehRentalCore.PickUpLocation.LocationCode
    const dropLocation = VehResRQCore.VehRentalCore.ReturnLocation.LocationCode

    const brokerData = await getBrokerData({
        brokerAccountCode: RequestorID.RATEID.slice(4),
        locationCode: pickLocation
    })

    const xml = `<OTA_VehResRQ xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation = "http://www.opentravel.org/OTA/2003/05 VehResRQ.xsd" >
    <POS>
    <Source>
    <RequestorID Type="5" ID="${brokerData.internalCode || "MOBILE001"}" />
    </Source>
    </POS><VehResRQCore>
    <VehRentalCore PickUpDateTime="${VehResRQCore.VehRentalCore.PickUpDateTime}" ReturnDateTime="${VehResRQCore.VehRentalCore.ReturnDateTime}">
    <PickUpLocation LocationCode="${pickLocation}" />
    <ReturnLocation LocationCode="${dropLocation}" />
    </VehRentalCore>
    <Customer>
    <Primary>
    <PersonName>
    <NamePrefix>${NamePrefix}</NamePrefix>
    <GivenName>${GivenName}</GivenName>
    <Surname>${Surname}</Surname>
    </PersonName>
    <Telephone PhoneNumber="${Telephone?.PhoneNumber || ""}" MobileNumber="${Telephone?.MobileNumber || ""}"/>
    <Email>${Email}</Email>
    <Address>
        <StreetNmbr>${Address.StreetNmbr || ""}</StreetNmbr>
        <CityName>${Address.CityName || ""}</CityName>
        <PostalCode>${Address.PostalCode || ""}</PostalCode>
        <Country>${Address.Country || ""}</Country>
    </Address>
    </Primary>
    </Customer>
    <VendorPref/>
    <VehPref Code="${VehPref.Code}" />
    <SpecialEquipPrefs>${VehResRQCore.SpecialEquipPrefs.SpecialEquipPref
        .map((i: any) => `<SpecialEquipPref vendorEquipID="${i.vendorEquipID}" Quantity="${i.Quantity}"/>`).join('\n')}</SpecialEquipPrefs>
        <PromoDesc></PromoDesc>
    </VehResRQCore>
    <VehResRQInfo/>
    <ArrivalDetails FlightNo="IB3154"/>
    <RentalPaymentPref>
    <Voucher Identifier="${RentalPaymentPref.Voucher.Identifier}">
    
    <PaymentCard CardType="${RentalPaymentPref.Voucher.PaymentCard.CardType}" CardCode="${RentalPaymentPref.Voucher.PaymentCard.CardCode}" CardNumber="${RentalPaymentPref.Voucher.PaymentCard.CardNumber}"
    ExpireDate="${RentalPaymentPref.Voucher.PaymentCard.CardType.ExpireDate}" >
    <CardHolderName>${RentalPaymentPref.Voucher.PaymentCard.CardHolderName}</CardHolderName>
    <AmountPaid>${RentalPaymentPref.Voucher.PaymentCard.AmountPaid}</AmountPaid>
    <CurrencyUsed>${RentalPaymentPref.Voucher.PaymentCard.CurrencyUsed}</CurrencyUsed>
    
    </PaymentCard>
    </Voucher>
    </RentalPaymentPref>
    </OTA_VehResRQ>`;


    const { data } = await axios.post('https://OTA.right-cars.com/', xml, {
        headers: {
            "Content-Type": "application/soap+xml;charset=utf-8"
        }
    })

    if (data == "") {
        throw new ApiError("Could not create the booking")
    }


    if (data.includes("Error")) {
        throw new XmlError(data)
    }

    const [pickupDate, pickupTime] = VehResRQCore.VehRentalCore.PickUpDateTime.split('T')
    const [dropoffDate, dropoffTime] = VehResRQCore.VehRentalCore.ReturnDateTime.split('T')

    const res = await xmlToJson(data);

    const toInsert: LogbookingParams = {
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        pickLocation,
        dropLocation,
        POS,
        xml,
        price: RentalPaymentPref.Voucher.PaymentCard.AmountPaid,
        grcgdsClient: "1",
        hannkUser: await getHannkUserByEmail({ email: Email }),
        extras: [],
        pickupInstructions: res.OTA_VehResRS.VehResRSCore[0].VehReservation[0].VehSegmentInfo[0].LocationDetails[0].Pickupinst[0],
        returninstructions: res.OTA_VehResRS.VehResRSCore[0].VehReservation[0].VehSegmentInfo[0].LocationDetails[1].Returninst[0],
        resNumber: res.OTA_VehResRS.VehResRSCore[0].VehReservation[0].VehSegmentCore[0].ConfID[0].Resnumber[0],
        brokerInternalCode: brokerData?.internalCode
    }

    await LogBookingToDb(toInsert)

    return res
}

export const getRightCarsBooking = async (body: any) => {
    const { VehRetSingleResRQ, POS } = body

    const xml = `<OTA_VehListRQ xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation = "http://www.opentravel.org/OTA/2003/05 VehResRQ.xsd" >
    <POS>
    <Source>
    <RequestorID Type="5" ID="MOBILE001" />
    </Source>
    </POS>
    <Customer>
    <Primary>
    <Email>${VehRetSingleResRQ.Email.Address}</Email>
    </Primary>
    </Customer>
    </OTA_OTA_VehListRQ>`;

    try {
        const { data } = await axios.post('https://OTA.right-cars.com/', xml, {
            headers: {
                "Content-Type": "application/soap+xml;charset=utf-8"
            }
        })

        if (data.includes("Error")) {
            throw new XmlError(data)
        }

        const reservations = await xmlToJson(data);

        if (!reservations.OTA_VehListRS.VehResRSCore) return undefined
    
        const reservationFound = reservations.OTA_VehListRS.VehResRSCore.find((res: any) => {
            return res.VehReservation[0].VehSegmentCore[0].ConfID[0].Resnumber[0] == VehRetSingleResRQ.ResNumber.Number
        })

        if (!reservationFound) return reservationFound

        const pickDateTime = fromUnixTime(reservationFound.VehReservation[0].VehSegmentCore[0].VehRentalCore[0].PickUpDateTime[0])
        const returnDateTime = fromUnixTime(reservationFound.VehReservation[0].VehSegmentCore[0].VehRentalCore[0].ReturnDateTime[0])
        const pickCode = reservationFound.VehReservation[0].VehSegmentCore[0].VehRentalCore[0].PickUpLocation[0].LocationCode[0]
        const dropCode = reservationFound.VehReservation[0].VehSegmentCore[0].VehRentalCore[0].ReturnLocation[0].LocationCode[0]
        const price = reservationFound.VehReservation[0].VehSegmentCore[0].Payment[0].AmountToPayForRental[0]
        const resNumber = reservationFound.VehReservation[0].VehSegmentCore[0].ConfID[0].Resnumber[0]
        const appUser = await getHannkUserByEmail({ email: VehRetSingleResRQ.Email.Address })

        const toInsert: LogbookingParams = {
            pickupDate: lightFormat(pickDateTime, 'yyyy-MM-dd'),
            pickupTime: lightFormat(pickDateTime, 'HH:mm'),
            dropoffDate: lightFormat(returnDateTime, 'yyyy-MM-dd'),
            dropoffTime: lightFormat(returnDateTime, 'HH:mm'),
            pickLocation: pickCode,
            dropLocation: dropCode,
            POS,
            xml: data,
            price,
            grcgdsClient: "1",
            hannkUser: appUser,
            extras: [],
            resNumber
        }
        const exist = await bookingExistOnDd({ resNumber, appUser })
        if (!exist) {
            await LogBookingToDb(toInsert)
        }

        //const usersBookings = await getBookings({ resNumber })

        return //usersBookings.find(b => b.resNumber == VehRetSingleResRQ.ResNumber.Number)

    } catch (error) {
        if (error.response) {
            throw new ApiError(error.response.data.error)
        } else {
            throw error
        }
    }
}

export const cancelRightCarsBooking = async (body: any) => {
    const { VehCancelRQCore, POS } = body
    const { Source: { RequestorID } } = POS

    const brokerData = await getBrokerData({
        brokerAccountCode: RequestorID.RATEID.slice(4),
    })

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
        const { data } = await axios.post('https://OTA.right-cars.com/', xml, {
            headers: {
                "Content-Type": "application/soap+xml;charset=utf-8"
            }
        })

        if (data.includes("Error")) {
            console.log(`RC cancel failed with ${data}`)
            throw new XmlError(data)
        }

        const reservation = await xmlToJson(data);

        return reservation
    } catch (error) {
        if (error.response) {
            throw new ApiError(error.response.data.error)
        } else {
            throw error
        }
    }
}