import Axios from "axios"
import { ApiError } from "../utils/ApiError";
import { DB } from "../utils/DB"
import { getClientData } from "../utils/getClientData";
import { getCodeForGrcCode } from "../utils/getCodeForGrcCode";
import { getPaypalCredentials } from "../utils/getPaypalCredentials";
import { xmlToJson } from '../utils/XmlConfig';
const https = require('https');

export const ROUTEREZ_URL = `https://routesrezworld.com/api/service/`
const rouresrezWorldClientId = 72

export default async (params: any) => {

    const currency = params?.VehAvailRQCore?.Currency?.Code || 'GBP'
    const [pickupCodeObj, returnCodeObj] = await Promise.all([
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id: rouresrezWorldClientId }),
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode, id: rouresrezWorldClientId }),
    ])

    if (!pickupCodeObj || !returnCodeObj) return Promise.reject(`No code mapping found for grc code ${pickupCodeObj} or ${returnCodeObj}`)

    const body = `<TRNXML Version="1.0.0">
    <Dategmtime TimeZone="ET">7/2/2017 9:25:19 PM</Dategmtime>
    <Sender>
        <SenderID>ROUTES</SenderID>
    </Sender>
    <Recipient>
        <RecipientID>TRN</RecipientID>
    </Recipient>
    <TradingPartner>
        <TradingPartnerCode>BC</TradingPartnerCode>
    </TradingPartner>
    <Customer>
        <CustomerNumber>1044</CustomerNumber>
        <Passcode>#d9Oo880.@</Passcode>
    </Customer>
    <Message>
        <MessageID>REQRAT</MessageID>
        <MessageDesc>Request Rates</MessageDesc>
    </Message>
    <Payload>
        <RentalLocationID>DEN</RentalLocationID>
        <ReturnLocationID>DEN</ReturnLocationID>
        <PickupDateTime>06062021 08:00 am</PickupDateTime>
        <ReturnDateTime>06072021 08:00 am</ReturnDateTime>
        <RateSource>WebLink</RateSource>
        <ClassCode></ClassCode>
        <CompanyNumber>RCR</CompanyNumber>
        <DiscountCode></DiscountCode>
        <TotalPricing>1</TotalPricing>
    </Payload>
</TRNXML>`

    const { data } = await Axios({
        method: 'POST',
        url: ROUTEREZ_URL,
        headers: {
            'Content-Type': 'application/xml',
        },
        data: body
    })

    if (data.includes('Error')) throw new ApiError(data)

    const u = await getClientData({ id: rouresrezWorldClientId })

    const json = await xmlToJson(data, { charkey: "" });

    const dataS = JSON.stringify(json)

    return json.PRE.Payload[0].RateProduct.map(($VehAvail: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "VehID": "",
                    "Deeplink": "",
                    "Supplier_ID": `GRC-${u.clientId}0000`,
                    "Supplier_Name": u.clientname,
                    ...getPaypalCredentials({ requetorClient: params.requestorClientData, supplier: u })
                },
                "Vehicle": [{
                    $: {
                        "AirConditionInd": "Yes",
                        "TransmissionType": "Automatic",
                        "BrandPicURL": "https://www.grcgds.com/routes.world.jpg",
                        "Brand": u.clientname,
                    },
                    "VehMakeModel": [{
                        $: {
                            "Name": $VehAvail.ModelDesc[0],
                            "PictureURL": $VehAvail.ClassImage[0],
                        }
                    }],
                    "VehType": [{
                        $: {
                            "VehicleCategory": $VehAvail.ClassCode[0],
                            "DoorCount": 1,
                            "Baggage": 1,
                        }
                    }],
                    "VehClass": [{
                        $: { "Size": $VehAvail.Seats[0] }
                    }],
                    "VehTerms": []
                }],
                "RentalRate": [],
                "VehicleCharges": [{
                    "VehicleCharge": [{ "CurrencyCode": $VehAvail.CurrencyCode[0] }]
                }],
                "TotalCharge": [{
                    $: {
                        "RateTotalAmount": Number($VehAvail.TotalPricing[0].TotalCharges[0]).toFixed(2),
                        "CurrencyCode": $VehAvail.CurrencyCode[0],
                    }
                }],
                "PricedEquips": []
            }]
        }
    })
}