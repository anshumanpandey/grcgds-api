import { SearchUtilsOptions } from "../../types/SearchUtilsOptions";
import { CompanyLocation, getCodeForGrcCode } from "../../utils/getCodeForGrcCode";
import EasirentBase from "./EasirentBase";
import {isAnEuropeCountry, isIreland, isUk, isUsa} from "./europe_countries";

export const EASIRENT_URL = 'https://easirent.com/broker/bookingclik/bookingclik.asp'

const resolveBcodeId = (clientId: string) => {
    if (clientId === "57") {
        return "$USA169"
    }
    return "$BRO169"
}

const resolveCodeByLocation = (p: { pickCode: CompanyLocation, dropCode: CompanyLocation}) => {
    if (isAnEuropeCountry(p.pickCode.country)) {
        if (isIreland(p.dropCode.country)) {
            return "$ROI172"
        } else if(isUk(p.dropCode.country)) {
            return "$BRO172"
        } else if(isUsa(p.dropCode.country)) {
            return "$USA172"
        }
    } else if (isUsa(p.pickCode.country)) {
        if (isIreland(p.dropCode.country)) {
            return "$ROI172X"
        } else if(isUk(p.dropCode.country)) {
            return "$BRO172X"
        } else if(isUsa(p.dropCode.country)) {
            return "$USA172X"
        }
    }
}

export default async (params: any, opt: SearchUtilsOptions) => {
    const [ pickupCodeObj, returnCodeObj ] = await Promise.all([
        getCodeForGrcCode({
            grcCode: params.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode,
            id: opt.supplierData.clientId
        }),
        getCodeForGrcCode({
            grcCode: params.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode,
            id: opt.supplierData.clientId
        }),
    ])
    const bcode = resolveCodeByLocation({ pickCode: pickupCodeObj, dropCode: returnCodeObj}) || resolveBcodeId(opt.supplierData.clientId.toString())
    return EasirentBase({
        clientId: opt.supplierData.clientId.toString(),
        bcode,
        pickupCodeObj,
        returnCodeObj
    })(params, opt)
}