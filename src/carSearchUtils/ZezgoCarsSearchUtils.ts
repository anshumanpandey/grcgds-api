import axios from "axios"
import { getDataUsersForUserId } from "../services/requestor.service";
import { DB } from "../utils/DB";
import { xmlToJson } from '../utils/XmlConfig';

const getGrcgds = async () => {
    const r = await DB?.select({ clientId: "clients.id", clientname: "clients.clientname", clientAccountCode: "data_suppliers_user.account_code" })
        .from("clients")
        .leftJoin('data_suppliers_user', 'data_suppliers_user.clientId', 'clients.id')
        .joinRaw('LEFT JOIN broker_account_type on data_suppliers_user.account_type_code and broker_account_type.name = "Prepaid Standard" ')
        .where("clients.id", 10)
    return r && r.length != 0 ? r[0] : null
}

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

    const grc = await getGrcgds()
    const xml = generateXmlBody({ ...body, account_code: t?.account_code});

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
                        "Supplier_ID": `GRC-${grc.clientAccountCode}`,
                        "Supplier_Name": grc.clientname,
                    },
                }],
            }))
        return json
    }
}