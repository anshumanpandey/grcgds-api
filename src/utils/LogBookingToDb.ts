import { getGrcgdsLocations } from "../services/locations.service"
import { DB } from "./DB"
import { logger } from "./Logger"

type Params = {
    pickupDate: string,
    pickupTime: string,
    dropoffDate: string,
    dropoffTime: string,
    pickLocation: string,
    dropLocation: string,
    price: string,
    POS: any,
    xml: string
    grcgdsClient: string,
    resNumber: string,
    extras: any[],
    hannkUser: any
}

export default async ({
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    pickLocation,
    dropLocation,
    price,
    POS,
    xml,
    grcgdsClient,
    resNumber,
    extras,
    hannkUser
}: Params) => {
    const [pickupFullAddress, dropoffFullAddress] = await Promise.all([
        getGrcgdsLocations({ whereFilters: [{ columnName: 'internalcode', op: '=', val: pickLocation }]}),
        getGrcgdsLocations({ whereFilters: [{ columnName: 'internalcode', op: '=', val: dropLocation }]}),
    ])
    const toInsert = {
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime,
        pickLocation,
        carPrice: price,
        pickupFullAddress: pickupFullAddress[0].locationname,
        dropoffFullAddress: dropoffFullAddress[0].locationname,
        dropoffLocation: dropLocation,
        requestorId: POS.Source.RequestorID.ID,
        requestBody: xml,
        grcgdsClient,
        resNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
        customerId : hannkUser?.id
    }
    logger.info(`Login booking to DB ${JSON.stringify(toInsert)}`)
    if (hannkUser) {
        logger.info(`For mobile app user ${JSON.stringify(hannkUser)}`)
    }


    await DB?.insert(toInsert).into('Bookings')
    const bookings = await DB?.select(DB?.raw('LAST_INSERT_ID()'))
    if (!bookings) return Promise.resolve()

    const extrasToInsert = extras?.map(e => {
        return {
            'vendorEquipId': e["vendorEquipID"],
            'quantity': e["Quantity"],
            'bookingId': bookings[0]["LAST_INSERT_ID()"],
        }
    })

    return DB?.insert(extrasToInsert || [] ).into('BookingsExtras')
}