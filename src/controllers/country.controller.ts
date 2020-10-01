import { ApiError } from "../utils/ApiError";
import { DB } from "../utils/DB";
import { validateFor } from '../utils/JsonValidator';

const schema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/country.json",
    "type": "object",
    "title": "The root schema",
    "description": "The root schema comprises the entire JSON document.",
    "default": {},
    "examples": [
        {
            "CONTEXT": {
                "Filter": {
                    "Language": "EN"
                }
            }
        }
    ],
    "required": [
        "CONTEXT"
    ],
    "properties": {
        "CONTEXT": {
            "default": {},
            "description": "An explanation about the purpose of this instance.",
            "examples": [
                {
                    "Filter": {
                        "Language": "EN"
                    }
                }
            ],
            "title": "The CONTEXT schema",
            "properties": {
                "Filter": {
                    "default": {},
                    "description": "An explanation about the purpose of this instance.",
                    "examples": [
                        {
                            "Language": "EN"
                        }
                    ],
                    "title": "The Filter schema",
                    "properties": {
                        "Language": {
                            "$id": "#/properties/CONTEXT/properties/Filter/properties/Language",
                            "type": "string",
                            "title": "The Language schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "EN"
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

export const getCountries = async (body: any) => {
    const validator = validateFor(schema)
    validator(body)
    const { CONTEXT, POS } = body;
    const { Filter } = CONTEXT;
    const Language = Filter?.Language || null
    const content = Filter?.content || null

    let columnName = "country";
    if (Language && Language == "ES") columnName = "countryes"
    if (Language && Language == "FR") columnName = "countryfr"
    if (Language && Language == "IT") columnName = "countryit"
    if (Language && Language == "DE") columnName = "countryde"
    
    let whereIn = []
    if (content) {
        whereIn?.push(content.replace('GRC-',"").slice(0, -4))
    }

    let r = new Map();

    const requestorDataSuppliers = await DB?.select(["data_suppliers_user.clientId", "clients.clientname"])
        .from("data_suppliers_user")
        .innerJoin('clients','clients.id','data_suppliers_user.clientId')
        .where({ brokerId: POS.Source.RequestorID.ID.replace('GRC-',"").slice(0, -4) })
        .where("active", 1)

    if (requestorDataSuppliers && requestorDataSuppliers.length != 0) {
        for (const supplier of requestorDataSuppliers) {
            const records = await DB?.select({ Code: "countries.code", Country: `countries.${columnName}` })
            .from("countries")
            .leftJoin('companies_locations','companies_locations.country','countries.code')
            .leftJoin('clients','companies_locations.clientId','clients.id')
            .where("clients.id", supplier.clientId)
            .groupBy('countries.code');
            
            if (records) {
                for (const record of records) {
                    if (r.has(record.Code)) {
                        const oldRecord = r.get(record.Code)
                        oldRecord.Suppliers.Supplier.push(supplier.clientname)
                        r.set(record.Code, oldRecord)
                    } else {
                        r.set(record.Code, { ...record, Suppliers: { Supplier: [supplier.clientname]} })
                    }
                }          
            }
        }
    } else {
        throw new ApiError("No suppliers have been setup.")
    }

    return [
        { CountryList: { Country: Array.from(r.values()) }},
        200,
        "OTA_CountryListRQ",
        { "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05 CountryListRQ.xsd", }
    ];
}