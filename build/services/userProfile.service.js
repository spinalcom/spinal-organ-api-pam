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
exports.UserProfileService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
class UserProfileService {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserProfileService();
        }
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.USER_PROFILE_CONTEXT_NAME);
            if (!this.context)
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.USER_PROFILE_CONTEXT_NAME, constant_1.USER_PROFILE_CONTEXT_TYPE);
            return this.context;
        });
    }
    createUserProfile(userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            userProfile.type = constant_1.USER_PROFILE_TYPE;
            const profileId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(userProfile, new spinal_env_viewer_graph_service_1.SpinalGraph(userProfile.name));
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profileId);
            return this.context.addChildInContext(node, constant_1.CONTEXT_TO_USER_PROFILE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    getUserProfile(userProfileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(userProfileId);
            if (node)
                return node;
            return this._findChildInContext(this.context, userProfileId);
        });
    }
    getAllUserProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.context.getChildrenInContext();
        });
    }
    updateUserProfile(userProfileId, userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userProfileId === 'undefined' || typeof userProfile === 'undefined') {
                return;
            }
            const node = yield this.getUserProfile(userProfileId);
            if (!node)
                throw new Error(`no user profile Found for ${userProfileId}`);
            for (const key in userProfile) {
                if (Object.prototype.hasOwnProperty.call(userProfile, key) && node.info[key]) {
                    const element = userProfile[key];
                    node.info[key].set(element);
                }
            }
            return node;
        });
    }
    deleteUserProfile(userProfileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this.getUserProfile(userProfileId);
            if (!node)
                throw new Error(`no user profile Found for ${userProfileId}`);
            yield node.removeFromGraph();
            return userProfileId;
        });
    }
    removeRoleToUserProfile(userProfileId, roleId) { }
    _findChildInContext(startNode, nodeIdOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield startNode.getChildrenInContext(this.context);
            return children.find(el => {
                if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
                    //@ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(el);
                    return true;
                }
                return false;
            });
        });
    }
}
exports.UserProfileService = UserProfileService;
//# sourceMappingURL=userProfile.service.js.map