import { SearchUtilsOptions } from "../types/SearchUtilsOptions";
import BaseGrcgdsSearchUtils from "./BaseGrcgdsSearchUtils";

export const LOCALCARS_URL = 'https://www.grcgds.com/XML/'

export default async (body: any, p: SearchUtilsOptions) => {
    const r = await BaseGrcgdsSearchUtils({ reqBody: body, requestorID: 'GRC-120000',rateId: "GRC-1450001", grcgdsClientId: "56", ...p })
    return r
} 
