import Axios from "axios"
import { DB } from "../utils/DB"
import { getClientData } from "../utils/getClientData"
import { getPaypalCredentials } from "../utils/getPaypalCredentials"

const URL = 'https://api-partner.discovercars.com/api/Aggregator/GetCars?access_token=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3'
const formatDate = (fullDate: string) => {
    const [date, time] = fullDate.split('T')
    return `${date.split('-').reverse().join(".")}T${time.slice(0, -3)}`
}


const getCodeForGrcCode = async (grcCode: string) => {
    const r = await DB?.select().from("companies_locations")
        .where("GRCGDSlocatincode", grcCode)
        .where("clientId", 17)
    return r && r.length != 0 ? r[0].internal_code : null
}

export default async (params: any) => {

    const body = {
        //04.08.2020T09:00
        "DateFrom": formatDate(params.VehAvailRQCore.VehRentalCore.PickUpDateTime),
        "DateTo": formatDate(params.VehAvailRQCore.VehRentalCore.ReturnDateTime),
        "PickupLocationID": await getCodeForGrcCode(params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode),
        "DropOffLocationID": await getCodeForGrcCode(params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode),
        "CurrencyCode": params?.POS?.Source?.ISOCurrency || "GBP",
        "Age": "35",
        "UserIP": "192.168.1.1",
        "Pos": "GB",
        "Lng2L": "en",
        "DeviceTypeID": "101",
        "DomainExtension": "example: .com, .co.uk, co.za, .lv, .de",
        "SearchOnlyPartners": "null",
    }


    const { data } = await Axios.post(URL, body, {
        auth: {
            username: 'mqTqzF7a42zk',
            password: 'xks8pgd2QMqAS2qN'
        }
    })

    const u = await getClientData({ id: 17 })

    return data.map(($VehAvail: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "SearchUID": $VehAvail["SearchUID"],
                    "VehID": $VehAvail["CarUID"],
                    "Deeplink": $VehAvail["BookingPageUrl"],
                    "Supplier_ID": `GRC-${u.clientId}0000`,
                    "Supplier_Name": u.clientname,
                    ...getPaypalCredentials(u)
                },
                "Vehicle": [{
                    $: {
                        "AirConditionInd": $VehAvail["AirCon"] == true ? "Yes" : "No",
                        "TransmissionType": $VehAvail["TransmissionType"] == 1 ? "Automatic" : "Manual",
                    },
                    "VehMakeModel": [{
                        $: {
                            "Name": $VehAvail["Name"],
                            "PictureURL": $VehAvail["VehicleImageUrl"],
                        }
                    }],
                    "VehType": [{
                        $: {
                            "VehicleCategory": $VehAvail["SIPP"],
                            "DoorCount": parseInt($VehAvail["Doors"]),
                            "Baggage": parseInt($VehAvail["Bags"]),
                        }
                    }],
                    "VehClass": [{
                        $: { "Size": parseInt($VehAvail["PasengerCount"]) }
                    }],
                    "VehTerms": []
                }],
                "RentalRate": [],
                "VehicleCharges": [{
                    "VehicleCharge": [{"CurrencyCode": $VehAvail["Currency"] }]
                }],
                "TotalCharge": [{
                    $: {
                        "RateTotalAmount": Number($VehAvail["Price"]).toFixed(2),
                        "CurrencyCode": $VehAvail["Currency"],
                    }
                }],
                "PricedEquips": $VehAvail.OptionalEquipmentList.map((equip: any) => {
                    return {
                        "PricedEquip": {
                            "Equipment": [{ $: {Description: equip.Name, EquipType: equip.EquipmentId, vendorEquipID: equip.EquipmentId, MaxQuantity: equip.MaxQuantity } }],
                            "Charge": [{
                                "Amount": equip.Price,
                                "IncludedRate": equip.IsMandatory,
                            }],
                        }
                    }
                })
            }]
        }
    })
}