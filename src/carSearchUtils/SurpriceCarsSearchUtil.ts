import Axios from "axios"
import { DB } from "../utils/DB"
import { getClientData } from "../utils/getClientData"
import { getCodeForGrcCode } from "../utils/getCodeForGrcCode"
import { getPaypalCredentials } from "../utils/getPaypalCredentials"

const getUrl = async (params: any) => {
    const [pickCode, dropCode ] = await Promise.all([
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode ,id: 37}),
        getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode ,id: 37}),
    ])
    const [pickDate, pickTime] = params.VehAvailRQCore.VehRentalCore.PickUpDateTime.split("T")
    const [dropDate, dropTime] = params.VehAvailRQCore.VehRentalCore.PickUpDateTime.split("T")
    return `https://www.grcgds.com/surprice_api/available_api.php?pickuplocationcode=${pickCode.internal_code}&pickupdate=${pickDate}&pickuptime=${pickTime}&returnlocationcode=${dropCode.internal_code}&returndate=${dropDate}&returntime=${dropTime}&age=30`
}

export default async (params: any) => {

    const url = await getUrl(params)
    const { data } = await Axios.get(url, {})

    const u = await getClientData({ id: 37, brokerId: params.requestorClientData.clientId })

    return data.map((car: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "VehID": "",
                    "Deeplink": car.deeplink,
                    "Supplier_ID": `GRC-${u.clientAccountCode}`,
                    "Supplier_Name": u.clientname,
                    ...getPaypalCredentials({ requetorClient: params.requestorClientData, supplier: u })
                },
                "Vehicle": [{
                    $: {
                        "BrandPicURL": `https://www.grcgds.com/surprice_logo.png`,
                        "Brand": "Surprice",
                        "AirConditionInd": car.model.aircondition == 1 ? "Yes" : "No",
                        "TransmissionType": car.model.TransmissionType == "M" ? "Manual" : "Automatic" ,
                    },
                    "VehMakeModel": [{
                        $: {
                            "Name": car.model.type,
                            "PictureURL": car.model.photo_url,
                        }
                    }],
                    "VehType": [{
                        $: {
                            "VehicleCategory": car.model.SIPPCode,
                            "DoorCount": car.model.doors, // we cannot getr the door number from API response
                            "Baggage": 0,
                        }
                    }],
                    "VehClass": [{
                        $: { "Size": car.model.persons }
                    }],
                    "VehTerms": []
                }],
                "RentalRate": [],
                "VehicleCharge": {
                    "CurrencyCode": car.charge.currency,
                },
                "VehicleCharges": [{
                    "VehicleCharge": [{"CurrencyCode": car.charge.currency }]
                }],
                "TotalCharge": [{
                    $: {
                        "RateTotalAmount": Number(car.charge.price).toFixed(2),
                        "CurrencyCode": car.charge.currency,
                    }
                }],
                "PricedEquips": car.extras.map((e: any) => {
                    return {
                        PricedEquip: {
                            Equipment: [{ $: { Description: e.Description, EquipType: e.EquipmentId, vendorEquipID: e.Description } }],
                            Amount: e.Charge
                        }
                    }
                })
            }]
        }
    })
}