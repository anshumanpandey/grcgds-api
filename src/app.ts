import express from 'express';
import { join } from "path"
import * as bodyParser from 'body-parser';
import sequelize, { initDb } from './utils/DB';
import { routes } from './routes';
import { ApiError } from './utils/ApiError';
import { BuildXmlResponse } from './utils/XmlConfig';
var morgan = require('morgan')
var cors = require('cors')

const app = express();

app.use(cors())
app.use(morgan("tiny"))
/*app.use(bodyParser.json({
    limit: '50mb',
    verify(req: any, res, buf, encoding) {
        req.rawBody = buf;
    }
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
}));*/

app.use('/api/v1',routes)

app.use((err:any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ApiError) {
        BuildXmlResponse(res, { Error: {
            StatusCode: err.code,
            Message: err.message
        } }, err.code, "Errors")
        return
    } else if (err.name === 'UnauthorizedError') {
        console.log(err)
        res.send("You are blocked!")
      }
    else {
        console.log(err)
        BuildXmlResponse(res, { Error: {
            StatusCode: 500,
            Message: "UNKWON ERROR"
        } }, 500, "Errors")
        return
    }
});

const bootstrap = () => {
    return initDb()
}

export {
    app,
    bootstrap
};