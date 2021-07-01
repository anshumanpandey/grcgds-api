import { DB } from "../utils/DB"

type ClientData = {
    internalCode: string,
}

export const getBrokerData = async ({ brokerAccountCode }: { brokerAccountCode?: string | number }): Promise<ClientData> => {
    const query = DB?.select({
        internalCode: 'internal_code'
    })
        .from("client_broker_locations_accountype")
        .groupBy('account_code')
    if (brokerAccountCode) query?.where("client_broker_locations_accountype.account_code", brokerAccountCode)

    const r = await query;

    return r && r.length != 0 ? r[0] : null
}