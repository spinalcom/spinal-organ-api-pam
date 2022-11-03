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
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const building_service_1 = require("./building.service");
const portofolio_service_1 = require("./portofolio.service");
class AuthorizationService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthorizationService();
        return this.instance;
    }
    profileHasAccess(profile, node) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getAuthorizedPortofolioContext(profile, true);
            if (!context)
                return false;
            const id = typeof node === "string" ? node : node.getId().get();
            const found = yield context.findInContextAsyncPredicate(context, ((node, stop) => __awaiter(this, void 0, void 0, function* () {
                const element = yield node.getElement(true);
                if (element && element.getId().get() === id) {
                    stop();
                    return true;
                }
                return false;
            })));
            return found && found.length > 0 ? true : false;
        });
    }
    // public async removePortofolioReferences(profile: SpinalNode, portofolioId: string): Promise<void> {
    //     const promises = [this._getAuthorizedBosContext(profile, false), this._getAuthorizedPortofolioContext(profile, false)]
    //     return Promise.all(promises).then(async ([bosContext, PortofolioContext]) => {
    //         if (PortofolioContext) await this.unauthorizeProfileToAccessPortofolio(profile, portofolioId);
    //     }).catch((err) => {
    //     });
    // }
    /////////////////////////////////////////////////////////
    //                  PORTOFOLIO AUTH                    //
    /////////////////////////////////////////////////////////
    //Authorize
    authorizeProfileToAccessPortofolio(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getAuthorizedPortofolioContext(profile, true);
            let reference = yield this._getReference(context, portofolioId);
            if (reference) {
                return this._getRealNode(reference);
            }
            const portofolio = yield portofolio_service_1.PortofolioService.getInstance().getPortofolio(portofolioId);
            if (!portofolio)
                return;
            reference = yield this._createNodeReference(portofolio);
            yield context.addChildInContext(reference, constant_1.PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, constant_1.PTR_LST_TYPE, context);
            return portofolio;
        });
    }
    authorizeProfileToAccessPortofolioApp(profile, portofolioId, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            yield this.authorizeProfileToAccessPortofolio(profile, portofolioId);
            const context = yield this._getAuthorizedPortofolioContext(profile, false);
            const reference = yield this._getReference(context, portofolioId);
            return appIds.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                let liste = yield prom;
                const app = yield portofolio_service_1.PortofolioService.getInstance().getAppFromPortofolio(portofolioId, id);
                if (app) {
                    let appExist = yield this._getReference(reference, app.getId().get(), [constant_1.APP_RELATION_NAME]);
                    if (!appExist) {
                        appExist = yield this._createNodeReference(app);
                        yield reference.addChildInContext(appExist, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
                    }
                    ;
                    liste.push(app);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    // unauthorize
    unauthorizeProfileToAccessPortofolio(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { context, portofolioRef } = yield this._getRefTree(profile, portofolioId);
            if (context && portofolioRef) {
                try {
                    yield context.removeChild(portofolioRef, constant_1.PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, constant_1.PTR_LST_TYPE);
                }
                catch (error) {
                    return false;
                }
            }
            return false;
        });
    }
    unauthorizeProfileToAccessPortofolioApp(profile, portofolioId, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            const { portofolioRef } = yield this._getRefTree(profile, portofolioId);
            if (!portofolioRef)
                return [];
            const data = yield appIds.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                let liste = yield prom;
                const app = yield portofolio_service_1.PortofolioService.getInstance().getAppFromPortofolio(portofolioId, id);
                if (app) {
                    const appExist = yield this._getReference(portofolioRef, app.getId().get(), [constant_1.APP_RELATION_NAME]);
                    try {
                        yield portofolioRef.removeChild(appExist, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
                        liste.push(app);
                    }
                    catch (error) { }
                }
                return liste;
            }), Promise.resolve([]));
            yield this._checkPortofolioValidity(profile, portofolioId, portofolioRef);
            return data;
        });
    }
    // get
    getAuthorizedPortofolioFromProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getAuthorizedPortofolioContext(profile, false);
            if (!context)
                return [];
            const children = yield context.getChildren([constant_1.PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION]);
            return children.reduce((prom, item) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                if (item) {
                    const element = yield this._getRealNode(item);
                    liste.push(element);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    getAuthorizedPortofolioAppFromProfile(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { context, portofolioRef } = yield this._getRefTree(profile, portofolioId);
            if (context && portofolioRef) {
                const children = yield portofolioRef.getChildren(constant_1.APP_RELATION_NAME);
                return children.reduce((prom, item) => __awaiter(this, void 0, void 0, function* () {
                    const liste = yield prom;
                    if (item) {
                        const element = yield this._getRealNode(item);
                        liste.push(element);
                    }
                    return liste;
                }), Promise.resolve([]));
            }
            return [];
        });
    }
    // //////////////////////////////////////////////////////////
    // //                  BOS AUTHORIZATION                   //
    // //////////////////////////////////////////////////////////
    // authorize
    authorizeProfileToAccessBos(profile, portofolioId, BosId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorizeProfileToAccessPortofolio(profile, portofolioId);
            const { context, portofolioRef } = yield this._getRefTree(profile, portofolioId);
            const bos = yield portofolio_service_1.PortofolioService.getInstance().getBuildingFromPortofolio(portofolioId, BosId);
            if (!bos)
                return;
            const bosExist = yield this._getReference(portofolioRef, BosId, [constant_1.PROFILE_TO_AUTHORIZED_BOS_RELATION]);
            if (!bosExist) {
                const reference = yield this._createNodeReference(bos);
                yield portofolioRef.addChildInContext(reference, constant_1.PROFILE_TO_AUTHORIZED_BOS_RELATION, constant_1.PTR_LST_TYPE, context);
            }
            return bos;
        });
    }
    authorizeProfileToAccessBosApp(profile, portofolioId, BosId, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            yield this.authorizeProfileToAccessBos(profile, portofolioId, BosId);
            const { context, bosRef } = yield this._getRefTree(profile, portofolioId, BosId);
            return appIds.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                let liste = yield prom;
                const app = yield building_service_1.BuildingService.getInstance().getAppFromBuilding(BosId, id);
                if (app) {
                    let appExist = yield this._getReference(bosRef, app.getId().get(), [constant_1.APP_RELATION_NAME]);
                    if (!appExist) {
                        appExist = yield this._createNodeReference(app);
                        yield bosRef.addChildInContext(appExist, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
                    }
                    ;
                    liste.push(app);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    // unauthorize
    unauthorizeProfileToAccessBos(profile, portofolioId, BosId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { portofolioRef, bosRef } = yield this._getRefTree(profile, portofolioId, BosId);
            if (portofolioRef && bosRef) {
                try {
                    yield portofolioRef.removeChild(bosRef, constant_1.PROFILE_TO_AUTHORIZED_BOS_RELATION, constant_1.PTR_LST_TYPE);
                    return true;
                }
                catch (error) { }
            }
            return false;
        });
    }
    unauthorizeProfileToAccessBosApp(profile, portofolioId, BosId, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            const { bosRef } = yield this._getRefTree(profile, portofolioId, BosId);
            if (!bosRef)
                return;
            const data = yield appIds.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                let liste = yield prom;
                const app = yield building_service_1.BuildingService.getInstance().getAppFromBuilding(BosId, id);
                if (app) {
                    const appRef = yield this._getReference(bosRef, app.getId().get(), [constant_1.APP_RELATION_NAME]);
                    if (appRef) {
                        yield bosRef.removeChild(appRef, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
                        liste.push(app);
                    }
                }
                return liste;
            }), Promise.resolve([]));
            yield this._checkBosValidity(profile, portofolioId, BosId, bosRef);
            return data;
        });
    }
    // get
    getAuthorizedBosFromProfile(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { portofolioRef } = yield this._getRefTree(profile, portofolioId);
            const children = yield portofolioRef.getChildren(constant_1.PROFILE_TO_AUTHORIZED_BOS_RELATION);
            return children.reduce((prom, item) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                if (item) {
                    const element = yield this._getRealNode(item);
                    liste.push(element);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    getAuthorizedBosAppFromProfile(profile, portofolioId, BosId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bosRef } = yield this._getRefTree(profile, portofolioId, BosId);
            if (!bosRef)
                return [];
            const children = yield bosRef.getChildren(constant_1.APP_RELATION_NAME);
            return children.reduce((prom, item) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                if (item) {
                    const element = yield this._getRealNode(item);
                    liste.push(element);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    //////////////////////////////////////////////////////////
    //            API's ROUTES AUTHORIZATION                //
    //////////////////////////////////////////////////////////
    //authorize
    authorizeProfileToAccessPortofolioApisRoutes(profile, portofolioId, apiRoutesIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(apiRoutesIds))
                apiRoutesIds = [apiRoutesIds];
            // const authApicontext = await this._getAuthorizedApisRoutesContext(profile, true);
            // if (!authApicontext) return;
            yield this.authorizeProfileToAccessPortofolio(profile, portofolioId);
            const { context, portofolioRef } = yield this._getRefTree(profile, portofolioId);
            return apiRoutesIds.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const node = yield portofolio_service_1.PortofolioService.getInstance().getApiFromPortofolio(portofolioId, id);
                if (node) {
                    let apiExist = yield this._getReference(portofolioRef, id, [constant_1.API_RELATION_NAME]);
                    if (!apiExist) {
                        const _temp = yield this._createNodeReference(node);
                        apiExist = yield portofolioRef.addChildInContext(_temp, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
                    }
                    liste.push(node);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    authorizeProfileToAccessBosApisRoutes(profile, portofolioId, bosId, apiRoutesIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(apiRoutesIds))
                apiRoutesIds = [apiRoutesIds];
            yield this.authorizeProfileToAccessBos(profile, portofolioId, bosId);
            const { context, bosRef } = yield this._getRefTree(profile, portofolioId, bosId);
            if (!bosRef)
                return;
            return apiRoutesIds.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const node = yield building_service_1.BuildingService.getInstance().getApiFromBuilding(bosId, id);
                if (node) {
                    let apiExist = yield this._getReference(bosRef, id, [constant_1.API_RELATION_NAME]);
                    if (!apiExist) {
                        const _temp = yield this._createNodeReference(node);
                        apiExist = yield bosRef.addChildInContext(_temp, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
                    }
                    liste.push(node);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    // unauthorize
    unauthorizeProfileToAccessPortofolioApisRoutes(profile, portofolioId, apiRoutesIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(apiRoutesIds))
                apiRoutesIds = [apiRoutesIds];
            const { portofolioRef } = yield this._getRefTree(profile, portofolioId);
            if (!portofolioRef)
                return;
            return apiRoutesIds.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const route = yield portofolio_service_1.PortofolioService.getInstance().getApiFromPortofolio(portofolioId, id);
                if (route) {
                    const routeRef = yield this._getReference(portofolioRef, id, [constant_1.API_RELATION_NAME]);
                    try {
                        yield portofolioRef.removeChild(routeRef, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE);
                        liste.push(route);
                    }
                    catch (error) { }
                }
                return liste;
                // this._removeApiFromContext(authcontext, el)
            }), Promise.resolve([]));
        });
    }
    unauthorizeProfileToAccessBosApisRoutes(profile, portofolioId, bosId, apiRoutesIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(apiRoutesIds))
                apiRoutesIds = [apiRoutesIds];
            const { bosRef } = yield this._getRefTree(profile, portofolioId, bosId);
            if (!bosRef)
                return;
            return apiRoutesIds.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const route = yield building_service_1.BuildingService.getInstance().getApiFromBuilding(bosId, id);
                if (route) {
                    const routeRef = yield this._getReference(bosRef, id, [constant_1.API_RELATION_NAME]);
                    try {
                        yield bosRef.removeChild(routeRef, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE);
                        liste.push(route);
                    }
                    catch (error) { }
                }
                return liste;
                // this._removeApiFromContext(authcontext, el)
            }), Promise.resolve([]));
        });
    }
    // get
    getAuthorizedApisRoutesFromProfile(profile, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { portofolioRef } = yield this._getRefTree(profile, portofolioId);
            if (!portofolioRef)
                return [];
            const children = yield portofolioRef.getChildren(constant_1.API_RELATION_NAME);
            return children.reduce((prom, item) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                if (item) {
                    const element = yield this._getRealNode(item);
                    liste.push(element);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    getAuthorizedBosApisRoutesFromProfile(profile, portofolioId, BosId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bosRef } = yield this._getRefTree(profile, portofolioId, BosId);
            if (!bosRef)
                return [];
            const children = yield bosRef.getChildren(constant_1.API_RELATION_NAME);
            return children.reduce((prom, item) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                if (item) {
                    const element = yield this._getRealNode(item);
                    liste.push(element);
                }
                return liste;
            }), Promise.resolve([]));
        });
    }
    //////////////////////////////////////////////////////////
    //                     PRIVATES                         //
    //////////////////////////////////////////////////////////
    _getRefTree(profile, portofolioId, BosId) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getAuthorizedPortofolioContext(profile, false);
            if (!context || !portofolioId)
                return { context };
            const portofolioRef = yield this._getReference(context, portofolioId);
            if (!portofolioRef || !BosId)
                return { context, portofolioRef };
            const bosRef = yield this._getReference(portofolioRef, BosId, [constant_1.PROFILE_TO_AUTHORIZED_BOS_RELATION]);
            return { context, portofolioRef, bosRef };
        });
    }
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
    // private async _addApiToContext(context: SpinalContext, id: string): Promise<SpinalNode> {
    //     try {
    //         const node = await APIService.getInstance().getApiRouteById(id);
    //         if (node) {
    //             const apiExist = context.getChildrenIds().find(id => id === node.getId().get());
    //             if (!apiExist) return context.addChildInContext(node, CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME, PTR_LST_TYPE, context);
    //             return node;
    //         }
    //     } catch (error) { }
    // }
    // private async _removeApiFromContext(context: SpinalContext, id: string): Promise<string> {
    //     try {
    //         const node = await APIService.getInstance().getApiRouteById(id);
    //         if (node) {
    //             await context.removeChild(node, CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME, PTR_LST_TYPE);
    //             return node.getId().get();
    //         }
    //     } catch (error) { }
    // }
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
    _getReference(startNode, referenceId, relationName = []) {
        return __awaiter(this, void 0, void 0, function* () {
            let queue = [startNode];
            while (queue.length > 0) {
                const child = queue.shift();
                if (child instanceof spinal_env_viewer_graph_service_1.SpinalNode) {
                    const element = yield child.getElement(true);
                    if (element && element.getId().get() === referenceId)
                        return child;
                    const children = yield child.getChildren(relationName);
                    queue.push(...children);
                }
            }
        });
    }
    _getRealNode(refNode) {
        return refNode.getElement(false);
    }
    _createNodeReference(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const refNode = new spinal_env_viewer_graph_service_1.SpinalNode(node.getName().get(), node.getType().get(), node);
            refNode.info.name.set(node.info.name);
            this._addRefToNode(node, refNode);
            return refNode;
        });
    }
    _addRefToNode(node, ref) {
        if (node.info.references) {
            return new Promise((resolve, reject) => {
                node.info.references.load((lst) => {
                    lst.push(ref);
                    resolve(ref);
                });
            });
        }
        else {
            node.info.add_attr({
                references: new spinal_core_connectorjs_type_1.Ptr(new spinal_core_connectorjs_type_1.Lst([ref]))
            });
            return Promise.resolve(ref);
        }
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
            const children = yield reference.getChildren();
            if (children.length > 0)
                return;
            return this.unauthorizeProfileToAccessPortofolio(profile, portofolioId);
        });
    }
    _checkBosValidity(profile, portofolioId, bosId, reference) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield reference.getChildren();
            if (children.length > 0)
                return;
            return this.unauthorizeProfileToAccessBos(profile, portofolioId, bosId);
        });
    }
}
exports.default = AuthorizationService;
exports.AuthorizationService = AuthorizationService;
const authorizationInstance = AuthorizationService.getInstance();
exports.authorizationInstance = authorizationInstance;
//# sourceMappingURL=authorization.service.js.map