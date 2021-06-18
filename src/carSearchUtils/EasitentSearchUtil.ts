import Axios from "axios"
import { DB } from "../utils/DB"
import { getClientData } from "../utils/getClientData";
import { getCodeForGrcCode } from "../utils/getCodeForGrcCode";
import { getPaypalCredentials } from "../utils/getPaypalCredentials";
import { xmlToJson } from '../utils/XmlConfig';

export const EASIRENT_URL = 'https://easirent.com/broker/bookingclik/bookingclik.asp'
const getDateTime = (fullDate: string) => {
    const [date, time] = fullDate.split('T')
    return [date, time.slice(0, 5)]
}

export default async (params: any) => {

    const [ pickupCodeObj, returnCodeObj ] = await Promise.all([
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id: 57}),
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode, id: 57}),
    ])

    if(!pickupCodeObj || !returnCodeObj) return Promise.reject(`No code mapping found for grc code ${pickupCodeObj} or ${returnCodeObj}`)

    let bcode = "$BRO166"
    if (params.VehAvailRQInfo.Customer.Primary.CitizenCountryName.Code.toLowerCase() == "us" && pickupCodeObj.country.toLowerCase() == "us") {
        bcode = "$USA166A"
    }

    const body = `<?xml version="1.0" encoding="utf-8"?>
    <GetVehicles>
        <bcode>${bcode}</bcode>
        <vtype>1</vtype>
        <estmiles>10000</estmiles>
        <currency>${params?.POS?.Source?.ISOCurrency}</currency>
        <pickup>
            <location>${pickupCodeObj.internal_code}</location>
            <date>${getDateTime(params.VehAvailRQCore.VehRentalCore.PickUpDateTime)[0]}</date>
            <time>${getDateTime(params.VehAvailRQCore.VehRentalCore.PickUpDateTime)[1]}</time>
        </pickup>
        <dropoff>
            <location>${returnCodeObj.internal_code}</location>
            <date>${getDateTime(params.VehAvailRQCore.VehRentalCore.ReturnDateTime)[0]}</date>
            <time>${getDateTime(params.VehAvailRQCore.VehRentalCore.ReturnDateTime)[1]}</time>
        </dropoff>
    </GetVehicles>`

    const [{ data }, u, ] = await Promise.all([
        Axios.post(EASIRENT_URL, body, {}),
        getClientData({ id: 57, brokerId: params.requestorClientData.clientId })
    ])

    const json = await xmlToJson(data, { charkey: "" });

    return json.easirent.vehicle.map(($VehAvail: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "VehID": "",
                    "Deeplink": $VehAvail.deeplink[0].replace(/\s/g, "").replace(/[\r]/g, "").replace(/[\n]/g, ""),
                    "Supplier_ID": `GRC-${u.clientAccountCode}`,
                    "Supplier_Name": u.clientname,
                    ...getPaypalCredentials({ requetorClient: params.requestorClientData, supplier: u })
                },
                "Vehicle": [{
                    $: {
                        "AirConditionInd": $VehAvail.aircon[0] == "Yes" ? "Yes" : "No",
                        "TransmissionType": $VehAvail.transType[0] == "Manual" ? "Manual" :"Automatic",
                        "BrandPicURL": "https://www.easirent.com/ref/ppc/IMG/small-logo.png",
                        "Brand": "Easirent",
                    },
                    "VehMakeModel": [{
                        $: {
                            "Name": $VehAvail.description[0],
                            "PictureURL": $VehAvail.pictureUrl[0],
                        }
                    }],
                    "VehType": [{
                        $: {
                            "VehicleCategory": $VehAvail.SIPP[0],
                            "DoorCount": $VehAvail.doors[0],
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
                    "VehicleCharge": [{"CurrencyCode": $VehAvail.currency[0] }]
                }],
                "TotalCharge": [{
                    $: {
                        "RateTotalAmount": Number($VehAvail.price[0]).toFixed(2),
                        "CurrencyCode": $VehAvail.currency[0],
                    }
                }],
                "PricedEquips": []
            }]
        }
    })
}