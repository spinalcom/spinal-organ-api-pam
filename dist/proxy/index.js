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
const constant_1 = require("../constant");
const services_1 = require("../services");
const proxy = require("express-http-proxy");
const authentication_1 = require("../security/authentication");
const utils_1 = require("./utils");
function configureProxy(app, useV1 = false) {
    let apiData = { url: "", clientId: "", secretId: "" };
    const uri = !useV1 ? constant_1.BOS_BASE_URI_V2 : `(${constant_1.BOS_BASE_URI_V1}|${constant_1.BOS_BASE_URI_V1_2})`;
    app.all(`${uri}/:building_id/*`, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { building_id } = req.params;
            const tokenInfo = yield (0, authentication_1.expressAuthentication)(req, constant_1.SECURITY_NAME.simple);
            req["endpoint"] = (0, utils_1.formatUri)(req.url, uri);
            const building = yield services_1.BuildingService.getInstance().getBuildingById(building_id);
            if (!building)
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`No building found for ${building_id}`);
            if (((_a = tokenInfo.userInfo) === null || _a === void 0 ? void 0 : _a.type) != constant_1.USER_TYPES.ADMIN) {
                const isAppProfile = tokenInfo.profile.appProfileBosConfigId ? true : false;
                const profileId = tokenInfo.profile.appProfileBosConfigId || tokenInfo.profile.userProfileBosConfigId;
                const access = yield (0, utils_1.canAccess)(building_id, { method: req.method, route: req.endpoint }, profileId, isAppProfile);
                if (!access)
                    throw new Error(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            }
            apiData.url = building.info.apiUrl.get();
            next();
        }
        catch (error) {
            return res.status(constant_1.HTTP_CODES.UNAUTHORIZED).send(error.message);
        }
    }), proxy((req) => apiData.url, (0, utils_1.proxyOptions)(useV1)));
}
exports.default = configureProxy;
//# sourceMappingURL=index.js.map