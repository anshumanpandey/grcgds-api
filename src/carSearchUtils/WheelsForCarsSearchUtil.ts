import BaseGrcgdsSearchUtils from "./BaseGrcgdsSearchUtils";

export const LOCALCARS_URL = 'https://www.grcgds.com/XML/'

export default async (body: any) => {
    return BaseGrcgdsSearchUtils({ reqBody: body, rateId: "GRC-560000", grcgdsClientId: "52" })
} 
