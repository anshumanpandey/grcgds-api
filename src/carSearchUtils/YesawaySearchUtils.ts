import Axios from "axios"
import { DB } from "../utils/DB"
import { xmlToJson } from '../utils/XmlConfig';
const https = require('https');

export const JIMPSOFT_URL = `https://62.28.221.122/Rentway_WS/getMultiplePrices_GroupDetails.asmx`
const getDateTime = (fullDate: string) => {
    //2021-02-02 10:00
    const [date, time] = fullDate.split('T')
    return `${date} ${time.slice(0, 5)}`
}

const getDiscoverCarsUser = async () => {
    const r = await DB?.select({ clientId: "clients.id", clientname: "clients.clientname", clientAccountCode: "data_suppliers_user.account_code" })
        .from("clients")
        .leftJoin('data_suppliers_user', 'data_suppliers_user.clientId', 'clients.id')
        .joinRaw('LEFT JOIN broker_account_type on data_suppliers_user.account_type_code and broker_account_type.name = "Prepaid Standard" ')
        .where("clients.id", 64)
    return r && r.length != 0 ? r[0] : null
}


const getCodeForGrcCode = async (grcCode: string) => {
    const r = await DB?.select().from("companies_locations")
        .where("GRCGDSlocatincode", grcCode)
        .where("clientId", 64)
    return r && r.length != 0 ? r[0].internal_code : null
}

export default async (params: any) => {

    const currency = params.VehAvailRQCore.Currency.Code || 'GBP'
    const [pickupCodeObj, returnCodeObj] = await Promise.all([
        getCodeForGrcCode(params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode),
        getCodeForGrcCode(params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode),
    ])

    if (!pickupCodeObj || !returnCodeObj) return Promise.reject(`No code mapping found for grc code ${pickupCodeObj} or ${returnCodeObj}`)

    const body = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
        <MultiplePrices_GroupDetails xmlns="http://www.jimpisoft.pt/Rentway_Reservations_WS/getMultiplePrices_GroupDetails">
            <objRequest>
                <currency>${currency}</currency>
                <pickUp>
                <Date>${getDateTime(params.VehAvailRQCore.VehRentalCore.PickUpDateTime)}</Date>
                <rentalStation>${pickupCodeObj}</rentalStation>
                </pickUp>
                <dropOff>
                <Date>${getDateTime(params.VehAvailRQCore.VehRentalCore.ReturnDateTime)}</Date>
                <rentalStation>${returnCodeObj}</rentalStation>
                </dropOff>
                <Date_of_Birth>1990-01-30</Date_of_Birth>
                <companyCode>9948</companyCode>
                <customerCode>23247</customerCode>
            </objRequest>
            </MultiplePrices_GroupDetails>
        </soap:Body>
        </soap:Envelope>`

    const { data } = await Axios({
        method: 'POST',
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
        url: `https://62.28.221.122/Rentway_WS/getMultiplePrices_GroupDetails.asmx`,
        headers: {
            "Content-Type": "text/xml;charset=UTF-8",
            "SOAPAction": "http://www.jimpisoft.pt/Rentway_Reservations_WS/getMultiplePrices_GroupDetails/MultiplePrices_GroupDetails"
        },
        data: body
    })

    const u = await getDiscoverCarsUser()

    const json = await xmlToJson(data, { charkey: "" });

    return json["soap:Envelope"]["soap:Body"][0].MultiplePrices_GroupDetailsResponse[0].MultiplePrices_GroupDetailsResult[0].getMultiplePrices_GroupDetails[0]["diffgr:diffgram"][0].NewDataSet[0].MultiplePrices_GroupDetails.map(($VehAvail: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "VehID": "",
                    //missing booking url on response
                    "Deeplink": "",
                    "Supplier_ID": u.clientAccountCode ? `GRC-${u.clientAccountCode}` : `GRC-${u.clientId}0001`,
                    "Supplier_Name": u.clientname,
                },
                "Vehicle": [{
                    $: {
                        //missing property on response
                        "AirConditionInd": $VehAvail.AC[0] == 'false' ? "No" : "Yes",
                        //missing property on response
                        "TransmissionType": $VehAvail.automaticTransmission[0] == 'true' ? "Automatic" : 'Manual',
                        "BrandPicURL": $VehAvail.imageURL[0],
                        "Brand": u.clientname,
                    },
                    "VehMakeModel": [{
                        $: {
                            "Name": $VehAvail.brand[0],
                            "PictureURL": $VehAvail.imageURL[0],
                        }
                    }],
                    "VehType": [{
                        $: {
                            "VehicleCategory": $VehAvail.SIPP[0],
                            "DoorCount": $VehAvail.doors[0],
                            "Baggage": $VehAvail.handBags[0],
                        }
                    }],
                    "VehClass": [{
                        $: { "Size": $VehAvail.passangers[0] }
                    }],
                    "VehTerms": []
                }],
                "RentalRate": [],
                "VehicleCharges": [{
                    "VehicleCharge": [{ "CurrencyCode": currency }]
                }],
                "TotalCharge": [{
                    $: {
                        "RateTotalAmount": Number($VehAvail.previewValue[0]).toFixed(2),
                        "CurrencyCode": currency,
                    }
                }],
                "PricedEquips": []
            }]
        }
    })
}