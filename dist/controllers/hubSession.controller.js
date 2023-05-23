/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
// /*
//  * Copyright 2023 SpinalCom - www.spinalcom.com
//  * 
//  * This file is part of SpinalCore.
//  * 
//  * Please read all of the following terms and conditions
//  * of the Free Software license Agreement ("Agreement")
//  * carefully.
//  * 
//  * This Agreement is a legally binding contract between
//  * the Licensee (as defined below) and SpinalCom that
//  * sets forth the terms and conditions that govern your
//  * use of the Program. By installing and/or using the
//  * Program, you agree to abide by all the terms and
//  * conditions stated or referenced herein.
//  * 
//  * If you do not agree to abide by these terms and
//  * conditions, do not demonstrate your acceptance and do
//  * not install or use the Program.
//  * You should have received a copy of the license along
//  * with this file. If not, see
//  * <http://resources.spinalcom.com/licenses.pdf>.
//  */
// import { Controller, Get, Request, Route, Security, Tags } from "tsoa";
// import * as express from "express";
// import { HTTP_CODES, SECURITY_MESSAGES, SECURITY_NAME } from "../constant";
// import { checkAndGetTokenInfo, getProfileId } from "../security/authentication";
// import SpinalAPIMiddleware from "../middlewares/SpinalAPIMiddleware";
// import { HubSessionService } from "../services/hubSession.service";
// import { AuthError } from "../security/AuthError";
// @Route("/api/v1")
// @Tags("Hub session")
// export class HubSessionController extends Controller {
//     constructor() {
//         super();
//     }
//     @Security(SECURITY_NAME.bearerAuth)
//     @Get("/createSession")
//     public async createSession(@Request() req: express.Request): Promise<{ sessionNumber?: number; graphServerId?: number; username?: string } | { message: string }> {
//         try {
//             const tokenInfo = await checkAndGetTokenInfo(req);
//             let isAppProfile ;
//             let profileId;
//             if(tokenInfo.profile?.profileId || tokenInfo.profile?.userProfileBosConfigId) {
//                 profileId =  tokenInfo.profile?.profileId || tokenInfo.profile?.userProfileBosConfigId;
//                 isAppProfile = false;
//             }  else if (tokenInfo.profile?.appProfileBosConfigId) {
//                 profileId =  tokenInfo.profile?.appProfileBosConfigId;
//                 isAppProfile = true
//             }
//             if (!profileId) throw new AuthError(SECURITY_MESSAGES.NO_PROFILE_FOUND);
//             const username = tokenInfo.userInfo?.name
//             const graph = await SpinalAPIMiddleware.getInstance().getProfileGraph(profileId);
//             const sessionNumber = await HubSessionService.getInstance().createSession();
//             if (sessionNumber && graph) {
//                 this.setStatus(HTTP_CODES.OK);
//                 return { sessionNumber: parseInt(sessionNumber), graphServerId: graph._server_id, username }
//             }
//             throw { code: HTTP_CODES.BAD_REQUEST, message: `Failed to create session` };
//         } catch (error) {
//             this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
//             return { message: error.message };
//         }
//     }
// }
//# sourceMappingURL=hubSession.controller.js.map