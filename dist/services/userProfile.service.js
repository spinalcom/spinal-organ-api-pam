"use strict";
/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the followi../interfaces/IProfileResitions
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
const authorization_service_1 = require("./authorization.service");
const configFile_service_1 = require("./configFile.service");
const profileUtils_1 = require("../utils/profileUtils");
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
    /// CRUD BEGIN
    createUserProfile(userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this._createUserProfileNode(userProfile);
            const { authorizeApis, authorizeBos, authorizePortofolio } = (0, profileUtils_1._formatAuthorizationData)(userProfile);
            let authorizedPortofolio = yield this.authorizeToAccessPortofolioApp(node, authorizePortofolio);
            let authorizedRoutes = yield this.authorizeToAccessApis(node, authorizeApis);
            let authorizedBos = yield this.authorizeToAccessBosApp(node, authorizeBos);
            yield this._addProfileToGraph(node);
            return {
                node,
                authorizedPortofolio: authorizedPortofolio || [],
                authorizedRoutes: authorizedRoutes || [],
                authorizedBos: authorizedBos || []
            };
        });
    }
    getUserProfile(userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            if (!node)
                return;
            return Promise.all([
                this.getAuthorizedApis(userProfile),
                this.getPortofolioAuthStructure(userProfile),
                this.getBosAuthStructure(userProfile)
            ]).then(([authorizedRoutes, authorizedPortofolio, authorizedBos]) => {
                return {
                    node,
                    authorizedPortofolio: authorizedPortofolio || [],
                    authorizedRoutes: authorizedRoutes || [],
                    authorizedBos: authorizedBos || []
                };
            });
        });
    }
    updateUserProfile(userProfileId, userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileNode = yield this._getUserProfileNode(userProfileId);
            if (!profileNode)
                return;
            this._renameProfile(profileNode, userProfile.name);
            const { authorizeApis, authorizeBos, authorizePortofolio, unauthorizeApis, unauthorizeBos, unauthorizePortofolio } = (0, profileUtils_1._formatAuthorizationData)(userProfile);
            yield this._unauthorizeOnEdit(profileNode, unauthorizeApis, unauthorizeBos, unauthorizePortofolio);
            const filteredPortofolio = (0, profileUtils_1._filterPortofolioList)(authorizePortofolio, unauthorizePortofolio);
            const filteredApis = (0, profileUtils_1._filterApisList)(authorizeApis, unauthorizeApis);
            const filteredBos = (0, profileUtils_1._filterBosList)(authorizeBos, unauthorizeBos);
            yield this._authorizeOnEdit(profileNode, filteredApis, filteredBos, filteredPortofolio);
            return this.getUserProfile(profileNode);
        });
    }
    getAllUserProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const contexts = yield this.getAllUserProfilesNodes();
            const promises = contexts.map(node => this.getUserProfile(node));
            return Promise.all(promises);
        });
    }
    getAllUserProfilesNodes() {
        return this.context.getChildrenInContext();
    }
    deleteUserProfile(userProfileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this._getUserProfileNode(userProfileId);
            if (!node)
                throw new Error(`no user profile Found for ${userProfileId}`);
            yield node.removeFromGraph();
            return userProfileId;
        });
    }
    /// END CRUD
    /// AUTH BEGIN
    //////////////////////////////////////////////////////
    //                      PORTOFOLIO                  //
    //////////////////////////////////////////////////////
    authorizePortofolio(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            portofolioId = Array.isArray(portofolioId) ? portofolioId : [portofolioId];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const promises = portofolioId.map((id) => __awaiter(this, void 0, void 0, function* () {
                return authorization_service_1.authorizationInstance.authorizeProfileToAccessPortofolio(node, id);
            }));
            return Promise.all(promises);
        });
    }
    unauthorizeToAccessPortofolio(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            portofolioId = Array.isArray(portofolioId) ? portofolioId : [portofolioId];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const promises = portofolioId.map((id) => __awaiter(this, void 0, void 0, function* () {
                return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessPortofolio(node, id);
            }));
            return Promise.all(promises);
        });
    }
    authorizeToAccessPortofolioApp(profile, data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = Array.isArray(data) ? data : [data];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return data.reduce((prom, { appsIds, portofolioId }) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const reference = yield authorization_service_1.authorizationInstance.authorizeProfileToAccessPortofolio(node, portofolioId);
                const apps = yield authorization_service_1.authorizationInstance.authorizeProfileToAccessPortofolioApp(node, portofolioId, appsIds, reference);
                liste.push({
                    portofolio: reference,
                    apps
                });
                return liste;
            }), Promise.resolve([]));
        });
    }
    unauthorizeToAccessPortofolioApp(profile, data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = Array.isArray(data) ? data : [data];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const promises = data.map(({ appsIds, portofolioId }) => __awaiter(this, void 0, void 0, function* () {
                return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessPortofolioApp(node, portofolioId, appsIds);
            }));
            return Promise.all(promises);
        });
    }
    getAuthorizedPortofolio(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return authorization_service_1.authorizationInstance.getAuthorizedPortofolioFromProfile(node);
        });
    }
    getAuthorizedPortofolioApp(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return authorization_service_1.authorizationInstance.getAuthorizedPortofolioAppFromProfile(node, portofolioId);
        });
    }
    getPortofolioAuthStructure(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const portofolios = yield this.getAuthorizedPortofolio(profile);
            const promises = portofolios.map((portofolio) => __awaiter(this, void 0, void 0, function* () {
                return {
                    portofolio,
                    apps: yield this.getAuthorizedPortofolioApp(profile, portofolio.getId().get())
                };
            }));
            return Promise.all(promises);
        });
    }
    //////////////////////////////////////////////////////
    //                      APIS                        //
    //////////////////////////////////////////////////////
    authorizeToAccessApis(userProfile, apisIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!apisIds)
                return;
            const node = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            if (node)
                return authorization_service_1.authorizationInstance.authorizeProfileToAccessApisRoutes(node, apisIds);
        });
    }
    unauthorizeToAccessApis(userProfile, apisIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!apisIds)
                return;
            const node = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            if (node)
                return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessApisRoutes(node, apisIds);
        });
    }
    getAuthorizedApis(userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = userProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? userProfile : yield this._getUserProfileNode(userProfile);
            // if (!node) throw new Error(`no user profile Found for ${userProfile}`);
            if (!node)
                return;
            return authorization_service_1.authorizationInstance.getAuthorizedApisRoutesFromProfile(node);
        });
    }
    /////////////////////////////////////////////
    //                  BOS                    //
    /////////////////////////////////////////////
    authorizeToAccessBos(profile, BosId) {
        return __awaiter(this, void 0, void 0, function* () {
            BosId = Array.isArray(BosId) ? BosId : [BosId];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const promises = BosId.map(id => authorization_service_1.authorizationInstance.authorizeProfileToAccessBos(node, id));
            return Promise.all(promises);
        });
    }
    unauthorizeToAccessBos(profile, BosId) {
        return __awaiter(this, void 0, void 0, function* () {
            BosId = Array.isArray(BosId) ? BosId : [BosId];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const promises = BosId.map(id => authorization_service_1.authorizationInstance.unauthorizeProfileToAccessBos(node, id));
            return Promise.all(promises);
        });
    }
    authorizeToAccessBosApp(profile, data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = Array.isArray(data) ? data : [data];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return data.reduce((prom, { buildingId, appsIds }) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const reference = yield authorization_service_1.authorizationInstance.authorizeProfileToAccessBos(node, buildingId);
                const apps = yield authorization_service_1.authorizationInstance.authorizeProfileToAccessBosApp(node, buildingId, appsIds, reference);
                liste.push({
                    building: reference,
                    apps
                });
                return liste;
            }), Promise.resolve([]));
        });
    }
    unauthorizeToAccessBosApp(profile, data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = Array.isArray(data) ? data : [data];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const promises = data.map(({ buildingId, appsIds }) => {
                return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessBosApp(node, buildingId, appsIds);
            });
            return Promise.all(promises);
        });
    }
    getAuthorizedBos(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return authorization_service_1.authorizationInstance.getAuthorizedBosFromProfile(node);
        });
    }
    getAuthorizedBosApp(profile, bosId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return authorization_service_1.authorizationInstance.getAuthorizedBosAppFromProfile(node, bosId);
        });
    }
    getBosAuthStructure(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getUserProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const buildings = yield this.getAuthorizedBos(profile);
            const promises = buildings.map((building) => __awaiter(this, void 0, void 0, function* () {
                return {
                    building,
                    apps: yield this.getAuthorizedBosApp(profile, building.getId().get())
                };
            }));
            return Promise.all(promises);
        });
    }
    ///////////////////////////////////////////////////////////
    ///                       PRIVATES                      //
    //////////////////////////////////////////////////////////
    _getUserProfileNodeGraph(profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield this._getUserProfileNode(profileId);
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
    _addProfileToGraph(node) {
        return this.context.addChildInContext(node, constant_1.CONTEXT_TO_USER_PROFILE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
    }
    _createUserProfileNode(userProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = {
                name: userProfile.name,
                type: constant_1.USER_PROFILE_TYPE
            };
            const graph = new spinal_env_viewer_graph_service_1.SpinalGraph(userProfile.name);
            const profileId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, graph);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profileId);
            return node;
        });
    }
    _getUserProfileNode(userProfileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(userProfileId);
            if (node)
                return node;
            return this._findChildInContext(this.context, userProfileId);
        });
    }
    _renameProfile(node, newName) {
        if (newName && newName.trim())
            node.info.name.set(newName);
    }
    _unauthorizeOnEdit(node, unauthorizeApis, unauthorizeBos, unauthorizePortofolio) {
        const promises = [
            this.unauthorizeToAccessApis(node, unauthorizeApis),
            this.unauthorizeToAccessBosApp(node, unauthorizeBos),
            this.unauthorizeToAccessPortofolioApp(node, unauthorizePortofolio)
        ];
        return Promise.all(promises);
    }
    _authorizeOnEdit(node, authorizeApis, authorizeBos, authorizePortofolio) {
        const promises = [
            this.authorizeToAccessPortofolioApp(node, authorizePortofolio),
            this.authorizeToAccessApis(node, authorizeApis),
            this.authorizeToAccessBosApp(node, authorizeBos),
        ];
        return Promise.all(promises);
    }
}
exports.UserProfileService = UserProfileService;
//# sourceMappingURL=userProfile.service.js.map