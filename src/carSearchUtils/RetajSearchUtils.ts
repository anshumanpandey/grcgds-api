import { SearchUtilsOptions } from "../types/SearchUtilsOptions";
import BaseGrcgdsSearchUtils from "./BaseGrcgdsSearchUtils";

export const RETAJ_URL = 'https://www.grcgds.com/XML/'

export default async (body: any, p: SearchUtilsOptions) => {
    return BaseGrcgdsSearchUtils({ reqBody: body, rateId: "GRC-930005", grcgdsClientId: "36", ...p })
}
