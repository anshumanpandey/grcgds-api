import Axios from "axios"
import { ApiError } from "../utils/ApiError";
import { DB } from "../utils/DB"
import { getClientData } from "../utils/getClientData";
import { getCodeForGrcCode } from "../utils/getCodeForGrcCode";
import { getPaypalCredentials } from "../utils/getPaypalCredentials";
import { xmlToJson } from '../utils/XmlConfig';
const https = require('https');

export const YESAWAY_URL = `http://javelin-api.yesaway.com/services`
export enum YESAWAY_ZONES {
    'W_NZ_ORDER_COM_RR_FULLPREPAID' = 'W_NZ_ORDER_COM_RR_FULLPREPAID',
    'W_US_ORDER_NOPROTECTION_RR_FULLPREPAID' = 'W_US_ORDER_NOPROTECTION_RR_FULLPREPAID',
    'W_US_ORDER_COM_RR_FULLPREPAID' = 'W_US_ORDER_COM_RR_FULLPREPAID',
    'W_NZ_ORDER_BASE_RR_FULLPREPAID' = 'W_NZ_ORDER_BASE_RR_FULLPREPAID',
    'W_TH_ORDER_BASE_RR_FULLPREPAID' = 'W_TH_ORDER_BASE_RR_FULLPREPAID',
}
type YesAwayBaseConfig = {
    yesAwayClientId: number
    zoneLocation: YESAWAY_ZONES
}
export default ({ yesAwayClientId, zoneLocation }: YesAwayBaseConfig) => async (params: any) => {

    const currency = params?.VehAvailRQCore?.Currency?.Code || 'GBP'
    const [pickupCodeObj, returnCodeObj] = await Promise.all([
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id: yesAwayClientId }),
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode, id: yesAwayClientId }),
    ])

    if (!pickupCodeObj || !returnCodeObj) return Promise.reject(`No code mapping found for grc code ${pickupCodeObj} or ${returnCodeObj}`)

    const body = `<?xml version="1.0" encoding="UTF-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:ns="http://www.opentravel.org/OTA/2003/05">
         <soap:Body>
             <OTA_VehAvailRateMoreRQ
    xmlns="http://www.opentravel.org/OTA/2003/05"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" PrimaryLangID="EN"
    MaxResponses="50" Target="Production" Version="3.0"
    TransactionIdentifier="100000002"
    xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05">
                 <POS>
                     <Source ISOCountry="US">
                         <RequestorID Type="4" ID="${zoneLocation}" >
                             <CompanyName Code="bookingclik"
    CompanyShortName="bookingclik"/>
                         </RequestorID>
                     </Source>
                     <Source>
                         <RequestorID ID="00000000" ID_Context="IATA" Type="4"/>
                     </Source>
                 </POS>
                 <VehAvailRQCore Status="Available">
                     <VehRentalCore PickUpDateTime="${params.VehAvailRQCore.VehRentalCore.PickUpDateTime}"
    ReturnDateTime="${params.VehAvailRQCore.VehRentalCore.ReturnDateTime}">
                         <PickUpLocation LocationCode="${pickupCodeObj.internal_code}"/>
                         <ReturnLocation LocationCode="${returnCodeObj.internal_code}"/>
                     </VehRentalCore>
                     <VendorPrefs>
                         <VendorPref Code="yesaway"/>
                     </VendorPrefs>
                     <DriverType Age="35"/>
                     <TPA_Extensions>
                         <TPA_Extension_Flags EnhancedTotalPrice="true"/>
                     </TPA_Extensions>
                 </VehAvailRQCore>
             </OTA_VehAvailRateMoreRQ>
         </soap:Body>
    </soap:Envelope>`

    const { data } = await Axios({
        method: 'POST',
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
        url: YESAWAY_URL,
        headers: {
            'Authorization': 'Basic Ym9va2luZ2NsaWs6MWFiNzQ3NmFmM2U2NmM4ODAzOTdkNGM5OWUzMDA0NzI=',
            'Content-Type': 'application/xml'
        },
        data: body
    })

    if (data.includes('Error')) throw new ApiError(data)

    const u = await getClientData({ id: yesAwayClientId })

    const json = await xmlToJson(data, { charkey: "" });
    
    return json["env:Envelope"]["env:Body"][0].OTA_VehAvailRateMoreRS[0].VehAvailRSCore[0].VehVendorAvails[0].VehVendorAvail[0].VehAvails[0].VehAvail.map(($VehAvail: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "VehID": "",
                    //missing booking url on response
                    "Deeplink": "",
                    "Supplier_ID": `GRC-${u.clientId}0000`,
                    "Supplier_Name": u.clientname,
                    ...getPaypalCredentials({ requetorClient: params.requestorClientData, supplier: u })
                },
                "Vehicle": [{
                    $: {
                        //missing property on response
                        "AirConditionInd": $VehAvail.VehAvailCore[0].Vehicle[0].$.AirConditionInd == true ? "Yes": "No",
                        //missing property on response
                        "TransmissionType": $VehAvail.VehAvailCore[0].Vehicle[0].$.TransmissionType,
                        "BrandPicURL": "https://media-exp1.licdn.com/dms/image/C4E0BAQFGAUu5D1WzFA/company-logo_200_200/0/1530081319521?e=2159024400&v=beta&t=fWdI82aTTGYW4rbJJ9I7jLps0esHqEpBZGchjRem9gA",
                        "Brand": u.clientname,
                    },
                    "VehMakeModel": [{
                        $: {
                            "Name": $VehAvail.VehAvailCore[0].Vehicle[0].VehMakeModel[0].$.Name,
                            "PictureURL": $VehAvail.VehAvailCore[0].Vehicle[0].PictureURL || "https://media-exp1.licdn.com/dms/image/C4E0BAQFGAUu5D1WzFA/company-logo_200_200/0/1530081319521?e=2159024400&v=beta&t=fWdI82aTTGYW4rbJJ9I7jLps0esHqEpBZGchjRem9gA",
                        }
                    }],
                    "VehType": [{
                        $: {
                            "VehicleCategory": $VehAvail.VehAvailCore[0].Vehicle[0].VehMakeModel[0].$.Code,
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