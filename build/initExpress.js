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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateRequest = void 0;
// import * as bodyParser from 'body-parser';
const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const constant_1 = require("./constant");
var proxy = require('express-http-proxy');
const { spinalConnector: { host, port }, config: { server_port } } = require("../config");
const constant_2 = require("./constant");
// const path = require('path');
function initExpress() {
    // const absPath = '../../../.browser_organs'.split('/');
    // const root = path.join(__dirname, ...absPath);
    const HUB_HOST = `http://${host}:${port}`;
    var app = express();
    app.all(`/${constant_1.PAM_BASE_URI}*`, authenticateRequest, (req, res, next) => {
        next();
    });
    const proxyHub = proxy(HUB_HOST, {
        limit: '1tb',
        proxyReqPathResolver: function (req) {
            return req.originalUrl;
        },
    });
    for (const routeToProxy of constant_2.routesToProxy) {
        app.use(routeToProxy, proxyHub);
    }
    app.use(cors({ origin: '*' }));
    app.use(fileUpload({ createParentPath: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));
    // app.options('*', cors({ origin: '*' }));
    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({
    //   extended: true,
    // }));
    // app.use(express.static(root));
    // app
    //   .route(`/sendRegisterMail`)
    //   .post(mailController.mailCreateAccount.bind(mailController));
    // app.route(`/auth`).post(service.authentication.bind(service));
    // app
    //   .route(`/generateAccessServer/:email`)
    //   .get(service.generateAccessServer.bind(service));
    // app
    //   .route(`/${BASE_URI}/getProfileUser`)
    //   .get(service.getProfileUser.bind(service));
    // app
    //   .route(`/${BASE_URI}/getProfileApp`)
    //   .get(service.getProfileApp.bind(service));
    // app
    //   .route(`/${BASE_URI}/getAllProfileUser`)
    //   .get(serviceUserProfile.getAllUserProfile.bind(serviceUserProfile));
    // app
    //   .route(`/${BASE_URI}/getAllProfileApp`)
    //   .get(serviceAppProfile.getAllProfileApp.bind(serviceAppProfile));
    const server = app.listen(server_port, () => console.log(`Example app listening on port ${server_port}!`));
    return { server, app };
}
exports.default = initExpress;
function authenticateRequest(req, res, next) {
    next();
    // let authHeader = req.headers.authorization;
    // let TokenArray = authHeader.split(' ');
    // if (!TokenArray[1]) {
    //   res.status(401).json({
    //     message:
    //       "Votre token est expiré ou n'est pas valide. Veuillez vous authentifiez",
    //   });
    // } else {
    //   if (myCache.has(TokenArray[1])) {
    //     next();
    //   } else {
    //     res.status(401).json({
    //       message:
    //         "Votre token est expiré ou n'est pas valide. Veuillez vous authentifiez",
    //     });
    //   }
    // }
}
exports.authenticateRequest = authenticateRequest;
//# sourceMappingURL=initExpress.js.map