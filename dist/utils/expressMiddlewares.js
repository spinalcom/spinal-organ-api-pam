"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.useApiMiddleWare = exports.initSwagger = exports.useViewMiddleWare = exports.useProxyToHub = void 0;
/////////////////////////////////////
//          Middleware             //
/////////////////////////////////////
const express = require("express");
const tsoa_1 = require("tsoa");
const constant_1 = require("../constant");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const AuthError_1 = require("../security/AuthError");
var proxy = require('express-http-proxy');
function useProxyToHub(app) {
    const HUB_HOST = `${process.env.HUB_PROTOCOL}://${process.env.HUB_HOST}:${process.env.HUB_PORT}`;
    const proxyHub = proxy(HUB_HOST, {
        limit: '1tb',
        proxyReqPathResolver: (req) => req.originalUrl
    });
    for (const routeToProxy of constant_1.routesToProxy) {
        app.use(routeToProxy, proxyHub);
    }
}
exports.useProxyToHub = useProxyToHub;
function useViewMiddleWare(app) {
    // const oneDay = 1000 * 60 * 60 * 24;
    const root = path.resolve(__dirname, '..');
    app.use(express.static(root));
    app.get('/', (req, res) => {
        res.redirect('/docs');
    });
}
exports.useViewMiddleWare = useViewMiddleWare;
function initSwagger(app) {
    app.use('/swagger.json', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../swagger/swagger.json'));
    });
    app.get('/logo.png', (req, res) => {
        res.sendFile('spinalcore.png', { root: path.resolve(__dirname, './assets') });
    });
    app.use('/docs', swaggerUi.serve, async (req, res) => {
        return res.send(swaggerUi.generateHTML(await Promise.resolve().then(() => require('../swagger/swagger.json'))));
    });
}
exports.initSwagger = initSwagger;
function useApiMiddleWare(app) {
    app.use(express.json({ limit: '500mb' }));
    app.use(express.urlencoded({ extended: true, limit: '500mb' }));
}
exports.useApiMiddleWare = useApiMiddleWare;
function errorHandler(err, req, res, next) {
    if (err instanceof tsoa_1.ValidateError) {
        return res.status(constant_1.HTTP_CODES.BAD_REQUEST).send(_formatValidationError(err));
    }
    if (err instanceof AuthError_1.AuthError) {
        return res.status(constant_1.HTTP_CODES.UNAUTHORIZED).send({ message: err.message });
    }
    if (err instanceof Error) {
        return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).json({
            message: 'Internal Server Error',
        });
    }
    next();
}
exports.errorHandler = errorHandler;
function _formatValidationError(err) {
    err;
    return {
        message: 'Validation Failed',
        details: err?.fields,
    };
}
//# sourceMappingURL=expressMiddlewares.js.map