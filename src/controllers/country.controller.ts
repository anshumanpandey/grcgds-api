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
    const { CONTEXT } = body;
    const { Filter } = CONTEXT;
    const Language = Filter?.Language || null

    let columnName = "country";
    if (Language && Language == "ES") columnName = "countryes"
    if (Language && Language == "FR") columnName = "countryfr"
    if (Language && Language == "IT") columnName = "countryit"
    if (Language && Language == "DE") columnName = "countryde"

    const r = await DB?.select({ Code: "code", Country: columnName }).table("countries");

    return [
        { CountryList: { Country: (r || []).map(e => ({ value: e.Country, attr: e })) } },
        200,
        "OTA_CountryListRQ",
        { "xsi:schemaLocation": "http://www.opentravel.org/OTA/2003/05 CountryListRQ.xsd", }
    ];
}