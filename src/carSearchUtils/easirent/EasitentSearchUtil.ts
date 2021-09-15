import { SearchUtilsOptions } from "../../types/SearchUtilsOptions";
import EasirentBase from "./EasirentBase";

export const EASIRENT_URL = 'https://easirent.com/broker/bookingclik/bookingclik.asp'

const resolveBcodeId = (clientId: string) => {
    if (clientId === "57") {
        return "$USA169"
    }
    return "$BRO169"
}

export default async (params: any, opt: SearchUtilsOptions) => {
    return EasirentBase({ clientId: opt.supplierData.clientId.toString(), bcode: resolveBcodeId(opt.supplierData.clientId.toString()) })(params, opt)
}