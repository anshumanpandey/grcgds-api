import Axios from "axios"
import { ApiError } from "../utils/ApiError";
import { DB } from "../utils/DB"
import { getClientData } from "../utils/getClientData";
import { getCodeForGrcCode } from "../utils/getCodeForGrcCode";
import { getPaypalCredentials } from "../utils/getPaypalCredentials";
import { xmlToJson } from '../utils/XmlConfig';
const https = require('https');

export const ACERENTCAR_URL = `https://ota.acerentacar.com/BookingClick/RateService.asmx`
const aceRentCarClientId = 75

export default async (params: any) => {

    const currency = params?.VehAvailRQCore?.Currency?.Code || 'GBP'
    const [pickupCodeObj, returnCodeObj] = await Promise.all([
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id: aceRentCarClientId }),
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode, id: aceRentCarClientId }),
    ])

    if (!pickupCodeObj || !returnCodeObj) return Promise.reject(`No code mapping found for grc code ${pickupCodeObj} or ${returnCodeObj}`)

    const body = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs-d="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <OTA_VehAvailRateRQ xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" TimeStamp="2015-12-02T11:53:13.2885909-05:00" Target="Production" Version="5.0" xmlns="http://www.opentravel.org/OTA/2003/05">
                    <POS>
                        <Source>
                            <RequestorID Type="22" ID="RezPower" />
                        </Source>
                    </POS>
                    <VehAvailRQCore>
                        <VehRentalCore PickUpDateTime="${params.VehAvailRQCore.VehRentalCore.PickUpDateTime}" ReturnDateTime="${params.VehAvailRQCore.VehRentalCore.ReturnDateTime}">
                            <PickUpLocation LocationCode="${pickupCodeObj.internal_code}" />
                            <ReturnLocation LocationCode="${returnCodeObj.internal_code}" />
                        </VehRentalCore>
                    </VehAvailRQCore>
                </OTA_VehAvailRateRQ>
            </soap:Body>
        </soap:Envelope>`

    const { data } = await Axios({
        method: 'POST',
        url: ACERENTCAR_URL,
        headers: {
            'SOAPAction': 'VehAvailRate', 
            'Content-Type': 'text/xml; charset=utf-8'
        },
        data: body
    })

    if (data.includes('Error')) throw new ApiError(data)

    const u = await getClientData({ id: aceRentCarClientId })

    const json = await xmlToJson(data, { charkey: "" });

    return json["soap:Envelope"]["soap:Body"][0].OTA_VehAvailRateRS[0].VehAvailRSCore[0].VehVendorAvails[0].VehVendorAvail[0].VehAvails[0].VehAvail.map(($VehAvail: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "VehID": "",
                    //missing booking url on response
                    "Deeplink": $VehAvail.VehAvailCore[0].Reference[0].$.URL,
                    "Supplier_ID": `GRC-${u.clientId}0000`,
                    "Supplier_Name": u.clientname,
                    ...getPaypalCredentials({ requetorClient: params.requestorClientData, supplier: u })
                },
                "Vehicle": [{
                    $: {
                        "AirConditionInd": $VehAvail.VehAvailCore[0].Vehicle[0].$.AirConditionInd == true ? "Yes" : "No",
                        "TransmissionType": $VehAvail.VehAvailCore[0].Vehicle[0].$.TransmissionType,
                        "BrandPicURL": "https://www.acerentacar.com/Images/AceLogo.jpg",
                        "Brand": u.clientname,
                    },
                    "VehMakeModel": [{
                        $: {
                            "Name": $VehAvail.VehAvailCore[0].Vehicle[0].VehMakeModel[0].$.Name,
                            "PictureURL": $VehAvail.VehAvailCore[0].Vehicle[0].PictureURL[0] || "https://media-exp1.licdn.com/dms/image/C4E0BAQFGAUu5D1WzFA/company-logo_200_200/0/1530081319521?e=2159024400&v=beta&t=fWdI82aTTGYW4rbJJ9I7jLps0esHqEpBZGchjRem9gA",
                        }
                    }],
                    "VehType": [{
                        $: {
                            "VehicleCategory": $VehAvail.VehAvailCore[0].Vehicle[0].VehType[0].$.VehicleCategory,
                            "DoorCount": $VehAvail.VehAvailCore[0].Vehicle[0].VehType[0].$.DoorCount,
                            "Baggage": $VehAvail.VehAvailCore[0].Vehicle[0].$.BaggageQuantity,
                        }
                    }],
                    "VehClass": [{
                        $: { "Size": $VehAvail.VehAvailCore[0].Vehicle[0].$.PassengerQuantity }
                    }],
                    "VehTerms": []
                }],
                "RentalRate": [],
                "VehicleCharges": [{
                    "VehicleCharge": [{ "CurrencyCode": $VehAvail.VehAvailCore[0].TotalCharge[0].$.CurrencyCode }]
                }],
                "TotalCharge": [{
                    $: {
                        "RateTotalAmount": Number($VehAvail.VehAvailCore[0].TotalCharge[0].$.RateTotalAmount).toFixed(2),
                        "CurrencyCode": $VehAvail.VehAvailCore[0].TotalCharge[0].$.CurrencyCode,
                    }
                }],
                "PricedEquips": []
            }]
        }
    })
}