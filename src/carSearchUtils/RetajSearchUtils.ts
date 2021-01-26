import BaseGrcgdsSearchUtils from "./BaseGrcgdsSearchUtils";

export const RETAJ_URL = 'https://www.grcgds.com/XML/'

export default async (body: any) => {
    return BaseGrcgdsSearchUtils({ reqBody: body, rateId: "GRC-930005", grcgdsClientId: "36" })
} 