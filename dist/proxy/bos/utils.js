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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileIdInTokenInfo = exports._get_method = exports.profileHasAccessToApi = exports.profileHasAccessToBuilding = exports.proxyOptions = exports.tryToAccessBuildingInfo = exports.canAccess = exports.formatUri = exports.getUserProfileBuildings = exports.getAppProfileBuildings = exports.getBuildingsAuthorizedToProfile = exports._formatBuildingResponse = exports.isTryingToDownloadSvf = void 0;
const constant_1 = require("../../constant");
const services_1 = require("../../services");
const utils_1 = require("../../utils/pam_v1_utils/utils");
const correspondance_1 = require("./correspondance");
const api_exception_1 = require("../../utils/pam_v1_utils/api_exception");
const authorization_service_1 = require("../../services/authorization.service");
const apiServerEndpoint = "/api/v1/";
function isTryingToDownloadSvf(req) {
    if (/\BIM\/file/.test(req.endpoint)) {
        req["endpoint"] = req.endpoint.replace("/api/v1", "");
        return true;
    }
    return false;
}
exports.isTryingToDownloadSvf = isTryingToDownloadSvf;
function _formatBuildingResponse(building) {
    return {
        name: building.name,
        _id: building.id,
        id: building.id,
        address: building.address,
        description: building.description,
        urlBos: building.bosUrl,
        type: building.type,
        localisation: building.location,
    };
}
exports._formatBuildingResponse = _formatBuildingResponse;
async function getBuildingsAuthorizedToProfile(tokenInfo) {
    if (services_1.TokenService.getInstance().isAppToken(tokenInfo))
        return getAppProfileBuildings(tokenInfo);
    return getUserProfileBuildings(tokenInfo);
}
exports.getBuildingsAuthorizedToProfile = getBuildingsAuthorizedToProfile;
async function getAppProfileBuildings(tokenInfo) {
    const instance = services_1.AppProfileService.getInstance();
    const profileId = tokenInfo.profile.appProfileBosConfigId;
    const buildings = await instance.getAllAuthorizedBos(profileId);
    return buildings.map((el) => el.info.get());
}
exports.getAppProfileBuildings = getAppProfileBuildings;
async function getUserProfileBuildings(tokenInfo) {
    const instance = services_1.UserProfileService.getInstance();
    const profileId = tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId;
    const buildings = await instance.getAllAuthorizedBos(profileId);
    return buildings.map((el) => el.info.get());
}
exports.getUserProfileBuildings = getUserProfileBuildings;
function formatUri(argUrl, uri) {
    const base = argUrl.replace(new RegExp(`^${uri}*/`), (el) => ""); // Remove the base URI from the start of the URL
    let url = base.split("/").slice(1).join("/"); // Remove the first segment of the URL, which is the building ID
    let query = "";
    // If the URL contains a query string, separate it from the path
    if (url.includes("?")) {
        query = url.slice(url.indexOf("?"));
        url = url.substring(0, url.indexOf("?"));
    }
    const correspondance = _getCorrespondance(url); // Get the corresponding path from the correspondance object
    // Reconstruct the URL with the base path and query string if it exists
    return (/^api\/v1/.test(correspondance) ? "/" + correspondance : apiServerEndpoint + correspondance) + query;
}
exports.formatUri = formatUri;
async function canAccess(buildingId, api, profileId, isAppProfile) {
    const buildingAccess = await profileHasAccessToBuilding(profileId, buildingId, isAppProfile);
    if (!buildingAccess)
        return false;
    if (!isAppProfile || tryToAccessBuildingInfo(api))
        return true;
    const apiNode = await services_1.APIService.getInstance().getApiRouteByRoute(api, constant_1.BUILDING_API_GROUP_NAME);
    if (!apiNode)
        return false;
    const buildingHasApi = await services_1.BuildingService.getInstance().buildingHasApi(buildingId, apiNode.getId().get());
    if (!buildingHasApi)
        return false;
    const access = await profileHasAccessToApi(profileId, apiNode.getId().get(), isAppProfile);
    return Boolean(access);
    // const buildingAccess = await profileHasAccessToBuilding(profileId, buildingId, isAppProfile);
    // if (!buildingAccess) return false;
    // if (!isAppProfile || tryToAccessBuildingInfo(api)) return true;
    // if (!apiNode) return false;
    // const hasApi = await BuildingService.getInstance().buildingHasApi(buildingId, apiNode.getId().get());
    // if (!hasApi) return false;
    // const apiAccess = profileHasAccessToApi(profileId, apiNode.getId().get(), isAppProfile);
    // const routeFound = _hasAccessToApiRoute(buildingAccess, api);
    // if (!routeFound) return false;
    // return true;
}
exports.canAccess = canAccess;
function tryToAccessBuildingInfo(api) {
    if (api.method.toUpperCase() !== "GET")
        return false;
    const reqWithOutApi = api.route.replace("/api/v1", "");
    return reqWithOutApi === "/" || reqWithOutApi.length == 0;
}
exports.tryToAccessBuildingInfo = tryToAccessBuildingInfo;
const proxyOptions = (useV1) => {
    return {
        memoizeHost: false,
        proxyReqPathResolver: (req) => {
            return req["endpoint"];
        },
        limit: "500gb",
        userResDecorator: (proxyRes, proxyResData) => {
            return new Promise((resolve, reject) => {
                if (!useV1)
                    return resolve(proxyResData);
                try {
                    if (proxyRes.statusCode >= 400 && proxyRes.statusCode <= 599) {
                        throw new api_exception_1.APIException(proxyRes.statusCode, proxyResData.toString());
                    }
                    const response = JSON.parse(proxyResData.toString());
                    const data = utils_1.Utils.getReturnObj(null, response, _get_method(proxyRes.req.method, proxyRes.statusCode));
                    resolve(data);
                }
                catch (error) {
                    const oErr = utils_1.Utils.getErrObj(error, "");
                    oErr.msg.datas = { ko: {} };
                    resolve(oErr.msg);
                    // resolve(proxyResData)
                }
            });
        },
    };
};
exports.proxyOptions = proxyOptions;
async function profileHasAccessToBuilding(profileId, buildingId, isAppProfile) {
    const instance = isAppProfile ? services_1.AppProfileService.getInstance() : services_1.UserProfileService.getInstance();
    const profile = await instance.getProfileNode(profileId);
    // return _hasAccessToBuilding(profile, buildingId);
    return authorization_service_1.default.getInstance().profileHasAccessToNode(profile, buildingId);
}
exports.profileHasAccessToBuilding = profileHasAccessToBuilding;
async function profileHasAccessToApi(profileId, buildingId, isAppProfile) {
    const instance = isAppProfile ? services_1.AppProfileService.getInstance() : services_1.UserProfileService.getInstance();
    const profile = await instance.getProfileNode(profileId);
    // return _hasAccessToBuilding(profile, buildingId);
    return authorization_service_1.default.getInstance().profileHasAccessToNode(profile, buildingId);
}
exports.profileHasAccessToApi = profileHasAccessToApi;
///////////////////////////////////
//            PRIVATES           //
///////////////////////////////////
function _getCorrespondance(url) {
    const found = Object.keys(correspondance_1.correspondanceObj).find((el) => {
        const t = el.replace(/\{(.*?)\}/g, (el) => "(.*?)");
        const regex = new RegExp(`^${t}$`);
        return url.match(regex);
    });
    if (found) {
        const urls = url.split("/");
        const list = correspondance_1.correspondanceObj[found].split("/");
        let final = "";
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            let item = "";
            if (element.includes("{") && element.includes("}"))
                item = urls[index];
            else
                item = list[index];
            final += index === 0 ? item : "/" + item;
        }
        return final;
    }
    return url;
}
function _hasAccessToBuilding(profile, buildingId) {
    for (const { buildings } of profile.authorized) {
        const found = buildings.find(({ building }) => building.getId().get() === buildingId);
        if (found)
            return found;
    }
    return;
}
function _hasAccessToApiRoute(building, apiRoute) {
    return building.apis.find((node) => {
        const route = node.info.get();
        if (apiRoute.method.toUpperCase() !== route.method.toUpperCase())
            return false;
        const routeFormatted = route.name.replace(/\{(.*?)\}/g, (el) => "(.*?)");
        const regex = new RegExp(`^${routeFormatted}$`);
        return apiRoute.route.match(regex);
    });
}
function _get_method(method, statusCode) {
    switch (method) {
        case "POST":
            if (statusCode === constant_1.HTTP_CODES.CREATED)
                return "ADD";
            return "READ";
        case "DELETE":
            return "DEL";
        default:
            if (statusCode >= 400 && statusCode <= 599)
                return "ERROR";
            return "READ";
    }
}
exports._get_method = _get_method;
function getProfileIdInTokenInfo(tokenInfo) {
    if (services_1.TokenService.getInstance().isAppToken(tokenInfo))
        return tokenInfo.profile.appProfileBosConfigId;
    if (services_1.TokenService.getInstance().isUserToken(tokenInfo))
        return tokenInfo.profile.userProfileBosConfigId;
    return tokenInfo.profile.profileId;
}
exports.getProfileIdInTokenInfo = getProfileIdInTokenInfo;
//# sourceMappingURL=utils.js.map