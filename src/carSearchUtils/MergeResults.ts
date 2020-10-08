import { AvailabilityResponse } from "../types/AvailabilityResponse"

export default (RcResults: any, rest: any[][]) => {
    rest.forEach(r => {
        if (r.length > 0) {
            RcResults.OTA_VehAvailRateRS.VehVendorAvails[0].VehVendorAvail[0].VehAvails[0].VehAvail = RcResults.OTA_VehAvailRateRS.VehVendorAvails[0].VehVendorAvail[0].VehAvails[0].VehAvail.concat(r)
        }
    })

    return RcResults
}

export const getUserOfResults = (results: any[]) => {
    const map = results.reduce((map, next) => {
        if (!map.has(next.VehAvailCore[0].$.Supplier_ID)) {
            map.set(next.VehAvailCore[0].$.Supplier_ID, { Supplier_ID: next.VehAvailCore[0].$.Supplier_ID ,Supplier_Name:next.VehAvailCore[0].$.Supplier_Name})
        }
        return map
    }, new Map())

    return { Supplier: Array.from(map.values()) }
}