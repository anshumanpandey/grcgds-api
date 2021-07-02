import DB, { getDbFor } from "./DB";

type Params = {
    pickupDate: string,
    pickupTime: string,
    dropoffDate: string,
    dropoffTime: string,
    pickLocation: string,
    dropoffLocation: string,
    hannkMobileUser?: { id: string },
    hannkClientData?: { id: string },
}
export const LogCarSearchToDb = async (parmas: Params) => {

    const toInsert = {
        "pickupDate": parmas["pickupDate"],
        "pickupTime": parmas["pickupTime"],
        "dropoffDate": parmas["dropoffDate"],
        "dropoffTime": parmas["dropoffTime"],
        "pickLocation": parmas["pickLocation"],
        "dropoffLocation": parmas["dropoffLocation"],
        "customerId": parmas.hannkMobileUser ? parmas.hannkMobileUser["id"] : '',
        "clientId": parmas.hannkClientData ? parmas.hannkClientData.id : '',
        "createdAt": new Date(),
        "updatedAt ": new Date(),
    }
    const [recordId] = await getDbFor("grcgds_gateway_db")?.insert(toInsert).into('CarSearches');
    return { id: recordId }
}