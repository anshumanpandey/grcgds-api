import { DB } from "../utils/DB"

export const getLocationsByClient = async ({ clientId, whereFilters }: { clientId: string[], whereFilters?: any[] }) => {
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
    const r = await DB?.select(columns)
        .from("companies_locations")
        .innerJoin('clients','clients.id','companies_locations.clientId')
        .where(whereFilters || [])
        .whereIn("companies_locations.clientId", clientId)

    return r ? r.map(a => {
        const { Supplier, ...json } = a 
        return { ...json, Suppliers: { Supplier: [Supplier] }}
    }) : []
}

export const mergeSupplierLocations = (locations: any[][]) => {

    const r = locations.reduce((array, next) => {
        next.forEach(element => {
            if (element.GRCGDSlocatincode) {
                const foundIndex = array.findIndex(el => el.GRCGDSlocatincode == element.GRCGDSlocatincode && el.Suppliers.Supplier.find((v: any) => v == element.Suppliers.Supplier[0]) == null)
                if (foundIndex != -1) {
                    const found = array[foundIndex]
                    found.Suppliers.Supplier.push(element.Suppliers.Supplier[0])
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