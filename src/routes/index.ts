import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { BuildXmlResponse, XmlMiddleware } from '../utils/XmlConfig';
import { getLocations } from '../controllers/locations.controller';
import { getCountries } from '../controllers/country.controller';
import JwtMiddleware from '../utils/JwtMiddleware';
import { searchCars } from '../controllers/carsearch.controller';

export const routes = express();

routes.get('/', JwtMiddleware(),XmlMiddleware() ,expressAsyncHandler(async (req, res) => {
    if (req.body.OTA_VehLocSearchRQ) {
      const r = await getLocations(req.body.OTA_VehLocSearchRQ)
      //@ts-expect-error
      BuildXmlResponse(res,...r)
    } else if (req.body.OTA_CountryListRQ) {
      const r = await getCountries(req.body.OTA_CountryListRQ)
      //@ts-expect-error
      BuildXmlResponse(res,...r)
    } else if (req.body.OTA_VehAvailRateRQ) {
      const r = await searchCars(req.body.OTA_VehAvailRateRQ)
      //@ts-expect-error
      BuildXmlResponse(res,...r)
    } else {
      BuildXmlResponse(res,{ Response: "Request not supported" }, 200, "OTA_UnsuportedRequest")}
  }));
