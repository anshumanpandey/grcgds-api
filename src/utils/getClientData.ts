import { DB } from "../utils/DB"

type ClientData = {
    clientId: string,
    clientname: string,
    clientAccountCode: string,
    paypalClientId: string,
    paypalSecretKey: string,
    cancellation_period: string,
    electronic_agreement: string,
    agreement_format: string,
    user_type: string,
}

export const getClientData = async ({ id, brokerId, clientAccountCode }: { id?: string | number, brokerId?: string | number, clientAccountCode?: string | number }): Promise<ClientData> => {
    const query = DB?.select({
        clientId: "clients.id",
        clientname: "clients.clientname",
        clientAccountCode: "data_suppliers_user.account_code",
        paypalClientId: "paypalClientId",
        paypalSecretKey: "paypalSecretKey",
        cancellation_period: "cancellation_period",
        electronic_agreement: "electronic_agreement",
        agreement_format: "agreement_format",
        user_type: "user_type",
    })
        .from("clients")
        .leftJoin('data_suppliers_user', 'data_suppliers_user.clientId', 'clients.id')
        .joinRaw('LEFT JOIN broker_account_type on data_suppliers_user.account_type_code and broker_account_type.name = "Prepaid Standard" ')
    if (id) query?.where("clients.id", id)
    if (brokerId) query?.where("data_suppliers_user.brokerId", brokerId)
    if (clientAccountCode) query?.where("data_suppliers_user.account_code", clientAccountCode)

    const r = await query;

    return r && r.length != 0 ? r[0] : null
}