import { SearchUtilsOptions } from "../types/SearchUtilsOptions";
import { CompanyLocation, getCodeForGrcCode } from "../utils/getCodeForGrcCode";
import YesawayBase, { YESAWAY_ZONES } from "./YesawayBase";

export const YESAWAY_URL = `http://javelin-api.yesaway.com/services`

export default async (params: any, opt: SearchUtilsOptions) => {
    const Location = params.VehAvailRQInfo.Customer.Primary.DriverType.Location

    let yesAwayClientIds = [67, 73, 74]
    let yesAwayClientId = yesAwayClientIds[0]
    let zoneLocation = YESAWAY_ZONES.W_US_ORDER_NOPROTECTION_RR_FULLPREPAID

    for (let i = 0; i < yesAwayClientIds.length; i++) {
        const id = yesAwayClientIds[i]
        let [pickupCodeObj, returnCodeObj] = await Promise.all([
            getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id }),
            getCodeForGrcCode({ grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode, id }),
        ]);
        if (!pickupCodeObj && !returnCodeObj) {
            if (yesAwayClientIds.length == (i + 1)) {
                return Promise.reject('')
            } else {
                continue
            }
        }

        if (!returnCodeObj) returnCodeObj = pickupCodeObj

        if (pickupCodeObj.country == 'US' && returnCodeObj.country == 'US' && (!Location || Location !== 'US')) {
            zoneLocation = YESAWAY_ZONES.W_US_ORDER_COM_RR_FULLPREPAID
        }
        if (pickupCodeObj.country == 'NZ' || returnCodeObj.country == 'NZ') {
            zoneLocation = YESAWAY_ZONES.W_NZ_ORDER_BASE_RR_FULLPREPAID
            yesAwayClientId = 73
        }
        if (pickupCodeObj.country == 'TH' || returnCodeObj.country == 'TH') {
            zoneLocation = YESAWAY_ZONES.W_TH_ORDER_BASE_RR_FULLPREPAID
            yesAwayClientId = 74
        }
        break
    }

    
    const r = await YesawayBase({ yesAwayClientId, zoneLocation })(params, opt)
    return r
}