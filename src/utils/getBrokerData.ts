import { DB } from "../utils/DB"

export type BrokerData = {
    internalCode: string,
    clientId: string,
}

type Params = { brokerId?:  string | number, locationCode?: string | number, brokerAccountCode?: string | number }
export const getBrokerData = async (p: Params): Promise<BrokerData> => {
    const query = DB?.select({
        internalCode: 'internal_code',
        clientId: 'clientId',
    })
        .from("client_broker_locations_accountype")
        .groupBy('account_code')
    if (p.brokerAccountCode) query?.where("client_broker_locations_accountype.account_code", p.brokerAccountCode)
    if (p.locationCode) query?.where("client_broker_locations_accountype.brokerInternalCode", p.locationCode)
    if (p.brokerId) query?.where("client_broker_locations_accountype.brokerInternalCode", p.brokerId)

    const r = await query;

    return r && r.length != 0 ? r[0] : null
}