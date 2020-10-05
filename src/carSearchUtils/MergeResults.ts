export default (RcResults: any, rest: any[][]) => {
    rest.forEach(r => {
        if (r.length > 0) {
            RcResults.OTA_VehAvailRateRS.VehVendorAvails[0].VehVendorAvail[0].VehAvails[0].VehAvail = RcResults.OTA_VehAvailRateRS.VehVendorAvails[0].VehVendorAvail[0].VehAvails[0].VehAvail.concat(r)
        }
    })

    return RcResults
}