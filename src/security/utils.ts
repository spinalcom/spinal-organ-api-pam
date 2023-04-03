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
import { SpinalNode } from 'spinal-env-viewer-graph-service';
import { AppProfileService } from "../services/appProfile.service";
import { APIService } from "../services";
import { BOS_BASE_URI_V1, BOS_BASE_URI_V1_2, BOS_BASE_URI_V2, BUILDING_API_GROUP_TYPE, PORTOFOLIO_API_GROUP_TYPE } from "../constant";



export function getToken(request: express.Request): string {
    const header = request.headers.authorization || request.headers.Authorization;
    if (header) {
        const [, token] = (<string>header).split(" ");
        if (token) return token;
    }

    return request.body?.token || request.query?.token || request.headers["x-access-token"];
}


export async function profileHasAccessToApi(profile: SpinalNode, apiUrl: string, method: string): Promise<SpinalNode> {
    let parentType = PORTOFOLIO_API_GROUP_TYPE;

    if (apiUrl.match(`(${BOS_BASE_URI_V1}|${BOS_BASE_URI_V1_2}|${BOS_BASE_URI_V2})`))
        parentType = BUILDING_API_GROUP_TYPE;

    const api = await APIService.getInstance().getApiRouteByRoute(<any>{ route: apiUrl, method }, parentType);;
    if (!api) return;

    const hasAccess = await AppProfileService.getInstance().profileHasAccessToApi(profile, api);
    if (hasAccess) return api;
}




// async function getProfileNode(profileId: string): Promise<SpinalNode> {
//     let profile = await UserProfileService.getInstance().getUserProfile(profileId);
//     if (profile) return profile.node;

//     profile = await AppProfileService.getInstance().getAppProfile(profileId);
//     if (profile) return profile.node;
// }

// export async function checkIfProfileHasAccess(req: Request, profileId: string): Promise<boolean> {
//     // const params = (<any>req).params;
//     // const profile = await getProfileNode(profileId);

//     // if (!profile) return false;

//     // for (const key in params) {
//     //     if (Object.prototype.hasOwnProperty.call(params, key)) {
//     //         const element = params[key];
//     //         if (element === profileId) continue;

//     //         const access = await authorizationInstance.profileHasAccess(profile, element);
//     //         if (!access) return false

//     //     }
//     // }

//     return true;
// }