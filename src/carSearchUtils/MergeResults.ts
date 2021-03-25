import { AvailabilityResponse } from "../types/AvailabilityResponse"

export default (RcResults: any, rest: any[][]) => {
    const all = 
    rest.forEach((r = []) => {
        if (r.length > 0) {
          if (RcResults.OTA_VehAvailRateRS) {
            RcResults.OTA_VehAvailRateRS.VehVendorAvails[0].VehVendorAvail[0].VehAvails[0].VehAvail = RcResults.OTA_VehAvailRateRS.VehVendorAvails[0].VehVendorAvail[0].VehAvails[0].VehAvail.concat(r)
          } else {

          }
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

export const wrapCarsResponseIntoXml = (cars: any[], params: any) => {

    return {
        $: {
          xmlns: "http://www.opentravel.org/OTA/2003/05",
          "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
          "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05 OTA_VehAvailRateRS.xsd",
          TimeStamp: new Date().toISOString(),
          Target: "Test",
          Version: "1.002",
        },
        Success: [
          "",
        ],
        VehAvailRSCore: [
          {
            Suppliers: getUserOfResults(cars),
            VehRentalCore: [
              {
                $: {
                  PickUpDateTime: params.VehAvailRQCore.VehRentalCore.PickUpDateTime,
                  ReturnDateTime: params.VehAvailRQCore.VehRentalCore.ReturnDateTime,
                },
                PickUpLocation: [
                  {
                    $: {
                      LocationCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode,
                    },
                  },
                ],
                ReturnLocation: [
                  {
                    $: {
                      LocationCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode,
                    },
                  },
                ],
              },
            ],
          },
        ],
        VehVendorAvails: [
          {
            VehVendorAvail: [
              {
                VehAvails: [
                  {
                    VehAvail: cars.map(r => {
                      r.VehAvailCore[0].$.PaymentClientID = "AULf9Sl8sTQh_qg1YdRivkb25yh04L8npaWCinbQYI-rXAI_FHjySNWwhqgC3l2co2v3UVZOTe4Ut3s2"
                      r.VehAvailCore[0].$.PaymentKey = "EBvmJupOC4USrlufwkkSvtEWifz_KQmpbpX4Rap57Vw-_uU6PHdufZpzCHbjbmS9z2fpH_dSWEN6IFea"
                      r.VehAvailCore[0].$.PaymentMethod = "Paypal"
                      return r
                    }),
                  },
                ],
              },
            ],
          },
        ],
      };
}