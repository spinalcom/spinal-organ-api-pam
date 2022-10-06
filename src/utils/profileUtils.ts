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

import { IAuthRes, IBosAuth, IPortofolioAuth, IProfile, IProfileRes, IPortofolioAuthRes, IBosAuthRes, IPortofolioData, IBosData } from "../interfaces";
import { SpinalNode } from 'spinal-env-viewer-graph-service'

export function _formatProfile(data: IProfileRes) {
    return {
        ...data.node.info.get(),
        authorizedportofolio: data.authorizedPortofolio.map(el => _formatPortofolioAuthRes(el)),
        authorizedRoutes: _getNodeListInfo(data.authorizedRoutes),
        authorizedBos: data.authorizedBos.map(el => _formatBosAuthRes(el))
    }
}


export function _formatPortofolioAuthRes(data: IPortofolioAuthRes): IPortofolioData {
    return {
        ...data.portofolio.info.get(),
        apps: _getNodeListInfo(data.apps)
    }
}

export function _formatBosAuthRes(data: IBosAuthRes): IBosData {
    return {
        ...data.building.info.get(),
        apps: _getNodeListInfo(data.apps)
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

export function _formatAuthorizationData(profileData: IProfile) {
    return {
        authorizePortofolio: _unifyData(profileData.authorizePortofolio),
        unauthorizePortofolio: _unifyData(profileData.unauthorizePortofolio),
        authorizeApis: profileData.authorizeApis || [],
        unauthorizeApis: profileData.unauthorizeApis || [],
        authorizeBos: _unifyData(profileData.authorizeBos),
        unauthorizeBos: _unifyData(profileData.unauthorizeBos)
    }
}

function _unifyData(auths: (IPortofolioAuth | IBosAuth)[]): (IPortofolioAuth | IBosAuth)[] {
    if (!auths) return [];

    return auths.reduce((liste, item) => {
        let key = "portofolioId" in item ? "portofolioId" : "buildingId";
        let appIds = item.appsIds ? Array.isArray(item.appsIds) ? item.appsIds : [item.appsIds] : [];

        const found = liste.find(el => el[key] === item[key]);
        if (found) found.appIds.push(...appIds);
        else {
            item.appsIds = appIds;
            liste.push(item);
        }

        return liste;
    }, [])
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