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
const authentication_1 = require("../../security/authentication");
const utils_1 = require("./utils");
const utils_2 = require("../../utils/pam_v1_utils/utils");
function configureProxy(app, useV1 = false) {
    let apiData = { url: "", clientId: "", secretId: "" };
    const uri = !useV1 ? constant_1.BOS_BASE_URI_V2 : `(${constant_1.BOS_BASE_URI_V1}|${constant_1.BOS_BASE_URI_V1_2})`;
    app.all(`${uri}/:building_id/*`, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { building_id } = req.params;
            req["endpoint"] = (0, utils_1.formatUri)(req.url, uri);
            const building = yield services_1.BuildingService.getInstance().getBuildingById(building_id);
            if (!building)
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`No building found for ${building_id}`);
            apiData.url = building.info.apiUrl.get();
            if (/\BIM\/file/.test(req.endpoint)) {
                req["endpoint"] = req.endpoint.replace("/api/v1", "");
                return next();
            }
            const tokenInfo = yield (0, authentication_1.checkAndGetTokenInfo)(req);
            // const building = await BuildingService.getInstance().getBuildingById(building_id);
            // if (!building) return res.status(HTTP_CODES.NOT_FOUND).send(`No building found for ${building_id}`);
            if (((_a = tokenInfo.userInfo) === null || _a === void 0 ? void 0 : _a.type) != constant_1.USER_TYPES.ADMIN) {
                const isAppProfile = tokenInfo.profile.appProfileBosConfigId ? true : false;
                const profileId = tokenInfo.profile.appProfileBosConfigId || tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId;
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
    buildingListMiddleware(app);
}
exports.default = configureProxy;
function buildingListMiddleware(app, useV1 = false) {
    if (useV1) {
        app.get("/v1/building_list", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenInfo = yield (0, authentication_1.checkAndGetTokenInfo)(req);
                let isApp;
                let profileId;
                if (tokenInfo.profile.appProfileBosConfigId) {
                    isApp = true;
                    profileId = tokenInfo.profile.appProfileBosConfigId;
                }
                else if (tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId) {
                    isApp = false;
                    profileId = tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId;
                }
                const buildings = yield (0, utils_1.getProfileBuildings)(profileId, isApp);
                const data = utils_2.Utils.getReturnObj(null, buildings, "READ");
                return res.send(data);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.UNAUTHORIZED).send(error.message);
            }
        }));
        app.post("/v1/oauth/token", (req, res) => {
            res.redirect(307, `${constant_1.PAM_BASE_URI}/auth`);
        });
    }
}
//# sourceMappingURL=index.js.map