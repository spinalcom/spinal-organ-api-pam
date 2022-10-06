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
exports.AuthorizationService = exports.authorizationInstance = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const apis_service_1 = require("./apis.service");
const building_service_1 = require("./building.service");
const portofolio_service_1 = require("./portofolio.service");
class AuthorizationService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthorizationService();
        return this.instance;
    }
    profileHasAccess(profile, node, elementType) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getContextByType(profile, elementType);
            if (!context)
                return false;
            return node.belongsToContext(context);
        });
    }
    removePortofolioReferences(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [this._getAuthorizedBosContext(profile, false), this._getAuthorizedPortofolioContext(profile, false)];
            return Promise.all(promises).then(([bosContext, PortofolioContext]) => __awaiter(this, void 0, void 0, function* () {
                if (PortofolioContext)
                    yield this.unauthorizeProfileToAccessPortofolio(profile, portofolioId);
            })).catch((err) => {
            });
        });
    }
    /////////////////////////////////////////////////////////
    //                  PORTOFOLIO AUTH                    //
    /////////////////////////////////////////////////////////
    authorizeProfileToAccessPortofolio(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getAuthorizedPortofolioContext(profile, true);
            let reference = yield this._getReference(context, portofolioId);
            if (reference)
                return reference;
            const portofolio = yield portofolio_service_1.PortofolioService.getInstance().getPortofolio(portofolioId);
            if (!portofolio)
                return;
            reference = yield this._createNodeReference(portofolio);
            return context.addChildInContext(reference, constant_1.PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, constant_1.PTR_LST_TYPE, context);
        });
    }
    unauthorizeProfileToAccessPortofolio(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getAuthorizedPortofolioContext(profile, false);
            if (!context)
                return;
            let reference = yield this._getReference(context, portofolioId);
            if (!reference)
                return;
            return context.removeChild(reference, constant_1.PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, constant_1.PTR_LST_TYPE);
        });
    }
    authorizeProfileToAccessPortofolioApp(profile, portofolioId, appIds, portofolioRef) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            const reference = portofolioRef || (yield this.authorizeProfileToAccessPortofolio(profile, portofolioId));
            const context = yield this._getAuthorizedPortofolioContext(profile, true);
            return appIds.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                let liste = yield prom;
                const app = yield portofolio_service_1.PortofolioService.getInstance().getAppFromPortofolio(portofolioId, id);
                if (app) {
                    const appExist = reference.getChildrenIds().find(id => id === app.getId().get());
                    if (!appExist)
                        yield reference.addChildInContext(app, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
                    liste.push(app);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    unauthorizeProfileToAccessPortofolioApp(profile, portofolioId, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            const context = yield this._getAuthorizedPortofolioContext(profile, false);
            if (!context)
                return;
            const reference = yield this._getReference(context, portofolioId);
            if (!reference)
                return;
            const data = yield appIds.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                let liste = yield prom;
                const app = yield portofolio_service_1.PortofolioService.getInstance().getAppFromPortofolio(portofolioId, id);
                if (app) {
                    yield reference.removeChild(app, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
                    liste.push(app);
                }
                return liste;
            }), Promise.resolve([]));
            yield this._checkPortofolioValidity(profile, portofolioId, reference);
            return data;
        });
    }
    getAuthorizedPortofolioFromProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getAuthorizedPortofolioContext(profile, false);
            if (!context)
                return [];
            const children = yield context.getChildren([constant_1.PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION]);
            return children.reduce((prom, item) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                if (item) {
                    const element = yield item.getElement();
                    liste.push(element);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    getAuthorizedPortofolioAppFromProfile(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getAuthorizedPortofolioContext(profile, false);
            if (!context)
                return [];
            const reference = yield this._getReference(context, portofolioId);
            if (!reference)
                return [];
            return reference.getChildren(constant_1.APP_RELATION_NAME);
        });
    }
    //////////////////////////////////////////////////////////
    //            API's ROUTES AUTHORIZATION                //
    //////////////////////////////////////////////////////////
    authorizeProfileToAccessApisRoutes(profile, apiRoutesIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(apiRoutesIds))
                apiRoutesIds = [apiRoutesIds];
            const authApicontext = yield this._getAuthorizedApisRoutesContext(profile, true);
            if (!authApicontext)
                return;
            const promises = apiRoutesIds.map(id => this._addApiToContext(authApicontext, id));
            return Promise.all(promises).then((result) => {
                return authApicontext.getChildren(constant_1.CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME);
            });
        });
    }
    unauthorizeProfileToAccessApisRoutes(profile, apiRoutesIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(apiRoutesIds))
                apiRoutesIds = [apiRoutesIds];
            const authcontext = yield this._getAuthorizedApisRoutesContext(profile);
            if (!authcontext)
                return;
            const promises = apiRoutesIds.map(el => this._removeApiFromContext(authcontext, el));
            return Promise.all(promises);
        });
    }
    getAuthorizedApisRoutesFromProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const authAppcontext = yield this._getAuthorizedApisRoutesContext(profile);
            if (!authAppcontext)
                return [];
            return authAppcontext.getChildren(constant_1.CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME);
        });
    }
    // //////////////////////////////////////////////////////////
    // //                  BOS AUTHORIZATION                   //
    // //////////////////////////////////////////////////////////
    authorizeProfileToAccessBos(profile, BosId) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getAuthorizedBosContext(profile, true);
            let reference = yield this._getReference(context, BosId);
            if (reference)
                return reference;
            const bos = yield building_service_1.BuildingService.getInstance().getBuildingById(BosId);
            if (!bos)
                return;
            reference = yield this._createNodeReference(bos);
            return context.addChildInContext(reference, constant_1.PROFILE_TO_AUTHORIZED_BOS_RELATION, constant_1.PTR_LST_TYPE, context);
        });
    }
    unauthorizeProfileToAccessBos(profile, BosId) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getAuthorizedBosContext(profile, false);
            if (!context)
                return;
            let reference = yield this._getReference(context, BosId);
            if (!reference)
                return;
            return context.removeChild(reference, constant_1.PROFILE_TO_AUTHORIZED_BOS_RELATION, constant_1.PTR_LST_TYPE);
        });
    }
    authorizeProfileToAccessBosApp(profile, BosId, appIds, BosRef) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            const reference = BosRef || (yield this.authorizeProfileToAccessBos(profile, BosId));
            const context = yield this._getAuthorizedBosContext(profile, true);
            return appIds.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                let liste = yield prom;
                const app = yield building_service_1.BuildingService.getInstance().getAppFromBuilding(BosId, id);
                if (app) {
                    const appExist = reference.getChildrenIds().find(id => id === app.getId().get());
                    if (!appExist)
                        yield reference.addChildInContext(app, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
                    liste.push(app);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    unauthorizeProfileToAccessBosApp(profile, BosId, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            const context = yield this._getAuthorizedBosContext(profile, false);
            if (!context)
                return;
            let reference = yield this._getReference(context, BosId);
            if (!reference)
                return;
            const data = yield appIds.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                let liste = yield prom;
                const app = yield building_service_1.BuildingService.getInstance().getAppFromBuilding(BosId, id);
                if (app) {
                    yield reference.removeChild(app, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
                    liste.push(app);
                }
                return liste;
            }), Promise.resolve([]));
            yield this._checkBosValidity(profile, BosId, reference);
            return data;
        });
    }
    getAuthorizedBosFromProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getAuthorizedBosContext(profile, false);
            if (!context)
                return [];
            const children = yield context.getChildren([constant_1.PROFILE_TO_AUTHORIZED_BOS_RELATION]);
            return children.reduce((prom, item) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                if (item) {
                    const element = yield item.getElement();
                    liste.push(element);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    getAuthorizedBosAppFromProfile(profile, bosId) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getAuthorizedBosContext(profile, false);
            if (!context)
                return [];
            const reference = yield this._getReference(context, bosId);
            if (!reference)
                return [];
            return reference.getChildren(constant_1.APP_RELATION_NAME);
        });
    }
    //////////////////////////////////////////////////////////
    //                     PRIVATES                         //
    //////////////////////////////////////////////////////////
    _getAuthorizedPortofolioContext(profile, createIfNotExist = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getOrCreateContext(profile, constant_1.AUTHORIZED_PORTOFOLIO_CONTEXT_NAME, createIfNotExist, constant_1.AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE);
        });
    }
    _getAuthorizedApisRoutesContext(profile, createIfNotExist = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getOrCreateContext(profile, constant_1.AUTHORIZED_API_CONTEXT_NAME, createIfNotExist, constant_1.AUTHORIZED_API_CONTEXT_TYPE);
        });
    }
    _getAuthorizedBosContext(profile, createIfNotExist = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getOrCreateContext(profile, constant_1.AUTHORIZED_BOS_CONTEXT_NAME, createIfNotExist, constant_1.AUTHORIZED_BOS_CONTEXT_TYPE);
        });
    }
    _addApiToContext(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield apis_service_1.APIService.getInstance().getApiRouteById(id);
                if (node) {
                    const apiExist = context.getChildrenIds().find(id => id === node.getId().get());
                    if (!apiExist)
                        return context.addChildInContext(node, constant_1.CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
                    return node;
                }
            }
            catch (error) { }
        });
    }
    _removeApiFromContext(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield apis_service_1.APIService.getInstance().getApiRouteById(id);
                if (node) {
                    yield context.removeChild(node, constant_1.CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME, constant_1.PTR_LST_TYPE);
                    return node.getId().get();
                }
            }
            catch (error) { }
        });
    }
    _getOrCreateContext(profile, contextName, createIfNotExist, contextType) {
        return __awaiter(this, void 0, void 0, function* () {
            const graph = yield this._getProfileGraph(profile);
            if (graph) {
                let context = yield graph.getContext(contextName);
                if (context)
                    return context;
                if (!createIfNotExist)
                    return;
                let newContext = new spinal_env_viewer_graph_service_1.SpinalContext(contextName, contextType);
                return graph.addContext(newContext);
            }
        });
    }
    _getProfileGraph(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (profile)
                return profile.getElement();
        });
    }
    _getReference(context, referenceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield context.getChildren();
            for (const child of children) {
                const element = yield child.getElement(true);
                if (element && element.getId().get() === referenceId)
                    return child;
            }
        });
    }
    _createNodeReference(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const refNode = new spinal_env_viewer_graph_service_1.SpinalNode(node.getName().get(), node.getType().get(), node);
            refNode.info.name.set(node.info.name);
            return refNode;
        });
    }
    _getContextByType(profile, elementType) {
        switch (elementType) {
            case constant_1.AUTHORIZED_API_CONTEXT_TYPE:
                return this._getAuthorizedApisRoutesContext(profile);
            case constant_1.AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE:
                return this._getAuthorizedPortofolioContext(profile);
            case constant_1.AUTHORIZED_BOS_CONTEXT_TYPE:
                return this._getAuthorizedBosContext(profile);
            default:
                break;
        }
    }
    _checkPortofolioValidity(profile, portofolioId, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield reference.getChildren(constant_1.APP_RELATION_NAME);
            if (children.length > 0)
                return;
            return this.unauthorizeProfileToAccessPortofolio(profile, portofolioId);
        });
    }
    _checkBosValidity(profile, bosId, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield reference.getChildren(constant_1.APP_RELATION_NAME);
            if (children.length > 0)
                return;
            return this.unauthorizeProfileToAccessBos(profile, bosId);
        });
    }
}
exports.default = AuthorizationService;
exports.AuthorizationService = AuthorizationService;
const authorizationInstance = AuthorizationService.getInstance();
exports.authorizationInstance = authorizationInstance;
//# sourceMappingURL=authorization.service.js.map