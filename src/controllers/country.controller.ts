import { getCountriesByClientId } from "../services/country.service";
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
        whereIn?.push(content.replace('GRC-', "").slice(0, -4))
    }

    let r = new Map();

    const requestorDataSuppliers = await DB?.select(["data_suppliers_user.clientId", "clients.clientname"])
        .from("data_suppliers_user")
        .innerJoin('clients', 'clients.id', 'data_suppliers_user.clientId')
        .where({ brokerId: POS.Source.RequestorID.ID.replace('GRC-', "").slice(0, -4) })
        .where("active", 1)

    if (!requestorDataSuppliers || requestorDataSuppliers?.length == 0) {
        throw new ApiError("No suppliers have been setup.")
    }

    for (const supplier of requestorDataSuppliers) {
        const records = await getCountriesByClientId({ ClientId: supplier.clientId, columns: { Country: `countries.${columnName}` } })

        if (records) {
            for (const record of records) {
                if (r.has(record.Code)) {
                    const oldRecord = r.get(record.Code)
                    oldRecord.Suppliers.Supplier.push(supplier.clientname)
                    r.set(record.Code, oldRecord)
                } else {
                    r.set(record.Code, { ...record, Suppliers: { Supplier: [supplier.clientname] } })
                }
            }
        }
    }

    const ownersOfCurrentBroker = await DB?.select(["clients.id", "clients.clientname"])
        .from("ClientBrokerOwner")
        .innerJoin('BackOfficeUsers', 'BackOfficeUsers.id', 'ClientBrokerOwner.BackOfficeUserId')
        .innerJoin('clients', 'clients.BackOfficeUserId', 'BackOfficeUsers.id')
        .where({ ClientId: POS.Source.RequestorID.ID.replace('GRC-', "").slice(0, -4) })
        .orderBy('ClientBrokerOwner.createdAt', 'asc')

    if (ownersOfCurrentBroker) {
        for (const supplier of ownersOfCurrentBroker) {
            const records = await getCountriesByClientId({ ClientId: supplier.id, columns: { Country: `countries.${columnName}` } })
            if (records && records.length != 0) {
                for (const record of records) {
                    if (r.has(record.Code)) {
                        const oldRecord = r.get(record.Code)
                        oldRecord.Suppliers.Supplier.push(supplier.clientname)
                        r.set(record.Code, oldRecord)
                    } else {
                        r.set(record.Code, { ...record, Suppliers: { Supplier: [supplier.clientname] } })
                    }
                }
                break;
            }
        }
    }
    

    return [
        { CountryList: { Country: Array.from(r.values()) } },
        200,
        "OTA_CountryListRQ",
        { "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05 CountryListRQ.xsd", }
    ];
}