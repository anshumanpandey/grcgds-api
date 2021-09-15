import { SearchUtilsOptions } from "../../types/SearchUtilsOptions";
import NucarBaseUtil from "./NucarBaseUtil";

export const NUCARS_URL = `https://wservices.nucarrentals.com:8443/axis2/services/VehWebService2006`

const resolveAccountId = (clientId: string) => {
    if (clientId === "76") {
        return "4700ARC"
    }
    return "4720ARC"
}

export default async (params: any, opt: SearchUtilsOptions) => {

    return NucarBaseUtil({ id: opt.supplierData.clientId.toString(), accountId: resolveAccountId(opt.supplierData.clientId.toString()) })(params, opt)
}