import { DB } from "./DB"

type Params = {
    pickupDate: string,
    pickupTime: string,
    dropoffDate: string,
    dropoffTime: string,
    pickLocation: string,
    dropLocation: string,
    POS: any,
    xml: string
    grcgdsClient: string,
    resNumber: string,
}

export default async ({
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    pickLocation,
    dropLocation,
    POS,
    xml,
    grcgdsClient,
    resNumber,
}: Params) => {
    const toInsert = {
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        pickLocation,
        dropoffLocation: dropLocation,
        requestorId: POS.Source.RequestorID.ID,
        requestBody: xml,
        grcgdsClient,
        resNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    return DB?.insert(toInsert).into('Bookings')
}