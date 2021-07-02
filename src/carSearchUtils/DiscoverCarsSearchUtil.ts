import Axios from "axios"
import { SearchUtilsOptions } from "../types/SearchUtilsOptions"
import { getBrokerData } from "../utils/getBrokerData"
import { getClientData } from "../utils/getClientData"
import { getCodeForGrcCode } from "../utils/getCodeForGrcCode"
import { getPaypalCredentials } from "../utils/getPaypalCredentials"
import { saveServiceRequest } from "../utils/saveServiceRequest"

const URL = 'https://api-partner.discovercars.com/api/Aggregator/GetCars?access_token=yHjjy7XZVTsVTb4zP3HLc3uQP3ZJEvBkKBuwWhSwNCkafCXx5ykRmhJdnqW2UJT3'
const formatDate = (fullDate: string) => {
    const [date, time] = fullDate.split('T')
    return `${date.split('-').reverse().join(".")}T${time.slice(0, -3)}`
}

export default async (params: any, opt: SearchUtilsOptions) => {
    const { POS } = params
    const { Source: { RequestorID } } = POS

    const pickLocationCode = await getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id: 17})

    const body = {
        //04.08.2020T09:00
        "DateFrom": formatDate(params.VehAvailRQCore.VehRentalCore.PickUpDateTime),
        "DateTo": formatDate(params.VehAvailRQCore.VehRentalCore.ReturnDateTime),
        "PickupLocationID": pickLocationCode.internal_code,
        "DropOffLocationID": (await getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode, id: 17})).internal_code,
        "CurrencyCode": params?.POS?.Source?.ISOCurrency || "GBP",
        "Age": "35",
        "UserIP": "192.168.1.1",
        "Pos": "GB",
        "Lng2L": "en",
        "DeviceTypeID": "101",
        "DomainExtension": "example: .com, .co.uk, co.za, .lv, .de",
        "SearchOnlyPartners": "null",
    }

    await saveServiceRequest({
        requestBody: JSON.stringify(body),
        carsSearchId: opt.searchRecord.id,
        pickupCodeObj: pickLocationCode,
        supplierData: opt.supplierData
    })

    const { data } = await Axios.post(URL, body, {
        auth: {
            username: 'mqTqzF7a42zk',
            password: 'xks8pgd2QMqAS2qN'
        }
    })

    const u = await getClientData({ id: 17, brokerId: params.requestorClientData.clientId })

    return data.map(($VehAvail: any) => {
        return {
            VehAvailCore: [{
                $: {
                    "SearchUID": $VehAvail["SearchUID"],
                    "VehID": $VehAvail["CarUID"],
                    "Deeplink": $VehAvail["BookingPageUrl"],
                    "Supplier_ID": `GRC-${u.clientAccountCode}`,
                    "Supplier_Name": u.clientname,
                    ...getPaypalCredentials({ requetorClient: params.requestorClientData, supplier: u })
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