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
exports.checkIfProfileHasAccess = void 0;
const appProfile_service_1 = require("../services/appProfile.service");
const authorization_service_1 = require("../services/authorization.service");
const userProfile_service_1 = require("../services/userProfile.service");
function getProfileNode(profileId) {
    return __awaiter(this, void 0, void 0, function* () {
        let profile = yield userProfile_service_1.UserProfileService.getInstance().getUserProfile(profileId);
        if (profile)
            return profile.node;
        profile = yield appProfile_service_1.AppProfileService.getInstance().getAppProfile(profileId);
        if (profile)
            return profile.node;
    });
}
function checkIfProfileHasAccess(req, profileId) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = req.params;
        const profile = yield getProfileNode(profileId);
        if (!profile)
            return false;
        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                const element = params[key];
                if (element === profileId)
                    continue;
                const access = yield authorization_service_1.authorizationInstance.profileHasAccess(profile, element);
                if (!access)
                    return false;
            }
        }
        return true;
    });
}
exports.checkIfProfileHasAccess = checkIfProfileHasAccess;
//# sourceMappingURL=utils.js.map