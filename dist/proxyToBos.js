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
const constant_1 = require("./constant");
const services_1 = require("./services");
const proxy = require("express-http-proxy");
const utils_1 = require("./utils/pam_v1_utils/utils");
const apiServerEndpoint = "/api/v1/";
function configureProxy(app, useV1 = false) {
    let apiData = { url: "", clientId: "", secretId: "" };
    const uri = !useV1 ? constant_1.BOS_BASE_URI_V2 : `(${constant_1.BOS_BASE_URI_V1}|${constant_1.BOS_BASE_URI_V1_2})`;
    app.all(`${uri}/:building_id/*`, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const base = req.url.replace(new RegExp(`^${uri}*/`), (el) => "");
        let url = base.split("/").slice(1).join("/");
        url = /^api\/v1/.test(url) ? ('/' + url) : (apiServerEndpoint + url);
        const { building_id } = req.params;
        /////////////////////////////////////////////////// 
        //verifier que l'utilisateur à accès aux données //
        //////////////////////////////////////////////////
        req.endpoint = url;
        const node = yield services_1.BuildingService.getInstance().getBuildingById(building_id);
        if (!node)
            return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`No building found for ${building_id}`);
        // apiData = { url: "", clientId: "", secretId: "" };
        apiData.url = node.info.apiUrl.get();
        // apiData.clientId = node.info.clientId.get();
        // apiData.secretId = node.info.clientSecret.get();
        next();
    }), proxy((req) => getProxyHost(apiData), {
        memoizeHost: false,
        proxyReqPathResolver: (req) => {
            return req.endpoint;
        },
        userResDecorator: (proxyRes, proxyResData) => {
            return new Promise((resolve, reject) => {
                if (!useV1)
                    return resolve(proxyResData);
                if (proxyRes.statusCode == constant_1.HTTP_CODES.NOT_FOUND)
                    return resolve(proxyResData);
                try {
                    const response = JSON.parse(proxyResData.toString());
                    const data = utils_1.Utils.getReturnObj(null, response, get_method(proxyRes.req.method));
                    resolve(data);
                }
                catch (error) {
                    console.error(error);
                    resolve(proxyResData);
                }
            });
        }
    }));
}
exports.default = configureProxy;
function getProxyHost(apiData) {
    return apiData.url;
}
function get_method(method) {
    switch (method) {
        case "GET":
            return "READ";
        case "POST":
            return "ADD";
        case "DELETE":
            return "DEL";
    }
}
// export function configureProxyV1(app: express.Express) {
//     let apiData: IApiData = { url: "", clientId: "", secretId: "" };
//     app.all(`(${BOS_BASE_URI_V1}|${BOS_BASE_URI_V1_2})/:building_id/*`, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//         const base = req.url.replace(new RegExp(`^(${BOS_BASE_URI_V1}|${BOS_BASE_URI_V1_2})*/`), (el) => "")
//         let url = base.split("/").slice(1).join("/");
//         url = /^api\/v1/.test(url) ? ('/' + url) : (apiServerEndpoint + url);
//         const { building_id } = req.params;
//         /////////////////////////////////////////////////// 
//         //verifier que l'utilisateur à accès aux données //
//         //////////////////////////////////////////////////
//         (<any>req).endpoint = url;
//         const node = await BuildingService.getInstance().getBuildingById(building_id);
//         if (!node) return res.status(HTTP_CODES.NOT_FOUND).send(`No building found for ${building_id}`);
//         // apiData = { url: "", clientId: "", secretId: "" };
//         apiData.url = node.info.apiUrl.get();
//         // apiData.clientId = node.info.clientId.get();
//         // apiData.secretId = node.info.clientSecret.get();
//         next();
//     },
//         proxy((req: express.Request) => getProxyHost(apiData), {
//             memoizeHost: false,
//             proxyReqPathResolver: (req: express.Request) => {
//                 return (<any>req).endpoint;
//                 // const base = req.baseUrl.replace(new RegExp(`^${BOS_BASE_URI}*/`), (el) => "");
//                 // return "/" + base.split("/").slice(1).join("/")
//             },
//         }))
// }
// export function configureProxyV2(app: express.Express) {
//     let apiData: IApiData = { url: "", clientId: "", secretId: "" };
//     app.all(`${BOS_BASE_URI_V2}/:building_id/*`, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//         const base = req.url.replace(new RegExp(`^${BOS_BASE_URI_V2}*/`), (el) => "")
//         let url = base.split("/").slice(1).join("/");
//         url = /^api\/v2/.test(url) ? ('/' + url) : (apiServerEndpoint + url);
//         const { building_id } = req.params;
//         /////////////////////////////////////////////////// 
//         //verifier que l'utilisateur à accès aux données //
//         //////////////////////////////////////////////////
//         (<any>req).endpoint = url;
//         const node = await BuildingService.getInstance().getBuildingById(building_id);
//         if (!node) return res.status(HTTP_CODES.NOT_FOUND).send(`No building found for ${building_id}`);
//         apiData.url = node.info.apiUrl.get();
//         next();
//     },
//         proxy((req: express.Request) => getProxyHost(apiData), {
//             memoizeHost: false,
//             proxyReqPathResolver: (req: express.Request) => {
//                 return (<any>req).endpoint;
//             },
//         }))
// }
//# sourceMappingURL=proxyToBos.js.map