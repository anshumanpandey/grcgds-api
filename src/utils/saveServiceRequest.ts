import { SupplierData } from "../services/requestor.service";
import DB, { getDbFor } from "./DB";
import { BrokerData, getBrokerData } from "./getBrokerData";
import { CompanyLocation } from "./getCodeForGrcCode";

type Params = {
    requestBody: string,
    carsSearchId: string,
    pickupCodeObj: CompanyLocation,
    supplierData: SupplierData
}

const saveRecord = async (params: Params, brokerData: BrokerData) => {
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
export const saveServiceRequest = async (params: Params) => {
    const brokerData = await getBrokerData({
        brokerAccountCode: params.supplierData.account_code,
        locationCode: params.pickupCodeObj.GRCGDSlocatincode,
    })
    return saveRecord(params, brokerData)
}

export const lateSaveServiceRequest = async (params: Params) => {
    const brokerData = await getBrokerData({
        brokerAccountCode: params.supplierData.account_code,
        locationCode: params.pickupCodeObj.GRCGDSlocatincode,
    })
    return {
        brokerData,
        saveRequest: ({ requestBody }: { requestBody: Params["requestBody"]}) => saveRecord({...params, requestBody }, brokerData)
    }
}