import { DB } from "../utils/DB"

export const getLocationsByClient = ({ clientId, whereFilters }: { clientId: string[], whereFilters?: any[] }) => {
    const columns = { Id: "id", InternalCode: "internal_code", Location: "location", Country: "country", GRCGDSlocatincode: "GRCGDSlocatincode", Lat: "Lat", Long: "Long" }
    const r = DB?.select(columns).where(whereFilters || []).whereIn("clientId", clientId).from("companies_locations")
    return r || []
}