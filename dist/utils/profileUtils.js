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
exports._getProfileNodeGraph = exports._renameProfile = exports._getProfileNode = exports._createProfileNode = exports._findChildInContext = exports.formatAndMergePortofolioAuthorization = exports.formatAndMergeBosAuthorization = exports._formatProfileKeys = exports._getNodeListInfo = exports._formatBosAuthRes = exports._formatPortofolioAuthRes = exports._formatProfile = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
function _formatProfile(data) {
    return {
        ...data.node.info.get(),
        authorized: data.authorized.map(el => _formatPortofolioAuthRes(el))
    };
}
exports._formatProfile = _formatProfile;
function _formatPortofolioAuthRes(data) {
    return {
        ...data.portofolio.info.get(),
        apps: _getNodeListInfo(data.apps),
        apis: _getNodeListInfo(data.apis),
        buildings: data.buildings.map(el => _formatBosAuthRes(el))
    };
}
exports._formatPortofolioAuthRes = _formatPortofolioAuthRes;
function _formatBosAuthRes(data) {
    return {
        ...data.building.info.get(),
        apps: _getNodeListInfo(data.apps),
        apis: _getNodeListInfo(data.apis)
    };
}
exports._formatBosAuthRes = _formatBosAuthRes;
function _getNodeListInfo(nodes = []) {
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
function formatAndMergeBosAuthorization(itemsToAuthorize) {
    const buildingValids = itemsToAuthorize.filter(item => authorizationItemIsValid(item));
    return mergeBosAuth(buildingValids);
}
exports.formatAndMergeBosAuthorization = formatAndMergeBosAuthorization;
function formatAndMergePortofolioAuthorization(itemsToAuthorize) {
    itemsToAuthorize = removeEmptyBuildings(itemsToAuthorize);
    itemsToAuthorize = removeInvalidPortofolio(itemsToAuthorize);
    return mergePortofolioAuth(itemsToAuthorize);
    // return profileData.authorize.reduce((liste, item: IPortofolioAuth) => {
    //     const index = obj[item.portofolioId];
    //     if (typeof index !== "undefined") {
    //         const copy = _unifyData(liste[index - 1], item);
    //         liste[index - 1] = copy
    //     } else {
    //         obj[item.portofolioId] = liste.push(item);
    //     }
    //     return liste;
    // }, [])
}
exports.formatAndMergePortofolioAuthorization = formatAndMergePortofolioAuthorization;
async function _findChildInContext(startNode, nodeIdOrName, context) {
    const children = await startNode.getChildrenInContext(context);
    return children.find(el => {
        if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
            //@ts-ignore
            spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(el);
            return true;
        }
        return false;
    });
}
exports._findChildInContext = _findChildInContext;
async function _createProfileNode(profile) {
    const info = {
        name: profile.name,
        type: constant_1.APP_PROFILE_TYPE
    };
    const graph = new spinal_env_viewer_graph_service_1.SpinalGraph(profile.name);
    const profileId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, graph);
    const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profileId);
    return node;
}
exports._createProfileNode = _createProfileNode;
async function _getProfileNode(profileId, context) {
    const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profileId);
    if (node)
        return node;
    return _findChildInContext(context, profileId, context);
}
exports._getProfileNode = _getProfileNode;
function _renameProfile(node, newName) {
    if (newName && newName.trim())
        node.info.name.set(newName);
}
exports._renameProfile = _renameProfile;
async function _getProfileNodeGraph(profileId, context) {
    const profile = await _getProfileNode(profileId, context);
    if (profile)
        return profile.getElement();
}
exports._getProfileNodeGraph = _getProfileNodeGraph;
function mergePortofolioAuth(authorizedPortofolio) {
    const mergedObj = {};
    for (const portofolio of authorizedPortofolio) {
        const existing = mergedObj[portofolio.portofolioId];
        if (!existing) {
            mergedObj[portofolio.portofolioId] = { ...portofolio };
        }
        else {
            mergedObj[portofolio.portofolioId] = mergeTwoPortofolioAuth(existing, portofolio);
        }
    }
    return Object.values(mergedObj);
}
function mergeTwoPortofolioAuth(existing, portofolio) {
    const mergedValue = mergeAuthorizationItems(existing, portofolio);
    return {
        portofolioId: existing.portofolioId,
        building: mergeBosAuth(existing.building, portofolio.building),
        ...mergedValue
    };
}
function mergeBosAuth(existingBuildings = [], newBuildings = []) {
    const mergedObj = {};
    const buildings = [...existingBuildings, ...newBuildings];
    for (const building of buildings) {
        const existing = mergedObj[building.buildingId];
        let mergedValue;
        if (!existing)
            mergedValue = { ...building };
        else
            mergedValue = { buildingId: building.buildingId, ...mergeAuthorizationItems(existing, building) };
        mergedObj[building.buildingId] = mergedValue;
    }
    return Object.values(mergedObj);
}
function removeInvalidPortofolio(items) {
    return items.filter(item => {
        return item.portofolioId && item.portofolioId.trim() && authorizationItemIsValid(item);
    });
}
function removeEmptyBuildings(items) {
    console.warn("Don't remove empty buildings for now, it can be usefull for bos_config compatibility");
    // for (const item of items) {
    //     item.building = (item.building || []).filter(building => authorizationItemIsValid(building));
    // }
    return items;
}
function authorizationItemIsValid(item) {
    const globalCondition = item.appsIds?.length > 0 || item.apisIds?.length > 0 || item.unauthorizeApisIds?.length > 0 || item.unauthorizeAppsIds?.length > 0;
    if (isBuildingAuth(item)) {
        return globalCondition;
    }
    return globalCondition || item.building?.length > 0;
}
function isBuildingAuth(building) {
    return typeof building.buildingId !== "undefined" && building.buildingId;
}
function mergeAuthorizationItems(item1, item2) {
    const mergedAppsIds = new Set([...(item1.appsIds || []), ...(item2.appsIds || [])]);
    const mergedApisIds = new Set([...(item1.apisIds || []), ...(item2.apisIds || [])]);
    const mergedUnauthorizeAppsIds = new Set([...(item1.unauthorizeAppsIds || []), ...(item2.unauthorizeAppsIds || [])]);
    const mergedUnauthorizeApisIds = new Set([...(item1.unauthorizeApisIds || []), ...(item2.unauthorizeApisIds || [])]);
    return {
        ...(mergedAppsIds.size > 0 && { appsIds: Array.from(mergedAppsIds) }),
        ...(mergedApisIds.size > 0 && { apisIds: Array.from(mergedApisIds) }),
        ...(mergedUnauthorizeAppsIds.size > 0 && { unauthorizeAppsIds: Array.from(mergedUnauthorizeAppsIds) }),
        ...(mergedUnauthorizeApisIds.size > 0 && { unauthorizeApisIds: Array.from(mergedUnauthorizeApisIds) })
    };
}
////////////////////////////////////////////////////////////////////////////////////
// function _unifyData(profile1: IPortofolioAuth, profile2: IPortofolioAuth): IPortofolioAuth {
//     if (!profile1.appsIds) profile1.appsIds = [];
//     if (!profile1.apisIds) profile1.apisIds = [];
//     if (!profile1.building) profile1.building = [];
//     profile1.appsIds = [...profile1.appsIds, ...(profile2.appsIds || [])];
//     profile1.apisIds = [...profile1.apisIds, ...(profile2.apisIds || [])];
//     profile1.building = [...profile1.building, ...(profile2.building || [])];
//     return profile1;
// }
// export function _filterApisList(authorizedIds: string[] = [], unauthorizedIds: string[] = []): string[] {
//     if (!unauthorizedIds.length) return authorizedIds;
//     const unAuthObj = {};
//     unauthorizedIds.map(id => unAuthObj[id] = id);
//     return authorizedIds.filter(id => !unAuthObj[id]);
// }
// export function _filterPortofolioList(authorizedPortofolio: IPortofolioAuth[] = [], unauthorizedPortofolio: IPortofolioAuth[] = []): IPortofolioAuth[] {
//     const obj = {};
//     unauthorizedPortofolio.map(({ portofolioId, appsIds }) => {
//         obj[portofolioId] = appsIds;
//         return;
//     })
//     return authorizedPortofolio.reduce((liste, item) => {
//         const apps = obj[item.portofolioId]
//         if (apps) {
//             if (!item.appsIds) item.appsIds = [];
//             item.appsIds = Array.isArray(item.appsIds) ? item.appsIds : [item.appsIds];
//             item.appsIds = item.appsIds.filter(id => {
//                 return apps.find(el => el !== id);
//             })
//         }
//         liste.push(item);
//         return liste;
//     }, [])
// }
// export function _filterBosList(authorizedBos: IBosAuth[] = [], unauthorizedBos: IBosAuth[] = []): IBosAuth[] {
//     const obj = {};
//     unauthorizedBos.map(({ buildingId, appsIds }) => {
//         obj[buildingId] = appsIds;
//         return;
//     })
//     return authorizedBos.reduce((liste, item) => {
//         const apps = obj[item.buildingId]
//         if (apps) {
//             if (!item.appsIds) item.appsIds = [];
//             item.appsIds = Array.isArray(item.appsIds) ? item.appsIds : [item.appsIds];
//             item.appsIds = item.appsIds.filter(id => {
//                 return apps.find(el => el !== id);
//             })
//         }
//         liste.push(item);
//         return liste;
//     }, [])
// }
//# sourceMappingURL=profileUtils.js.map