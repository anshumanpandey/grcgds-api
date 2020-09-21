import { DB } from '../utils/DB';
import { validateFor } from '../utils/JsonValidator';
import axios from "axios"
import { ApiError } from '../utils/ApiError';

const schema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/example.json",
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


export const searchCars = async (body: any) => {
    const validator = validateFor(schema)
    validator(body)
    const [PickupDate, PickupTime] = body.VehAvailRQCore.VehRentalCore.PickUpDateTime.split("T")
    const [DropoffDate, DropoffTime] = body.VehAvailRQCore.VehRentalCore.ReturnDateTime.split("T")
    const pickLocation = body.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode
    const dropLocation = body.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode
    const axiosConfig = {
        url: 'https://www.grcgds.com/mobiletest/index.php',
        params: {
            module_name: "SEARCH_VEHICLE",

            pickup_date: PickupDate,
            pickup_time: PickupTime.slice(0, 5),

            dropoff_date: DropoffDate,
            dropoff_time: DropoffTime.slice(0, 5),

            pickup_location: pickLocation,
            dropoff_location: dropLocation || pickLocation,
        },
        headers: {
            Auth: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTE5MiwiZW1haWxhZGRyZXNzIjoidGVzdDI1QHRlc3QuY29tIiwibW9iaWxlbnVtYmVyIjoiNDE2OTk0MzQ2NCIsIm1vYmlsZWNvZGUiOiIrNTgiLCJmaXJzdG5hbWUiOiIiLCJsYXN0bmFtZSI6IiIsImFkZDEiOiIiLCJhZGQyIjoiIiwiY2l0eSI6IiIsInZlbWFpbCI6MCwidnBob25lIjo0ODY4LCJjb3VudHJ5IjoiVVMiLCJwb3N0Y29kZSI6IiIsInBhc3NkYXkiOiIiLCJwYXNzbW9udGgiOiIiLCJwYXNzeWVhciI6IiIsInBhc3NpbWFnZSI6IiIsInBhc3Njb3VudHJ5IjoiIiwicGFzc3BvcnQiOiIiLCJkcmxpYyI6IiIsImRyZGF5IjoiIiwiZHJtb250aCI6IiIsImRyeWVhciI6IiIsImRyaW1hZ2UiOiIiLCJkcmNvdW50cnkiOiIiLCJzZWxmaXVybCI6IiIsImNvbXBhbnkiOiJOT05FIiwidmF0IjoiTk9ORSIsInR3b2F1dGgiOjAsInZkciI6MCwidnBhc3MiOjAsInZzZWxmIjowLCJzb2NpYWxtZWRpYSI6MH0.zhecWWnP9_jH1bRhoMV7Pn8Vw1Xwfp_5BGFk_OcVAtA"
        }
    }
    
    try {
        const { data } = await axios(axiosConfig)

        return [
            data,
            200,
            "OTA_VehAvailRateRS",
            { "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05 OTA_VehAvailRateRS.xsd" }
        ]
    } catch (error) {
        if (error.response) {
            throw new ApiError(error.response.data.error)
        } else {
            throw error
        }
    }
}