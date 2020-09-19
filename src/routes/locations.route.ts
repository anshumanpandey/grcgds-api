import express from 'express';
import asyncHandler from "express-async-handler"
import { DB } from '../utils/DB';
import { validateFor } from '../utils/JsonValidator';
import { XmlMiddleware, BuildXmlResponse } from '../utils/XmlConfig';

export const locationsRoutes = express();

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

locationsRoutes.get('/', XmlMiddleware() ,asyncHandler(async (req, res) => {
  const validator = validateFor(schema)
  validator(req.body)
  const { VehLocSearchCriterion: { CONTEXT, Address } } = req.body;

  const whereFilters: any = {}
  if (Address && Address.CountryName) {
    whereFilters.country = Address.CountryName.Code
  }

  const columns = { Id: "id", InternalCode: "internal_code", Location: "location", Country: "country", GRCGDSlocatincode: "GRCGDSlocatincode", Lat: "Lat", Long: "Long"}
  const r = await DB?.select(columns).where(whereFilters).table("companies_locations");
  
  BuildXmlResponse(res, { VehMatchedLocs: {VehMatchedLoc: { LocationDetail: r }}}, 200, "OTA_CountryListRS", {"xsi:schemaLocation":"http://www.opentravel.org/OTA/2003/05 OTA_CountryListRS.xsd",})
}));
