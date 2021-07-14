import Axios from "axios"
import { SearchUtilsOptions } from "../types/SearchUtilsOptions";
import { getClientData } from "../utils/getClientData";
import { getCodeForGrcCode } from "../utils/getCodeForGrcCode";
import { getPaypalCredentials } from "../utils/getPaypalCredentials";
import { saveServiceRequest } from "../utils/saveServiceRequest";
import { xmlToJson } from '../utils/XmlConfig';
const https = require('https');

export const JIMPSOFT_URL = `https://62.28.221.122/Rentway_WS/getMultiplePrices_GroupDetails.asmx`
const getDateTime = (fullDate: string) => {
    //2021-02-02 10:00
    const [date, time] = fullDate.split('T')
    return `${date} ${time.slice(0, 5)}`
}


export default async (params: any, opt: SearchUtilsOptions) => {

    const currency = params.VehAvailRQCore.Currency.Code || 'GBP'
    const [pickupCodeObj, returnCodeObj] = await Promise.all([
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id: 64 }),
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode, id: 64 }),
    ])

    if (!pickupCodeObj || !returnCodeObj) return Promise.reject(`No code mapping found for grc code ${pickupCodeObj} or ${returnCodeObj}`)

    const body = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:get="http://www.jimpisoft.pt/Rentway_Reservations_WS/getMultiplePrices_GroupDetails">
   <soapenv:Header/>
   <soapenv:Body>
      <get:MultiplePrices_GroupDetails>
         <get:objRequest>
            <get:companyCode>9906</get:companyCode>
            <get:customerCode>2809</get:customerCode>
            <get:pickUp>
               <get:Date>${getDateTime(params.VehAvailRQCore.VehRentalCore.PickUpDateTime)}</get:Date>
               <get:rentalStation>${pickupCodeObj.internal_code}</get:rentalStation>
            </get:pickUp>
            <get:dropOff>
               <get:Date>${getDateTime(params.VehAvailRQCore.VehRentalCore.ReturnDateTime)}</get:Date>
               <get:rentalStation>${returnCodeObj.internal_code}</get:rentalStation>
            </get:dropOff>
            <get:username>usrBookingClik</get:username>
            <get:password>Ix;aesooS0que4bo</get:password>
         </get:objRequest>
      </get:MultiplePrices_GroupDetails>
   </soapenv:Body>
</soapenv:Envelope>
        `

    await saveServiceRequest({
        requestBody: body,
        carsSearchId: opt.searchRecord.id,
        pickupCodeObj: pickupCodeObj,
        supplierData: opt.supplierData
    })

    const { data } = await Axios({
        method: 'POST',
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
        url: `https://webservice.nizacars.es/Rentway_WS/getMultiplePrices_GroupDetails.asmx`,
        headers: {
            "Content-Type": "text/xml;charset=UTF-8",
            "SOAPAction": "http://www.jimpisoft.pt/Rentway_Reservations_WS/getMultiplePrices_GroupDetails/MultiplePrices_GroupDetails"
        },
        data: body
    })

    const u = await getClientData({ id: 64, brokerId: params.requestorClientData.clientId })

    const json = await xmlToJson(data, { charkey: "" });

    return json["soap:Envelope"]["soap:Body"][0].MultiplePrices_GroupDetailsResponse[0].MultiplePrices_GroupDetailsResult[0].getMultiplePrices_GroupDetails[0]["diffgr:diffgram"][0].NewDataSet[0].MultiplePrices_GroupDetails.map(($VehAvail: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "VehID": "",
                    //missing booking url on response
                    "Deeplink": "",
                    "Supplier_ID": `GRC-${u.clientAccountCode}`,
                    "Supplier_Name": u.clientname,
                    ...getPaypalCredentials({ requetorClient: params.requestorClientData, supplier: u })
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