import axios from "axios"
import { RC_URL } from "../carSearchUtils/RightCarsSearchUtils"
import { BookingLocationDate, FetchBookingsParams, GRCBooking } from "../services/bookings.service"
import { getCountryBy } from "../utils/getCountryBy"
import { xmlToJson } from "../utils/XmlConfig"
import { XmlError } from "../utils/XmlError"

export interface RCBookingData {
    OTA_VehRetResRS: OTAVehRetResRS;
}

export interface OTAVehRetResRS {
    $:               Empty;
    Success:         string[];
    VehRetResRSCore: VehRetResRSCore[];
}

export interface Empty {
    xmlns:                string;
    "xmlns:xsi":          string;
    "xsi:schemaLocation": string;
    Version:              string;
}

export interface VehRetResRSCore {
    VehReservation: VehReservation[];
}

export interface VehReservation {
    Customer:       Customer[];
    VehSegmentCore: VehSegmentCore[];
    VehSegmentInfo: VehSegmentInfo[];
}

export interface Customer {
    Primary: Primary[];
}

export interface Primary {
    PersonName: PersonName[];
    Email:      string[];
    Address:    Address[];
}

export interface Address {
    AddressLine:  string[];
    CityName:     string[];
    PostalCode:   string[];
    CountryName?: CountryName[];
}

export interface Telephone {
    PhoneNumber: string[]
}

export interface CountryName {
    Name: string[];
    Code: string[];
}

export interface PersonName {
    GivenName: string[];
    Surname:   string[];
}

export interface VehSegmentCore {
    ConfID:        ConfID[];
    VehRentalCore: VehRentalCore[];
    Vehicle:       Vehicle[];
    Extras:        Extra[];
    RentalRate:    RentalRate[];
    TotalCharge:   TotalCharge[];
}

export interface ConfID {
    ResNumber: string[];
}

export interface Extra {
    [k: string]:  string[];
}

export interface RentalRate {
    RateDistance:   RateDistance[];
    VehicleCharges: RentalRateVehicleCharge[];
    RateQualifier:  RateQualifier[];
}

export interface RateDistance {
    Unlimited:             string[];
    DistUnitName:          string[];
    VehiclePeriodUnitName: string[];
}

export interface RateQualifier {
    RateCategory:  string[];
    RateQualifier: string[];
    RatePeriod:    string[];
    VendorRateID:  string[];
}

export interface RentalRateVehicleCharge {
    VehicleCharge: VehicleChargeVehicleCharge[];
}

export interface VehicleChargeVehicleCharge {
    TaxAmounts:  VehicleChargeTaxAmount[];
    Calculation: Calculation[];
}

export interface Calculation {
    UnitCharge: string[];
    UnitName:   string[];
    Quantity:   string[];
}

export interface VehicleChargeTaxAmount {
    TaxAmount: TaxAmountTaxAmount[];
}

export interface TaxAmountTaxAmount {
    Total:        string[];
    CurrencyCode: string[];
    Percentage:   string[];
    Description:  string[];
}

export interface TotalCharge {
    RateTotalAmount:      string[];
    EstimatedTotalAmount: string[];
}

export interface VehRentalCore {
    PickUpLocation: PickUpLocation[];
    ReturnLocation: ReturnLocation[];
}

export interface PickUpLocation {
    Name:         string[];
    LocationCode: string[];
    Pickupdate:   string[];
}

export interface ReturnLocation {
    Name:         string[];
    LocationCode: string[];
    Returndate:   string[];
}

export interface Vehicle {
    Code:      string[];
    regnumber: string[];
}

export interface VehSegmentInfo {
    LocationDetails: LocationDetail[];
}

export interface LocationDetail {
    Address:     Address[];
    Telephone:   Telephone[];
    Code:        string[];
    Name:        string[];
    CodeContext: string[];
    Pickupinst?: string[];
    ReturnInst?: string[];
}

const dateStringToDateJson = (dateString: string): BookingLocationDate => {
    //dateString be like "2021-08-08T10:00:00"
    const [date, time] = dateString.split('T')
    const [year, month, day] = date.split('-')
    const [hour, minutes, seconds] = time.split(":")

    return {
        day,
        month,
        year,
        hour: hour,
        minutes: minutes,
        seconds
    }
}
export default async ({ ResNumber, RequestorId, AccountCode }: FetchBookingsParams): Promise<GRCBooking> => {

    const xml = `<OTA_VehRetResRQ xmlns="http://www.opentravel.org/OTA/2003/05"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05
    VehRetResRQ.xsd">
    <POS>
    <Source>
    <RequestorID Type="5" ID="${RequestorId}" />
    </Source>
    </POS>
    <VehRetResRQCore>
    <ResNumber Number="${ResNumber}"/>
    <PersonName>
    <GivenName>Rick</GivenName>
    <Surname>Little</Surname>
    </PersonName>
    </VehRetResRQCore>
    </OTA_VehRetResRQ>`

    const { data } = await axios.post(RC_URL, xml, {
        headers: {
            'Content-Type': 'application/soap+xml;charset=utf-8',
        }
    })

    if (data.includes("Error")) {
        throw new XmlError(data)
    }

    const rcBooking = await xmlToJson(data) as unknown as RCBookingData

    const pickupLocation = rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentInfo[0].LocationDetails.find(e => e.CodeContext[0] == "Pickup Location")
    const dropLocation = rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentInfo[0].LocationDetails.find(e => e.CodeContext[0] == "Return Location")
    const pickupDateString = rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].VehRentalCore[0].PickUpLocation[0].Pickupdate[0]
    const dropDateString = rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].VehRentalCore[0].ReturnLocation[0].Returndate[0]
    const extraKeys = Object.keys(rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].Extras[0])
    
    const pickCountryCode = pickupLocation?.Address[0]?.CountryName?.[0]?.Code[0] || ""
    const dropCountryCode = dropLocation?.Address[0]?.CountryName?.[0]?.Code[0] || ""
    const [pickCountry, dropCountry] = await Promise.all([
        getCountryBy({ code: pickCountryCode }),
        getCountryBy({ code: dropCountryCode }),
    ])

    return {
        customer: {
            firstname: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].Customer[0].Primary[0].PersonName[0].GivenName[0],
            lastname: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].Customer[0].Primary[0].PersonName[0].Surname[0],
            email: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].Customer[0].Primary[0].Email[0],
            address: {
                addressLine: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].Customer[0].Primary[0].Address[0].AddressLine[0],
                postalCode: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].Customer[0].Primary[0].Address[0].PostalCode[0],
                cityName: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].Customer[0].Primary[0].Address[0].CityName[0],
            },
        },
        extras: extraKeys.map((key) => {
            return {
                key,
                val: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].Extras[0][key][0]
            }
        }) || [],
        taxData: {
            total: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0].TaxAmounts[0].TaxAmount[0].Total[0],
            currencyCode: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0].TaxAmounts[0].TaxAmount[0].CurrencyCode[0],
            percentage: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0].TaxAmounts[0].TaxAmount[0].Percentage[0],
            description: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0].TaxAmounts[0].TaxAmount[0].Description[0],
        },
        calculation: {
            unitCharge: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0].Calculation[0].UnitCharge[0],
            quantity: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0].Calculation[0].Quantity[0],
            unitName: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].RentalRate[0].VehicleCharges[0].VehicleCharge[0].Calculation[0].UnitName[0],
        },
        rateQualifier: {
            rateCategory: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].RentalRate[0].RateQualifier[0].RateCategory[0],
            rateQualifier: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].RentalRate[0].RateQualifier[0].RateQualifier[0],
            ratePeriod: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].RentalRate[0].RateQualifier[0].RatePeriod[0],
            vendorRateID: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].RentalRate[0].RateQualifier[0].VendorRateID[0],
        },
        resNumber: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].ConfID[0].ResNumber[0],
        carCode: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].Vehicle[0].Code[0],
        carPrice: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentCore[0].TotalCharge[0].EstimatedTotalAmount[0],
        supplier: {
            phonenumber: rcBooking.OTA_VehRetResRS.VehRetResRSCore[0].VehReservation[0].VehSegmentInfo[0].LocationDetails[0].Telephone[0].PhoneNumber[0],
            id: `GRC-${RequestorId}`,
            name: AccountCode
        },
        pickupLocation: {
            code: pickupLocation?.Code[0] || "",
            countryCode: pickCountryCode,
            countryName: pickCountry.countryName,
            pickupInstructions: pickupLocation?.Pickupinst?.[0] || "",
            locationName: pickupLocation?.Name[0] || "",
            date: dateStringToDateJson(pickupDateString),
            address: {
                addressLine: pickupLocation?.Address[0].AddressLine[0] || "",
                cityName: pickupLocation?.Address[0].CityName[0] || "",
                postalCode: pickupLocation?.Address[0].PostalCode[0] || "",
                countryName: {
                    name: pickupLocation?.Address[0].CountryName?.[0].Name[0] || "",
                    code: pickupLocation?.Address[0].CountryName?.[0].Code[0] || "",
                }
            }
        },
        dropoffLocation: {
            code: dropLocation?.Code[0] || "",
            countryCode: dropCountryCode || "",
            countryName: dropCountry.countryName,
            pickupInstructions: dropLocation?.ReturnInst?.[0] || "",
            locationName: dropLocation?.Name[0] || "",
            date: dateStringToDateJson(dropDateString),
            address: {
                addressLine: dropLocation?.Address[0].AddressLine[0] || "",
                cityName: dropLocation?.Address[0].CityName[0] || "",
                postalCode: dropLocation?.Address[0].PostalCode[0] || "",
                countryName: {
                    name: dropLocation?.Address[0].CountryName?.[0].Name[0] || "",
                    code: dropLocation?.Address[0].CountryName?.[0].Code[0] || "",
                }
            }
        }
    }
}