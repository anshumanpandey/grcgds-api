import { DB, getDbFor } from "../utils/DB"

export const getDataSuppliers = async ({ RequestorID }: { RequestorID: string }) => {
    const r = await DB?.select(["data_suppliers_user.clientId", "clients.clientname", "data_suppliers_user.account_code"])
        .from("data_suppliers_user")
        .innerJoin('clients', 'clients.id', 'data_suppliers_user.clientId')
        .where({ brokerId: RequestorID })
        .where("active", 1)
    return r || []
}

export const getBrokersOwners = async ({ RequestorID }: { RequestorID: string }) => {
    const r = await DB?.select(["clients.id", "clients.clientname", "ClientBrokerOwner.id as ClientBrokerOwnerId"])
        .from("ClientBrokerOwner")
        .innerJoin('BackOfficeUsers', 'BackOfficeUsers.id', 'ClientBrokerOwner.BackOfficeUserId')
        .innerJoin('clients', 'clients.BackOfficeUserId', 'BackOfficeUsers.id')
        .where({ ClientId: RequestorID })
        .orderBy('ClientBrokerOwner.createdAt', 'asc')

    return r || []
}

export const getUsersByName = async (params: { firstname?: string, lastname?: string}) => {
    const query = await getDbFor("grcgds_hannk")
        .select()
        .from("users")
        .modify(function(queryBuilder) {
            if (params.firstname) {
                queryBuilder.where("firstname", "like", params.firstname)
            }

            if (params.lastname) {
                queryBuilder.where("lastname", "like", params.lastname)
            }
        })

    return query || []
}