"use strict";
/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the followi../interfaces/IAppProfileResitions
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
exports.AppProfileService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const authorization_service_1 = require("./authorization.service");
const configFile_service_1 = require("./configFile.service");
class AppProfileService {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AppProfileService();
        }
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.APP_PROFILE_CONTEXT_NAME);
            if (!this.context)
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.APP_PROFILE_CONTEXT_NAME, constant_1.APP_PROFILE_CONTEXT_TYPE);
            return this.context;
        });
    }
    /// CRUD BEGIN
    createAppProfile(appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this._createAppProfileNode(appProfile);
            let authorizedApps = yield this.authorizeToAccessApps(node, appProfile.authorizeApps);
            let authorizedRoutes = yield this.authorizeToAccessApis(node, appProfile.authorizeApis);
            let authorizedBos = yield this.authorizeToAccessBos(node, appProfile.authorizeBos);
            return { node, authorizedApps: authorizedApps || [], authorizedRoutes: authorizedRoutes || [], authorizedBos: authorizedBos || [] };
        });
    }
    getAppProfile(appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            if (!node)
                return;
            return Promise.all([
                this.getAuthorizedApis(appProfile),
                this.getAuthorizedApps(appProfile),
                this.getAuthorizedBos(appProfile)
            ]).then(([authorizedRoutes, authorizedApps, authorizedBos]) => {
                return {
                    node,
                    authorizedRoutes,
                    authorizedApps,
                    authorizedBos
                };
            });
        });
    }
    updateAppProfile(appProfileId, appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileNode = yield this._getAppProfileNode(appProfileId);
            if (!profileNode)
                return;
            this._renameProfile(profileNode, appProfile.name);
            const unauthorizedAppsIds = appProfile.unauthorizeApps || [];
            const unauthorizedApisIds = appProfile.unauthorizeApis || [];
            const unauthorizedBosIds = appProfile.unauthorizeBos || [];
            yield this._unauthorizeOnEdit(profileNode, unauthorizedAppsIds, unauthorizedApisIds, unauthorizedBosIds);
            const filteredApps = this._filterAuthList(appProfile.authorizeApps, unauthorizedAppsIds);
            const filteredApis = this._filterAuthList(appProfile.authorizeApis, unauthorizedApisIds);
            const filteredBos = this._filterAuthList(appProfile.authorizeBos, unauthorizedBosIds);
            const [authorizedApps, authorizedApis, authorizedBos] = yield this._authorizeOnEdit(profileNode, filteredApps, filteredApis, filteredBos);
            return { node: profileNode, authorizedApps: authorizedApps || [], authorizedRoutes: authorizedApis || [], authorizedBos: authorizedBos || [] };
        });
    }
    getAllAppProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.getAllAppProfileNodes();
            const promises = contexts.map(node => this.getAppProfile(node));
            return Promise.all(promises);
        });
    }
    getAllAppProfileNodes() {
        return this.context.getChildrenInContext();
    }
    deleteAppProfile(appProfileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this._getAppProfileNode(appProfileId);
            if (!node)
                throw new Error(`no profile Found for ${appProfileId}`);
            yield node.removeFromGraph();
            return appProfileId;
        });
    }
    /// END CRUD
    /// AUTH BEGIN
    //apps
    authorizeToAccessApps(appProfile, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!appIds)
                return;
            const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            if (node)
                return authorization_service_1.authorizationInstance.authorizeProfileToAccessApp(node, appIds) || [];
        });
    }
    unauthorizeToAccessApps(appProfile, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!appIds)
                return;
            const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            if (node)
                return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApp(node, appIds);
        });
    }
    getAuthorizedApps(appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            if (!node)
                return;
            // if (!node) throw new Error(`no user profile Found for ${userProfile}`);
            return authorization_service_1.authorizationInstance.getAuthorizedAppsFromProfile(node);
        });
    }
    //apis
    authorizeToAccessApis(appProfile, apisIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!apisIds)
                return;
            const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            if (node)
                return authorization_service_1.authorizationInstance.authorizeProfileToAccessApisRoutes(node, apisIds);
        });
    }
    unauthorizeToAccessApis(appProfile, apisIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!apisIds)
                return;
            const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            if (node)
                return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApisRoutes(node, apisIds);
        });
    }
    getAuthorizedApis(appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            // if (!node) throw new Error(`no user profile Found for ${appProfile}`);
            if (!node)
                return;
            return authorization_service_1.authorizationInstance.getAuthorizedApisRoutesFromProfile(node);
        });
    }
    // bos
    authorizeToAccessBos(profile, bosIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bosIds)
                return;
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (node)
                return authorization_service_1.authorizationInstance.authorizeProfileToAccessBos(node, bosIds);
        });
    }
    unauthorizeToAccessBos(appProfile, bosIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bosIds)
                return;
            const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            if (node)
                return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessBos(node, bosIds);
        });
    }
    getAuthorizedBos(appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            if (!node)
                return;
            // if (!node) throw new Error(`no user profile Found for ${userProfile}`);
            return authorization_service_1.authorizationInstance.getAuthorizedBosFromProfile(node);
        });
    }
    /// END AUTH
    ///////////////////////////////////////////////////////////
    ///                       PRIVATES                      //
    //////////////////////////////////////////////////////////
    _getAppProfileNodeGraph(profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this._getAppProfileNode(profileId);
            if (profile)
                return profile.getElement();
        });
    }
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
    _filterAuthList(authorizedIds = [], unauthorizedIds = []) {
        if (!unauthorizedIds.length)
            return authorizedIds;
        const unAuthObj = {};
        unauthorizedIds.map(id => unAuthObj[id] = id);
        return authorizedIds.filter(id => !unAuthObj[id]);
    }
    _createAppProfileNode(appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = {
                name: appProfile.name,
                type: constant_1.APP_PROFILE_TYPE
            };
            const graph = new spinal_env_viewer_graph_service_1.SpinalGraph(appProfile.name);
            const profileId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, graph);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profileId);
            yield this.context.addChildInContext(node, constant_1.CONTEXT_TO_APP_PROFILE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
            return node;
        });
    }
    _getAppProfileNode(appProfileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appProfileId);
            if (node)
                return node;
            return this._findChildInContext(this.context, appProfileId);
        });
    }
    _renameProfile(node, newName) {
        if (newName && newName.trim())
            node.info.name.set(newName);
    }
    _unauthorizeOnEdit(node, unauthorizedAppsIds, unauthorizedApisIds, unauthorizedBosIds) {
        const promises = [
            authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApp(node, unauthorizedAppsIds),
            authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApisRoutes(node, unauthorizedApisIds),
            authorization_service_1.authorizationInstance.unauthorizeProfileToAccessBos(node, unauthorizedBosIds)
        ];
        return Promise.all(promises);
    }
    _authorizeOnEdit(node, authorizedAppsIds, authorizedApisIds, _authorizeOnEdit) {
        const promises = [
            authorization_service_1.authorizationInstance.authorizeProfileToAccessApp(node, authorizedAppsIds),
            authorization_service_1.authorizationInstance.authorizeProfileToAccessApisRoutes(node, authorizedApisIds),
            authorization_service_1.authorizationInstance.authorizeProfileToAccessBos(node, _authorizeOnEdit)
        ];
        return Promise.all(promises);
    }
}
exports.AppProfileService = AppProfileService;
//# sourceMappingURL=appProfile.service.js.map