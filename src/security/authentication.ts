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
import { APP_PROFILE_TYPE, SECURITY_MESSAGES, SECURITY_NAME, USER_TYPES } from "../constant";
import { AppProfileService, TokenService, UserProfileService } from "../services";
import { profileHasAccessToApi, getToken } from "./utils";
import { AuthError } from "./AuthError";
import { AdminProfileService } from "../services/adminProfile.service";
import { SpinalNode } from "spinal-env-viewer-graph-service";


export async function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {

    if (securityName === SECURITY_NAME.all) return;

    const tokenInfo: any = await checkAndGetTokenInfo(request);

    // get profile Node
    let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.appProfileBosConfigId;
    if (!profileId) throw new AuthError(SECURITY_MESSAGES.NO_PROFILE_FOUND);

    let profileNode = await AppProfileService.getInstance()._getAppProfileNode(profileId) || await UserProfileService.getInstance()._getUserProfileNode(profileId)
    if (!profileNode) throw new AuthError(SECURITY_MESSAGES.NO_PROFILE_FOUND);


    // Check if profile has access to api route
    // if (profileNode.info.type.get() === APP_PROFILE_TYPE) {
    //     const apiUrl = request.url;
    //     const method = request.method;
    //     const isAuthorized = await profileHasAccessToApi(profileNode, apiUrl, method);
    //     if (!isAuthorized) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
    // }

    (<any>request).profileId = profileId;

    return tokenInfo;
}


export async function checkIfItIsAdmin(request: express.Request): Promise<boolean> {

    let profileId = await getProfileId(request);

    return AdminProfileService.getInstance().adminNode.getId().get() === profileId;
}


export async function getProfileId(request: express.Request): Promise<string> {
    const tokenInfo: any = await checkAndGetTokenInfo(request);

    let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.appProfileBosConfigId;
    if (!profileId) throw new AuthError(SECURITY_MESSAGES.NO_PROFILE_FOUND);

    return profileId;
}

export async function getProfileNode(req: express.Request): Promise<SpinalNode> {
    const tokenInfo = await checkAndGetTokenInfo(req);
    const profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
    const isApp = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId ? false : true;

    return isApp ? AppProfileService.getInstance()._getAppProfileNode(profileId) : UserProfileService.getInstance()._getUserProfileNode(profileId);
}


export async function checkAndGetTokenInfo(request: express.Request) {
    // check token validity
    const token = getToken(request);
    if (!token) throw new AuthError(SECURITY_MESSAGES.INVALID_TOKEN);

    const tokenInstance = TokenService.getInstance();

    const tokenInfo: any = await tokenInstance.tokenIsValid(token);
    if (!tokenInfo) throw new AuthError(SECURITY_MESSAGES.INVALID_TOKEN);

    return tokenInfo;
}