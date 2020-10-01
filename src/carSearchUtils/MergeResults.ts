export default (RcResults: any, ...rest: any[]) => {
    rest.forEach(r => {
        if (r.lenght > 0) {
            RcResults.OTA_VehAvailRateRS.VehVendorAvails[0].VehVendorAvail[0].VehAvails[0].VehAvail.push(...r)
        }
    })

    return RcResults
}