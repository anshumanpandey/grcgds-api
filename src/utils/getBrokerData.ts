import { DB } from "../utils/DB"

export type BrokerData = {
    internalCode: string,
    clientId: string,
}

type Params = { brokerId?:  string | number, locationCode?: string | number, brokerAccountCode?: string | number }
export const getBrokerData = async (p: Params): Promise<BrokerData> => {
    const query = DB?.select({
        internalCode: 'client_broker_locations_accountype.internal_code',
        clientId: 'client_broker_locations_accountype.clientId',
    })
        .from("client_broker_locations_accountype")
        .groupBy('client_broker_locations_accountype.account_code')
    if (p.brokerAccountCode) query?.where("client_broker_locations_accountype.account_code", p.brokerAccountCode)
    if (p.locationCode) {
        query?.innerJoin('companies_locations', 'client_broker_locations_accountype.locationId', 'companies_locations.id')
        query?.where("companies_locations.GRCGDSlocatincode", p.locationCode)
    }
    if (p.brokerId) query?.where("client_broker_locations_accountype.brokerId", p.brokerId)

    const r = await query;

    return r && r.length != 0 ? r[0] : null
}