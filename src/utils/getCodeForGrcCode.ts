import { DB } from "../utils/DB";

export interface CompanyLocation {
    id:                number;
    internal_code:     string;
    location:          string;
    country:           string;
    GRCGDSlocatincode: string;
    clientId:          string;
    lat:               string;
    long:              string;
}


export const getCodeForGrcCode = async ({ grcCode, id }:{ grcCode: string, id: string | number }): Promise<CompanyLocation> => {
    const r = await DB?.select().from("companies_locations")
        .where("GRCGDSlocatincode", grcCode)
        .where("clientId", id)
    return r && r.length != 0 ? r.sort((a,b) => a.internal_code.slice(3) - b.internal_code.slice(3))[0] : null
}