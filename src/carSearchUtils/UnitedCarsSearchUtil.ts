import Axios from "axios"
import { SearchUtilsOptions } from "../types/SearchUtilsOptions";
import { DB } from "../utils/DB"
import { getClientData } from "../utils/getClientData";
import { getCodeForGrcCode } from "../utils/getCodeForGrcCode";
import { getPaypalCredentials } from "../utils/getPaypalCredentials";
import { saveServiceRequest } from "../utils/saveServiceRequest";
import { xmlToJson } from '../utils/XmlConfig';

export const UNITEDCAR_URL = 'http://ws.karveinformatica.com:186/Union5/soap/RentaCarPort'
const getDateTime = (fullDate: string) => {
    const [date, time] = fullDate.split('T')
    return [date, time.slice(0, 5)]
}

export default async (params: any, opt: SearchUtilsOptions) => {

    const [pickupCodeObj, returnCodeObj] = await Promise.all([
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id: 58}),
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode, id: 58}),
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
                <PickUpOfficeId>${pickupCodeObj.internal_code}</PickUpOfficeId>
                <DropOffDate>${getDateTime(params.VehAvailRQCore.VehRentalCore.ReturnDateTime)[0]}</DropOffDate>
                <DropOffTime>${getDateTime(params.VehAvailRQCore.VehRentalCore.ReturnDateTime)[1]}</DropOffTime>
                <DropOffOfficeId>${returnCodeObj.internal_code}</DropOffOfficeId>
                <CurrencyCode>${CurrencyCode}</CurrencyCode>
            </req:RetrieveQuotationRequest>
        </soap:Body>
    </soap:Envelope>`

    await saveServiceRequest({
        requestBody: body,
        carsSearchId: opt.searchRecord.id,
        pickupCodeObj: pickupCodeObj,
        supplierData: opt.supplierData
    })

    const [{ data }, u,] = await Promise.all([
        Axios.post(UNITEDCAR_URL, body, {}),
        getClientData({ id: 58, brokerId: params.requestorClientData.clientId })
    ])

    const json = await xmlToJson(data, { charkey: "" });

    return json["soap:Envelope"]["soap:Body"][0]["ns3:RetrieveQuotationResponse"][0].ResponseData[0].quotationOptions.map(($VehAvail: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "VehID": $VehAvail.carTypeId[0],
                    "Deeplink": "",
                    "Supplier_ID": `GRC-${u.clientAccountCode}`,
                    "Supplier_Name": u.clientname,
                    ...getPaypalCredentials({ requetorClient: params.requestorClientData, supplier: u })
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