import express from 'express';
import xml from 'xml2js';
import xmlparser from 'express-xml-bodyparser';

// XML Parser configurations, https://github.com/Leonidas-from-XIV/node-xml2js#options
const xmlOptions = {
    charkey: 'value',
    trim: false,
    explicitRoot: false,
    explicitArray: false,
    normalizeTags: false,
    mergeAttrs: true,
};

const builder = new xml.Builder({
    renderOpts: { 'pretty': false }
});

export const XmlMiddleware = () => {
    return xmlparser(xmlOptions);
}

export const bustHeaders = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    //@ts-expect-error
    request.app.isXml = false;

    if (request.headers['content-type'] === 'application/xml' || request.headers['accept'] === 'application/xml') {
        //@ts-expect-error
        request.app.isXml = true;
    }

    next();
};


export const BuildXmlResponse = (response: any, data:any, statusCode: number = 200,preTag?: any) => {
    response.setHeader('Content-Type', 'application/xml');
    response.format({
        'application/xml': () => {
            response.status(statusCode).send(builder.buildObject({ [preTag]: data }));
        },
        'default': () => {
            // log the request and respond with 406
            response.status(406).send('Not Acceptable');
        }
    });
};
