import express from 'express';
import asyncHandler from "express-async-handler"
import { DB } from '../utils/DB';
import { XmlMiddleware, BuildXmlResponse } from '../utils/XmlConfig';

export const countriesRoutes = express();

countriesRoutes.get('/', XmlMiddleware() ,asyncHandler(async (req, res) => {
  const { CONTEXT } = req.body;
  const { Language } = CONTEXT;

  let columnName = "country";
  if (Language && Language == "ES") columnName = "countryes"
  if (Language && Language == "FR") columnName = "countryfr"
  if (Language && Language == "IT") columnName = "countryit"
  if (Language && Language == "DE") columnName = "countryde"

  const r = await DB?.select({ Code: "code", Country: columnName }).table("countries");
  
  BuildXmlResponse(res, { CountryList: {Country: (r || []).map(e => ({ value: e.Country, attr: e })) }}, 200, "OTA_CountryListRS", {"xsi:schemaLocation":"http://www.opentravel.org/OTA/2003/05 OTA_CountryListRS.xsd",})
}));
