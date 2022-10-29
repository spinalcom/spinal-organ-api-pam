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

import * as express from "express";
import { ProxyOptions } from "express-http-proxy";
import { SpinalNode } from "spinal-env-viewer-graph-service";
import { HTTP_CODES } from "../constant";
import { IApiRoute, IBosAuthRes, IProfileRes } from "../interfaces";
import { AppProfileService, UserProfileService } from "../services";
import AuthorizationService from "../services/authorization.service";
import { Utils } from "../utils/pam_v1_utils/utils";
import { correspondanceObj } from "./corrspondance";

const apiServerEndpoint = "/api/v1/";

export function formatUri(argUrl: string, uri: string): string {
    const base = argUrl.replace(new RegExp(`^${uri}*/`), (el) => "");
    let url = base.split("/").slice(1).join("/");

    const correspondance = _getCorrespondance(url);
    return /^api\/v1/.test(correspondance) ? ('/' + correspondance) : (apiServerEndpoint + correspondance);
}

export async function canAccess(buildingId: string, api: { method: string; route: string }, profileId: string, isAppProfile): Promise<boolean> {
    // const access = AuthorizationService.getInstance().profileHasAccess()
    const profile = isAppProfile ? await AppProfileService.getInstance().getAppProfile(profileId) : await UserProfileService.getInstance().getUserProfile(profileId)

    const buildingAccess = hasAccessToBuilding(profile, buildingId);
    if (!buildingAccess) return false;

    const routeFound = hasAccessToApiRoute(buildingAccess, api);
    if (!routeFound) return false;


    return true;
}


function _getCorrespondance(url: string) {
    const found = Object.keys(correspondanceObj).find(el => {
        const t = el.replace(/\{(.*?)\}/g, (el) => '(.*?)')
        const regex = new RegExp(`^${t}$`);
        return url.match(regex);
    })

    if (found) {
        const urls = url.split("/");
        const list = correspondanceObj[found].split("/");
        let final = "";

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            let item = ""
            if (element.includes("{") && element.includes("}")) item = urls[index];
            else item = list[index];

            final += index === 0 ? item : "/" + item
        }
        return final;
    }


    return url;
}

function hasAccessToBuilding(profile: IProfileRes, buildingId: string): IBosAuthRes {
    for (const { buildings } of profile.authorized) {
        const found = buildings.find(({ building }) => building.getId().get() === buildingId);
        if (found) return found;
    }

    return;
}

function hasAccessToApiRoute(building: IBosAuthRes, apiRoute: { method: string; route: string }): SpinalNode {
    return building.apis.find(node => {
        const route = node.info.get();
        if (apiRoute.method.toUpperCase() !== route.method.toUpperCase()) return false;

        const routeFormatted = route.name.replace(/\{(.*?)\}/g, (el) => '(.*?)');
        const regex = new RegExp(`^${routeFormatted}$`);
        return apiRoute.route.match(regex);
    })
}


export const proxyOptions = (useV1: boolean): ProxyOptions => {
    return {
        memoizeHost: false,
        proxyReqPathResolver: (req: express.Request) => req["endpoint"],
        userResDecorator: (proxyRes, proxyResData) => {
            return new Promise((resolve, reject) => {
                if (!useV1) return resolve(proxyResData);
                if (proxyRes.statusCode == HTTP_CODES.NOT_FOUND) return resolve(proxyResData);

                try {
                    const response = JSON.parse(proxyResData.toString());
                    const data = Utils.getReturnObj(null, response, get_method((<any>proxyRes).req.method));
                    resolve(data);
                } catch (error) {
                    resolve(proxyResData)
                }
            });
        }
    }
}

function get_method(method: string) {
    switch (method) {
        case "GET":
            return "READ";
        case "POST":
            return "ADD";
        case "DELETE":
            return "DEL";
    }
}