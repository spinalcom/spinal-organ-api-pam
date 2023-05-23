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

import * as cors from 'cors';
import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
import * as bodyParser from 'body-parser';

import {HTTP_CODES, routesToProxy} from './constant';
import configureBosProxy from './proxy/bos';
var proxy = require('express-http-proxy');
import * as swaggerUi from 'swagger-ui-express';
import {ValidateError} from 'tsoa';
import {RegisterRoutes} from './routes';
import {AuthError} from './security/AuthError';
import {WebSocketServer} from './proxy/websocket';
import {WebsocketLogsService} from './services/webSocketLogs.service';
// import { webSocketProxy } from './proxy/websocketProxy';

export default async function initExpress(conn: spinal.FileSystem) {
  var app = express();
  app.use(morgan('dev'));

  useApiMiddleWare(app);
  configureBosProxy(app);
  configureBosProxy(app, true);
  useHubProxy(app);
  useClientMiddleWare(app);
  initSwagger(app);

  RegisterRoutes(app);

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
  const server = app.listen(server_port, () =>
    console.log(`api server listening on port ${server_port}!`)
  );
  await WebsocketLogsService.getInstance().init(conn);
  const ws = new WebSocketServer(server);

  await ws.init();
  // const wsProxy = webSocketProxy(app)

  // server.on("upgrade", (req: any, socket: any, head) => {
  //   wsProxy.upgrade(req, socket, head)
  // });
  return {server, app};
}

/////////////////////////////////////
//          Middleware             //
/////////////////////////////////////

function useHubProxy(app: express.Express) {
  const HUB_HOST = `${process.env.HUB_PROTOCOL}://${process.env.HUB_HOST}:${process.env.HUB_PORT}`;
  const proxyHub = proxy(HUB_HOST, {
    limit: '1tb',
    proxyReqPathResolver: function (req: any) {
      return req.originalUrl;
    },
  });

  for (const routeToProxy of routesToProxy) {
    app.use(routeToProxy, proxyHub);
  }
}

function useClientMiddleWare(app: express.Express) {
  const oneDay = 1000 * 60 * 60 * 24;
  const root = path.resolve(__dirname, '..');
  app.use(express.static(root));

  app.get('/', (req, res) => {
    res.redirect('/docs');
  });
}

function initSwagger(app: express.Express) {
  app.use('/swagger.json', (req, res) => {
    res.sendFile(path.resolve(__dirname, './swagger/swagger.json'));
  });

  app.get('/logo.png', (req, res) => {
    res.sendFile('spinalcore.png', {root: path.resolve(__dirname, './assets')});
  });

  app.use('/docs', swaggerUi.serve, async (req, res) => {
    return res.send(
      swaggerUi.generateHTML(await import('./swagger/swagger.json'))
    );
  });
}

function useApiMiddleWare(app: express.Express) {
  app.use(cors({origin: '*'}));
  app.use(express.json({limit: '500mb'}));
  app.use(express.urlencoded({extended: true, limit: '500mb'}));

  // const bodyParserDefault = bodyParser.json();
  // const bodyParserTicket = bodyParser.json({ limit: '500mb' });

  // app.use((req, res, next) => {
  //   if (req.originalUrl === '/api/v1/node/convert_base_64' || req.originalUrl === '/api/v1/ticket/create_ticket')
  //     return bodyParserTicket(req, res, next);
  //   return bodyParserDefault(req, res, next);
  // });
}

function errorHandler(
  err: unknown,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.Response | void {
  if (err instanceof ValidateError) {
    return res.status(HTTP_CODES.BAD_REQUEST).send(_formatValidationError(err));
  }

  if (err instanceof AuthError) {
    return res.status(HTTP_CODES.UNAUTHORIZED).send({message: err.message});
  }

  if (err instanceof Error) {
    return res.status(HTTP_CODES.INTERNAL_ERROR).json({
      message: 'Internal Server Error',
    });
  }

  next();
}

function _formatValidationError(err: ValidateError) {
  err;
  return {
    message: 'Validation Failed',
    details: err?.fields,
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
