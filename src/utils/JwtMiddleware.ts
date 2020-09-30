const requestIp = require('request-ip');
import express from 'express';
import { DB, getDbFor } from '../utils/DB';
const md5 = require('md5');

export default () => {
    return (req: express.Request, res: express.Response, n: express.NextFunction) => {
        const ip = requestIp.getClientIp(req)
        console.log(ip)
        console.log(md5(ip))
        DB?.select().where('pall', md5(ip)).table("white")
        .then((r) => {
            if (r.length == 0) {
                n({name : "UnauthorizedError"});
            }
            let pos = null;
            if (req.body.OTA_VehLocSearchRQ) {
                pos = req.body.OTA_VehLocSearchRQ.POS
              } else if (req.body.OTA_CountryListRQ) {
                pos = req.body.OTA_CountryListRQ.POS
              } else if (req.body.OTA_VehAvailRateRQ) {
                pos = req.body.OTA_VehAvailRateRQ.POS
              } else if (req.body.OTA_VehResRQ) {
                pos = req.body.OTA_VehResRQ.POS
              }
            return getDbFor("grcgds_gateway_db")?.select().where('id', pos.Source.RequestorID.ID.replace('GRC-',"").slice(0,2)).table("clients")
        })
        .then((r) => {
            if (r.length != 0) {
                n();
            } else {
                n({name : "RequestorIDError"});
            }
        })
        .catch((err) => {
            console.log(err)
            n({name : "UnauthorizedError"})
        })
    }
}