import axios from "axios"
import { DB } from "../utils/DB";
import { getClientData } from "../utils/getClientData";
import { getPaypalCredentials } from "../utils/getPaypalCredentials";
import { xmlToJson } from '../utils/XmlConfig';
const allSettled = require('promise.allsettled');

const getRightCarsDataUsers = async () => {
    const r = await DB?.select()
        .from("client_broker_locations_accountype")
        .where("client_broker_locations_accountype.clientId", 1)
        .whereRaw("client_broker_locations_accountype.account_code <> '' ")
        .groupBy("client_broker_locations_accountype.internal_code");
    return r || []
}

const generateXmlBody = (body: any, id: string) => {
    const PickUpDateTime = body.VehAvailRQCore.VehRentalCore.PickUpDateTime
    const ReturnDateTime = body.VehAvailRQCore.VehRentalCore.ReturnDateTime
    const pickLocation = body.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode
    const dropLocation = body.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode
    const Age = body.VehAvailRQInfo.Customer.Primary.DriverType.Age
    const Code = body.VehAvailRQInfo.Customer.Primary.CitizenCountryName.Code
    const currency = body?.POS?.Source?.ISOCurrency

    return `<OTA_VehAvailRateRQ xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05OTA_VehAvailRateRQ.xsd" TimeStamp="2014-09-08-T16:38:24" EchoToken="$ttoken" Target="Production" Version="1.002">
    <POS>
        <Source>
            <RequestorID Type="5" ID="mobile001"/>
        </Source>
    </POS>
    <VehAvailRQCore Status="Available">
    <Currency Code="${currency || "EUR"}"/>
        <VehRentalCore PickUpDateTime="${PickUpDateTime}" ReturnDateTime="${ReturnDateTime}">
            <PickUpLocation LocationCode="${pickLocation}"/>
    
            <ReturnLocation LocationCode="${dropLocation}"/>
        </VehRentalCore>
    <DriverType Age="35"/>
    </VehAvailRQCore>
    <VehAvailRQInfo>
        <Customer>
        <Primary>
            <CitizenCountryName Code="${Code || "UK"}"/>
            <DriverType Age="${Age || 35}"/>
        </Primary>
        </Customer>
        <TPA_Extensions>
            <ConsumerIP>188.39.95.93</ConsumerIP>
        </TPA_Extensions>
    </VehAvailRQInfo>
    </OTA_VehAvailRateRQ>
`
}

export const RC_URL = 'https://ota.right-cars.com'

export default async (body: any) => {

    const [rc, dataUsers] = await Promise.all([
        getClientData({ id: 1 }),
        getRightCarsDataUsers()
    ]);

    const xml = generateXmlBody(body, "1000022");

    const { data } = await axios.post(RC_URL, xml, {
        headers: {
            'Content-Type': 'text/plain; charset=UTF8',
        }
    })

    const json = await xmlToJson(data);
    if (json.OTA_VehAvailRateRS.VehVendorAvails[0].VehVendorAvail[0].VehAvails[0] == "") {
        json.OTA_VehAvailRateRS.VehVendorAvails[0].VehVendorAvail[0].VehAvails = [{ VehAvail: [] }]
        return []
    } else {
        return json.OTA_VehAvailRateRS.VehVendorAvails[0].VehVendorAvail[0].VehAvails[0].VehAvail
            .map((r: any) => {
                const { deeplink, ...vehCoreMeta } = r.VehAvailCore[0].$
                return {
                    VehAvailCore: [{
                        ...r.VehAvailCore[0],
                        $: {
                            ...vehCoreMeta,
                            Deeplink: deeplink,
                            "Supplier_ID": `GRC-${rc.clientId}0000`,
                            "Supplier_Name": rc.clientname,
                            ...getPaypalCredentials(rc)
                        },
                        Vehicle: [{
                            ...r.VehAvailCore[0].Vehicle[0],
                            $: {
                                ...r.VehAvailCore[0].Vehicle[0].$,
                                "Brand": rc.clientname,
                                "BrandPicURL": "https://supplierimages.rent.it/rightcars.jpg",
                            },
                        }]
                    }],
                }
            })
    }

}