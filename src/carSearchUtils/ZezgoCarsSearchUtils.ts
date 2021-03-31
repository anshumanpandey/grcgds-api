import axios from "axios"
import { getDataUsersForUserId } from "../services/requestor.service";
import { DB } from "../utils/DB";
import { getClientData } from "../utils/getClientData";
import { getPaypalCredentials } from "../utils/getPaypalCredentials";
import { xmlToJson } from '../utils/XmlConfig';

const getDataUser = async (body: any) => {
    const query = DB?.select()
    .from("client_broker_locations_accountype")
    .where("clientId",body.POS.Source.RequestorID.ID.slice(4,6))
    .andWhere("description", "like", "%Mobile Rates%")

    const r = await query
    
    return r && r.length != 0 ? r[0] : null
}

const getCodeForGrcCode = async (grcCode: string) => {
    const r = await DB?.select().from("companies_locations")
        .where("GRCGDSlocatincode", grcCode)
        .where("clientId", 10)
    return r && r.length != 0 ? r[0].internal_code : null
}

const generateXmlBody = async (body: any) => {
    const [pickCode, dropCode] = await Promise.all([
        getCodeForGrcCode(body.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode),
        getCodeForGrcCode(body.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode),
    ])
    const PickUpDateTime = body.VehAvailRQCore.VehRentalCore.PickUpDateTime
    const ReturnDateTime = body.VehAvailRQCore.VehRentalCore.ReturnDateTime
    const pickLocation = pickCode
    const dropLocation = dropCode
    const Age = body.VehAvailRQInfo.Customer.Primary.DriverType.Age
    const Code = body.VehAvailRQInfo.Customer.Primary.CitizenCountryName.Code
    const currency = body?.POS?.Source?.ISOCurrency

    return `<OTA_VehAvailRateRQ xmlns="https://www.opentravel.org/OTA/2003/05" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://www.opentravel.org/OTA/2003/05 OTA_VehAvailRateRQ.xsd" TimeStamp="2018-12-04T17:00:16" Target="Production" Version="1.002">
    <POS>
      <Source>
        <RequestorID Type="5" ID="Mobile002"/>
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
    <VehAvailRQInfo>
      <Customer>
        <Primary>
            <CitizenCountryName Code="${Code || "UK"}"/>
        </Primary>
      </Customer>
    </VehAvailRQInfo>
  </OTA_VehAvailRateRQ>`;
}

export const ZEZGO_URL = "https://ota.zezgo.com/"

export default async (body: any) => {

    const t = await getDataUser(body);

    const grc = await getClientData({ id: 10 })

    const xml = await generateXmlBody({ ...body, account_code: t?.account_code});

    const { data } = await axios.post(ZEZGO_URL, xml, {
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
                        Deeplink: r.VehAvailCore[0].$.deeplink,
                        "Supplier_ID": `GRC-${grc.clientId}0000`,
                        "Supplier_Name": grc.clientname,
                        ...getPaypalCredentials({ requetorClient: body.requestorClientData, supplier: grc })
                    },
                    Vehicle: [{
                        ...r.VehAvailCore[0].Vehicle[0],
                        $: {
                            ...r.VehAvailCore[0].Vehicle[0].$,
                            "Brand": grc.clientname,
                            "BrandPicURL": "https://www.zezgo.com/public/img/logo.png",
                        },
                    }]
                }],
            }))
        return json
    }
}
