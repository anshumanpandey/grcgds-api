import EasitentSearchUtil, { EASIRENT_URL } from "../carSearchUtils/EasitentSearchUtil"
import EasyRentSearchUtils from "../carSearchUtils/EasyRentSearchUtils"
import GrcgdsSearchUtils, { GRCGDS_URL } from "../carSearchUtils/GrcgdsSearchUtils"
import JimpsoftSearchUtil, { JIMPSOFT_URL } from "../carSearchUtils/JimpsoftSearchUtil"
import LocalcarsSearchUtils, { LOCALCARS_URL } from "../carSearchUtils/LocalcarsSearchUtils"
import MexrentacarSearchUtil, { MEXRENT_URL } from "../carSearchUtils/MexrentacarSearchUtil"
import RentitCarsSearchUtil, { RENTI_URL } from "../carSearchUtils/RentitCarsSearchUtil"
import RetajSearchUtils, { RETAJ_URL } from "../carSearchUtils/RetajSearchUtils"
import RightCarsSearchUtils, { RC_URL } from "../carSearchUtils/RightCarsSearchUtils"
import UnitedCarsSearchUtil, { UNITEDCAR_URL } from "../carSearchUtils/UnitedCarsSearchUtil"
import ZezgoCarsSearchUtils, { ZEZGO_URL } from "../carSearchUtils/ZezgoCarsSearchUtils"
import { DB, getDbFor } from "../utils/DB"

export const getGrcgdsClient = async ({ ClientId }: { ClientId: string }) => {
    const r = await DB?.select()
        .from("clients")
        .where({ id: ClientId })
    return r && r.length != 0 ? r[0] : null
}

export const getDataSuppliers = async ({ RequestorID }: { RequestorID: string }) => {
    const query = DB?.select(["data_suppliers_user.clientId", "clients.clientname", "data_suppliers_user.account_code"])
        .from("data_suppliers_user")
        .innerJoin('clients', 'clients.id', 'data_suppliers_user.clientId')
        .where({ brokerId: RequestorID })
        .where("active", 1)
    const r = await query
    return r || []
}

export const getDataUsersForUserId = async (id: { id: string }) => {
    const r = await DB?.select()
        .from("client_broker_locations_accountype")
        .where("client_broker_locations_accountype.clientId", id)
        .whereRaw("client_broker_locations_accountype.account_code <> '' ")
        .groupBy("client_broker_locations_accountype.internal_code");
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

export const getHannkUserByEmail = async ({ email }: { email: string }) => {
    const r = await getDbFor("grcgds_hannk")
        .from("users")
        .where({ username: email })

    return r.length != 0 ? r[0] : null
}

export const SUPORTED_URL = new Map();
SUPORTED_URL.set(GRCGDS_URL, (body: any) => {
    if (body.POS.Source.RequestorID.ID.slice(4, 6) == "65") {
        return EasyRentSearchUtils(body)
    } else if (body.POS.Source.RequestorID.ID.slice(4, 6) == "32") {
        return LocalcarsSearchUtils(body)
    } else if (body.POS.Source.RequestorID.ID.slice(4, 6) == "36") {
        return LocalcarsSearchUtils(body)
    } else if (body.POS.Source.RequestorID.ID.slice(4, 6) == "56") {
        return LocalcarsSearchUtils(body)
    }
    return GrcgdsSearchUtils(body)
})
SUPORTED_URL.set(RC_URL, (body: any) => RightCarsSearchUtils(body))
SUPORTED_URL.set(EASIRENT_URL, (body: any) => EasitentSearchUtil(body))
SUPORTED_URL.set(RENTI_URL, (body: any) => RentitCarsSearchUtil(body))
SUPORTED_URL.set(UNITEDCAR_URL, (body: any) => UnitedCarsSearchUtil(body))
SUPORTED_URL.set(LOCALCARS_URL, (body: any) => LocalcarsSearchUtils(body))
SUPORTED_URL.set(RETAJ_URL, (body: any) => RetajSearchUtils(body))
SUPORTED_URL.set(ZEZGO_URL, (body: any) => ZezgoCarsSearchUtils(body))
SUPORTED_URL.set(JIMPSOFT_URL, (body: any) => JimpsoftSearchUtil(body))
SUPORTED_URL.set(MEXRENT_URL, (body: any) => MexrentacarSearchUtil(body))

