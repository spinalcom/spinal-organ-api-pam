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
exports.profileHasAccessToBuilding = exports.proxyOptions = exports.canAccess = exports.formatUri = exports.getProfileBuildings = void 0;
const constant_1 = require("../../constant");
const services_1 = require("../../services");
const utils_1 = require("../../utils/pam_v1_utils/utils");
const correspondance_1 = require("./correspondance");
const apiServerEndpoint = "/api/v1/";
function getProfileBuildings(profileId, isApp) {
    return __awaiter(this, void 0, void 0, function* () {
        const instance = isApp ? services_1.AppProfileService.getInstance() : services_1.UserProfileService.getInstance();
        const buildings = yield instance.getAllAuthorizedBos(profileId);
        return buildings.map(el => el.info.get());
    });
}
exports.getProfileBuildings = getProfileBuildings;
function formatUri(argUrl, uri) {
    const base = argUrl.replace(new RegExp(`^${uri}*/`), (el) => "");
    let url = base.split("/").slice(1).join("/");
    let query = "";
    if (url.includes("?")) {
        query = url.slice(url.indexOf("?"));
        url = url.substring(0, url.indexOf('?'));
    }
    const correspondance = _getCorrespondance(url);
    return (/^api\/v1/.test(correspondance) ? ('/' + correspondance) : (apiServerEndpoint + correspondance)) + query;
}
exports.formatUri = formatUri;
function canAccess(buildingId, api, profileId, isAppProfile) {
    return __awaiter(this, void 0, void 0, function* () {
        const buildingAccess = yield profileHasAccessToBuilding(profileId, buildingId, isAppProfile);
        if (!buildingAccess)
            return false;
        if (api.route.includes("?"))
            api.route = api.route.substring(0, api.route.indexOf('?'));
        const routeFound = _hasAccessToApiRoute(buildingAccess, api);
        if (!routeFound)
            return false;
        return true;
    });
}
exports.canAccess = canAccess;
const proxyOptions = (useV1) => {
    return {
        memoizeHost: false,
        proxyReqPathResolver: (req) => req["endpoint"],
        limit: '500mb',
        userResDecorator: (proxyRes, proxyResData) => {
            return new Promise((resolve, reject) => {
                if (!useV1)
                    return resolve(proxyResData);
                if (proxyRes.statusCode == constant_1.HTTP_CODES.NOT_FOUND)
                    return resolve(proxyResData);
                try {
                    const response = JSON.parse(proxyResData.toString());
                    const data = utils_1.Utils.getReturnObj(null, response, _get_method(proxyRes.req.method));
                    resolve(data);
                }
                catch (error) {
                    resolve(proxyResData);
                }
            });
        }
    };
};
exports.proxyOptions = proxyOptions;
function profileHasAccessToBuilding(profileId, buildingId, isAppProfile) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = isAppProfile ? yield services_1.AppProfileService.getInstance().getAppProfile(profileId) : yield services_1.UserProfileService.getInstance().getUserProfile(profileId);
        return _hasAccessToBuilding(profile, buildingId);
    });
}
exports.profileHasAccessToBuilding = profileHasAccessToBuilding;
///////////////////////////////////
//            PRIVATES           //
///////////////////////////////////
function _getCorrespondance(url) {
    const found = Object.keys(correspondance_1.correspondanceObj).find(el => {
        const t = el.replace(/\{(.*?)\}/g, (el) => '(.*?)');
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
    return building.apis.find(node => {
        const route = node.info.get();
        if (apiRoute.method.toUpperCase() !== route.method.toUpperCase())
            return false;
        const routeFormatted = route.name.replace(/\{(.*?)\}/g, (el) => '(.*?)');
        const regex = new RegExp(`^${routeFormatted}$`);
        return apiRoute.route.match(regex);
    });
}
function _get_method(method) {
    switch (method) {
        case "GET":
            return "READ";
        case "POST":
            return "ADD";
        case "DELETE":
            return "DEL";
    }
}
//# sourceMappingURL=utils.js.map