import { DB } from "../utils/DB"

export type whereFilter = {'columnName': string, op: string, val: string}
export const getLocationsByClient = async ({ clientId, whereFilters }: { clientId: string[], whereFilters?: whereFilter[] }) => {
    return getAllLocations({clientId, whereFilters})
}

export const mergeSupplierLocations = (locations: any[][]) => {

    const r = locations.reduce((array, next) => {
        next.forEach(element => {
            if (element.GRCGDSlocatincode) {
                const foundIndex = array.findIndex(el => el.GRCGDSlocatincode == element.GRCGDSlocatincode)
                if (foundIndex != -1) {
                    const found = array[foundIndex]
                    if (!found.Suppliers.Supplier.includes(element.Suppliers.Supplier[0])) {
                        found.Suppliers.Supplier.push(element.Suppliers.Supplier[0])
                    }
                    array[foundIndex] = found;
                } else {
                    array.push(element)
                }
            } else {
                array.push(element)
            }
        });
        return array
    }, [])

    return r
}

export const isGrcgdsLocations = async (code: string) => {
    const r = await DB?.select()
    .from("grcgds_locations")
    .where("internalcode", code)

    if (!r) return false
    if (r.length == 0) return false

    return true
}

type Params = { clientId?: string[], whereFilters?: whereFilter[] }
export const getAllLocations = async ({ clientId, whereFilters }: Params) => {
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
    const query = DB?.select(columns)
        .from("companies_locations")
        .innerJoin('clients','clients.id','companies_locations.clientId')

        whereFilters?.forEach(w => {
            query?.where(w.columnName, w.op, w.val);
        })

        if (clientId) {
            query?.where("companies_locations.clientId", clientId);
        }

    const r = await query;

    return r ? r.map(a => {
        const { Supplier, ...json } = a 
        return { ...json, Suppliers: { Supplier: [Supplier] }}
    }) : []
}