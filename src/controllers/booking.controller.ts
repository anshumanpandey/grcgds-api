import { DB } from '../utils/DB';
import { validateFor } from '../utils/JsonValidator';
import axios from "axios"
import { ApiError } from '../utils/ApiError';
import { xmlToJson } from '../utils/XmlConfig';
import RightCarsBooking, { cancelRightCarsBooking, getRightCarsBooking } from '../carsBookingUtils/RightCarsBooking';
import GrcgdsXmlBooking, { cancelGrcBooking } from '../carsBookingUtils/GrcgdsXmlBooking';
import { BOOKING_STATUS_ENUM, cancelBookingByResNumber, createBookingsXmlResponse, getBookings, getBookingsBy, GetBookingsParams } from '../services/bookings.service';
import { isGrcgdsLocations } from '../services/locations.service';
import DiscoverCarsBooking from '../carsBookingUtils/DiscoverCarsBooking';
import UnitedCarsBooking, { cancelUnitedCarBooking } from '../carsBookingUtils/UnitedCarsBooking';
import { logger } from '../utils/Logger';
import ZezgoBooking, { cancelZezgoBooking } from '../carsBookingUtils/ZezgoBooking';
import { getClientData } from '../utils/getClientData';
import { getBrokerData } from '../utils/getBrokerData';
import { getHannkUserByEmail, saveHannkUserByEmail, SaveHannkUserParams, updateHannkUserByEmail } from '../services/requestor.service';
const allSettled = require('promise.allsettled');

const schema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "OTA_VehResRQReq",
    "type": "object",
    "title": "The root schema",
    "description": "The root schema comprises the entire JSON document.",
    "default": {},
    "examples": [
        {
            "xmlns": "http://www.opentravel.org/OTA/2003/05",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05 VehResRQ.xsd",
            "POS": {
                "Source": {
                    "RequestorID": {
                        "Type": "5",
                        "ID": "GRC-300000",
                        "RATEID": "GRC-880001"
                    }
                }
            },
            "VehResRQCore": {
                "VehRentalCore": {
                    "PickUpDateTime": "2020-11-20T12:00:00",
                    "ReturnDateTime": "2020-11-18T10:00:00",
                    "PickUpLocation": {
                        "LocationCode": "LWNA01"
                    },
                    "ReturnLocation": {
                        "LocationCode": "LWNA01"
                    }
                },
                "Customer": {
                    "Primary": {
                        "PersonName": {
                            "NamePrefix": "Sr",
                            "GivenName": "Rick",
                            "Surname": "Little"
                        },
                        "Telephone": {
                            "PhoneNumber": "+1 8006471058"
                        },
                        "Email": "test25@test.com",
                        "Address": {
                            "StreetNmbr": "",
                            "CityName": "",
                            "PostalCode": ""
                        },
                        "CustLoyalty": {
                            "ProgramID": "",
                            "MembershipID": ""
                        }
                    }
                },
                "VendorPref": "",
                "VehPref": {
                    "SearchId": "",
                    "Code": "SWMR-8-23412",
                    "Acriss": "SWMR",
                    "price": ""
                },
                "SpecialEquipPrefs": {
                    "SpecialEquipPref": []
                },
                "PromoDesc": ""
            },
            "VehResRQInfo": "",
            "ArrivalDetails": {
                "FlightNo": "IB3154"
            },
            "RentalPaymentPref": {
                "Voucher": {
                    "Identifier": "5464srsdrdasu1",
                    "PaymentCard": {
                        "CardType": "Paypal",
                        "CardCode": "",
                        "CardNumber": "1111111111111111111111111",
                        "ExpireDate": "MM/YY",
                        "CardHolderName": "",
                        "AmountPaid": "",
                        "CurrencyUsed": ""
                    }
                }
            },
            "CONTEXT": {
                "Filter": {
                    "content": "SupplierAccountnumber",
                    "Language": "EN",
                    "contactless": "Yes"
                }
            }
        }
    ],
    "required": [
        "POS",
        "VehResRQCore",
        "VehResRQInfo",
        "ArrivalDetails",
        "RentalPaymentPref",
        "CONTEXT"
    ],
    "properties": {
        "xmlns": {
            "$id": "#/properties/xmlns",
            "type": "string",
            "title": "The xmlns schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
                "http://www.opentravel.org/OTA/2003/05"
            ]
        },
        "xmlns:xsi": {
            "$id": "#/properties/xmlns%3Axsi",
            "type": "string",
            "title": "The xmlns:xsi schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
                "http://www.w3.org/2001/XMLSchema-instance"
            ]
        },
        "xsi:schemaLocation": {
            "$id": "#/properties/xsi%3AschemaLocation",
            "type": "string",
            "title": "The xsi:schemaLocation schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
                "http://www.opentravel.org/OTA/2003/05 VehResRQ.xsd"
            ]
        },
        "POS": {
            "$id": "#/properties/POS",
            "type": "object",
            "title": "The POS schema",
            "description": "An explanation about the purpose of this instance.",
            "default": {},
            "examples": [
                {
                    "Source": {
                        "RequestorID": {
                            "Type": "5",
                            "ID": "GRC-300000",
                            "RATEID": "GRC-880001"
                        }
                    }
                }
            ],
            "required": [
                "Source"
            ],
            "properties": {
                "Source": {
                    "$id": "#/properties/POS/properties/Source",
                    "type": "object",
                    "title": "The Source schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": {},
                    "examples": [
                        {
                            "RequestorID": {
                                "Type": "5",
                                "ID": "GRC-300000",
                                "RATEID": "GRC-880001"
                            }
                        }
                    ],
                    "required": [
                        "RequestorID"
                    ],
                    "properties": {
                        "RequestorID": {
                            "$id": "#/properties/POS/properties/Source/properties/RequestorID",
                            "type": "object",
                            "title": "The RequestorID schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": {},
                            "examples": [
                                {
                                    "Type": "5",
                                    "ID": "GRC-300000",
                                    "RATEID": "GRC-880001"
                                }
                            ],
                            "required": [
                                "Type",
                                "ID",
                                "RATEID"
                            ],
                            "properties": {
                                "Type": {
                                    "$id": "#/properties/POS/properties/Source/properties/RequestorID/properties/Type",
                                    "type": "string",
                                    "title": "The Type schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "5"
                                    ]
                                },
                                "ID": {
                                    "$id": "#/properties/POS/properties/Source/properties/RequestorID/properties/ID",
                                    "type": "string",
                                    "title": "The ID schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "GRC-300000"
                                    ]
                                },
                                "RATEID": {
                                    "$id": "#/properties/POS/properties/Source/properties/RequestorID/properties/RATEID",
                                    "type": "string",
                                    "title": "The RATEID schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "GRC-880001"
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
        "VehResRQCore": {
            "$id": "#/properties/VehResRQCore",
            "default": {},
            "description": "An explanation about the purpose of this instance.",
            "examples": [
                {
                    "VehRentalCore": {
                        "PickUpDateTime": "2020-11-20T12:00:00",
                        "ReturnDateTime": "2020-11-18T10:00:00",
                        "PickUpLocation": {
                            "LocationCode": "LWNA01"
                        },
                        "ReturnLocation": {
                            "LocationCode": "LWNA01"
                        }
                    },
                    "Customer": {
                        "Primary": {
                            "PersonName": {
                                "NamePrefix": "Sr",
                                "GivenName": "Rick",
                                "Surname": "Little"
                            },
                            "Telephone": {
                                "PhoneNumber": "+1 8006471058"
                            },
                            "Email": "test25@test.com",
                            "Address": {
                                "StreetNmbr": "",
                                "CityName": "",
                                "PostalCode": ""
                            },
                            "CustLoyalty": {
                                "ProgramID": "",
                                "MembershipID": ""
                            }
                        }
                    },
                    "VendorPref": "",
                    "VehPref": {
                        "SearchId": "",
                        "Code": "SWMR-8-23412",
                        "Acriss": "SWMR",
                        "price": ""
                    },
                    "SpecialEquipPrefs": {
                        "SpecialEquipPref": []
                    },
                    "PromoDesc": ""
                }
            ],
            "required": [
                "VehRentalCore",
                "Customer",
                "VendorPref",
                "VehPref",
                "PromoDesc"
            ],
            "title": "The VehResRQCore schema",
            "type": "object",
            "properties": {
                "VehRentalCore": {
                    "$id": "#/properties/VehResRQCore/properties/VehRentalCore",
                    "type": "object",
                    "title": "The VehRentalCore schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": {},
                    "examples": [
                        {
                            "PickUpDateTime": "2020-11-20T12:00:00",
                            "ReturnDateTime": "2020-11-18T10:00:00",
                            "PickUpLocation": {
                                "LocationCode": "LWNA01"
                            },
                            "ReturnLocation": {
                                "LocationCode": "LWNA01"
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
                            "$id": "#/properties/VehResRQCore/properties/VehRentalCore/properties/PickUpDateTime",
                            "type": "string",
                            "title": "The PickUpDateTime schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "2020-11-20T12:00:00"
                            ]
                        },
                        "ReturnDateTime": {
                            "$id": "#/properties/VehResRQCore/properties/VehRentalCore/properties/ReturnDateTime",
                            "type": "string",
                            "title": "The ReturnDateTime schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "2020-11-18T10:00:00"
                            ]
                        },
                        "PickUpLocation": {
                            "$id": "#/properties/VehResRQCore/properties/VehRentalCore/properties/PickUpLocation",
                            "type": "object",
                            "title": "The PickUpLocation schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": {},
                            "examples": [
                                {
                                    "LocationCode": "LWNA01"
                                }
                            ],
                            "required": [
                                "LocationCode"
                            ],
                            "properties": {
                                "LocationCode": {
                                    "$id": "#/properties/VehResRQCore/properties/VehRentalCore/properties/PickUpLocation/properties/LocationCode",
                                    "type": "string",
                                    "title": "The LocationCode schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "LWNA01"
                                    ]
                                }
                            },
                            "additionalProperties": true
                        },
                        "ReturnLocation": {
                            "$id": "#/properties/VehResRQCore/properties/VehRentalCore/properties/ReturnLocation",
                            "type": "object",
                            "title": "The ReturnLocation schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": {},
                            "examples": [
                                {
                                    "LocationCode": "LWNA01"
                                }
                            ],
                            "required": [
                                "LocationCode"
                            ],
                            "properties": {
                                "LocationCode": {
                                    "$id": "#/properties/VehResRQCore/properties/VehRentalCore/properties/ReturnLocation/properties/LocationCode",
                                    "type": "string",
                                    "title": "The LocationCode schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "LWNA01"
                                    ]
                                }
                            },
                            "additionalProperties": true
                        }
                    },
                    "additionalProperties": true
                },
                "Customer": {
                    "$id": "#/properties/VehResRQCore/properties/Customer",
                    "type": "object",
                    "title": "The Customer schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": {},
                    "examples": [
                        {
                            "Primary": {
                                "PersonName": {
                                    "NamePrefix": "Sr",
                                    "GivenName": "Rick",
                                    "Surname": "Little"
                                },
                                "Telephone": {
                                    "PhoneNumber": "+1 8006471058"
                                },
                                "Email": "test25@test.com",
                                "Address": {
                                    "StreetNmbr": "",
                                    "CityName": "",
                                    "PostalCode": ""
                                },
                                "CustLoyalty": {
                                    "ProgramID": "",
                                    "MembershipID": ""
                                }
                            }
                        }
                    ],
                    "required": [
                        "Primary"
                    ],
                    "properties": {
                        "Primary": {
                            "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary",
                            "type": "object",
                            "title": "The Primary schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": {},
                            "examples": [
                                {
                                    "PersonName": {
                                        "NamePrefix": "Sr",
                                        "GivenName": "Rick",
                                        "Surname": "Little"
                                    },
                                    "Telephone": {
                                        "PhoneNumber": "+1 8006471058"
                                    },
                                    "Email": "test25@test.com",
                                    "Address": {
                                        "StreetNmbr": "",
                                        "CityName": "",
                                        "PostalCode": ""
                                    },
                                    "CustLoyalty": {
                                        "ProgramID": "",
                                        "MembershipID": ""
                                    }
                                }
                            ],
                            "required": [
                                "PersonName",
                                "Telephone",
                                "Email",
                                "Address",
                                "CustLoyalty"
                            ],
                            "properties": {
                                "PersonName": {
                                    "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/PersonName",
                                    "type": "object",
                                    "title": "The PersonName schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": {},
                                    "examples": [
                                        {
                                            "NamePrefix": "Sr",
                                            "GivenName": "Rick",
                                            "Surname": "Little"
                                        }
                                    ],
                                    "required": [
                                        "NamePrefix",
                                        "GivenName",
                                        "Surname"
                                    ],
                                    "properties": {
                                        "NamePrefix": {
                                            "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/PersonName/properties/NamePrefix",
                                            "type": "string",
                                            "title": "The NamePrefix schema",
                                            "description": "An explanation about the purpose of this instance.",
                                            "default": "",
                                            "examples": [
                                                "Sr"
                                            ]
                                        },
                                        "GivenName": {
                                            "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/PersonName/properties/GivenName",
                                            "type": "string",
                                            "title": "The GivenName schema",
                                            "description": "An explanation about the purpose of this instance.",
                                            "default": "",
                                            "examples": [
                                                "Rick"
                                            ]
                                        },
                                        "Surname": {
                                            "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/PersonName/properties/Surname",
                                            "type": "string",
                                            "title": "The Surname schema",
                                            "description": "An explanation about the purpose of this instance.",
                                            "default": "",
                                            "examples": [
                                                "Little"
                                            ]
                                        }
                                    },
                                    "additionalProperties": true
                                },
                                "Telephone": {
                                    "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/Telephone",
                                    "type": "object",
                                    "title": "The Telephone schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": {},
                                    "examples": [
                                        {
                                            "PhoneNumber": "+1 8006471058"
                                        }
                                    ],
                                    "required": [
                                        "PhoneNumber"
                                    ],
                                    "properties": {
                                        "PhoneNumber": {
                                            "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/Telephone/properties/PhoneNumber",
                                            "type": "string",
                                            "title": "The PhoneNumber schema",
                                            "description": "An explanation about the purpose of this instance.",
                                            "default": "",
                                            "examples": [
                                                "+1 8006471058"
                                            ]
                                        }
                                    },
                                    "additionalProperties": true
                                },
                                "Email": {
                                    "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/Email",
                                    "type": "string",
                                    "title": "The Email schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "test25@test.com"
                                    ]
                                },
                                "Address": {
                                    "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/Address",
                                    "type": "object",
                                    "title": "The Address schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": {},
                                    "examples": [
                                        {
                                            "StreetNmbr": "",
                                            "CityName": "",
                                            "PostalCode": ""
                                        }
                                    ],
                                    "required": [
                                        "StreetNmbr",
                                        "CityName",
                                        "PostalCode"
                                    ],
                                    "properties": {
                                        "StreetNmbr": {
                                            "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/Address/properties/StreetNmbr",
                                            "type": "string",
                                            "title": "The StreetNmbr schema",
                                            "description": "An explanation about the purpose of this instance.",
                                            "default": "",
                                            "examples": [
                                                ""
                                            ]
                                        },
                                        "CityName": {
                                            "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/Address/properties/CityName",
                                            "type": "string",
                                            "title": "The CityName schema",
                                            "description": "An explanation about the purpose of this instance.",
                                            "default": "",
                                            "examples": [
                                                ""
                                            ]
                                        },
                                        "PostalCode": {
                                            "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/Address/properties/PostalCode",
                                            "type": "string",
                                            "title": "The PostalCode schema",
                                            "description": "An explanation about the purpose of this instance.",
                                            "default": "",
                                            "examples": [
                                                ""
                                            ]
                                        }
                                    },
                                    "additionalProperties": true
                                },
                                "CustLoyalty": {
                                    "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/CustLoyalty",
                                    "type": "object",
                                    "title": "The CustLoyalty schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": {},
                                    "examples": [
                                        {
                                            "ProgramID": "",
                                            "MembershipID": ""
                                        }
                                    ],
                                    "required": [
                                        "ProgramID",
                                        "MembershipID"
                                    ],
                                    "properties": {
                                        "ProgramID": {
                                            "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/CustLoyalty/properties/ProgramID",
                                            "type": "string",
                                            "title": "The ProgramID schema",
                                            "description": "An explanation about the purpose of this instance.",
                                            "default": "",
                                            "examples": [
                                                ""
                                            ]
                                        },
                                        "MembershipID": {
                                            "$id": "#/properties/VehResRQCore/properties/Customer/properties/Primary/properties/CustLoyalty/properties/MembershipID",
                                            "type": "string",
                                            "title": "The MembershipID schema",
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
                },
                "VendorPref": {
                    "$id": "#/properties/VehResRQCore/properties/VendorPref",
                    "type": "string",
                    "title": "The VendorPref schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                        ""
                    ]
                },
                "VehPref": {
                    "$id": "#/properties/VehResRQCore/properties/VehPref",
                    "type": "object",
                    "title": "The VehPref schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": {},
                    "examples": [
                        {
                            "SearchId": "",
                            "Code": "SWMR-8-23412",
                            "Acriss": "SWMR",
                            "price": ""
                        }
                    ],
                    "required": [
                        "Code",
                        "Acriss",
                        "price"
                    ],
                    "properties": {
                        "SearchId": {
                            "$id": "#/properties/VehResRQCore/properties/VehPref/properties/SearchId",
                            "type": "string",
                            "title": "The SearchId schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                ""
                            ]
                        },
                        "Code": {
                            "$id": "#/properties/VehResRQCore/properties/VehPref/properties/Code",
                            "type": "string",
                            "title": "The Code schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "SWMR-8-23412"
                            ]
                        },
                        "Acriss": {
                            "$id": "#/properties/VehResRQCore/properties/VehPref/properties/Acriss",
                            "type": "string",
                            "title": "The Acriss schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "SWMR"
                            ]
                        },
                        "price": {
                            "$id": "#/properties/VehResRQCore/properties/VehPref/properties/price",
                            "type": "string",
                            "title": "The price schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                ""
                            ]
                        }
                    },
                    "additionalProperties": true
                },
                "SpecialEquipPrefs": {
                    "$id": "#/properties/VehResRQCore/properties/SpecialEquipPrefs",
                    "default": {},
                    "description": "An explanation about the purpose of this instance.",
                    "examples": [
                        {
                            "SpecialEquipPref": []
                        }
                    ],
                    "required": [
                        ""
                    ],
                    "title": "The SpecialEquipPrefs schema",
                    "type": [
                        "object",
                        "string"
                    ],
                    "properties": {
                        "SpecialEquipPref": {
                            "$id": "#/properties/VehResRQCore/properties/SpecialEquipPrefs/properties/SpecialEquipPref",
                            "type": "array",
                            "title": "The SpecialEquipPref schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": [],
                            "examples": [
                                []
                            ],
                            "additionalItems": true,
                            "items": {
                                "$id": "#/properties/VehResRQCore/properties/SpecialEquipPrefs/properties/SpecialEquipPref/items"
                            }
                        }
                    },
                    "additionalProperties": true
                },
                "PromoDesc": {
                    "$id": "#/properties/VehResRQCore/properties/PromoDesc",
                    "type": "string",
                    "title": "The PromoDesc schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                        ""
                    ]
                }
            },
            "additionalProperties": true
        },
        "VehResRQInfo": {
            "$id": "#/properties/VehResRQInfo",
            "type": "string",
            "title": "The VehResRQInfo schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
                ""
            ]
        },
        "ArrivalDetails": {
            "$id": "#/properties/ArrivalDetails",
            "type": "object",
            "title": "The ArrivalDetails schema",
            "description": "An explanation about the purpose of this instance.",
            "default": {},
            "examples": [
                {
                    "FlightNo": "IB3154"
                }
            ],
            "required": [
                "FlightNo"
            ],
            "properties": {
                "FlightNo": {
                    "$id": "#/properties/ArrivalDetails/properties/FlightNo",
                    "type": "string",
                    "title": "The FlightNo schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": "",
                    "examples": [
                        "IB3154"
                    ]
                }
            },
            "additionalProperties": true
        },
        "RentalPaymentPref": {
            "$id": "#/properties/RentalPaymentPref",
            "type": "object",
            "title": "The RentalPaymentPref schema",
            "description": "An explanation about the purpose of this instance.",
            "default": {},
            "examples": [
                {
                    "Voucher": {
                        "Identifier": "5464srsdrdasu1",
                        "PaymentCard": {
                            "CardType": "Paypal",
                            "CardCode": "",
                            "CardNumber": "1111111111111111111111111",
                            "ExpireDate": "MM/YY",
                            "CardHolderName": "",
                            "AmountPaid": "",
                            "CurrencyUsed": ""
                        }
                    }
                }
            ],
            "required": [
                "Voucher"
            ],
            "properties": {
                "Voucher": {
                    "$id": "#/properties/RentalPaymentPref/properties/Voucher",
                    "type": "object",
                    "title": "The Voucher schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": {},
                    "examples": [
                        {
                            "Identifier": "5464srsdrdasu1",
                            "PaymentCard": {
                                "CardType": "Paypal",
                                "CardCode": "",
                                "CardNumber": "1111111111111111111111111",
                                "ExpireDate": "MM/YY",
                                "CardHolderName": "",
                                "AmountPaid": "",
                                "CurrencyUsed": ""
                            }
                        }
                    ],
                    "required": [
                        "Identifier",
                        "PaymentCard"
                    ],
                    "properties": {
                        "Identifier": {
                            "$id": "#/properties/RentalPaymentPref/properties/Voucher/properties/Identifier",
                            "type": "string",
                            "title": "The Identifier schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "5464srsdrdasu1"
                            ]
                        },
                        "PaymentCard": {
                            "$id": "#/properties/RentalPaymentPref/properties/Voucher/properties/PaymentCard",
                            "type": "object",
                            "title": "The PaymentCard schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": {},
                            "examples": [
                                {
                                    "CardType": "Paypal",
                                    "CardCode": "",
                                    "CardNumber": "1111111111111111111111111",
                                    "ExpireDate": "MM/YY",
                                    "CardHolderName": "",
                                    "AmountPaid": "",
                                    "CurrencyUsed": ""
                                }
                            ],
                            "required": [
                                "CardType",
                                "CardCode",
                                "CardNumber",
                                "ExpireDate",
                                "CardHolderName",
                                "AmountPaid",
                                "CurrencyUsed"
                            ],
                            "properties": {
                                "CardType": {
                                    "$id": "#/properties/RentalPaymentPref/properties/Voucher/properties/PaymentCard/properties/CardType",
                                    "type": "string",
                                    "title": "The CardType schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "Paypal"
                                    ]
                                },
                                "CardCode": {
                                    "$id": "#/properties/RentalPaymentPref/properties/Voucher/properties/PaymentCard/properties/CardCode",
                                    "type": "string",
                                    "title": "The CardCode schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        ""
                                    ]
                                },
                                "CardNumber": {
                                    "$id": "#/properties/RentalPaymentPref/properties/Voucher/properties/PaymentCard/properties/CardNumber",
                                    "type": "string",
                                    "title": "The CardNumber schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "1111111111111111111111111"
                                    ]
                                },
                                "ExpireDate": {
                                    "$id": "#/properties/RentalPaymentPref/properties/Voucher/properties/PaymentCard/properties/ExpireDate",
                                    "type": "string",
                                    "title": "The ExpireDate schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "MM/YY"
                                    ]
                                },
                                "CardHolderName": {
                                    "$id": "#/properties/RentalPaymentPref/properties/Voucher/properties/PaymentCard/properties/CardHolderName",
                                    "type": "string",
                                    "title": "The CardHolderName schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        ""
                                    ]
                                },
                                "AmountPaid": {
                                    "$id": "#/properties/RentalPaymentPref/properties/Voucher/properties/PaymentCard/properties/AmountPaid",
                                    "type": "string",
                                    "title": "The AmountPaid schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        ""
                                    ]
                                },
                                "CurrencyUsed": {
                                    "$id": "#/properties/RentalPaymentPref/properties/Voucher/properties/PaymentCard/properties/CurrencyUsed",
                                    "type": "string",
                                    "title": "The CurrencyUsed schema",
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
        },
        "CONTEXT": {
            "$id": "#/properties/CONTEXT",
            "type": "object",
            "title": "The CONTEXT schema",
            "description": "An explanation about the purpose of this instance.",
            "default": {},
            "examples": [
                {
                    "Filter": {
                        "content": "SupplierAccountnumber",
                        "Language": "EN",
                        "contactless": "Yes"
                    }
                }
            ],
            "required": [
                "Filter"
            ],
            "properties": {
                "Filter": {
                    "$id": "#/properties/CONTEXT/properties/Filter",
                    "type": "object",
                    "title": "The Filter schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": {},
                    "examples": [
                        {
                            "content": "SupplierAccountnumber",
                            "Language": "EN",
                            "contactless": "Yes"
                        }
                    ],
                    "required": [
                        "content",
                        "Language",
                        "contactless"
                    ],
                    "properties": {
                        "content": {
                            "$id": "#/properties/CONTEXT/properties/Filter/properties/content",
                            "type": "string",
                            "title": "The content schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "SupplierAccountnumber"
                            ]
                        },
                        "Language": {
                            "$id": "#/properties/CONTEXT/properties/Filter/properties/Language",
                            "type": "string",
                            "title": "The Language schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "EN"
                            ]
                        },
                        "contactless": {
                            "$id": "#/properties/CONTEXT/properties/Filter/properties/contactless",
                            "type": "string",
                            "title": "The contactless schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "Yes"
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

const clientBookingsMaps: {[k: number]: (p: any) => void } = {
    17: DiscoverCarsBooking,
    58: UnitedCarsBooking,
    1: RightCarsBooking,
    10: ZezgoBooking,
}

export const createBooking = async (body: any) => {
    const validator = validateFor(schema)
    validator(body)
    const { VehResRQCore, POS: { Source: { RequestorID } } } = body

    try {   
        const cliendData = await getClientData({
            brokerId: RequestorID.ID.slice(4,6),
            clientAccountCode: RequestorID.RATEID.slice(4)
        })

        const bookingFn = clientBookingsMaps[parseInt(cliendData.clientId.toString() || "0")]

        if (!bookingFn) throw new ApiError('We could not find the requested booking supplier')

        const primary = VehResRQCore?.Customer?.Primary
        if (primary.Email) {
            const hannkUser = await getHannkUserByEmail({ email: primary.Email })
            const params: SaveHannkUserParams = {
                firstName: primary.PersonName.GivenName,
                lastname: primary.PersonName.Surname,
                phonenumber: primary.Telephone.PhoneNumber,
                
                city: primary.Address.CityName,
                address: primary.Address.StreetNmbr,
                country: primary.Address.Country,
                postcode: primary.Address.PostalCode,
            }
            if (hannkUser) {
                await updateHannkUserByEmail({
                    ...params,
                    id: hannkUser.id
                })
            } else {
                await saveHannkUserByEmail(params)
            }
        }

        let json = await bookingFn(body)

        return [
            json,
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

const SearchBookingSchema = {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/example.json",
    "type": "object",
    "title": "The root schema",
    "description": "The root schema comprises the entire JSON document.",
    "default": {},
    "examples": [
        {
            "xmlns": "http://www.opentravel.org/OTA/2003/05",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05  \nVehRetResRQ.xsd",
            "POS": {
                "Source": {
                    "RequestorID": {
                        "Type": "5",
                        "ID": "GRC-660000",
                        "RATEID": "GRC-200002",
                        "ID_NAME": "Acme Rent A Car"
                    },
                    "ApiKey": "c32419e4-d316-4a54-b20d-296eb2dcf7a2"
                }
            },
            "VehRetResRQCore": {
                "ResNumber": {
                    "Number": ""
                },
                "PersonName": {
                    "GivenName": "ddddddd",
                    "Surname": "Test"
                },
                "Telephone": {
                    "PhoneNumber": "123465"
                }
            },
            "CONTEXT": "\n    "
        }
    ],
    "required": [
        "POS",
        "VehRetResRQCore",
    ],
    "properties": {
        "xmlns": {
            "$id": "#/properties/xmlns",
            "type": "string",
            "title": "The xmlns schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
                "http://www.opentravel.org/OTA/2003/05"
            ]
        },
        "xmlns:xsi": {
            "$id": "#/properties/xmlns%3Axsi",
            "type": "string",
            "title": "The xmlns:xsi schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
                "http://www.w3.org/2001/XMLSchema-instance"
            ]
        },
        "xsi:schemaLocation": {
            "$id": "#/properties/xsi%3AschemaLocation",
            "type": "string",
            "title": "The xsi:schemaLocation schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
                "http://www.opentravel.org/OTA/2003/05  \nVehRetResRQ.xsd"
            ]
        },
        "POS": {
            "$id": "#/properties/POS",
            "type": "object",
            "title": "The POS schema",
            "description": "An explanation about the purpose of this instance.",
            "default": {},
            "examples": [
                {
                    "Source": {
                        "RequestorID": {
                            "Type": "5",
                            "ID": "GRC-660000",
                            "RATEID": "GRC-200002",
                            "ID_NAME": "Acme Rent A Car"
                        },
                        "ApiKey": "c32419e4-d316-4a54-b20d-296eb2dcf7a2"
                    }
                }
            ],
            "required": [
                "Source"
            ],
            "properties": {
                "Source": {
                    "$id": "#/properties/POS/properties/Source",
                    "default": {},
                    "description": "An explanation about the purpose of this instance.",
                    "examples": [
                        {
                            "RequestorID": {
                                "Type": "5",
                                "ID": "GRC-660000",
                                "RATEID": "GRC-200002",
                                "ID_NAME": "Acme Rent A Car"
                            },
                            "ApiKey": "c32419e4-d316-4a54-b20d-296eb2dcf7a2"
                        }
                    ],
                    "required": [
                        "RequestorID"
                    ],
                    "title": "The Source schema",
                    "type": "object",
                    "properties": {
                        "RequestorID": {
                            "$id": "#/properties/POS/properties/Source/properties/RequestorID",
                            "default": {},
                            "description": "An explanation about the purpose of this instance.",
                            "examples": [
                                {
                                    "Type": "5",
                                    "ID": "GRC-660000",
                                    "RATEID": "GRC-200002",
                                    "ID_NAME": "Acme Rent A Car"
                                }
                            ],
                            "required": [
                                "ID",
                                "RATEID"
                            ],
                            "title": "The RequestorID schema",
                            "type": "object",
                            "properties": {
                                "Type": {
                                    "$id": "#/properties/POS/properties/Source/properties/RequestorID/properties/Type",
                                    "type": "string",
                                    "title": "The Type schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "5"
                                    ]
                                },
                                "ID": {
                                    "$id": "#/properties/POS/properties/Source/properties/RequestorID/properties/ID",
                                    "type": "string",
                                    "title": "The ID schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "GRC-660000"
                                    ]
                                },
                                "RATEID": {
                                    "$id": "#/properties/POS/properties/Source/properties/RequestorID/properties/RATEID",
                                    "type": "string",
                                    "title": "The RATEID schema",
                                    "description": "An explanation about the purpose of this instance.",
                                    "default": "",
                                    "examples": [
                                        "GRC-200002"
                                    ]
                                },
                                "ID_NAME": {
                                    "$id": "#/properties/POS/properties/Source/properties/RequestorID/properties/ID_NAME",
                                    "description": "An explanation about the purpose of this instance.",
                                    "examples": [
                                        "Acme Rent A Car"
                                    ],
                                    "title": "The ID_NAME schema",
                                    "type": "string"
                                }
                            },
                            "additionalProperties": true
                        },
                        "ApiKey": {
                            "$id": "#/properties/POS/properties/Source/properties/ApiKey",
                            "type": "string",
                            "title": "The ApiKey schema",
                            "description": "An explanation about the purpose of this instance.",
                            "default": "",
                            "examples": [
                                "c32419e4-d316-4a54-b20d-296eb2dcf7a2"
                            ]
                        }
                    },
                    "additionalProperties": true
                }
            },
            "additionalProperties": true
        },
        "VehRetResRQCore": {
            "$id": "#/properties/VehRetResRQCore",
            "type": "object",
            "title": "The VehRetResRQCore schema",
            "description": "An explanation about the purpose of this instance.",
            "default": {},
            "examples": [
                {
                    "ResNumber": {
                        "Number": ""
                    },
                }
            ],
            "required": [
                "ResNumber",
            ],
            "properties": {
                "ResNumber": {
                    "$id": "#/properties/VehRetResRQCore/properties/ResNumber",
                    "type": "object",
                    "title": "The ResNumber schema",
                    "description": "An explanation about the purpose of this instance.",
                    "default": {},
                    "examples": [
                        {
                            "Number": ""
                        }
                    ],
                    "required": [
                        "Number"
                    ],
                    "properties": {
                        "Number": {
                            "$id": "#/properties/VehRetResRQCore/properties/ResNumber/properties/Number",
                            "description": "An explanation about the purpose of this instance.",
                            "examples": [
                                ""
                            ],
                            "title": "The Number schema",
                            "minLength": 1,
                            "type": "string"
                        }
                    },
                    "additionalProperties": true
                }
            },
            "additionalProperties": true
        },
        "CONTEXT": {
            "$id": "#/properties/CONTEXT",
            "type": "string",
            "title": "The CONTEXT schema",
            "description": "An explanation about the purpose of this instance.",
            "default": "",
            "examples": [
                "\n    "
            ]
        }
    },
    "additionalProperties": true
}

export const searchBookings = async (body: any) => {
    const validator = validateFor(SearchBookingSchema)
    validator(body)
    const { VehRetResRQCore, CONTEXT: { Filter = [] } } = body
    const { POS: { Source: { RequestorID } } } = body
    const { ResNumber } = VehRetResRQCore

    try {

        const RequestorIDs = Array.isArray(Filter) ? Filter.map((f: any) => f.content) : Filter.content == "" ? [] : [Filter.content]

        const params: GetBookingsParams = {
            RequestorIDs,
        }
        if (RequestorID.RATEID) {
            const cliendData = await getBrokerData({
                brokerAccountCode: RequestorID.RATEID.slice(4)
            })
            if (cliendData) params.clientId = cliendData.clientId
        }
        if (ResNumber?.Number) {
            params.resNumber = ResNumber.Number
        }

        const bookings = await getBookings(params)
        const xml = await createBookingsXmlResponse(bookings)
        const response = await xmlToJson(xml)

        logger.info("Sending OTA_VehRetResRQ response")
        return [
            response.OTA_VehRetResRS,
            200,
            "OTA_VehRetResRS",
            { "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05 OTA_VehRetResRS.xsd" }
        ]
    } catch (error) {
        if (error.response) {
            throw new ApiError(error.response.data.error)
        } else {
            throw error
        }
    }
}

const clientCancelBookingsMaps: Record<string, (body: any) => Promise<any>> = {
    58: cancelUnitedCarBooking,
    1: cancelRightCarsBooking,
    10: cancelZezgoBooking,
}
export const cancelBooking = async (body: any) => {
    //const validator = validateFor(schema)
    //validator(body)
    const { VehCancelRQCore, POS: { Source: { RequestorID } } } = body

    const resNumber = VehCancelRQCore.ResNumber.Number

    const bookings = await getBookingsBy({ requestorId: RequestorID.ID, resNumber })

    if (bookings.length === 0) throw new ApiError("Booking not found")
    if (bookings.every(b => b.reservationStatus === BOOKING_STATUS_ENUM.CANCELLED)) throw new ApiError("Booking not found")

    const cliendData = await getBrokerData({
        brokerAccountCode: RequestorID.RATEID.slice(4)
    })

    try {

        let json = null;

        await clientCancelBookingsMaps[cliendData.clientId](body)
            .then(() => cancelBookingByResNumber(resNumber))
            .then(() => {
                json = {
                    VehRetResRSCore: {
                        VehReservation: {
                            Status: "Cancelled",
                            Resnumber: VehCancelRQCore.ResNumber.Number,
                        }
                    }
                }
            })

        return [
            json,
            200,
            "OTA_VehCancelRS",
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

export const getSingleBooking = async (body: any) => {
    //const validator = validateFor(schema)
    //validator(body)

    try {
        const booking = await getRightCarsBooking(body)
        if (!booking) throw new ApiError('Booking now found')
        const xml = await createBookingsXmlResponse([booking])
        const response = await xmlToJson(xml)

        logger.info("Sending OTA_VehRetResRQ response")
        return [
            response.OTA_VehRetResRS,
            200,
            "OTA_VehRetResRS",
            { "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05 OTA_VehRetResRS.xsd" }
        ]
    } catch (error) {
        if (error.response) {
            throw new ApiError(error.response.data.error)
        } else {
            throw error
        }
    }
}