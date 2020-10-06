import { getLocationsByClient, mergeSupplierLocations } from '../services/locations.service';
import { getBrokersOwners, getDataSuppliers } from '../services/requestor.service';
import { increaseCounterFor, sortClientsBySearch } from '../services/searchHistory.service';
import { ApiError } from '../utils/ApiError';
import { DB } from '../utils/DB';
import { validateFor } from '../utils/JsonValidator';
import { SearchHistoryEnum } from '../utils/SearchHistoryEnum';

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
        whereFilters[`companies_locations.country`] = `${Address.CountryName.Code}`
    }

    if (Address && Address.CityName) {
        whereFilters[`companies_locations.GRCGDSlocatincode`] = Address.CityName.Code
    }

    const suppliersId = [ ]
    if (CONTEXT && CONTEXT?.Filter?.content) {
        suppliersId.push(CONTEXT.Filter.content.replace("GRC-", "").slice(0, -4));
    }

    let r: any[] = []
    const [requestorDataSuppliers, ownersOfCurrentBroker] = await Promise.all([
        getDataSuppliers({ RequestorID: POS.Source.RequestorID.ID.replace('GRC-',"").slice(0, -4) }),
        getBrokersOwners({ RequestorID: POS.Source.RequestorID.ID.replace('GRC-', "").slice(0, -4) })
    ])

    if (requestorDataSuppliers.length == 0 || ownersOfCurrentBroker.length == 0) {
        throw new ApiError("No suppliers have been setup.")
    }

    const firstResult = await getLocationsByClient({ whereFilters, clientId: requestorDataSuppliers.map(r => r.clientId)})
    let secondResult = []

    const orderedSuppliers = await sortClientsBySearch({ clients: ownersOfCurrentBroker, searchType: SearchHistoryEnum.Locations })
    for (const record of orderedSuppliers) {
        const results = await getLocationsByClient({ whereFilters ,clientId: [record.id] })
        if (results.length == 0) continue;   
        secondResult = results
        await increaseCounterFor({ clientId: record.id, searchType: SearchHistoryEnum.Locations })
        break;     
    }

    r = mergeSupplierLocations([ firstResult, secondResult])

    return [
        { VehMatchedLocs: { VehMatchedLoc: { LocationDetail: r || [] } } },
        200,
        "OTA_CountryListRS",
        { "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05 OTA_CountryListRS.xsd" }
    ]
}