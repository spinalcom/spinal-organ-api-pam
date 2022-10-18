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
// import * as fileUpload from 'express-fileupload';
import * as morgan from "morgan";
import * as path from "path";
import { HTTP_CODES, routesToProxy } from "./constant";
import configureBosProxy from "./proxyToBos";
import { AuthentificationService } from './services';
var proxy = require('express-http-proxy');
import * as swaggerUi from "swagger-ui-express";


// const path = require('path');


function useApiMiddleWare(app: express.Express) {

  app.use(cors({ origin: '*' }));
  // app.use(fileUpload({ createParentPath: true }));
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
  const root = path.resolve(__dirname, '..')
  app.use(express.static(root));


  // app.all(/^\/(?!api).*$/, function (req, res) {
  //   res.sendFile(path.resolve(root, "index.html"));
  // });

  app.get("/", (req, res) => {
    res.redirect("/docs");
  })
}

function initSwagger(app: express.Express) {
  app.use("/swagger.json", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./swagger/swagger.json"));
  })

  app.get('/logo.png', (req, res) => {
    res.sendFile('spinalcore.png', { root: path.resolve(__dirname, "./assets") });
  });

  app.use("/docs", swaggerUi.serve, async (req, res) => {
    return res.send(
      swaggerUi.generateHTML(await import("./swagger/swagger.json"))
      // swaggerUi.setup(undefined, {
      //   swaggerOptions: { url: "/swagger.json" },
      //   customSiteTitle: "PAM APIs",
      //   customCss: '.topbar-wrapper img {content: url(/logo.png);} .swagger-ui .topbar {background: #dbdbdb;}'
      // })
    )

  }

  );
}

export default function initExpress() {
  // const absPath = '../../../.browser_organs'.split('/');
  // const root = path.join(__dirname, ...absPath);


  var app = express();
  app.use(morgan('dev'));

  configureBosProxy(app);
  configureBosProxy(app, true);

  useHubProxy(app);
  useApiMiddleWare(app);
  useClientMiddleWare(app);
  initSwagger(app);

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