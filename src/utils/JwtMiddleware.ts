const requestIp = require('request-ip');
import express from 'express';
import { DB } from '../utils/DB';
const md5 = require('md5');

export default () => {
    return (req: express.Request, res: express.Response, n: express.NextFunction) => {
        const ip = requestIp.getClientIp(req)
        console.log(ip)
        console.log(md5(ip))
        DB?.select().where('pall', md5(ip)).table("white")
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