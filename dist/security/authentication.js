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
exports.expressAuthentication = void 0;
const constant_1 = require("../constant");
const services_1 = require("../services");
const AuthError_1 = require("./AuthError");
function expressAuthentication(request, securityName, scopes) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (securityName === constant_1.SECURITY_NAME.all)
            return;
        const token = getToken(request);
        if (!token)
            throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
        const authInstance = services_1.AuthentificationService.getInstance();
        const tokenInfo = yield authInstance.tokenIsValid(token);
        if (!tokenInfo)
            throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
        if (((_a = tokenInfo.userInfo) === null || _a === void 0 ? void 0 : _a.type) == constant_1.USER_TYPES.ADMIN) {
            return tokenInfo;
        }
        const profileId = tokenInfo.profile.profileId || tokenInfo.profile.appProfileBosConfigId || tokenInfo.profile.userProfileBosConfigId;
        if (securityName === constant_1.SECURITY_NAME.profile) {
            // const hasAccess = await checkIfProfileHasAccess(request, profileId);
            // if (!hasAccess) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
        }
        return tokenInfo;
    });
}
exports.expressAuthentication = expressAuthentication;
function getToken(request) {
    const header = request.headers.authorization || request.headers.Authorization;
    if (header) {
        const [, token] = header.split(" ");
        if (token)
            return token;
    }
    return request.body.token || request.query.token || request.headers["x-access-token"];
}
//# sourceMappingURL=authentication.js.map