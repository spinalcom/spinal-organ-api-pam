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
exports.APIService = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const configFile_service_1 = require("./configFile.service");
class APIService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new APIService();
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.API_ROUTES_CONTEXT_NAME);
            if (!this.context)
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.API_ROUTES_CONTEXT_NAME, constant_1.API_ROUTES_CONTEXT_TYPE);
            return this.context;
        });
    }
    createApiRoute(route) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiExist = yield this.getApiRouteByRoute(route);
            if (apiExist)
                throw `route ${route.method.toUpperCase()} ${route.route} already exists`;
            delete route.id;
            route.type = constant_1.API_ROUTE_TYPE;
            const routeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(route, undefined);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(routeId);
            return this.context.addChildInContext(node, constant_1.CONTEXT_TO_API_ROUTE, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    updateApiRoute(routeId, newValue) {
        return __awaiter(this, void 0, void 0, function* () {
            delete newValue.id;
            delete newValue.type;
            const route = yield this.getApiRouteById(routeId);
            if (!route)
                throw new Error(`no api route Found for ${routeId}`);
            for (const key in newValue) {
                if (Object.prototype.hasOwnProperty.call(newValue, key) && route.info[key]) {
                    const element = newValue[key];
                    route.info[key].set(element);
                }
            }
            return route;
        });
    }
    getApiRouteById(routeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(routeId);
            if (node)
                return node;
            const children = yield this.context.getChildrenInContext(this.context);
            return children.find(el => el.getId().get() === routeId);
        });
    }
    getApiRouteByRoute(apiRoute) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.context.getChildrenInContext(this.context);
            return children.find(el => {
                const { route, method } = el.info.get();
                if (route && method)
                    return route.toLowerCase() === apiRoute.route.toLowerCase() && method.toLowerCase() === apiRoute.method.toLowerCase();
                return false;
            });
        });
    }
    getAllApiRoute() {
        return this.context.getChildrenInContext(this.context);
    }
    deleteApiRoute(routeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = yield this.getApiRouteById(routeId);
            if (!route)
                throw new Error(`no api route Found for ${routeId}`);
            yield route.removeFromGraph();
            return routeId;
        });
    }
}
exports.APIService = APIService;
//# sourceMappingURL=apis.service.js.map