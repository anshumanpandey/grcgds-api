import { DB } from "../utils/DB"

export const getClientData = async ({ id }: { id: string | number }) => {
    const r = await DB?.select({
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
        .where("clients.id", id)
    return r && r.length != 0 ? r[0] : null
}