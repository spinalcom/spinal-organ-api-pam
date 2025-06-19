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

import { APP_PROFILE_TYPE } from "../constant";
import { IBosAuth, IPortofolioAuth, IProfile, IProfileRes, IPortofolioAuthRes, IBosAuthRes, IPortofolioData, IBosData, IProfileData, ItemsIds } from "../interfaces";
import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from 'spinal-env-viewer-graph-service'

export function _formatProfile(data: IProfileRes): IProfileData {
    return {
        ...data.node.info.get(),
        authorized: data.authorized.map(el => _formatPortofolioAuthRes(el))
    }
}


export function _formatPortofolioAuthRes(data: IPortofolioAuthRes): IPortofolioData {
    return {
        ...data.portofolio.info.get(),
        apps: _getNodeListInfo(data.apps),
        apis: _getNodeListInfo(data.apis),
        buildings: data.buildings.map(el => _formatBosAuthRes(el))
    }
}

export function _formatBosAuthRes(data: IBosAuthRes): IBosData {
    return {
        ...data.building.info.get(),
        apps: _getNodeListInfo(data.apps),
        apis: _getNodeListInfo(data.apis)
    }
}

export function _getNodeListInfo(nodes: SpinalNode[] = []): any[] {
    return nodes.map(el => el.info.get());
}

export function _formatProfileKeys(profile: IProfile): IProfile {
    const res: any = {};

    for (const key in profile) {
        if (Object.prototype.hasOwnProperty.call(profile, key)) {
            const element = profile[key];
            res[key] = typeof element === "string" && element.trim()[0] === "[" ? JSON.parse(element.trim()) : element;
        }
    }

    return res;
}

export function formatAndMergeBosAuthorization(itemsToAuthorize: IBosAuth[]): IBosAuth[] {
    const buildingValids = itemsToAuthorize.filter(item => authorizationItemIsValid(item));
    return mergeBosAuth(buildingValids);

}


export function formatAndMergePortofolioAuthorization(itemsToAuthorize: IPortofolioAuth[]): IPortofolioAuth[] {

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


export async function _findChildInContext(startNode: SpinalNode, nodeIdOrName: string, context: SpinalContext): Promise<SpinalNode> {
    const children = await startNode.getChildrenInContext(context);
    return children.find(el => {
        if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
            //@ts-ignore
            SpinalGraphService._addNode(el);
            return true;
        }
        return false;
    })
}

export async function _createProfileNode(profile: IProfile): Promise<SpinalNode> {

    const info = {
        name: profile.name,
        type: APP_PROFILE_TYPE
    }
    const graph = new SpinalGraph(profile.name)
    const profileId = SpinalGraphService.createNode(info, graph);

    const node = SpinalGraphService.getRealNode(profileId);
    return node;
}

export async function _getProfileNode(profileId: string, context: SpinalContext): Promise<SpinalNode> {
    const node = SpinalGraphService.getRealNode(profileId);
    if (node) return node;

    return _findChildInContext(context, profileId, context);
}

export function _renameProfile(node: SpinalNode, newName: string) {
    if (newName && newName.trim()) node.info.name.set(newName);
}


export async function _getProfileNodeGraph(profileId: string, context: SpinalContext): Promise<SpinalGraph | void> {
    const profile = await _getProfileNode(profileId, context);
    if (profile) return profile.getElement();
}



function mergePortofolioAuth(authorizedPortofolio: IPortofolioAuth[]): IPortofolioAuth[] {
    const mergedObj: { [key: string]: IPortofolioAuth } = {};

    for (const portofolio of authorizedPortofolio) {
        const existing = mergedObj[portofolio.portofolioId];
        if (!existing) {
            mergedObj[portofolio.portofolioId] = { ...portofolio };
        } else {
            mergedObj[portofolio.portofolioId] = mergeTwoPortofolioAuth(existing, portofolio);
        }
    }

    return Object.values(mergedObj);
}

function mergeTwoPortofolioAuth(existing: IPortofolioAuth, portofolio: IPortofolioAuth): IPortofolioAuth {
    const mergedValue: ItemsIds = mergeAuthorizationItems(existing, portofolio);

    return {
        portofolioId: existing.portofolioId,
        building: mergeBosAuth(existing.building, portofolio.building),
        ...mergedValue
    }
}


function mergeBosAuth(existingBuildings: IBosAuth[] = [], newBuildings: IBosAuth[] = []): IBosAuth[] {
    const mergedObj: { [key: string]: IBosAuth } = {};
    const buildings = [...existingBuildings, ...newBuildings];

    for (const building of buildings) {
        const existing = mergedObj[building.buildingId];

        let mergedValue: IBosAuth;
        if (!existing) mergedValue = { ...building };
        else mergedValue = { buildingId: building.buildingId, ...mergeAuthorizationItems(existing, building) }

        mergedObj[building.buildingId] = mergedValue;
    }

    return Object.values(mergedObj);
}


function removeInvalidPortofolio(items: IPortofolioAuth[]): IPortofolioAuth[] {
    return items.filter(item => {
        return item.portofolioId && item.portofolioId.trim() && authorizationItemIsValid(item);
    });
}

function removeEmptyBuildings(items: IPortofolioAuth[]): IPortofolioAuth[] {
    for (const item of items) {
        item.building = (item.building || []).filter(building => authorizationItemIsValid(building));
    }

    return items;
}

function authorizationItemIsValid(item: IBosAuth | IPortofolioAuth): boolean {
    const globalCondition = item.appsIds?.length > 0 || item.apisIds?.length > 0 || item.unauthorizeApisIds?.length > 0 || item.unauthorizeAppsIds?.length > 0;

    if (isBuildingAuth(item)) {
        return globalCondition;
    }

    return globalCondition || item.building?.length > 0;
}

function isBuildingAuth(building: any): building is IBosAuth {
    return typeof building.buildingId !== "undefined" && building.buildingId;
}

function mergeAuthorizationItems(item1: any, item2: any): ItemsIds {
    const mergedAppsIds = new Set([...(item1.appsIds || []), ...(item2.appsIds || [])]);
    const mergedApisIds = new Set([...(item1.apisIds || []), ...(item2.apisIds || [])]);
    const mergedUnauthorizeAppsIds = new Set([...(item1.unauthorizeAppsIds || []), ...(item2.unauthorizeAppsIds || [])]);
    const mergedUnauthorizeApisIds = new Set([...(item1.unauthorizeApisIds || []), ...(item2.unauthorizeApisIds || [])]);

    return {
        ...(mergedAppsIds.size > 0 && { appsIds: Array.from(mergedAppsIds) }),
        ...(mergedApisIds.size > 0 && { apisIds: Array.from(mergedApisIds) }),
        ...(mergedUnauthorizeAppsIds.size > 0 && { unauthorizeAppsIds: Array.from(mergedUnauthorizeAppsIds) }),
        ...(mergedUnauthorizeApisIds.size > 0 && { unauthorizeApisIds: Array.from(mergedUnauthorizeApisIds) })
    }

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