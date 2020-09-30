import { DB } from '../utils/DB';
import { validateFor } from '../utils/JsonValidator';
import axios from "axios"
import { ApiError } from '../utils/ApiError';
import { xmlToJson } from '../utils/XmlConfig';

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


export const searchCars = async (body: any) => {
    const validator = validateFor(schema)
    validator(body)
    const PickUpDateTime = body.VehAvailRQCore.VehRentalCore.PickUpDateTime
    const ReturnDateTime = body.VehAvailRQCore.VehRentalCore.ReturnDateTime
    const pickLocation = body.VehAvailRQCore.VehRentalCore.PickUpLocation.LocationCode
    const dropLocation = body.VehAvailRQCore.VehRentalCore.ReturnLocation.LocationCode
    const Age = body.VehAvailRQInfo.Customer.Primary.DriverType.Age
    const Code = body.VehAvailRQInfo.Customer.Primary.CitizenCountryName.Code

    const xml = `<?xml version="1.0"?>
            <OTA_VehAvailRateRQDeep xmlns="http://www.opentravel.org/OTA/2003/05" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05OTA_VehAvailRateRQ.xsd" TimeStamp="2010-11-12T11:00:00" Target="Test" Version="1.002">
            <POS>
                <Source>
                    <RequestorID Type="5" ID="1000022"/>
                </Source>
            </POS>
            <VehAvailRQCore Status="Available">
                <Currency Code="EUR"/>
                <VehRentalCore PickUpDateTime="${PickUpDateTime}" ReturnDateTime="${ReturnDateTime}">
                
                <PickUpLocation LocationCode="${pickLocation}"/>

                <ReturnLocation LocationCode="${dropLocation}"/>
                </VehRentalCore>
            </VehAvailRQCore>
            <VehAvailRQInfo>
                <Customer>
                <Primary>
                    <CitizenCountryName Code="${Code || "UK"}"/>
                    <DriverType Age="${Age || 35}"/>
                </Primary>
                </Customer>
                <TPA_Extensions>
                <ConsumerIP>192.168.102.14</ConsumerIP>
                </TPA_Extensions>
            </VehAvailRQInfo>
            </OTA_VehAvailRateRQDeep>
    `;

    try {
        const { data } = await axios.post('https://ota.right-cars.com', xml, {
            headers: {
                'Content-Type': 'text/plain; charset=UTF8',
            }
        })

        const json = await xmlToJson(data);

        return [
            json.OTA_VehAvailRateRS,
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