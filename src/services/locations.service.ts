import { DB } from "../utils/DB"

export const getLocationsByClient = ({ clientId, whereFilters }: { clientId: string[], whereFilters?: any[] }) => {
    const columns = {
        Supplier: "clients.clientname",
        Id: "companies_locations.id",
        InternalCode: "companies_locations.internal_code",
        Location: "companies_locations.location",
        Country: "companies_locations.country",
        GRCGDSlocatincode: "companies_locations.GRCGDSlocatincode",
        Lat: "companies_locations.Lat",
        Long: "companies_locations.Long"
    };
    const r = DB?.select(columns)
        .from("companies_locations")
        .innerJoin('clients','clients.id','companies_locations.clientId')
        .where(whereFilters || [])
        .whereIn("companies_locations.clientId", clientId)

    return r || []
}