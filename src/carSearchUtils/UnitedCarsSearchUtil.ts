import Axios from "axios"
import { DB } from "../utils/DB"
import { getClientData } from "../utils/getClientData";
import { getPaypalCredentials } from "../utils/getPaypalCredentials";
import { xmlToJson } from '../utils/XmlConfig';

export const UNITEDCAR_URL = 'http://ws.karveinformatica.com:186/Union5/soap/RentaCarPort'
const getDateTime = (fullDate: string) => {
    const [date, time] = fullDate.split('T')
    return [date, time.slice(0, 5)]
}

const getCodeForGrcCode = async (grcCode: string) => {
    const r = await DB?.select().from("companies_locations")
        .where("GRCGDSlocatincode", grcCode)
        .where("clientId", 58)
    return r && r.length != 0 ? r[0].internal_code : null
}

export default async (params: any) => {

    const [pickupCodeObj, returnCodeObj] = await Promise.all([
        getCodeForGrcCode(params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode),
        getCodeForGrcCode(params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode),
    ])

    if (!pickupCodeObj || !returnCodeObj) return Promise.reject(`No code mapping found for grc code ${pickupCodeObj} or ${returnCodeObj}`)

    const CurrencyCode = "USD"

    const body = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
    xmlns:req="http://request.rentacar.karve.com/">
        <soap:Header>
            <req:Password>ALAMHnK03</req:Password>
            <req:User>MC03MC03</req:User>
        </soap:Header>
        <soap:Body>
            <req:RetrieveQuotationRequest>
                <PickUpDate>${getDateTime(params.VehAvailRQCore.VehRentalCore.PickUpDateTime)[0]}</PickUpDate>
                <PickUpTime>${getDateTime(params.VehAvailRQCore.VehRentalCore.PickUpDateTime)[1]}</PickUpTime>
                <PickUpOfficeId>${pickupCodeObj}</PickUpOfficeId>
                <DropOffDate>${getDateTime(params.VehAvailRQCore.VehRentalCore.ReturnDateTime)[0]}</DropOffDate>
                <DropOffTime>${getDateTime(params.VehAvailRQCore.VehRentalCore.ReturnDateTime)[1]}</DropOffTime>
                <DropOffOfficeId>${returnCodeObj}</DropOffOfficeId>
                <CurrencyCode>${CurrencyCode}</CurrencyCode>
            </req:RetrieveQuotationRequest>
        </soap:Body>
    </soap:Envelope>`

    const [{ data }, u,] = await Promise.all([
        Axios.post(UNITEDCAR_URL, body, {}),
        getClientData({ id: 58 })
    ])

    const json = await xmlToJson(data, { charkey: "" });

    return json["soap:Envelope"]["soap:Body"][0]["ns3:RetrieveQuotationResponse"][0].ResponseData[0].quotationOptions.map(($VehAvail: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "VehID": $VehAvail.carTypeId[0],
                    "Deeplink": "",
                    "Supplier_ID": `GRC-${u.clientId}0000`,
                    "Supplier_Name": u.clientname,
                    ...getPaypalCredentials(params.requestorClientData)
                },
                "Vehicle": [{
                    $: {
                        "AirConditionInd": "YEs",
                        "TransmissionType": "Automatic",
                        "BrandPicURL": "https://www.grcgds.com/united_logo_white.png",
                        "Brand": "UnitedCar",
                    },
                    "VehMakeModel": [{
                        $: {
                            "Name": $VehAvail.carTypeName[0],
                            "PictureURL": "https://www.grcgds.com/united_logo_white.png",
                        }
                    }],
                    "VehType": [{
                        $: {
                            "RateId": $VehAvail.rateId[0],
                            "VehicleCategory": $VehAvail.carTypeId[0],
                            "DoorCount": $VehAvail.carTypeFeatures[0]?.doorsNumber?.[0] || 0,
                            //we need baggage property
                            "Baggage": 0,
                        }
                    }],
                    "VehClass": [{
                        //we need passangers amount
                        $: { "Size": 0 }
                    }],
                    "VehTerms": []
                }],
                "RentalRate": [],
                "VehicleCharges": [{
                    "VehicleCharge": [{ "CurrencyCode": CurrencyCode }]
                }],
                "TotalCharge": [{
                    $: {
                        "RateTotalAmount": Number($VehAvail.totalPrice[0]).toFixed(2),
                        "CurrencyCode": CurrencyCode,
                    }
                }],
                "PricedEquips": []
            }]
        }
    })
}