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
const AuthError_1 = require("../../security/AuthError");
const api_exception_1 = require("../../utils/pam_v1_utils/api_exception");
const bodyParser = require("body-parser");
const atob = require("atob");
function configureProxy(app, useV1 = false) {
    let apiData = { url: "", clientId: "", secretId: "" };
    const uri = !useV1 ? constant_1.BOS_BASE_URI_V2 : `(${constant_1.BOS_BASE_URI_V1}|${constant_1.BOS_BASE_URI_V1_2})`;
    app.all(`(${uri}/:building_id/*|${uri}/:building_id)`, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { building_id } = req.params;
            req["endpoint"] = (0, utils_1.formatUri)(req.url, uri);
            //////////////////////////////////////////////
            //   Check if user has access to building
            //////////////////////////////////////////////
            const building = yield services_1.BuildingService.getInstance().getBuildingById(building_id);
            if (!building)
                return new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            apiData.url = building.info.apiUrl.get();
            //////////////////////////////////////////////
            //   Condition to skip .svf file downloading
            //////////////////////////////////////////////
            if ((0, utils_1.tryToDownloadSvf)(req))
                return next();
            const tokenInfo = yield (0, authentication_1.checkAndGetTokenInfo)(req);
            // if (tokenInfo.userInfo?.type != USER_TYPES.ADMIN) {
            const isAppProfile = tokenInfo.profile.appProfileBosConfigId ? true : false;
            const profileId = tokenInfo.profile.appProfileBosConfigId || tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId;
            const access = yield (0, utils_1.canAccess)(building_id, { method: req.method, route: req.endpoint }, profileId, isAppProfile);
            if (!access)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            // }
            //////////////////////////////////////////////
            //   Condition to check
            //////////////////////////////////////////////
            const reqWithOutApi = req.endpoint.replace("/api/v1", "");
            if (reqWithOutApi === "/" || reqWithOutApi.length == 0) {
                let data = building.info.get();
                if (useV1)
                    data = utils_2.Utils.getReturnObj(null, (0, utils_1._formatBuildingRes)(data), req.method, "READ");
                return res.status(constant_1.HTTP_CODES.OK).send(data);
            }
            // apiData.url = building.info.apiUrl.get();
            next();
        }
        catch (error) {
            if (useV1) {
                const apiExc = new api_exception_1.APIException(error.code || constant_1.HTTP_CODES.UNAUTHORIZED, error.message);
                const err = utils_2.Utils.getErrObj(apiExc, "");
                return res.status(err.code).send(err.msg);
            }
            return res.status(constant_1.HTTP_CODES.UNAUTHORIZED).send(error.message);
        }
    }), proxy((req) => apiData.url, (0, utils_1.proxyOptions)(useV1)));
    buildingListMiddleware(app, useV1);
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
                return res.status(constant_1.HTTP_CODES.UNAUTHORIZED).send({
                    statusCode: constant_1.HTTP_CODES.UNAUTHORIZED,
                    status: constant_1.HTTP_CODES.UNAUTHORIZED,
                    code: constant_1.HTTP_CODES.UNAUTHORIZED,
                    message: error.message,
                });
            }
        }));
        app.get("/v1/building/:building_id", (req, res) => {
            const { building_id } = req.params;
        });
        app.post("/v1/oauth/token", bodyParser.json(), bodyParser.urlencoded({ extended: true }), (req, res) => __awaiter(this, void 0, void 0, function* () {
            // res.redirect(307, `${PAM_BASE_URI}/auth`)
            try {
                let credential = req.body;
                if (Object.keys(credential).length <= 0)
                    credential = formatViaHeader(req);
                if (!credential || Object.keys(credential).length <= 0)
                    throw { code: constant_1.HTTP_CODES.BAD_REQUEST, message: "Bad request", description: "Bad request, please check your request" };
                const { code, data } = yield services_1.AuthentificationService.getInstance().authenticate(credential);
                return res.status(code).send(formatResponse(data, credential));
            }
            catch (error) {
                res.status(error.code || constant_1.HTTP_CODES.UNAUTHORIZED).send({
                    code: error.code || constant_1.HTTP_CODES.UNAUTHORIZED,
                    message: error.code || "Invalid  client_id or client_secret",
                    description: error.description || "Invalid credential",
                });
            }
            // {
            //     "client": {
            //         "grants": [
            //         "authorization_code",
            //         "password",
            //         "refresh_token",
            //         "client_credentials"
            //         ],
            //         "_id": "6045f0456ca4c532c16eecc9",
            //         "name": "Mon Building",
            //         "scope": "read-write",
            //         "redirect_uri": "",
            //         "User": "5f7dbd62c2b33acaa6941a0b",
            //         "client_secret": "jsVsl4KLnzGYPcHWrSFo8TbmoL1ERs",
            //         "client_id": "tpqHG6ycrY",
            //         "created_at": "2021-03-08T09:37:09.072Z",
            //         "updated_at": "2021-03-08T09:37:09.072Z",
            //         "__v": 0
            //     },
            //     "user": "5f7dbd62c2b33acaa6941a0b",
            //     "access_token": "48ed6c62a3f0d060fbb36795d728653d7967c5b3",
            //     "accessToken": "48ed6c62a3f0d060fbb36795d728653d7967c5b3",
            //     "accessTokenExpiresAt": "2023-09-26T18:51:04.384Z",
            //     "scope": "read-write"
            // }
        }));
    }
}
function formatResponse(data, credential) {
    return {
        client: {
            grants: ["authorization_code", "password", "refresh_token", "client_credentials"],
            _id: data.applicationId,
            name: data.name,
            scope: "read-write",
            redirect_uri: "",
            User: data.applicationId,
            client_secret: credential.client_secret,
            client_id: credential.client_id,
            created_at: new Date(data.createdToken * 1000).toISOString(),
            updated_at: new Date(data.createdToken * 1000).toISOString(),
            __v: 0,
        },
        user: data.applicationId,
        access_token: data.token,
        accessToken: data.token,
        accessTokenExpiresAt: new Date(data.expieredToken * 1000).toISOString(),
        scope: "read-write",
    };
}
function formatViaHeader(req) {
    var _a;
    const auth = req.headers.authorization || "";
    const [, authCode] = auth.split(" ");
    if (!authCode)
        return;
    const [clientId, clientSecret] = (_a = atob(authCode)) === null || _a === void 0 ? void 0 : _a.split(":");
    return { clientId, clientSecret };
}
//# sourceMappingURL=index.js.map