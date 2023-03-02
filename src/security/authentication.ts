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
import { SECURITY_MESSAGES, SECURITY_NAME, USER_TYPES } from "../constant";
import { TokenService } from "../services";
import { getToken } from "./utils";
import { AuthError } from "./AuthError";


export async function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {

    if (securityName === SECURITY_NAME.all) return;

    const token = getToken(request);
    if (!token) throw new AuthError(SECURITY_MESSAGES.INVALID_TOKEN);

    const tokenInstance = TokenService.getInstance();

    const tokenInfo: any = await tokenInstance.tokenIsValid(token);
    if (!tokenInfo) throw new AuthError(SECURITY_MESSAGES.INVALID_TOKEN);

    // if (tokenInfo.userInfo?.type == USER_TYPES.ADMIN) {
    //     return tokenInfo;
    // }


    const profileId = tokenInfo.profile.profileId || tokenInfo.profile.appProfileBosConfigId || tokenInfo.profile.userProfileBosConfigId

    // if (securityName === SECURITY_NAME.profile) {
    //     const hasAccess = await checkIfProfileHasAccess(request, profileId);
    //     if (!hasAccess) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
    // }

    return tokenInfo;
}


