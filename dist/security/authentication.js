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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndGetTokenInfo = exports.getProfileNode = exports.getProfileId = exports.checkIfItIsAuthPlateform = exports.checkIfItIsAdmin = exports.expressAuthentication = void 0;
const constant_1 = require("../constant");
const services_1 = require("../services");
const utils_1 = require("./utils");
const AuthError_1 = require("./AuthError");
const adminProfile_service_1 = require("../services/adminProfile.service");
function expressAuthentication(request, securityName, scopes) {
    return __awaiter(this, void 0, void 0, function* () {
        if (securityName === constant_1.SECURITY_NAME.all)
            return;
        const token = (0, utils_1.getToken)(request);
        if (!token)
            throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
        return token;
    });
}
exports.expressAuthentication = expressAuthentication;
function checkIfItIsAdmin(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let profileId = yield getProfileId(request);
            return adminProfile_service_1.AdminProfileService.getInstance().isAdmin(profileId);
        }
        catch (error) {
            return false;
        }
    });
}
exports.checkIfItIsAdmin = checkIfItIsAdmin;
function checkIfItIsAuthPlateform(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = (0, utils_1.getToken)(request);
        if (!token)
            return false;
        const authAdmin = yield services_1.AuthentificationService.getInstance().getAdminCredential();
        return token === authAdmin.TokenAdminToPam;
    });
}
exports.checkIfItIsAuthPlateform = checkIfItIsAuthPlateform;
function getProfileId(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenInfo = yield checkAndGetTokenInfo(request);
        let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.appProfileBosConfigId;
        if (!profileId)
            throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.NO_PROFILE_FOUND);
        return profileId;
    });
}
exports.getProfileId = getProfileId;
function getProfileNode(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenInfo = yield checkAndGetTokenInfo(req);
        const profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
        const isApp = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId ? false : true;
        return isApp ? services_1.AppProfileService.getInstance()._getAppProfileNode(profileId) : services_1.UserProfileService.getInstance()._getUserProfileNode(profileId);
    });
}
exports.getProfileNode = getProfileNode;
function checkAndGetTokenInfo(request) {
    return __awaiter(this, void 0, void 0, function* () {
        // check token validity
        const token = yield expressAuthentication(request);
        const tokenInstance = services_1.TokenService.getInstance();
        const tokenInfo = yield tokenInstance.tokenIsValid(token);
        if (!tokenInfo)
            throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
        return tokenInfo;
    });
}
exports.checkAndGetTokenInfo = checkAndGetTokenInfo;
// export async function expressAuthentication(
//   request: express.Request,
//   securityName: string,
//   scopes?: string[]
// ): Promise<any> {
//   if (securityName === SECURITY_NAME.all) return;
//   const tokenInfo: any = await checkAndGetTokenInfo(request);
//   // get profile Node
//   let profileId =
//     tokenInfo.profile.profileId ||
//     tokenInfo.profile.userProfileBosConfigId ||
//     tokenInfo.profile.appProfileBosConfigId;
//   if (!profileId) throw new AuthError(SECURITY_MESSAGES.NO_PROFILE_FOUND);
//   let profileNode =
//     (await AppProfileService.getInstance()._getAppProfileNode(profileId)) ||
//     (await UserProfileService.getInstance()._getUserProfileNode(profileId));
//   if (!profileNode) throw new AuthError(SECURITY_MESSAGES.NO_PROFILE_FOUND);
//   // Check if profile has access to api route
//   // if (profileNode.info.type.get() === APP_PROFILE_TYPE) {
//   //     const apiUrl = request.url;
//   //     const method = request.method;
//   //     const isAuthorized = await profileHasAccessToApi(profileNode, apiUrl, method);
//   //     if (!isAuthorized) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
//   // }
//   (<any>request).profileId = profileId;
//   return tokenInfo;
// }
//# sourceMappingURL=authentication.js.map