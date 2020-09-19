import express from 'express';
import asyncHandler from "express-async-handler"
import { DB } from '../utils/DB';
import { XmlMiddleware, BuildXmlResponse } from '../utils/XmlConfig';

export const locationsRoutes = express();

locationsRoutes.get('/', XmlMiddleware() ,asyncHandler(async (req, res) => {
  const { VehLocSearchCriterion: { CONTEXT, Address } } = req.body;

  const whereFilters: any = {}
  if (Address.CountryName) {
    whereFilters.country = Address.CountryName.Code
  }

  const columns = { Id: "id", InternalCode: "internal_code", Location: "location", Country: "country", GRCGDSlocatincode: "GRCGDSlocatincode", Lat: "Lat", Long: "Long"}
  const r = await DB?.select(columns).where(whereFilters).table("companies_locations");
  
  BuildXmlResponse(res, { VehMatchedLocs: {VehMatchedLoc: { LocationDetail: r }}}, 200, "OTA_CountryListRS", {"xsi:schemaLocation":"http://www.opentravel.org/OTA/2003/05 OTA_CountryListRS.xsd",})
}));
