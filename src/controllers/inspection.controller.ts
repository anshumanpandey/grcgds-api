import * as inspectionService from "../services/inspection.service"


export const createInspection = async () => {
    
    const body = await inspectionService.createInspection()
    return [
        { VehInspection: body },
        200,
        "OTA_CountryListRS",
        { "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05 OTA_CountryListRS.xsd" }
    ]
}