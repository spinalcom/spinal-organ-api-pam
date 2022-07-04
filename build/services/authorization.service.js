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
const apps_service_1 = require("./apps.service");
const building_service_1 = require("./building.service");
class AuthorizationService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthorizationService();
        return this.instance;
    }
    profileHasAccess(profile, element, elementType) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getContextByType(profile, elementType);
            if (!context)
                return false;
            return element.belongsToContext(context);
        });
    }
    //////////////////////////////////////////////////////////
    //                  APPS AUTHORIZATION                  //
    //////////////////////////////////////////////////////////
    authorizeProfileToAccessApp(profile, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            const authAppcontext = yield this._getAuthorizedAppsContext(profile, true);
            if (!authAppcontext)
                return;
            const promises = appIds.map(id => this._addAppToContext(authAppcontext, id));
            return Promise.all(promises).then((result) => {
                return authAppcontext.getChildren(constant_1.CONTEXT_TO_AUTHORIZED_APPS_RELATION_NAME);
            });
        });
    }
    unauthorizeProfileToAccessApp(profile, appIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            const authAppcontext = yield this._getAuthorizedAppsContext(profile);
            if (!authAppcontext)
                return;
            const promises = appIds.map(el => this._removeAppToContext(authAppcontext, el));
            return Promise.all(promises);
        });
    }
    getAuthorizedAppsFromProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const authAppcontext = yield this._getAuthorizedAppsContext(profile);
            if (!authAppcontext)
                return [];
            return authAppcontext.getChildren(constant_1.CONTEXT_TO_AUTHORIZED_APPS_RELATION_NAME);
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
            const promises = apiRoutesIds.map(el => this._removeApiToContext(authcontext, el));
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
    //////////////////////////////////////////////////////////
    //                  BOS AUTHORIZATION                   //
    //////////////////////////////////////////////////////////
    authorizeProfileToAccessBos(profile, bosIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(bosIds))
                bosIds = [bosIds];
            const authApicontext = yield this._getAuthorizedBosContext(profile, true);
            if (!authApicontext)
                return;
            const promises = bosIds.map(id => this._addBosToContext(authApicontext, id));
            return Promise.all(promises).then((result) => {
                return authApicontext.getChildren(constant_1.CONTEXT_TO_AUTHORIZED_BOS_RELATION_NAME);
            });
        });
    }
    unauthorizeProfileToAccessBos(profile, bosIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(bosIds))
                bosIds = [bosIds];
            const authcontext = yield this._getAuthorizedBosContext(profile);
            if (!authcontext)
                return;
            const promises = bosIds.map(el => this._removeBosToContext(authcontext, el));
            return Promise.all(promises);
        });
    }
    getAuthorizedBosFromProfile(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const authAppcontext = yield this._getAuthorizedBosContext(profile);
            if (!authAppcontext)
                return [];
            return authAppcontext.getChildren(constant_1.CONTEXT_TO_AUTHORIZED_BOS_RELATION_NAME);
        });
    }
    //////////////////////////////////////////////////////////
    //                     PRIVATES                         //
    //////////////////////////////////////////////////////////
    _getAuthorizedAppsContext(profile, createIfNotExist = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getOrCreateContext(profile, constant_1.AUTHORIZED_APP_CONTEXT_NAME, createIfNotExist, constant_1.AUTHORIZED_APPS_CONTEXT_TYPE);
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
    _getProfileGraph(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (profile)
                return profile.getElement();
        });
    }
    _addAppToContext(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield apps_service_1.AppService.getInstance().getAppById(id);
                if (node)
                    return context.addChildInContext(node, constant_1.CONTEXT_TO_AUTHORIZED_APPS_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
            }
            catch (error) { }
        });
    }
    _addApiToContext(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield apis_service_1.APIService.getInstance().getApiRouteById(id);
                if (node)
                    return context.addChildInContext(node, constant_1.CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
            }
            catch (error) { }
        });
    }
    _addBosToContext(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield building_service_1.BuildingService.getInstance().getBuilding(id);
                if (node)
                    return context.addChildInContext(node, constant_1.CONTEXT_TO_AUTHORIZED_BOS_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
            }
            catch (error) { }
        });
    }
    _removeAppToContext(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield apps_service_1.AppService.getInstance().getAppById(id);
                if (node) {
                    yield context.removeChild(node, constant_1.CONTEXT_TO_AUTHORIZED_APPS_RELATION_NAME, constant_1.PTR_LST_TYPE);
                    return node.getId().get();
                }
            }
            catch (error) { }
        });
    }
    _removeApiToContext(context, id) {
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
    _removeBosToContext(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield building_service_1.BuildingService.getInstance().getBuilding(id);
                if (node) {
                    yield context.removeChild(node, constant_1.CONTEXT_TO_AUTHORIZED_BOS_RELATION_NAME, constant_1.PTR_LST_TYPE);
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
    _getContextByType(profile, elementType) {
        switch (elementType) {
            case constant_1.AUTHORIZED_API_CONTEXT_TYPE:
                return this._getAuthorizedApisRoutesContext(profile);
            case constant_1.AUTHORIZED_APPS_CONTEXT_TYPE:
                return this._getAuthorizedAppsContext(profile);
            default:
                break;
        }
    }
}
exports.default = AuthorizationService;
exports.AuthorizationService = AuthorizationService;
const authorizationInstance = AuthorizationService.getInstance();
exports.authorizationInstance = authorizationInstance;
//# sourceMappingURL=authorization.service.js.map