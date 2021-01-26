import BaseGrcgdsSearchUtils from "./BaseGrcgdsSearchUtils";

export const LOCALCARS_URL = 'https://www.grcgds.com/XML/'

export default async (body: any) => {
    return BaseGrcgdsSearchUtils({ reqBody: body, rateId: "GRC-880003", grcgdsClientId: "32" })
} 