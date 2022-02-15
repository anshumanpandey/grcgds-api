const requestIp = require('request-ip');
import express from 'express';
import { DB, getDbFor } from '../utils/DB';
import { logger } from './Logger';
const md5 = require('md5');

export default () => {
    return (req: express.Request, res: express.Response, n: express.NextFunction) => {
        const ip = requestIp.getClientIp(req)
        console.log(ip)
        console.log(md5(ip))
        let pos: any = null;

        const reqList = [
          "OTA_VehLocSearchRQ",
          "OTA_CountryListRQ",
          "OTA_VehAvailRateRQ",
          "OTA_VehResRQ",
          "OTA_VehRetResRQ",
          "OTA_VehCancelRQ",
          "OTA_VehRetSingleResRQ",
          "OTA_CreateAnswerReview",
          "OTA_GetAnswerReview",
          "OTA_DispatchReviewInvitation",
          "OTA_DepositFree",
          "OTA_Deposit",
          "OTA_DepositFind",
        ];

        const found = reqList.find(i => i in req.body)
        if (found) {
          pos = req.body[found].POS;
        }
        DB?.select().where('pall', md5(ip)).table("white")
            .then((r) => {
                if (r.length == 0) {
                    logger.info("Whitelisted IP NOT found!")
                    return getDbFor("hannk_grcgds_gateway_db")?.select()
                        .from("api_key")
                        .where({
                            'key': pos.Source.ApiKey,
                        })
                } else {
                    return [1]
                }
            })
            .then((r) => {
                if (r && r.length != 0) {
                    logger.info(`VALID API KEY ${pos.Source.ApiKey}!`)
                    n();
                } else {
                    logger.info(`INVALID API KEY ${pos.Source.ApiKey}!`)
                    n({ name: "UnauthorizedError" });
                }
            })
            .catch((err) => {
                console.log(err)
                n({ name: "UnauthorizedError" })
            })
    }
}