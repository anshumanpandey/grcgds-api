import { DB } from '../utils/DB';

export const FilterBrandsForClient = async (grcCode: string) => {
    const blockedBrands = await DB?.select().from("BlockedBrands") || []

    return (result: any) => {
        if (blockedBrands.length == 0) return true

        const clientName = result.VehAvailCore[0].$.Supplier_Name.toLowerCase().replace(/\s/g,'')
        const brand = result.VehAvailCore[0].Vehicle[0].$.Brand.toLowerCase().replace(/\s/g,'')
        return !blockedBrands
            .filter(i => i.supplierId.toLowerCase().replace(/\s/g,'') == clientName)
            .map(r => r.brandName.toLowerCase().replace(/\s/g,'')).includes(brand)
    }
}