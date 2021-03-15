import BaseGrcgdsSearchUtils from "./BaseGrcgdsSearchUtils";

export const LOCALCARS_URL = 'https://www.grcgds.com/XML/'

export default async (body: any) => {
    const r = await BaseGrcgdsSearchUtils({ reqBody: body, requestorID: "GRC-650000", rateId: "GRC-1550001", grcgdsClientId: "65" })
    return r
}
