import Axios from "axios"
import { parse } from 'date-fns'
import { format } from 'date-fns'
import { DB } from "../utils/DB"
import { getClientData } from "../utils/getClientData"
import { getPaypalCredentials } from "../utils/getPaypalCredentials"

const URL_PATH = "https://mexrentacar.com/api/v1/rateRequest"
export const MEXRENT_URL = URL_PATH

const formUrlEncoded = (x: any) =>
   Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')

const getBody = async (params: any) => {
    const body: {[k: string]: any} = {};
    const [pickCode, dropCode ] = await Promise.all([
        getCodeForGrcCode(params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode),
        getCodeForGrcCode(params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode),
    ])
    const t1 = getDateTime(params.VehAvailRQCore.VehRentalCore.PickUpDateTime)
    const t2 = getDateTime(params.VehAvailRQCore.VehRentalCore.ReturnDateTime)
    body.email_client_service = 'admin@bookingclik.com'
    body.pickup_code = pickCode
    body.dropoff_code = pickCode
    body.date_pickup = t1[0]
    body.date_dropoff = t2[0]
    body.hour_pickup = t1[1]
    body.hour_dropoff = t2[1]
    body.code_rate = "INCPOA"
    return formUrlEncoded(body)
}

const getDateTime = (fullDate: string) => {
    //2021-02-15T12:00:00
    var dateObj = parse(fullDate, `yyyy-MM-dd'T'H:mm:ss`, new Date())
    const [date] = fullDate.split('T')
    
    return [date, format(dateObj, `hh:mm aaaaa'm'`)]
}

const getCodeForGrcCode = async (grcCode: string) => {
    const r = await DB?.select().from("companies_locations")
        .where("GRCGDSlocatincode", grcCode)
        .where("clientId", 62)
    return r && r.length != 0 ? r.sort((a,b) => a.internal_code.slice(3) - b.internal_code.slice(3))[0].internal_code : null
}

const getSessionToken = async () => {

    const { data } = await Axios({
        url: "https://mexrentacar.com/oauth/token",
        method: 'post',
        data: formUrlEncoded({
            grant_type: 'client_credentials',
            client_id: '30',
            client_secret: 'yIlY8W2XtoK3aOXvCtdBu9TVJuftSiv0Pk2mhJlF',
        })
    })
    return data.access_token
}

export default async (params: any) => {

    const [bodyData, token] = await Promise.all([
        getBody(params),
        getSessionToken()
    ])
    const { data } = await Axios({
        url: MEXRENT_URL,
        method: 'post',
        data: bodyData,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    const u = await getClientData({ id: 62 })    

    return data.data.map((rate: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "VehID": rate.RateID,
                    //missing deeplink property
                    "Deeplink": "",
                    "Supplier_ID": `GRC-${u.clientId}0000`,
                    "Supplier_Name": u.clientname,
                    ...getPaypalCredentials({ requetorClient: params.requestorClientData, supplier: u })
                },
                "Vehicle": [{
                    $: {
                        "BrandPicURL": "https://www.grcgds.com/mexrentlogo.png",
                        "CarClass": rate.ClassCode,
                        "Brand": u.clientname,
                        //missing aircondition property
                        "AirConditionInd": "Yes",
                        //missing transmission property
                        "TransmissionType": "Automatic",
                    },
                    "VehMakeModel": [{
                        $: {
                            "Name": rate.ModelDesc,
                            "PictureURL": "https://www.grcgds.com/mexrentlogo.png",
                        }
                    }],
                    "VehType": [{
                        $: {
                            "VehicleCategory": rate.ClassCode,
                            "DoorCount": 0,
                            "Baggage": parseInt(rate.Luggage),
                        }
                    }],
                    "VehClass": [{
                        $: { "Size": rate.Passengers }
                    }],
                    "VehTerms": []
                }],
                "RentalRate": [],
                "VehicleCharges": [{
                    "VehicleCharge": [{"CurrencyCode": rate.CurrencyCode }]
                }],
                "TotalCharge": [{
                    $: {
                        "RateTotalAmount": Number(rate.TotalPricing.TotalCharges).toFixed(2),
                        "CurrencyCode": rate.CurrencyCode,
                    }
                }],
                "PricedEquips": []
            }]
        }
    })
}