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


// import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as fileUpload from 'express-fileupload';
import * as morgan from "morgan";
import * as path from "path";
import { HTTP_CODES, PAM_BASE_URI, routesToProxy } from "./constant";
import { AuthentificationService } from './services';
import AuthorizationService from './services/authorization.service';
var proxy = require('express-http-proxy');


// const path = require('path');


function useApiMiddleWare(app: express.Express) {

  app.use(cors({ origin: '*' }));
  app.use(fileUpload({ createParentPath: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // app.all(`${PAM_BASE_URI}*`, authorizeRequest);
}

function useHubProxy(app: express.Express) {
  const HUB_HOST = `http://${process.env.HUB_HOST}:${process.env.HUB_PORT}`;
  const proxyHub = proxy(HUB_HOST, {
    limit: '1tb',
    proxyReqPathResolver: function (req: any) { return req.originalUrl; }
  });

  for (const routeToProxy of routesToProxy) {
    app.use(routeToProxy, proxyHub);
  }
}

function useClientMiddleWare(app: express.Express) {
  const oneDay = 1000 * 60 * 60 * 24;
  const clientDir = path.resolve(__dirname, '../client/dist')
  app.use(express.static(clientDir));
  // app.use(cookieParser());
  // const options = {
  //   genid: (req) => uuidv4(),
  //   secret: "randomSessionStringmklsdkljvio156463187+qsfcsw",
  //   saveUninitialized: true,
  //   cookie: { maxAge: oneDay, secure: false },
  //   resave: false
  // }
  // if (app.get('env') === 'production') {
  //   app.set('trust proxy', 1) // trust first proxy
  //   options.cookie.secure = true // serve secure cookies
  // }
  // app.use(sessions(options))

  app.all(/^\/(?!api).*$/, function (req, res) {
    res.sendFile(path.resolve(clientDir, "index.html"));
  });
}

export default function initExpress() {
  // const absPath = '../../../.browser_organs'.split('/');
  // const root = path.join(__dirname, ...absPath);


  var app = express();
  // app.use(morgan('dev'));

  useHubProxy(app);
  useApiMiddleWare(app);
  useClientMiddleWare(app);

  const server_port = process.env.SERVER_PORT || 2022;
  const server = app.listen(server_port, () => console.log(`Example app listening on port ${server_port}!`));
  return { server, app }
}


export function authorizeRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
  let auth = req.headers.authorization;
  if (auth) {
    const token = auth.split(" ")[1];
    const tokenIsValid = AuthentificationService.getInstance().tokenIsValid(token);
    if (tokenIsValid) return next();
  }

  return res.status(HTTP_CODES.UNAUTHORIZED).send("invalid authorization");
}

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