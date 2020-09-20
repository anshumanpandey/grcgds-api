var jwt = require('express-jwt');
import express from 'express';
import { getDbFor } from '../utils/DB';

export default () => {
    return (req: express.Request, res: express.Response, n: express.NextFunction) => {
        const ip = req.headers['x-real-ip'] || req.connection.remoteAddress
        console.log(ip)
        getDbFor("grcgds_hannk")?.select().where('ip', ip).table("whitelist_ip")
        .then((r) => {
            if (r.length != 0) {
                n();
            } else {
                n({name : "UnauthorizedError"});
            }
        })
        .catch((err) => {
            console.log(err)
            n({name : "UnauthorizedError"})
        })
    }
}