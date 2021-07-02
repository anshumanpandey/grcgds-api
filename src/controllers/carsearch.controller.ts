import { validateFor } from '../utils/JsonValidator';
import { ApiError } from '../utils/ApiError';
import { wrapCarsResponseIntoXml } from '../carSearchUtils/MergeResults';
import { increaseCounterFor, sortClientsBySearch } from '../services/searchHistory.service';
import { SearchHistoryEnum } from '../utils/SearchHistoryEnum';
import { GetSerchForClients } from '../utils/GetSerchForClients';
import { getBrokersOwners, getDataSuppliers, getDataUsersForUserId, getGrcgdsClient, getHannkUserByEmail, SUPORTED_URL } from '../services/requestor.service';
import { FilterBrandsForClient } from '../utils/FilterBrandsForClient';
import { GetSearchServices } from '../utils/GetSearchServices';
import RightCarsSearchUtils, { RC_URL } from '../carSearchUtils/RightCarsSearchUtils';
import RentitCarsSearchUtil, { RENTI_URL } from '../carSearchUtils/RentitCarsSearchUtil';
import SurpriceCarsSearchUtil from '../carSearchUtils/SurpriceCarsSearchUtil';
import UnitedCarsSearchUtil from '../carSearchUtils/UnitedCarsSearchUtil';
import LocalcarsSearchUtils from '../carSearchUtils/LocalcarsSearchUtils';
import ZezgoCarsSearchUtils from '../carSearchUtils/ZezgoCarsSearchUtils';
import RetajSearchUtils from '../carSearchUtils/RetajSearchUtils';
import AceRentSearchUtils from '../carSearchUtils/AceRentSearchUtils';
import JimpsoftSearchUtil from '../carSearchUtils/JimpsoftSearchUtil';
import { LogCarSearchToDb } from '../utils/LogCarSearch';
import MexrentacarSearchUtil from '../carSearchUtils/MexrentacarSearchUtil';
import EasyRentSearchUtils from '../carSearchUtils/EasyRentSearchUtils';
import EasitentSearchUtil from '../carSearchUtils/EasitentSearchUtil';
import WheelsForCarsSearchUtil from '../carSearchUtils/WheelsForCarsSearchUtil';
import { getClientData } from '../utils/getClientData';
import YesawaySearchUtils from '../carSearchUtils/YesawaySearchUtils';
import RoutesRezWorldSearchUtil from '../carSearchUtils/RoutesRezWorldSearchUtil';
import NucarSearchUtil from '../carSearchUtils/NucarSearchUtil';
import { SearchUtilsOptions } from '../types/SearchUtilsOptions';
const allSettled = require('promise.allsettled');

const schema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "type": "object",
    "title": "The root schema",
    "description": "The root schema comprises the entire JSON document.",
    "default": {},
    "examples": [
        {
            "VehAvailRQCore": {
                "Status": "Available",
                "VehRentalCore": {
                    "PickUpDateTime": "2020-08-05T12:00:00",
                    "ReturnDateTime": "2020-08-06T10:00:00",
                    "PickUpLocation": {
                        "LocationCode": "MIAA01"
                    },
                    "ReturnLocation": {
                        "LocationCode": "MIAA01"
                    }
                }
            },
            "VehAvailRQInfo": {
                "Customer": {
                    "Primary": {
                        "DriverType": {
                            "Age": ""
                        },
                        "CitizenCountryName": {
                            "Code": ""
                        }
                    }
                }
            }
        }
    ],
    "required": [
        "VehAvailRQCore",
        "VehAvailRQInfo"
    ],
    "properties": {
        "VehAvailRQCore": {
            "$id": "#/properties/VehAvailRQCore",
            "type": "object",
            "title": "The VehAvailRQCore schema",
            "description": "An explanation about the purpose of this instance.",
            "default": {},
            "examples": [
                {
                    "Status": "Available",
                    "VehRentalCore": {
                        "PickUpDateTime": "2020-08-05T12:00:00",
                        "ReturnDateTime": "2020-08-06T10:00:00",
                        "PickUpLocation": {
                            "LocationCode": "MIAA01"
                        },
                        "ReturnLocation": {
                            "LocationCode": "MIAA01"
                        }
                    }
                }
            ],
            "required": [
                "Status",
                "VehRentalCore"
            ],
            "properties": {
                "Status": {
                    "$id": "#/properties/VehAvailRQCore/properties/Status",
                    "type": "string",
                    "title": "The Status schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                        "Available"
                    ]
                },
                "VehRentalCore": {
                    "$id": "#/properties/VehAvailRQCore/properties/VehRentalCore",
                    "type": "object",
                    "title": "The VehRentalCore schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": {},
                    "examples": [
                        {
                            "PickUpDateTime": "2020-08-05T12:00:00",
                            "ReturnDateTime": "2020-08-06T10:00:00",
                            "PickUpLocation": {
                                "LocationCode": "MIAA01"
                            },
                            "ReturnLocation": {
                                "LocationCode": "MIAA01"
                            }
                        }
                    ],
                    "required": [
                        "PickUpDateTime",
                        "ReturnDateTime",
                        "PickUpLocation",
                        "ReturnLocation"
                    ],
                    "properties": {
                        "PickUpDateTime": {
                            "$id": "#/properties/VehAvailRQCore/properties/VehRentalCore/properties/PickUpDateTime",
                            "type": "string",
                            "title": "The PickUpDateTime schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "2020-08-05T12:00:00"
                            ]
                        },
                        "ReturnDateTime": {
                            "$id": "#/properties/VehAvailRQCore/properties/VehRentalCore/properties/ReturnDateTime",
                            "type": "string",
                            "title": "The ReturnDateTime schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "2020-08-06T10:00:00"
                            ]
                        },
                        "PickUpLocation": {
                            "$id": "#/properties/VehAvailRQCore/properties/VehRentalCore/properties/PickUpLocation",
                            "type": "object",
                            "title": "The PickUpLocation schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": {},
                            "examples": [
                                {
                                    "LocationCode": "MIAA01"
                                }
                            ],
                            "required": [
                                "LocationCode"
                            ],
                            "properties": {
                                "LocationCode": {
                                    "$id": "#/properties/VehAvailRQCore/properties/VehRentalCore/properties/PickUpLocation/properties/LocationCode",
                                    "type": "string",
                                    "title": "The LocationCode schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "MIAA01"
                                    ]
                                }
                            },
                            "additionalProperties": true
                        },
                        "ReturnLocation": {
                            "$id": "#/properties/VehAvailRQCore/properties/VehRentalCore/properties/ReturnLocation",
                            "type": "object",
                            "title": "The ReturnLocation schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": {},
                            "examples": [
                                {
                                    "LocationCode": "MIAA01"
                                }
                            ],
                            "required": [
                                "LocationCode"
                            ],
                            "properties": {
                                "LocationCode": {
                                    "$id": "#/properties/VehAvailRQCore/properties/VehRentalCore/properties/ReturnLocation/properties/LocationCode",
                                    "type": "string",
                                    "title": "The LocationCode schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "MIAA01"
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
        },
        "VehAvailRQInfo": {
            "default": {},
            "description": "An explanation about the purpose of this instance.",
            "examples": [
                {
                    "Customer": {
                        "Primary": {
                            "DriverType": {
                                "Age": ""
                            },
                            "CitizenCountryName": {
                                "Code": ""
                            }
                        }
                    }
                }
            ],
            "title": "The VehAvailRQInfo schema",
            "properties": {
                "Customer": {
                    "$id": "#/properties/VehAvailRQInfo/properties/Customer",
                    "type": "object",
                    "title": "The Customer schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": {},
                    "examples": [
                        {
                            "Primary": {
                                "DriverType": {
                                    "Age": ""
                                },
                                "CitizenCountryName": {
                                    "Code": ""
                                }
                            }
                        }
                    ],
                    "required": [
                        "Primary"
                    ],
                    "properties": {
                        "Primary": {
                            "$id": "#/properties/VehAvailRQInfo/properties/Customer/properties/Primary",
                            "type": "object",
                            "title": "The Primary schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": {},
                            "examples": [
                                {
                                    "DriverType": {
                                        "Age": ""
                                    },
                                    "CitizenCountryName": {
                                        "Code": ""
                                    }
                                }
                            ],
                            "required": [
                                "DriverType",
                                "CitizenCountryName"
                            ],
                            "properties": {
                                "DriverType": {
                                    "$id": "#/properties/VehAvailRQInfo/properties/Customer/properties/Primary/properties/DriverType",
                                    "type": "object",
                                    "title": "The DriverType schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": {},
                                    "examples": [
                                        {
                                            "Age": ""
                                        }
                                    ],
                                    "required": [
                                        "Age"
                                    ],
                                    "properties": {
                                        "Age": {
                                            "$id": "#/properties/VehAvailRQInfo/properties/Customer/properties/Primary/properties/DriverType/properties/Age",
                                            "type": "string",
                                            "title": "The Age schema",
                                            "description": "An explanation about the purpose of this instance.",
                                            "default": "",
                                            "examples": [
                                                ""
                                            ]
                                        }
                                    },
                                    "additionalProperties": true
                                },
                                "CitizenCountryName": {
                                    "$id": "#/properties/VehAvailRQInfo/properties/Customer/properties/Primary/properties/CitizenCountryName",
                                    "type": "object",
                                    "title": "The CitizenCountryName schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": {},
                                    "examples": [
                                        {
                                            "Code": ""
                                        }
                                    ],
                                    "required": [
                                        "Code"
                                    ],
                                    "properties": {
                                        "Code": {
                                            "$id": "#/properties/VehAvailRQInfo/properties/Customer/properties/Primary/properties/CitizenCountryName/properties/Code",
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
    },
    "additionalProperties": true
}

const SUPORTED_CLIENT_SERVICES = new Map();
SUPORTED_CLIENT_SERVICES.set(1, (body: any, extras: SearchUtilsOptions) => RightCarsSearchUtils(body, extras))
SUPORTED_CLIENT_SERVICES.set(11, (body: any, extras: SearchUtilsOptions) => RentitCarsSearchUtil(body, extras))
SUPORTED_CLIENT_SERVICES.set(37, (body: any, extras: SearchUtilsOptions) => SurpriceCarsSearchUtil(body, extras))
SUPORTED_CLIENT_SERVICES.set(58, (body: any, extras: SearchUtilsOptions) => UnitedCarsSearchUtil(body, extras))
SUPORTED_CLIENT_SERVICES.set(57, (body: any, extras: SearchUtilsOptions) => EasitentSearchUtil(body, extras))
SUPORTED_CLIENT_SERVICES.set(32, (body: any, extras: SearchUtilsOptions) => LocalcarsSearchUtils(body, extras))
SUPORTED_CLIENT_SERVICES.set(10, (body: any, extras: SearchUtilsOptions) => ZezgoCarsSearchUtils(body, extras))
SUPORTED_CLIENT_SERVICES.set(36, (body: any, extras: SearchUtilsOptions) => RetajSearchUtils(body, extras))
SUPORTED_CLIENT_SERVICES.set(16, (body: any, extras: SearchUtilsOptions) => JimpsoftSearchUtil(body, extras))
SUPORTED_CLIENT_SERVICES.set(62, (body: any, extras: SearchUtilsOptions) => MexrentacarSearchUtil(body, extras))
SUPORTED_CLIENT_SERVICES.set(65, (body: any, extras: SearchUtilsOptions) => EasyRentSearchUtils(body, extras))
SUPORTED_CLIENT_SERVICES.set(56, (body: any, extras: SearchUtilsOptions) => WheelsForCarsSearchUtil(body, extras))
SUPORTED_CLIENT_SERVICES.set(67, (body: any, extras: SearchUtilsOptions) => YesawaySearchUtils(body, extras))
SUPORTED_CLIENT_SERVICES.set(73, (body: any, extras: SearchUtilsOptions) => YesawaySearchUtils(body, extras))
SUPORTED_CLIENT_SERVICES.set(74, (body: any, extras: SearchUtilsOptions) => YesawaySearchUtils(body, extras))
SUPORTED_CLIENT_SERVICES.set(75, (body: any, extras: SearchUtilsOptions) => AceRentSearchUtils(body, extras))
SUPORTED_CLIENT_SERVICES.set(72, (body: any, extras: SearchUtilsOptions) => RoutesRezWorldSearchUtil(body, extras))
SUPORTED_CLIENT_SERVICES.set(76, (body: any, extras: SearchUtilsOptions) => NucarSearchUtil(body, extras))



export const searchCars = async (body: any, req: any) => {
    const validator = validateFor(schema)
    validator(body)

    const clientId = body.POS.Source.RequestorID.ID.replace('GRC-', "").slice(0, -4)
    const rateId = body.POS.Source.RequestorID?.RATE_ID?.replace('GRC-', "")
    body.requestorClientData = await getClientData({ id: clientId })
    const { CONTEXT, POS } = body

    try {
        const [pickDate, pickTime] = body.VehAvailRQCore.VehRentalCore.PickUpDateTime.split('T')
        const [returnDate, returnTime] = body.VehAvailRQCore.VehRentalCore.ReturnDateTime.split('T')

        const [grcgdsClient, searchServices, suppliers, /*dataUsers*/] = await Promise.all([
            getGrcgdsClient({ ClientId: clientId }),
            GetSearchServices(clientId),
            getDataSuppliers({ RequestorID: clientId, rateId }),
            //getDataUsersForUserId({ id: clientId }),
        ])
        
        const searchRecord = await LogCarSearchToDb({
            pickupDate: pickDate,
            pickupTime: pickTime,
            dropoffDate: returnDate,
            dropoffTime: returnTime,
            pickLocation: body.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode,
            dropoffLocation: body.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode,
            hannkClientData: { id: clientId }
        })

        const servicesToCall = []

        if (grcgdsClient) {
            if (grcgdsClient.integrationEndpointUrl && SUPORTED_URL.has(grcgdsClient.integrationEndpointUrl)) {
                servicesToCall.push(SUPORTED_URL.get(grcgdsClient.integrationEndpointUrl)(body))
            } else {
                const servicesToAdd = Array.from(SUPORTED_CLIENT_SERVICES.entries())
                .filter(entry => suppliers.find(suppliers => suppliers.clientId == entry[0]))
                servicesToCall
                    .push(...servicesToAdd.map(([id ,service]) => {
                        const supplierData = suppliers.find(suppliers => suppliers.clientId == id)
                        return service(body, { searchRecord, supplierData: supplierData })
                    }))
            }
        }

        const sorted = await sortClientsBySearch({ clients: searchServices, searchType: SearchHistoryEnum.Availability })
        servicesToCall.push(...GetSerchForClients(sorted.map(s => s.clientId)).map(f => f(body)))

        const [ fromGrcgds = [], ...r ] = await allSettled(servicesToCall)
        .then((promises: any) => {
            return promises.filter((p: any) => p.status == "fulfilled")
        })
        .then((promises: any) => promises.map((p: any) => p.value))

        if (sorted[0]?.id) await increaseCounterFor({ clientId: sorted[0].id, searchType: SearchHistoryEnum.Availability })

        let filteredResponse = fromGrcgds
        filteredResponse = fromGrcgds
            .filter((r: any) => {
                if (!CONTEXT || !CONTEXT?.Filter || !CONTEXT?.Filter?.content || CONTEXT?.Filter?.content == "") return true
                const id = r.VehAvailCore[0].$.Supplier_ID
                const idsToSearch = CONTEXT?.Filter?.content?.split(",")
                return idsToSearch && idsToSearch.length != 0 ? idsToSearch.includes(id) : true
            })
        const filterBrands = await FilterBrandsForClient(body.POS.Source.RequestorID.ID)
        filteredResponse = filteredResponse.concat(...r)
            .filter(filterBrands)
            .sort((a: any, b: any) => {
                return a.VehAvailCore[0].TotalCharge[0].$.RateTotalAmount - b.VehAvailCore[0].TotalCharge[0].$.RateTotalAmount
            })

        const response = wrapCarsResponseIntoXml(filteredResponse, body)

        return [
            response,
            200,
            "OTA_VehAvailRateRS",
            { "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05 OTA_VehAvailRateRS.xsd" }
        ]
    } catch (error) {
        if (error.response) {
            console.log(error.response.data)
            throw new ApiError(error.response.data.error)
        } else {
            throw error
        }
    }
}