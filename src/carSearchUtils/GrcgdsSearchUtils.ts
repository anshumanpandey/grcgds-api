import axios from "axios"
import { getDataUsersForUserId } from "../services/requestor.service";
import { SearchUtilsOptions } from "../types/SearchUtilsOptions";
import { DB } from "../utils/DB";
import { getBrokerData } from "../utils/getBrokerData";
import { getClientData } from "../utils/getClientData";
import { getCodeForGrcCode } from "../utils/getCodeForGrcCode";
import { getPaypalCredentials } from "../utils/getPaypalCredentials";
import { saveServiceRequest } from "../utils/saveServiceRequest";
import { xmlToJson } from '../utils/XmlConfig';

const getDataUser = async (body: any) => {
    const query = DB?.select()
    .from("client_broker_locations_accountype")
    .where("clientId",body.POS.Source.RequestorID.ID.slice(4,6))
    .andWhere("description", "like", "%Mobile Rates%")

    const r = await query
    
    return r && r.length != 0 ? r[0] : null
}

const generateXmlBody = (body: any) => {
    const PickUpDateTime = body.VehAvailRQCore.VehRentalCore.PickUpDateTime
    const ReturnDateTime = body.VehAvailRQCore.VehRentalCore.ReturnDateTime
    const pickLocation = body.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode
    const dropLocation = body.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode
    const Age = body.VehAvailRQInfo.Customer.Primary.DriverType.Age
    const Code = body.VehAvailRQInfo.Customer.Primary.CitizenCountryName.Code
    const currency = body?.POS?.Source?.ISOCurrency

    return `<?xml version="1.0" encoding="UTF-8"?>
    <OTA_VehAvailRateRQ xmlns="http://www.opentravel.org/OTA/2003/05"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05 OTA_VehAvailRateRQ.xsd"
    TimeStamp="2020-06-04T19:32:01" Target="Production" Version="1.002">
        <POS>
        <Source>
            <RequestorID Type="5" ID="${body?.POS?.Source?.RequestorID.ID || "320000"}" RATEID="GRC-${"930001"}" RATETYPES=""/>
        </Source>
        </POS>
        <VehAvailRQCore Status="Available">
        <Currency Code="${currency || "EUR"}"/>
        <VehRentalCore PickUpDateTime="${PickUpDateTime}" ReturnDateTime="${ReturnDateTime}">
        <PickUpLocation LocationCode="${pickLocation}" />
        <ReturnLocation LocationCode="${dropLocation}" />
        </VehRentalCore>
            <DriverType Age="${Age || 35}"/>
        </VehAvailRQCore>
        <VehAvailRQInfo >
        <Customer>
        <Primary>
            <CitizenCountryName Code="${Code || "UK"}"/>
        </Primary>
        </Customer>
        </VehAvailRQInfo>
    </OTA_VehAvailRateRQ>`
}

export const GRCGDS_URL = 'https://www.grcgds.com/XML'

export default async (body: any, opt: SearchUtilsOptions) => {

    const t = await getDataUser(body);

    const grc = await getClientData({ id: 36, brokerId: body.requestorClientData.clientId })
    const xml = generateXmlBody({ ...body, account_code: t?.account_code});

    const pickLocationCode = await getCodeForGrcCode({ grcCode: body.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id: 36 })

    await saveServiceRequest({
        requestBody: xml,
        carsSearchId: opt.searchRecord.id,
        pickupCodeObj: pickLocationCode,
        supplierData: opt.supplierData
    })

    const { data } = await axios.post(GRCGDS_URL, xml, {
        headers: {
            'Content-Type': 'text/plain; charset=UTF8',
        }
    })

    const json = await xmlToJson(data, { charkey: "" });
    if (json.OTA_VehAvailRateRS.VehVendorAvails[0].VehVendorAvail[0].VehAvails[0] == "") {
        return []
    } else {
        return json.OTA_VehAvailRateRS.VehVendorAvails[0].VehVendorAvail[0].VehAvails[0].VehAvail
            .map((r: any) => ({
                VehAvailCore: [{
                    ...r.VehAvailCore[0],
                    $: {
                        ...r.VehAvailCore[0].$,
                        "Supplier_ID": `GRC-${grc.clientAccountCode}`,
                        "Supplier_Name": grc.clientname,
                        ...getPaypalCredentials({ requetorClient: body.requestorClientData, supplier: grc })
                    },
                }],
            }))
        return json
    }
}