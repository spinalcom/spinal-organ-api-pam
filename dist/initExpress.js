"use strict";
/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRequest = void 0;
// import * as bodyParser from 'body-parser';
const cors = require("cors");
const express = require("express");
// import * as fileUpload from 'express-fileupload';
const morgan = require("morgan");
const path = require("path");
const constant_1 = require("./constant");
const proxy_1 = require("./proxy");
const services_1 = require("./services");
var proxy = require('express-http-proxy');
const swaggerUi = require("swagger-ui-express");
// const path = require('path');
function useApiMiddleWare(app) {
    app.use(cors({ origin: '*' }));
    // app.use(fileUpload({ createParentPath: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // app.all(`${PAM_BASE_URI}*`, authorizeRequest);
}
function useHubProxy(app) {
    const HUB_HOST = `http://${process.env.HUB_HOST}:${process.env.HUB_PORT}`;
    const proxyHub = proxy(HUB_HOST, {
        limit: '1tb',
        proxyReqPathResolver: function (req) { return req.originalUrl; }
    });
    for (const routeToProxy of constant_1.routesToProxy) {
        app.use(routeToProxy, proxyHub);
    }
}
function useClientMiddleWare(app) {
    const oneDay = 1000 * 60 * 60 * 24;
    const root = path.resolve(__dirname, '..');
    app.use(express.static(root));
    // app.all(/^\/(?!api).*$/, function (req, res) {
    //   res.sendFile(path.resolve(root, "index.html"));
    // });
    app.get("/", (req, res) => {
        res.redirect("/docs");
    });
}
function initSwagger(app) {
    app.use("/swagger.json", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./swagger/swagger.json"));
    });
    app.get('/logo.png', (req, res) => {
        res.sendFile('spinalcore.png', { root: path.resolve(__dirname, "./assets") });
    });
    app.use("/docs", swaggerUi.serve, (req, res) => __awaiter(this, void 0, void 0, function* () {
        return res.send(swaggerUi.generateHTML(yield Promise.resolve().then(() => require("./swagger/swagger.json")))
        // swaggerUi.setup(undefined, {
        //   swaggerOptions: { url: "/swagger.json" },
        //   customSiteTitle: "PAM APIs",
        //   customCss: '.topbar-wrapper img {content: url(/logo.png);} .swagger-ui .topbar {background: #dbdbdb;}'
        // })
        );
    }));
}
function initExpress() {
    // const absPath = '../../../.browser_organs'.split('/');
    // const root = path.join(__dirname, ...absPath);
    var app = express();
    app.use(morgan('dev'));
    (0, proxy_1.default)(app);
    (0, proxy_1.default)(app, true);
    useHubProxy(app);
    useApiMiddleWare(app);
    useClientMiddleWare(app);
    initSwagger(app);
    const server_port = process.env.SERVER_PORT || 2022;
    const server = app.listen(server_port, () => console.log(`Example app listening on port ${server_port}!`));
    return { server, app };
}
exports.default = initExpress;
function authorizeRequest(req, res, next) {
    let auth = req.headers.authorization;
    if (auth) {
        const token = auth.split(" ")[1];
        const tokenIsValid = services_1.AuthentificationService.getInstance().tokenIsValid(token);
        if (tokenIsValid)
            return next();
    }
    return res.status(constant_1.HTTP_CODES.UNAUTHORIZED).send("invalid authorization");
}
exports.authorizeRequest = authorizeRequest;
// export function clientAuthorization(req: express.Request, res: express.Response, next: express.NextFunction) {
//   const loginUrl = "/login";
//   let originalUrl = req.originalUrl;
//   let auth = req.headers.authorization;
//   const isLoginUrl = originalUrl === loginUrl;
//   if (!auth && isLoginUrl) return next();
//   if (!auth) return res.redirect(loginUrl);
//   if (auth && isLoginUrl) return res.redirect("/");
//   next();
// }
//# sourceMappingURL=initExpress.js.map