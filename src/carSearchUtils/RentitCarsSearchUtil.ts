import Axios from "axios"
import { SearchUtilsOptions } from "../types/SearchUtilsOptions"
import { DB } from "../utils/DB"
import { getClientData } from "../utils/getClientData"
import { getCodeForGrcCode } from "../utils/getCodeForGrcCode"
import { getPaypalCredentials } from "../utils/getPaypalCredentials"
import { saveServiceRequest } from "../utils/saveServiceRequest"

const URL_PATH = "https://webapi.rent.it/api-ri/Quote/CreateAndLoad/"
export const RENTI_URL = URL_PATH

const getUrl = async (params: any, { pickCode, dropCode }: { pickCode: any, dropCode: any }) => {
    return `${URL_PATH}?ClientId=222&APIKey=4a3fa5f2-2df6-2f97-13ef-e8c0bd075917&Language=EN&RemoteIP=127.0.0.1&CountryID=1&PickUpLocationID=${pickCode.internal_code}&PickUpDate=${params.VehAvailRQCore.VehRentalCore.PickUpDateTime}&DropOffLocationID=${dropCode.internal_code}&DropOffDate=${params.VehAvailRQCore.VehRentalCore.ReturnDateTime}&DriverCountryCode=${pickCode.country || dropCode.country || "IT"}&DriverAge=30&Currency=${params?.POS?.Source?.ISOCurrency || "GBP"}&UserID=0`
}

export default async (params: any, opt: SearchUtilsOptions) => {
    const [pickCode, dropCode ] = await Promise.all([
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id: 11}),
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode, id: 11}),
    ])
    const url = await getUrl(params, { pickCode, dropCode })
    await saveServiceRequest({
        requestBody: url,
        carsSearchId: opt.searchRecord.id,
        pickupCodeObj: pickCode,
        supplierData: opt.supplierData
    })
    const { data } = await Axios.get(url, {})

    const u = await getClientData({ id: 11, brokerId: params.requestorClientData.clientId })

    return data.Rates.map((rate: any) => {
        const doorsRegexp = /[0-9].*[0-9]/gim
        const doors = doorsRegexp.exec(rate.Vehicle.Type)
        return {
            VehAvailCore: [{
                $: {
                    "VehID": rate.Reference.RequestID,
                    "Deeplink": rate.BookUrl,
                    "Supplier_ID": `GRC-${u.clientAccountCode}`,
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