import RightCarsFetchBooking from "../carsFetchBookingUtils/RightCars.fetchBooking";
import ZezgoFetchBooking from "../carsFetchBookingUtils/Zezgo.fetchBooking";
import { ApiError } from "../utils/ApiError";
import { DB, getDbFor } from "../utils/DB";
import { getBrokerData } from "../utils/getBrokerData";
import { logger } from "../utils/Logger";
import { xmlToJson } from "../utils/XmlConfig";
import { getCompanyLocations } from "./locations.service";

export enum BOOKING_STATUS_ENUM {
    CANCELLED = "Cancelled"
}
export type FetchBookingsParams = {
    ResNumber: string,
    RequestorId: string
}
export type FetchBookingFn = (p: FetchBookingsParams) => Promise<GRCBooking>;

export type GetBookingsParams = {
    accountCode : string,
    brokerId: string,
    resNumber: string,
}
const getBookingMap = new Map<string, FetchBookingFn>()
getBookingMap.set("1", RightCarsFetchBooking)
getBookingMap.set("10", ZezgoFetchBooking)
export const getBookings = async ({ accountCode, brokerId, resNumber }: GetBookingsParams ) => {
    const brokerData = await getBrokerData({
        brokerAccountCode: accountCode,
        brokerId
    })

    if (!brokerData) throw new ApiError("Supplier not found")

    let booking = null
    const fn = await getBookingMap.get(brokerData.clientId)
    if (fn) {
        booking = await fn({ ResNumber: resNumber, RequestorId: brokerData.internalCode })
    }

    return booking
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
export type BookingLocationDate = {
    day: string,
    month: string,
    year: string,
    hour: string,
    minutes: string,
}
type BookingLocation = {
    code: string,
    country: string,
    pickupInstructions: string,
    locationName: string,
    date: BookingLocationDate
}
export type GRCBooking = {
    customer: {
        firstname: string,
        lastname: string,
    },
    resNumber: string,
    carPrice: string,
    supplier: {
        phonenumber: string
    },
    pickupLocation: BookingLocation,
    dropoffLocation: BookingLocation
}

export const createBookingsXmlResponse = async (bookings: GRCBooking[]) => {
    logger.info('Creating booking response')
    const codes = await getCompanyLocations()
    return `
    <?xml version="1.0"?>
    <OTA_VehRetResRS>
    <Success/>
    <VehRetResRSCore>
        ${bookings.map((b) => {
        return `
            <VehReservation>
            <Customer>
                <Primary>
                <PersonName>
                    <GivenName>${b.customer?.firstname || ""}</GivenName>
                    <Surname>${b.customer?.lastname || ""}</Surname>
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
                    <LocationCode>${b.pickupLocation.code}</LocationCode>
                    <Pickupdate>${b.pickupLocation.date.year}-${b.pickupLocation.date.month}-${b.pickupLocation.date.day}T${b.pickupLocation.date.hour}:${b.pickupLocation.date.minutes}</Pickupdate>
                </PickUpLocation>
                <ReturnLocation>
                    <Name/>
                    <LocationCode>${b.dropoffLocation.code}</LocationCode>
                    <Pickupdate>${b.dropoffLocation.date.year}-${b.dropoffLocation.date.month}-${b.dropoffLocation.date.day}T${b.dropoffLocation.date.hour}:${b.dropoffLocation.date.minutes}</Pickupdate>
                    </ReturnLocation>
                </VehRentalCore>
                <Vehicle>
                    <Code>FVMR</Code>
                </Vehicle>
                <Extras></Extras>
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
                    <CountryCode>${b.pickupLocation.country}</CountryCode>
                    </CountryName>
                </Address>
                <Telephone>
                    <PhoneNumber>${b?.supplier?.phonenumber}</PhoneNumber>
                </Telephone>
                <Code>${b.pickupLocation.code}</Code>
                <Name>${b.pickupLocation.locationName}</Name>
                <CodeContext>Pickup Location</CodeContext>
                <Pickupinst>${b.pickupLocation.pickupInstructions}</Pickupinst>
                </LocationDetails>
                <LocationDetails>
                <Address>
                    <AddressLine/>
                    <CityName/>
                    <PostalCode/>
                    <CountryName>
                        <Name/>
                        <Code/>
                        <CountryCode>${b.dropoffLocation.country}</CountryCode>
                    </CountryName>
                </Address>
                <Telephone>
                    <PhoneNumber>${b?.supplier?.phonenumber}</PhoneNumber>
                </Telephone>
                <Code>${b.dropoffLocation.code}</Code>
                <Name>${b.dropoffLocation.locationName}</Name>
                <CodeContext>Return Location</CodeContext>
				<Returninst>${b.dropoffLocation.pickupInstructions}</Returninst>
                </LocationDetails>
            </VehSegmentInfo>
            </VehReservation>`;
        }).join("\n")}
    </VehRetResRSCore>
    </OTA_VehRetResRS>`
}