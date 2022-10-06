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
exports._filterBosList = exports._filterPortofolioList = exports._filterApisList = exports._formatAuthorizationData = exports._formatProfileKeys = exports._getNodeListInfo = exports._formatBosAuthRes = exports._formatPortofolioAuthRes = exports._formatProfile = void 0;
function _formatProfile(data) {
    return Object.assign(Object.assign({}, data.node.info.get()), { authorizedportofolio: data.authorizedPortofolio.map(el => _formatPortofolioAuthRes(el)), authorizedRoutes: _getNodeListInfo(data.authorizedRoutes), authorizedBos: data.authorizedBos.map(el => _formatBosAuthRes(el)) });
}
exports._formatProfile = _formatProfile;
function _formatPortofolioAuthRes(data) {
    return Object.assign(Object.assign({}, data.portofolio.info.get()), { apps: _getNodeListInfo(data.apps) });
}
exports._formatPortofolioAuthRes = _formatPortofolioAuthRes;
function _formatBosAuthRes(data) {
    return Object.assign(Object.assign({}, data.building.info.get()), { apps: _getNodeListInfo(data.apps) });
}
exports._formatBosAuthRes = _formatBosAuthRes;
function _getNodeListInfo(nodes) {
    return nodes.map(el => el.info.get());
}
exports._getNodeListInfo = _getNodeListInfo;
function _formatProfileKeys(profile) {
    const res = {};
    for (const key in profile) {
        if (Object.prototype.hasOwnProperty.call(profile, key)) {
            const element = profile[key];
            res[key] = typeof element === "string" && element.trim()[0] === "[" ? JSON.parse(element.trim()) : element;
        }
    }
    return res;
}
exports._formatProfileKeys = _formatProfileKeys;
function _formatAuthorizationData(profileData) {
    return {
        authorizePortofolio: _unifyData(profileData.authorizePortofolio),
        unauthorizePortofolio: _unifyData(profileData.unauthorizePortofolio),
        authorizeApis: profileData.authorizeApis || [],
        unauthorizeApis: profileData.unauthorizeApis || [],
        authorizeBos: _unifyData(profileData.authorizeBos),
        unauthorizeBos: _unifyData(profileData.unauthorizeBos)
    };
}
exports._formatAuthorizationData = _formatAuthorizationData;
function _unifyData(auths) {
    if (!auths)
        return [];
    return auths.reduce((liste, item) => {
        let key = "portofolioId" in item ? "portofolioId" : "buildingId";
        let appIds = item.appsIds ? Array.isArray(item.appsIds) ? item.appsIds : [item.appsIds] : [];
        const found = liste.find(el => el[key] === item[key]);
        if (found)
            found.appIds.push(...appIds);
        else {
            item.appsIds = appIds;
            liste.push(item);
        }
        return liste;
    }, []);
}
function _filterApisList(authorizedIds = [], unauthorizedIds = []) {
    if (!unauthorizedIds.length)
        return authorizedIds;
    const unAuthObj = {};
    unauthorizedIds.map(id => unAuthObj[id] = id);
    return authorizedIds.filter(id => !unAuthObj[id]);
}
exports._filterApisList = _filterApisList;
function _filterPortofolioList(authorizedPortofolio = [], unauthorizedPortofolio = []) {
    const obj = {};
    unauthorizedPortofolio.map(({ portofolioId, appsIds }) => {
        obj[portofolioId] = appsIds;
        return;
    });
    return authorizedPortofolio.reduce((liste, item) => {
        const apps = obj[item.portofolioId];
        if (apps) {
            if (!item.appsIds)
                item.appsIds = [];
            item.appsIds = Array.isArray(item.appsIds) ? item.appsIds : [item.appsIds];
            item.appsIds = item.appsIds.filter(id => {
                return apps.find(el => el !== id);
            });
        }
        liste.push(item);
        return liste;
    }, []);
}
exports._filterPortofolioList = _filterPortofolioList;
function _filterBosList(authorizedBos = [], unauthorizedBos = []) {
    const obj = {};
    unauthorizedBos.map(({ buildingId, appsIds }) => {
        obj[buildingId] = appsIds;
        return;
    });
    return authorizedBos.reduce((liste, item) => {
        const apps = obj[item.buildingId];
        if (apps) {
            if (!item.appsIds)
                item.appsIds = [];
            item.appsIds = Array.isArray(item.appsIds) ? item.appsIds : [item.appsIds];
            item.appsIds = item.appsIds.filter(id => {
                return apps.find(el => el !== id);
            });
        }
        liste.push(item);
        return liste;
    }, []);
}
exports._filterBosList = _filterBosList;
//# sourceMappingURL=profileUtils.js.map