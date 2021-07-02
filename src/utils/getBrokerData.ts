import { DB } from "../utils/DB"

type BrokerData = {
    internalCode: string,
}

export const getBrokerData = async ({ brokerAccountCode, locationCode }: { locationCode?: string | number, brokerAccountCode?: string | number }): Promise<BrokerData> => {
    const query = DB?.select({
        internalCode: 'internal_code'
    })
        .from("client_broker_locations_accountype")
        .groupBy('account_code')
    if (brokerAccountCode) query?.where("client_broker_locations_accountype.account_code", brokerAccountCode)
    if (locationCode) query?.where("client_broker_locations_accountype.brokerInternalCode", locationCode)

    const r = await query;

    return r && r.length != 0 ? r[0] : null
}