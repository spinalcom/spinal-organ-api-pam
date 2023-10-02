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
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const constant_1 = require("./constant");
const bos_1 = require("./proxy/bos");
var proxy = require('express-http-proxy');
const swaggerUi = require("swagger-ui-express");
const tsoa_1 = require("tsoa");
const routes_1 = require("./routes");
const AuthError_1 = require("./security/AuthError");
const websocket_1 = require("./proxy/websocket");
const webSocketLogs_service_1 = require("./services/webSocketLogs.service");
// import { webSocketProxy } from './proxy/websocketProxy';
function initExpress(conn) {
    return __awaiter(this, void 0, void 0, function* () {
        var app = express();
        app.use(morgan('dev'));
        app.use(cors({ origin: '*' }));
        (0, bos_1.default)(app);
        (0, bos_1.default)(app, true);
        useApiMiddleWare(app);
        useHubProxy(app);
        useClientMiddleWare(app);
        initSwagger(app);
        (0, routes_1.RegisterRoutes)(app);
        app.use(errorHandler);
        // configureBosProxy(app);
        // configureBosProxy(app, true);
        // useHubProxy(app);
        // useClientMiddleWare(app);
        // initSwagger(app);
        // useApiMiddleWare(app);
        // RegisterRoutes(app);
        // app.use(errorHandler);
        const server_port = process.env.SERVER_PORT || 2022;
        const server = app.listen(server_port, () => console.log(`api server listening on port ${server_port}!`));
        yield webSocketLogs_service_1.WebsocketLogsService.getInstance().init(conn);
        const ws = new websocket_1.WebSocketServer(server);
        yield ws.init();
        // const wsProxy = webSocketProxy(app)
        // server.on("upgrade", (req: any, socket: any, head) => {
        //   wsProxy.upgrade(req, socket, head)
        // });
        return { server, app };
    });
}
exports.default = initExpress;
/////////////////////////////////////
//          Middleware             //
/////////////////////////////////////
function useHubProxy(app) {
    const HUB_HOST = `${process.env.HUB_PROTOCOL}://${process.env.HUB_HOST}:${process.env.HUB_PORT}`;
    const proxyHub = proxy(HUB_HOST, {
        limit: '1tb',
        proxyReqPathResolver: function (req) {
            return req.originalUrl;
        },
    });
    for (const routeToProxy of constant_1.routesToProxy) {
        app.use(routeToProxy, proxyHub);
    }
}
function useClientMiddleWare(app) {
    const oneDay = 1000 * 60 * 60 * 24;
    const root = path.resolve(__dirname, '..');
    app.use(express.static(root));
    app.get('/', (req, res) => {
        res.redirect('/docs');
    });
}
function initSwagger(app) {
    app.use('/swagger.json', (req, res) => {
        res.sendFile(path.resolve(__dirname, './swagger/swagger.json'));
    });
    app.get('/logo.png', (req, res) => {
        res.sendFile('spinalcore.png', { root: path.resolve(__dirname, './assets') });
    });
    app.use('/docs', swaggerUi.serve, (req, res) => __awaiter(this, void 0, void 0, function* () {
        return res.send(swaggerUi.generateHTML(yield Promise.resolve().then(() => require('./swagger/swagger.json'))));
    }));
}
function useApiMiddleWare(app) {
    app.use(express.json({ limit: '500mb' }));
    app.use(express.urlencoded({ extended: true, limit: '500mb' }));
    // const bodyParserDefault = bodyParser.json();
    // const bodyParserTicket = bodyParser.json({ limit: '500mb' });
    // app.use((req, res, next) => {
    //   if (req.originalUrl === '/api/v1/node/convert_base_64' || req.originalUrl === '/api/v1/ticket/create_ticket')
    //     return bodyParserTicket(req, res, next);
    //   return bodyParserDefault(req, res, next);
    // });
}
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
function _formatValidationError(err) {
    err;
    return {
        message: 'Validation Failed',
        details: err === null || err === void 0 ? void 0 : err.fields,
    };
}
// export function authorizeRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
//   let auth = req.headers.authorization;
//   if (auth) {
//     const token = auth.split(" ")[1];
//     const tokenIsValid = AuthentificationService.getInstance().tokenIsValid(token);
//     if (tokenIsValid) return next();
//   }
//   return res.status(HTTP_CODES.UNAUTHORIZED).send("invalid authorization");
// }
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
//# sourceMappingURL=server.js.map