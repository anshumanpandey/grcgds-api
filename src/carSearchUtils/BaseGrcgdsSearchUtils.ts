import axios from "axios"
import { SearchUtilsOptions } from "../types/SearchUtilsOptions";
import { DB } from "../utils/DB";
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

const generateXmlBody = async (body: any, { pickCode, dropCode }: { pickCode: any, dropCode: any }) => {
    const PickUpDateTime = body.VehAvailRQCore.VehRentalCore.PickUpDateTime
    const ReturnDateTime = body.VehAvailRQCore.VehRentalCore.ReturnDateTime
    const pickLocation = pickCode.internal_code
    const dropLocation = dropCode.internal_code
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
            <RequestorID Type="5" ID="${body.requestorID || "GRC-470000"}" RATEID="${body.rateId}" RATETYPES=""/>
        </Source>
        </POS>
        <VehAvailRQCore Status="Available">
        <Currency Code="${currency || "EUR"}"/>
        <VehRentalCore PickUpDateTime="${PickUpDateTime}" ReturnDateTime="${ReturnDateTime}">
        <PickUpLocation LocationCode="${pickLocation}" />
        <ReturnLocation LocationCode="${dropLocation}" />
        </VehRentalCore>
            <DriverType Age="${Age || pickCode.country || dropCode.country || 35}"/>
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

type Params =  { reqBody: any, rateId: string, requestorID?: string,grcgdsClientId: string, url?: string,  } & SearchUtilsOptions
export default async ({ reqBody, rateId, grcgdsClientId, requestorID, url = 'https://www.grcgds.com/XML/', searchRecord, supplierData }: Params) => {

    const t = await getDataUser(reqBody);

    const [pickCode, dropCode] = await Promise.all([
        getCodeForGrcCode({ grcCode: reqBody.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode, id: reqBody.grcgdsClientId }),
        getCodeForGrcCode({ grcCode: reqBody.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode, id: reqBody.grcgdsClientId }),
    ])

    const grc = await getClientData({ id: grcgdsClientId, brokerId: reqBody.requestorClientData.clientId })
    const xml = await generateXmlBody({ ...reqBody, rateId, requestorID, account_code: t?.account_code, grcgdsClientId }, { pickCode, dropCode });

    await saveServiceRequest({
        requestBody: xml,
        carsSearchId: searchRecord.id,
        pickupCodeObj: pickCode,
        supplierData
    })

    const { data } = await axios.post(url, xml, {
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
                        ...getPaypalCredentials({ requetorClient: reqBody.requestorClientData, supplier: grc })
                    },
                }],
            }))
        return json
    }
}