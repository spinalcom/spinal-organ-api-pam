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
const constant_1 = require("../../constant");
const services_1 = require("../../services");
const proxy = require("express-http-proxy");
function redirectRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        let apiData = { url: "", clientId: "", secretId: "" };
        app.use(`${constant_1.BOS_BASE_URI}/:building_id/*`, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { building_id } = req.params;
            const node = yield services_1.BuildingService.getInstance().getBuilding(building_id);
            if (!node)
                return res.status(404).send(`No building found for ${building_id}`);
            apiData = { url: "", clientId: "", secretId: "" };
            apiData.url = node.info.apiUrl.get();
            apiData.clientId = node.info.clientId.get();
            apiData.secretId = node.info.clientSecret.get();
            next();
        }), proxy((req) => getProxyHost(apiData), {
            memoizeHost: false,
            proxyReqPathResolver: (req) => {
                const base = req.baseUrl.replace(new RegExp(`^${constant_1.BOS_BASE_URI}*/`), (el) => "");
                return "/" + base.split("/").slice(1).join("/");
            },
        }));
    });
}
exports.default = redirectRoutes;
function getProxyHost(apiData) {
    return apiData.url;
}
//# sourceMappingURL=index.js.map