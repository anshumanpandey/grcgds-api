import { SupplierData } from "../services/requestor.service";
import DB, { getDbFor } from "./DB";
import { getBrokerData } from "./getBrokerData";
import { CompanyLocation } from "./getCodeForGrcCode";

type Params = {
    requestBody: string,
    carsSearchId: string,
    pickupCodeObj: CompanyLocation,
    supplierData: SupplierData
}
export const saveServiceRequest = async (params: Params) => {
    const brokerData = await getBrokerData({
        brokerAccountCode: params.supplierData.account_code,
        locationCode: params.pickupCodeObj.GRCGDSlocatincode,
    })

    const toInsert = {
        internalCode: brokerData.internalCode,
        body: params.requestBody,
        carSearchId: params.carsSearchId,
        "createdAt": new Date(),
        "updatedAt ": new Date(),
    }
    const [recordId] = await getDbFor("grcgds_gateway_db")?.insert(toInsert).into('serviceRequest');
    return { id: recordId, brokerData }
}