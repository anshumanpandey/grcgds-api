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
        if (!map.has(next.Supplier.ID)) {
            map.set(next.Supplier.ID, next.Supplier)
        }
        return map
    }, new Map())

    return { Supplier: Array.from(map.values()) }
}