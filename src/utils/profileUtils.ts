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

import { IBosAuth, IPortofolioAuth, IProfile, IProfileRes, IPortofolioAuthRes, IBosAuthRes, IPortofolioData, IBosData, IProfileData } from "../interfaces";
import { SpinalNode } from 'spinal-env-viewer-graph-service'

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

export function _getNodeListInfo(nodes: SpinalNode[]): any[] {
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

export function _formatAuthorizationData(profileData: IProfile): IPortofolioAuth[] {
    const obj = {}
    return profileData.authorize.reduce((liste, item: IPortofolioAuth) => {
        const index = obj[item.portofolioId];
        if (typeof index !== "undefined") {
            const copy = _unifyData(liste[index - 1], item);
            liste[index - 1] = copy
        } else {
            obj[item.portofolioId] = liste.push(item);
        }

        return liste;
    }, [])
}



function _unifyData(profile1: IPortofolioAuth, profile2: IPortofolioAuth): IPortofolioAuth {
    if (!profile1.appsIds) profile1.appsIds = [];
    if (!profile1.apisIds) profile1.apisIds = [];
    if (!profile1.building) profile1.building = [];

    profile1.appsIds = [...profile1.appsIds, ...(profile2.appsIds || [])];
    profile1.apisIds = [...profile1.apisIds, ...(profile2.apisIds || [])];
    profile1.building = [...profile1.building, ...(profile2.building || [])];

    return profile1;
}

export function _filterApisList(authorizedIds: string[] = [], unauthorizedIds: string[] = []): string[] {

    if (!unauthorizedIds.length) return authorizedIds;

    const unAuthObj = {};
    unauthorizedIds.map(id => unAuthObj[id] = id);

    return authorizedIds.filter(id => !unAuthObj[id]);
}

export function _filterPortofolioList(authorizedPortofolio: IPortofolioAuth[] = [], unauthorizedPortofolio: IPortofolioAuth[] = []): IPortofolioAuth[] {
    const obj = {};

    unauthorizedPortofolio.map(({ portofolioId, appsIds }) => {
        obj[portofolioId] = appsIds;
        return;
    })

    return authorizedPortofolio.reduce((liste, item) => {
        const apps = obj[item.portofolioId]
        if (apps) {
            if (!item.appsIds) item.appsIds = [];
            item.appsIds = Array.isArray(item.appsIds) ? item.appsIds : [item.appsIds];

            item.appsIds = item.appsIds.filter(id => {
                return apps.find(el => el !== id);
            })
        }
        liste.push(item);
        return liste;
    }, [])

}

export function _filterBosList(authorizedBos: IBosAuth[] = [], unauthorizedBos: IBosAuth[] = []): IBosAuth[] {
    const obj = {};

    unauthorizedBos.map(({ buildingId, appsIds }) => {
        obj[buildingId] = appsIds;
        return;
    })

    return authorizedBos.reduce((liste, item) => {
        const apps = obj[item.buildingId]
        if (apps) {
            if (!item.appsIds) item.appsIds = [];
            item.appsIds = Array.isArray(item.appsIds) ? item.appsIds : [item.appsIds];

            item.appsIds = item.appsIds.filter(id => {
                return apps.find(el => el !== id);
            })
        }
        liste.push(item);
        return liste;
    }, [])
}