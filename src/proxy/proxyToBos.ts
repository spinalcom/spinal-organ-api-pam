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

// /*
//  * Copyright 2022 SpinalCom - www.spinalcom.com
//  * 
//  * This file is part of SpinalCore.
//  * 
//  * Please read all of the following terms and conditions
//  * of the Free Software license Agreement ("Agreement")
//  * carefully.
//  * 
//  * This Agreement is a legally binding contract between
//  * the Licensee (as defined below) and SpinalCom that
//  * sets forth the terms and conditions that govern your
//  * use of the Program. By installing and/or using the
//  * Program, you agree to abide by all the terms and
//  * conditions stated or referenced herein.
//  * 
//  * If you do not agree to abide by these terms and
//  * conditions, do not demonstrate your acceptance and do
//  * not install or use the Program.
//  * You should have received a copy of the license along
//  * with this file. If not, see
//  * <http://resources.spinalcom.com/licenses.pdf>.
//  */

// import { BOS_BASE_URI_V2, BOS_BASE_URI_V1, BOS_BASE_URI_V1_2, HTTP_CODES, SECURITY_NAME, USER_TYPES } from "../constant";
// import * as express from "express";
// import { BuildingService } from '../services'
// import * as proxy from "express-http-proxy";
// import { Utils } from "../utils/pam_v1_utils/utils";
// import { expressAuthentication } from "../security/authentication"
// import AuthorizationService from "../services/authorization.service";


// const apiServerEndpoint = "/api/v1/";

// interface IApiData { url: string; clientId: string; secretId: string }


// export default function configureProxy(app: express.Express, useV1: boolean = false) {

//     let apiData: IApiData = { url: "", clientId: "", secretId: "" };
//     const uri = !useV1 ? BOS_BASE_URI_V2 : `(${BOS_BASE_URI_V1}|${BOS_BASE_URI_V1_2})`;

//     app.all(`${uri}/:building_id/*`, async (req: express.Request, res: express.Response, next: express.NextFunction) => {

//         try {
//             const tokenInfo = await expressAuthentication(req, SECURITY_NAME.simple);

//             const base = req.url.replace(new RegExp(`^${uri}*/`), (el) => "");
//             let url = base.split("/").slice(1).join("/");

//             url = /^api\/v1/.test(url) ? ('/' + url) : (apiServerEndpoint + url);
//             const { building_id } = req.params;


//             (<any>req).endpoint = url;
//             const node = await BuildingService.getInstance().getBuildingById(building_id);
//             if (!node) return res.status(HTTP_CODES.NOT_FOUND).send(`No building found for ${building_id}`);

//             apiData.url = node.info.apiUrl.get();

//             if (tokenInfo.userInfo?.type == USER_TYPES.ADMIN) return next();

//             const userHasAccessToBuilding = AuthorizationService.getInstance().profileHasAccess()

//         } catch (error) {
//             return res.send(HTTP_CODES.UNAUTHORIZED).send(error.message);
//         }
//     }, proxy((req: express.Request) => apiData.url, {
//         memoizeHost: false,
//         proxyReqPathResolver: (req: express.Request) => {
//             return (<any>req).endpoint;
//         }, userResDecorator: (proxyRes, proxyResData) => {
//             return new Promise((resolve, reject) => {
//                 if (!useV1) return resolve(proxyResData);
//                 if (proxyRes.statusCode == HTTP_CODES.NOT_FOUND) return resolve(proxyResData);

//                 try {
//                     const response = JSON.parse(proxyResData.toString());
//                     const data = Utils.getReturnObj(null, response, get_method((<any>proxyRes).req.method));
//                     resolve(data);
//                 } catch (error) {
//                     resolve(proxyResData)
//                 }
//             });
//         }
//     }))
// }



// function get_method(method: string) {
//     switch (method) {
//         case "GET":
//             return "READ";
//         case "POST":
//             return "ADD";
//         case "DELETE":
//             return "DEL";
//     }
// }



// // export function configureProxyV1(app: express.Express) {
// //     let apiData: IApiData = { url: "", clientId: "", secretId: "" };
// //     app.all(`(${BOS_BASE_URI_V1}|${BOS_BASE_URI_V1_2})/:building_id/*`, async (req: express.Request, res: express.Response, next: express.NextFunction) => {

// //         const base = req.url.replace(new RegExp(`^(${BOS_BASE_URI_V1}|${BOS_BASE_URI_V1_2})*/`), (el) => "")
// //         let url = base.split("/").slice(1).join("/");

// //         url = /^api\/v1/.test(url) ? ('/' + url) : (apiServerEndpoint + url);
// //         const { building_id } = req.params;

// //         /////////////////////////////////////////////////// 
// //         //verifier que l'utilisateur à accès aux données //
// //         //////////////////////////////////////////////////

// //         (<any>req).endpoint = url;
// //         const node = await BuildingService.getInstance().getBuildingById(building_id);
// //         if (!node) return res.status(HTTP_CODES.NOT_FOUND).send(`No building found for ${building_id}`);

// //         // apiData = { url: "", clientId: "", secretId: "" };

// //         apiData.url = node.info.apiUrl.get();
// //         // apiData.clientId = node.info.clientId.get();
// //         // apiData.secretId = node.info.clientSecret.get();
// //         next();

// //     },
// //         proxy((req: express.Request) => getProxyHost(apiData), {
// //             memoizeHost: false,
// //             proxyReqPathResolver: (req: express.Request) => {
// //                 return (<any>req).endpoint;

// //                 // const base = req.baseUrl.replace(new RegExp(`^${BOS_BASE_URI}*/`), (el) => "");
// //                 // return "/" + base.split("/").slice(1).join("/")
// //             },
// //         }))
// // }


// // export function configureProxyV2(app: express.Express) {
// //     let apiData: IApiData = { url: "", clientId: "", secretId: "" };
// //     app.all(`${BOS_BASE_URI_V2}/:building_id/*`, async (req: express.Request, res: express.Response, next: express.NextFunction) => {

// //         const base = req.url.replace(new RegExp(`^${BOS_BASE_URI_V2}*/`), (el) => "")
// //         let url = base.split("/").slice(1).join("/");

// //         url = /^api\/v2/.test(url) ? ('/' + url) : (apiServerEndpoint + url);
// //         const { building_id } = req.params;

// //         /////////////////////////////////////////////////// 
// //         //verifier que l'utilisateur à accès aux données //
// //         //////////////////////////////////////////////////

// //         (<any>req).endpoint = url;
// //         const node = await BuildingService.getInstance().getBuildingById(building_id);
// //         if (!node) return res.status(HTTP_CODES.NOT_FOUND).send(`No building found for ${building_id}`);


// //         apiData.url = node.info.apiUrl.get();
// //         next();
// //     },
// //         proxy((req: express.Request) => getProxyHost(apiData), {
// //             memoizeHost: false,
// //             proxyReqPathResolver: (req: express.Request) => {
// //                 return (<any>req).endpoint;
// //             },
// //         }))
// // }


