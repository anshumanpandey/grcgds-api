import Axios from "axios"
import { DB } from "../utils/DB"
import { getClientData } from "../utils/getClientData"
import { getCodeForGrcCode } from "../utils/getCodeForGrcCode"
import { getPaypalCredentials } from "../utils/getPaypalCredentials"

const URL_PATH = "https://webapi.rent.it/api-ri/Quote/CreateAndLoad/"
export const RENTI_URL = URL_PATH

const getUrl = async (params: any) => {
    const [pickCode, dropCode ] = await Promise.all([
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id: 11}),
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode, id: 11}),
    ])
    return `${URL_PATH}?ClientId=35&APIKey=30995a94-bc9b-f1ba-b47e-21a0091c24c4&Language=EN&RemoteIP=127.0.0.1&CountryID=1&PickUpLocationID=${pickCode.internal_code}&PickUpDate=${params.VehAvailRQCore.VehRentalCore.PickUpDateTime}&DropOffLocationID=${dropCode.internal_code}&DropOffDate=${params.VehAvailRQCore.VehRentalCore.ReturnDateTime}&DriverCountryCode=${pickCode.country || dropCode.country || "IT"}&DriverAge=30&Currency=${params?.POS?.Source?.ISOCurrency || "GBP"}&UserID=0`
}

export default async (params: any) => {

    const url = await getUrl(params)
    const { data } = await Axios.get(url, {})

    const u = await getClientData({ id: 11 })

    return data.Rates.map((rate: any) => {
        const doorsRegexp = /[0-9].*[0-9]/gim
        const doors = doorsRegexp.exec(rate.Vehicle.Type)
        return {
            VehAvailCore: [{
                $: {
                    "VehID": rate.Reference.RequestID,
                    "Deeplink": rate.BookUrl,
                    "Supplier_ID": `GRC-${u.clientId}0000`,
                    "Supplier_Name": u.clientname,
                    ...getPaypalCredentials({ requetorClient: params.requestorClientData, supplier: u })
                },
                "Vehicle": [{
                    $: {
                        "BrandPicURL": rate.Supplier.LogoUrl,
                        "CarClass": rate.Vehicle.AcrissGroup[0]?.Name,
                        "Brand": rate.Supplier.Name,
                        "AirConditionInd": rate.Vehicle.AC == true ? "Yes" : "No",
                        "TransmissionType": rate.Vehicle.Automatic == true ? "Automatic" : "Manual",
                    },
                    "VehMakeModel": [{
                        $: {
                            "Name": rate.Vehicle.Vehicles,
                            "PictureURL": rate.Vehicle.PhotoUrl,
                        }
                    }],
                    "VehType": [{
                        $: {
                            "VehicleCategory": rate.Vehicle.Acriss,
                            "DoorCount": doors ? doors[0] : 0,
                            "Baggage": parseInt(rate.Vehicle.Luggages),
                        }
                    }],
                    "VehClass": [{
                        $: { "Size": rate.Vehicle.Passengers }
                    }],
                    "VehTerms": []
                }],
                "RentalRate": [],
                "VehicleCharges": [{
                    "VehicleCharge": [{"CurrencyCode": rate.TotalRate.TotalAmount.Currency,}]
                }],
                "TotalCharge": [{
                    $: {
                        "RateTotalAmount": Number(rate.TotalRate.TotalAmount.Amount).toFixed(2),
                        "CurrencyCode": rate.TotalRate.TotalAmount.Currency,
                    }
                }],
                "PricedEquips": []
            }]
        }
    })
}