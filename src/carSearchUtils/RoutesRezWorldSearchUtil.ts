import Axios from "axios"
import { setHours, setMinutes, format } from "date-fns";
import { SearchUtilsOptions } from "../types/SearchUtilsOptions";
import { ApiError } from "../utils/ApiError";
import { getClientData } from "../utils/getClientData";
import { getCodeForGrcCode } from "../utils/getCodeForGrcCode";
import { getPaypalCredentials } from "../utils/getPaypalCredentials";
import { saveServiceRequest } from "../utils/saveServiceRequest";
import { xmlToJson } from '../utils/XmlConfig';

export const ROUTEREZ_URL = `https://routesrezworld.com/api/service/`
const rouresrezWorldClientId = 72

const formatDate = (dateString: string) => {
    const [date, time] = dateString.split('T')
    const hours = setMinutes(setHours(new Date(), parseInt(time.slice(0,2))), parseInt(time.slice(3,5)))
    const [year, month, day] = date.split('-')
    const str = `${month}${day}${year} ${format(hours, 'kk:mm aaa')}`.toLocaleLowerCase()
    return str
}

export default async (params: any, opt: SearchUtilsOptions) => {

    const currency = params?.VehAvailRQCore?.Currency?.Code || 'GBP'
    const PickUpDateTime = params.VehAvailRQCore.VehRentalCore.PickUpDateTime
    const ReturnDateTime = params.VehAvailRQCore.VehRentalCore.ReturnDateTime

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
        <RentalLocationID>${pickupCodeObj.internal_code}</RentalLocationID>
        <ReturnLocationID>${returnCodeObj.internal_code}</ReturnLocationID>
        <PickupDateTime>${formatDate(PickUpDateTime)}</PickupDateTime>
        <ReturnDateTime>${formatDate(ReturnDateTime)}</ReturnDateTime>
        <RateSource>WebLink</RateSource>
        <ClassCode></ClassCode>
        <CompanyNumber>RCR</CompanyNumber>
        <DiscountCode></DiscountCode>
        <TotalPricing>1</TotalPricing>
    </Payload>
</TRNXML>`

    await saveServiceRequest({
        requestBody: body,
        carsSearchId: opt.searchRecord.id,
        pickupCodeObj: pickupCodeObj,
        supplierData: opt.supplierData
    })

    const { data } = await Axios({
        method: 'POST',
        url: ROUTEREZ_URL,
        headers: {
            'Content-Type': 'application/xml',
        },
        data: body
    })

    if (data.includes('Error')) throw new ApiError(data)

    const u = await getClientData({ id: rouresrezWorldClientId, brokerId: params.requestorClientData.clientId })

    const json = await xmlToJson(data, { charkey: "" });

    const dataS = JSON.stringify(json)

    return json.PRE.Payload[0].RateProduct.map(($VehAvail: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "VehID": "",
                    "Deeplink": $VehAvail.LandingUrl[0],
                    "Supplier_ID": `GRC-${u.clientAccountCode}`,
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