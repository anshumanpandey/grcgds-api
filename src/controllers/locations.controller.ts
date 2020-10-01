import { ApiError } from '../utils/ApiError';
import { DB } from '../utils/DB';
import { validateFor } from '../utils/JsonValidator';

const schema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/example.json",
    "type": "object",
    "title": "The root schema",
    "description": "The root schema comprises the entire JSON document.",
    "default": {},
    "examples": [
        {
            "VehLocSearchCriterion": {
                "Address": {
                    "CountryName": {
                        "Code": ""
                    }
                }
            }
        }
    ],
    "required": [
        "VehLocSearchCriterion"
    ],
    "properties": {
        "VehLocSearchCriterion": {
            "default": {},
            "description": "An explanation about the purpose of this instance.",
            "examples": [
                {
                    "Address": {
                        "CountryName": {
                            "Code": ""
                        }
                    }
                }
            ],
            "title": "The VehLocSearchCriterion schema",
            "properties": {
                "Address": {
                    "default": {},
                    "description": "An explanation about the purpose of this instance.",
                    "examples": [
                        {
                            "CountryName": {
                                "Code": ""
                            }
                        }
                    ],
                    "title": "The Address schema",
                    "properties": {
                        "CountryName": {
                            "default": {},
                            "description": "An explanation about the purpose of this instance.",
                            "examples": [
                                {
                                    "Code": ""
                                }
                            ],
                            "title": "The CountryName schema",
                            "properties": {
                                "Code": {
                                    "$id": "#/properties/VehLocSearchCriterion/properties/Address/properties/CountryName/properties/Code",
                                    "type": "string",
                                    "title": "The Code schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        ""
                                    ]
                                }
                            },
                            "additionalProperties": true
                        }
                    },
                    "additionalProperties": true
                }
            },
            "additionalProperties": true
        }
    },
    "additionalProperties": true
}


export const getLocations = async (body: any) => {
    const validator = validateFor(schema)
    validator(body)
    const { POS, VehLocSearchCriterion: { CONTEXT, Address } } = body;

    const whereFilters: any = {}
    if (Address && Address.CountryName) {
        whereFilters.country = Address.CountryName.Code
    }

    if (Address && Address.CityName) {
        whereFilters.GRCGDSlocatincode 	 = Address.CityName.Code
    }

    const suppliersId = [ ]
    if (CONTEXT && CONTEXT?.Filter?.content) {
        suppliersId.push(CONTEXT.Filter.content.replace("GRC-", "").slice(0, -4));
    }

    let r = undefined
    const requestorDataSuppliers = await DB?.select("clientId")
        .from("data_suppliers_user")
        .whereIn("clientId", suppliersId)
        .where("brokerId", POS.Source.RequestorID.ID.replace('GRC-',"").slice(0, -4))
        .where("active", 1)

    if (requestorDataSuppliers && requestorDataSuppliers.length != 0) {

        const columns = { Id: "id", InternalCode: "internal_code", Location: "location", Country: "country", GRCGDSlocatincode: "GRCGDSlocatincode", Lat: "Lat", Long: "Long" }
        r = await DB?.select(columns).where(whereFilters).whereIn("clientId", requestorDataSuppliers.map(r => r.clientId)).table("companies_locations");
    } else {
        throw new ApiError("No suppliers have been setup.")
    }

    return [
        { VehMatchedLocs: { VehMatchedLoc: { LocationDetail: r || [] } } },
        200,
        "OTA_CountryListRS",
        { "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05 OTA_CountryListRS.xsd" }
    ]
}