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
exports.AppProfileService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const authorization_service_1 = require("./authorization.service");
const configFile_service_1 = require("./configFile.service");
const profileUtils_1 = require("../utils/profileUtils");
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
            const data = (0, profileUtils_1._formatAuthorizationData)(appProfile);
            const obj = {
                node,
                authorized: []
            };
            obj.authorized = yield data.reduce((prom, item) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const portofolioAuth = yield this._authorizeIPortofolioAuth(node, item);
                liste.push(portofolioAuth);
                return liste;
            }), Promise.resolve([]));
            yield this.context.addChildInContext(node, constant_1.CONTEXT_TO_APP_PROFILE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
            return obj;
        });
    }
    getAppProfile(appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = appProfile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? appProfile : yield this._getAppProfileNode(appProfile);
            if (!node)
                return;
            return {
                node,
                authorized: yield this.getPortofolioAuthStructure(node)
            };
        });
    }
    updateAppProfile(appProfileId, appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileNode = yield this._getAppProfileNode(appProfileId);
            if (!profileNode)
                return;
            this._renameProfile(profileNode, appProfile.name);
            if (appProfile.authorize) {
                yield appProfile.authorize.reduce((prom, item) => __awaiter(this, void 0, void 0, function* () {
                    const liste = yield prom;
                    yield this._authorizeIPortofolioAuth(profileNode, item);
                    yield this._unauthorizeIPortofolioAuth(profileNode, item);
                    return liste;
                }), Promise.resolve([]));
            }
            return this.getAppProfile(profileNode);
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
    //////////////////////////////////////////////////////
    //                      PORTOFOLIO                  //
    //////////////////////////////////////////////////////
    authorizePortofolio(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            portofolioId = Array.isArray(portofolioId) ? portofolioId : [portofolioId];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
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
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
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
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return data.reduce((prom, { appsIds, portofolioId }) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                if (!appsIds || appsIds.length === 0)
                    return liste;
                const portofolio = yield authorization_service_1.authorizationInstance.authorizeProfileToAccessPortofolio(node, portofolioId);
                const apps = yield authorization_service_1.authorizationInstance.authorizeProfileToAccessPortofolioApp(node, portofolioId, appsIds);
                liste.push({
                    portofolio,
                    apps
                });
                return liste;
            }), Promise.resolve([]));
        });
    }
    unauthorizeToAccessPortofolioApp(profile, data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = Array.isArray(data) ? data : [data];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const promises = data.map(({ appsIds, portofolioId }) => __awaiter(this, void 0, void 0, function* () {
                if (!appsIds)
                    appsIds = [];
                return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessPortofolioApp(node, portofolioId, appsIds);
            }));
            return Promise.all(promises).then((result) => {
                return result.flat();
            });
        });
    }
    authorizeToAccessPortofolioApisRoute(profile, data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = Array.isArray(data) ? data : [data];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return data.reduce((prom, { apisIds, portofolioId }) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                if (!apisIds || apisIds.length === 0)
                    return liste;
                const portofolio = yield authorization_service_1.authorizationInstance.authorizeProfileToAccessPortofolio(node, portofolioId);
                const apis = yield authorization_service_1.authorizationInstance.authorizeProfileToAccessPortofolioApisRoutes(node, portofolioId, apisIds);
                liste.push({
                    portofolio,
                    apis
                });
                return liste;
            }), Promise.resolve([]));
        });
    }
    unauthorizeToAccessPortofolioApisRoute(profile, data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = Array.isArray(data) ? data : [data];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const promises = data.map(({ apisIds, portofolioId }) => __awaiter(this, void 0, void 0, function* () {
                if (!apisIds || apisIds.length === 0)
                    return;
                return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessPortofolioApisRoutes(node, portofolioId, apisIds);
            }));
            return Promise.all(promises).then((result) => {
                const res = result.flat();
                return res.reduce((liste, el) => {
                    const id = el === null || el === void 0 ? void 0 : el.getId().get();
                    if (id)
                        liste.push(id);
                    return liste;
                }, []);
            });
        });
    }
    getAuthorizedPortofolio(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return authorization_service_1.authorizationInstance.getAuthorizedPortofolioFromProfile(node);
        });
    }
    getAuthorizedPortofolioApp(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return authorization_service_1.authorizationInstance.getAuthorizedPortofolioAppFromProfile(node, portofolioId);
        });
    }
    getAuthorizedPortofolioApis(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return authorization_service_1.authorizationInstance.getAuthorizedApisRoutesFromProfile(node, portofolioId);
        });
    }
    getPortofolioAuthStructure(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const portofolios = yield this.getAuthorizedPortofolio(profile);
            const promises = portofolios.map((portofolio) => __awaiter(this, void 0, void 0, function* () {
                const portofolioId = portofolio.getId().get();
                return {
                    portofolio,
                    apps: yield this.getAuthorizedPortofolioApp(profile, portofolioId),
                    apis: yield this.getAuthorizedPortofolioApis(profile, portofolioId),
                    buildings: yield this.getBosAuthStructure(profile, portofolioId)
                };
            }));
            return Promise.all(promises);
        });
    }
    /////////////////////////////////////////////
    //                  BOS                    //
    /////////////////////////////////////////////
    authorizeToAccessBos(profile, portofolioId, BosId) {
        return __awaiter(this, void 0, void 0, function* () {
            BosId = Array.isArray(BosId) ? BosId : [BosId];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const promises = BosId.map(id => authorization_service_1.authorizationInstance.authorizeProfileToAccessBos(node, portofolioId, id));
            return Promise.all(promises);
        });
    }
    unauthorizeToAccessBos(profile, portofolioId, BosId) {
        return __awaiter(this, void 0, void 0, function* () {
            BosId = Array.isArray(BosId) ? BosId : [BosId];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const promises = BosId.map(id => authorization_service_1.authorizationInstance.unauthorizeProfileToAccessBos(node, portofolioId, id));
            return Promise.all(promises);
        });
    }
    authorizeToAccessBosApp(profile, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = Array.isArray(data) ? data : [data];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return data.reduce((prom, { buildingId, appsIds }) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const bos = yield authorization_service_1.authorizationInstance.authorizeProfileToAccessBos(node, portofolioId, buildingId);
                const apps = yield authorization_service_1.authorizationInstance.authorizeProfileToAccessBosApp(node, portofolioId, buildingId, appsIds);
                liste.push({
                    building: bos,
                    apps
                });
                return liste;
            }), Promise.resolve([]));
        });
    }
    unauthorizeToAccessBosApp(profile, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = Array.isArray(data) ? data : [data];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const promises = data.map(({ buildingId, appsIds }) => {
                return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessBosApp(node, portofolioId, buildingId, appsIds);
            });
            return Promise.all(promises).then((result) => {
                return result.flat();
            });
        });
    }
    authorizeToAccessBosApiRoute(profile, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = Array.isArray(data) ? data : [data];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return data.reduce((prom, { buildingId, apisIds }) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const bos = yield authorization_service_1.authorizationInstance.authorizeProfileToAccessBos(node, portofolioId, buildingId);
                const apis = yield authorization_service_1.authorizationInstance.authorizeProfileToAccessBosApisRoutes(node, portofolioId, buildingId, apisIds);
                liste.push({
                    building: bos,
                    apis
                });
                return liste;
            }), Promise.resolve([]));
        });
    }
    unauthorizeToAccessBosApiRoute(profile, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = Array.isArray(data) ? data : [data];
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const promises = data.map(({ buildingId, apisIds }) => {
                return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessBosApisRoutes(node, portofolioId, buildingId, apisIds);
            });
            return Promise.all(promises).then((result) => {
                const res = result.flat();
                return res.map(el => el === null || el === void 0 ? void 0 : el.getId().get());
            });
        });
    }
    getAuthorizedBos(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return authorization_service_1.authorizationInstance.getAuthorizedBosFromProfile(node, portofolioId);
        });
    }
    getAuthorizedBosApp(profile, portofolioId, bosId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return authorization_service_1.authorizationInstance.getAuthorizedBosAppFromProfile(node, portofolioId, bosId);
        });
    }
    getAuthorizedBosApis(profile, portofolioId, bosId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            return authorization_service_1.authorizationInstance.getAuthorizedBosApisRoutesFromProfile(node, portofolioId, bosId);
        });
    }
    getBosAuthStructure(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            if (!(node instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const buildings = yield this.getAuthorizedBos(profile, portofolioId);
            const promises = buildings.map((building) => __awaiter(this, void 0, void 0, function* () {
                const bosId = building.getId().get();
                return {
                    building,
                    apps: yield this.getAuthorizedBosApp(profile, portofolioId, bosId),
                    apis: yield this.getAuthorizedBosApis(profile, portofolioId, bosId)
                };
            }));
            return Promise.all(promises);
        });
    }
    getAllAuthorizedBos(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = profile instanceof spinal_env_viewer_graph_service_1.SpinalNode ? profile : yield this._getAppProfileNode(profile);
            const portofolios = yield this.getAuthorizedPortofolio(node);
            const promises = portofolios.map(el => this.getAuthorizedBos(node, el.getId().get()));
            return Promise.all(promises).then((result) => {
                return result.flat();
            });
        });
    }
    ///////////////////////////////////////////////////////////
    ///                       PRIVATES                      //
    //////////////////////////////////////////////////////////
    _authorizeIPortofolioAuth(profile, portofolioAuth) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const [portofolio] = yield this.authorizePortofolio(profile, portofolioAuth.portofolioId);
            const apisData = yield this.authorizeToAccessPortofolioApisRoute(profile, portofolioAuth);
            const buildingProm = portofolioAuth.building.map(bos => this._authorizeIBosAuth(profile, bos, portofolioAuth.portofolioId));
            return {
                portofolio,
                apis: (_a = apisData[0]) === null || _a === void 0 ? void 0 : _a.apis,
                buildings: yield Promise.all(buildingProm)
            };
        });
    }
    _unauthorizeIPortofolioAuth(profile, portofolioAuth) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.unauthorizeToAccessPortofolioApisRoute(profile, { portofolioId: portofolioAuth.portofolioId, apisIds: portofolioAuth.unauthorizeApisIds });
            const buildingProm = portofolioAuth.building.map(bos => this._unauthorizeIBosAuth(profile, bos, portofolioAuth.portofolioId));
            yield Promise.all(buildingProm);
        });
    }
    _authorizeIBosAuth(profile, bosAuth, portofolioId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const [building] = yield this.authorizeToAccessBos(profile, portofolioId, bosAuth.buildingId);
            const apisData = yield this.authorizeToAccessBosApiRoute(profile, portofolioId, bosAuth);
            return {
                building,
                apis: (_a = apisData[0]) === null || _a === void 0 ? void 0 : _a.apis
            };
        });
    }
    _unauthorizeIBosAuth(profile, bosAuth, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const apisData = yield this.unauthorizeToAccessBosApiRoute(profile, portofolioId, { buildingId: bosAuth.buildingId, apisIds: bosAuth.unauthorizeApisIds });
            return apisData;
        });
    }
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
    _createAppProfileNode(appProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = {
                name: appProfile.name,
                type: constant_1.APP_PROFILE_TYPE
            };
            const graph = new spinal_env_viewer_graph_service_1.SpinalGraph(appProfile.name);
            const profileId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, graph);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profileId);
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
}
exports.AppProfileService = AppProfileService;
//# sourceMappingURL=appProfile.service.js.map