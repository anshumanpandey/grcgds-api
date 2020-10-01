import { DB } from "../utils/DB"

export const getDataSuppliers = ({ RequestorID }: { RequestorID: string }) => {
    const r = DB?.select(["data_suppliers_user.clientId", "clients.clientname"])
        .from("data_suppliers_user")
        .innerJoin('clients', 'clients.id', 'data_suppliers_user.clientId')
        .where({ brokerId: RequestorID })
        .where("active", 1)
    return r || []
}

export const getBrokersOwners = ({ RequestorID }: { RequestorID: string }) => {
    const r = DB?.select(["clients.id", "clients.clientname", "ClientBrokerOwner.id as ClientBrokerOwnerId"])
        .from("ClientBrokerOwner")
        .innerJoin('BackOfficeUsers', 'BackOfficeUsers.id', 'ClientBrokerOwner.BackOfficeUserId')
        .innerJoin('clients', 'clients.BackOfficeUserId', 'BackOfficeUsers.id')
        .where({ ClientId: RequestorID })
        .orderBy('ClientBrokerOwner.createdAt', 'asc')

    return r || []
}