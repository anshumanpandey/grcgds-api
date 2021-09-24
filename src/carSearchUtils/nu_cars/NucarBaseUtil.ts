import Axios from "axios"
import { SearchUtilsOptions } from "../../types/SearchUtilsOptions";
import { getClientData } from "../../utils/getClientData";
import { getCodeForGrcCode } from "../../utils/getCodeForGrcCode";
import { getPaypalCredentials } from "../../utils/getPaypalCredentials";
import { saveServiceRequest } from "../../utils/saveServiceRequest";
import { xmlToJson } from '../../utils/XmlConfig';
import { XmlError } from "../../utils/XmlError";

export const NUCARS_URL = `https://wservices.nucarrentals.com:8443/axis2/services/VehWebService2006`

type NucarBaseParams = {
    id: string,
    accountId: string
}
export default (p: NucarBaseParams) => async (params: any, opt: SearchUtilsOptions) => {

    const currency = params?.VehAvailRQCore?.Currency?.Code || 'GBP'
    const [pickupCodeObj, returnCodeObj] = await Promise.all([
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id: p.id }),
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode, id: p.id }),
    ])

    if (!pickupCodeObj || !returnCodeObj) return Promise.reject(`No code mapping found for grc code ${pickupCodeObj} or ${returnCodeObj}`)

    const body = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://www.opentravel.org/OTA/2003/05">
    <soapenv:Header/>
    <soapenv:Body>
       <OTA_VehAvailRateRQ SequenceNmbr="000" Version="1.0" xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:ns2="http://www.opentravel.org/OTA/2003/05/beta">
          <POS>
             <!--Agent Duty Code = CL87654-->
             <Source ISOCountry="US" AgentDutyCode="CL87654">
                <RequestorID Type="5" ID="${p.accountId}">
                   <CompanyName Code="CL" CodeContext="NUORG">CL</CompanyName>
                </RequestorID>
                <BookingChannel Type="6" Primary="true">
                   <CompanyName Code="CL" CodeContext="NUORG">CL</CompanyName>
                </BookingChannel>
             </Source>
          </POS>
          <VehAvailRQCore Status="All">
             <!--Enter location rental and return date/time-->
             <VehRentalCore 
                    PickUpDateTime="${params.VehAvailRQCore.VehRentalCore.PickUpDateTime}:00" 
                    ReturnDateTime="${params.VehAvailRQCore.VehRentalCore.ReturnDateTime}:00">
                <PickUpLocation LocationCode="${pickupCodeObj.internal_code}"/>
                <ReturnLocation LocationCode="${returnCodeObj.internal_code}"/>
             </VehRentalCore>
             <!--NU CHAIN CODE-->
             <VendorPrefs>
                <VendorPref Code="NU" CompanyShortName="NU Car Rentals">NU Car Rentals</VendorPref>
             </VendorPrefs>
             <RateQualifier PromotionCode="${p.accountId}"/>
          </VehAvailRQCore>
       </OTA_VehAvailRateRQ>
    </soapenv:Body>
  </soapenv:Envelope>`

    await saveServiceRequest({
        requestBody: body,
        carsSearchId: opt.searchRecord.id,
        pickupCodeObj: pickupCodeObj,
        supplierData: opt.supplierData
    })

    const { data } = await Axios({
        method: 'POST',
        url: NUCARS_URL,
        headers: {
            "Content-Type": "text/xml;charset=UTF-8",
            "SOAPAction": `"urn:vehAvail"`,
            "Content-Length": body.length
        },
        data: body
    })

    const u = await getClientData({ id: p.id, brokerId: params.requestorClientData.clientId })

    if (data.includes("Error")) {
        throw new XmlError(data)
    }
    
    const json = await xmlToJson(data, { charkey: "" });

    return json["soapenv:Envelope"]["soapenv:Body"][0].OTA_VehAvailRateRS[0].VehAvailRSCore[0].VehVendorAvails[0].VehVendorAvail[0].VehAvails[0].VehAvail.map(($VehAvail: any) => {
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
                        "AirConditionInd": $VehAvail.VehAvailCore[0].Vehicle[0].$.AirConditionInd == false ? "No" : "Yes",
                        "TransmissionType": $VehAvail.VehAvailCore[0].Vehicle[0].$.TransmissionType,
                        "BrandPicURL": `https://www.grcgds.com/nucars-logo.jpeg`,
                        "Brand": u.clientname,
                    },
                    "VehMakeModel": [{
                        $: {
                            "Name": $VehAvail.VehAvailCore[0].Vehicle[0].VehMakeModel[0].$.Name,
                            "PictureURL": `https://www.grcgds.com/nucars-logo.jpeg`,
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
                    "VehicleCharge": [{ "CurrencyCode": currency }]
                }],
                "TotalCharge": [{
                    $: {
                        "RateTotalAmount": Number($VehAvail.VehAvailCore[0].TotalCharge[0].$.RateTotalAmount).toFixed(2),
                        "CurrencyCode": currency,
                        "Commission": $VehAvail.VehAvailCore[0].Fees[0].Fee.find((i:any) => i.$.Description.toLowerCase().trim() === "commission")?.Amount || "",
                    }
                }],
                "PricedEquips": []
            }]
        }
    })
}