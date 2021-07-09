import { DB } from "../utils/DB"

export type BrokerData = {
    countryName: string,
}

type Params = { code?:  string }
export const getCountryBy = async (p?: Params): Promise<BrokerData> => {
    const query = DB?.select({ countryName: 'country' })
        .from("countries")

    if (p && p.code) query?.where("code", p.code)

    const r = await query;

    return r && r.length != 0 ? r[0] : null
}