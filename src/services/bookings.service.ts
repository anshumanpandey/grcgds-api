import { DB, getDbFor } from "../utils/DB";
import { logger } from "../utils/Logger";
import { getCompanyLocations } from "./locations.service";
import { getHannkUserByEmail } from "./requestor.service";

export enum BOOKING_STATUS_ENUM {
    CANCELLED = "Cancelled"
}

export type GetBookingsParams = { RequestorIDs? : string[], appUserEmail?: string, clientId?: string, resNumber?: string }
export const getBookings = async ({ RequestorIDs = [], appUserEmail, clientId, resNumber }: GetBookingsParams ) => {
    logger.info("Getting bookings")
    const getBookingQuery = DB?.select().from("Bookings").whereNot('customerId', null)
    if (appUserEmail) {
        const hannkUser = await getHannkUserByEmail({ email: appUserEmail })
        if (hannkUser) {
            getBookingQuery?.where("customerId", hannkUser.id)
        }
    }
    if (RequestorIDs && RequestorIDs.length != 0) {
        getBookingQuery?.andWhere(function() {
            RequestorIDs.forEach(id => {
                this.orWhere("requestorId", id)
            })
        })
    }
    if (clientId) {
        getBookingQuery?.where("grcgdsClient", clientId)
    }

    if (resNumber) {
        getBookingQuery?.where("resNumber", resNumber)
    }
    const [r, extras ] = await Promise.all([
        getBookingQuery,
        DB?.select().from("BookingsExtras")
    ]);

    if (!r) return [];
    if (r.length == 0) return [];

    const [customers, grcClients] = await Promise.all([
        getDbFor("grcgds_hannk").select().from("users"),
        getDbFor("grcgds_gateway_db").select().from("clients"),
    ])

    return r.map((r) => {
        return {
            ...r,
            supplier: grcClients.find((s) => s.id == r.grcgdsClient),
            customer: customers.find(c => c.id == r.customerId ),
            extras: (extras || []).filter(e => e.bookingId == r.id)
        }
    })
}

export const cancelBookingByResNumber = async (resNumber: string) => {
    return DB?.table("Bookings")
    .where('resNumber', resNumber)
    .update({
        reservationStatus: BOOKING_STATUS_ENUM.CANCELLED,
    })
}

export const getBookingsBy = async ({ requestorId, grcgdsClientId, resNumber }: { requestorId: string, grcgdsClientId?: string, resNumber: string }) => {
    const query = DB?.select().from("Bookings")
    .where('requestorId', requestorId)
    .where('resNumber', resNumber)

    if (grcgdsClientId) query?.where('grcgdsClient', grcgdsClientId)

    const bookings = await query
    if (!bookings) return []

    return bookings
}

export const createBookingsXmlResponse = async (bookings: any[]) => {
    logger.info('Creating booking response')
    const codes = await getCompanyLocations()
    return `
    <?xml version="1.0"?>
    <OTA_VehRetResRS>
    <Success/>
    <VehRetResRSCore>
        ${bookings.filter(b => b.customer).map((b) => {
            const extras = b.extras.length != 0 ? b.extras.map((e: any) => {
                return `<${e.vendorEquipId}>${e.quantity}</${e.vendorEquipId}>`;
            }).join("\n"): ""
        return `
            <VehReservation>
            <Customer>
                <Primary>
                <PersonName>
                    <GivenName>${b.customer.firstname}</GivenName>
                    <Surname>${b.customer.lastname}</Surname>
                </PersonName>
                <Email/>
                <Address>
                    <AddressLine/>
                    <CityName/>
                    <PostalCode/>
                </Address>
                </Primary>
            </Customer>
            <VehSegmentCore>
                <ConfID>
                <ResNumber>${b.resNumber}</ResNumber>
                </ConfID>
                <VehRentalCore>
                <PickUpLocation>
                    <Name/>
                    <LocationCode>${b.pickLocation}</LocationCode>
                    <Pickupdate>${b.pickupDate}T${b.pickupTime.slice(0, 5)}</Pickupdate>
                </PickUpLocation>
                <ReturnLocation>
                    <Name/>
                    <LocationCode>${b.dropoffLocation}</LocationCode>
                    <Pickupdate>${b.dropoffDate}T${b.dropoffTime.slice(0, 5)}</Pickupdate>
                </ReturnLocation>
                </VehRentalCore>
                <Vehicle>
                    <Code>FVMR</Code>
                </Vehicle>
                <Extras>${extras}</Extras>
                <RentalRate>
                <RateDistance>
                    <Unlimited>true</Unlimited>
                    <DistUnitName>km</DistUnitName>
                    <VehiclePeriodUnitName>RentalPeriod</VehiclePeriodUnitName>
                </RateDistance>
                <VehicleCharges>
                    <VehicleCharge>
                    <TaxAmounts>
                        <TaxAmount>
                        <Total/>
                        <CurrencyCode/>
                        <Percentage/>
                        <Description>Tax</Description>
                        </TaxAmount>
                    </TaxAmounts>
                    <Calculation>
                        <UnitCharge/>
                        <UnitName>Day</UnitName>
                        <Quantity>1</Quantity>
                    </Calculation>
                    </VehicleCharge>
                </VehicleCharges>
                <RateQualifier>
                    <RateCategory/>
                    <RateQualifier/>
                    <RatePeriod/>
                    <VendorRateID/>
                </RateQualifier>
                </RentalRate>
                <TotalCharge>
                <RateTotalAmount>${b.carPrice}</RateTotalAmount>
                <EstimatedTotalAmount>${b.carPrice}</EstimatedTotalAmount>
                </TotalCharge>
            </VehSegmentCore>
            <VehSegmentInfo>
                <LocationDetails>
                <Address>
                    <AddressLine/>
                    <CityName/>
                    <PostalCode/>
                    <CountryName>
                    <Name/>
                    <Code/>
                    <CountryCode>${codes.find(c => c.internal_code == b.pickLocation)?.country}</CountryCode>
                    </CountryName>
                </Address>
                <Telephone>
                    <PhoneNumber>${b?.supplier?.phonenumber}</PhoneNumber>
                </Telephone>
                <Code>${b.pickLocation}</Code>
                <Name>${codes.find(c => c.internal_code == b.pickLocation)?.location || b.pickupFullAddress}</Name>
                <CodeContext>Pickup Location</CodeContext>
                <Pickupinst>${b.pickupInstructions}</Pickupinst>
                </LocationDetails>
                <LocationDetails>
                <Address>
                    <AddressLine/>
                    <CityName/>
                    <PostalCode/>
                    <CountryName>
                        <Name/>
                        <Code/>
                        <CountryCode>${codes.find(c => c.internal_code == b.dropoffLocation)?.country}</CountryCode>
                    </CountryName>
                </Address>
                <Telephone>
                    <PhoneNumber>${b?.supplier?.phonenumber}</PhoneNumber>
                </Telephone>
                <Code>${b.dropoffLocation}</Code>
                <Name>${codes.find(c => c.internal_code == b.dropoffLocation)?.location || b.dropoffFullAddress}</Name>
                <CodeContext>Return Location</CodeContext>
				<Returninst>${b.returninstructions || ""}</Returninst>
                </LocationDetails>
            </VehSegmentInfo>
            </VehReservation>`;
        }).join("\n")}
    </VehRetResRSCore>
    </OTA_VehRetResRS>`
}