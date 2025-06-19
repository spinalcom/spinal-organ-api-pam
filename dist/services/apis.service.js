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
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIService = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const authorizationUtils_1 = require("../utils/authorizationUtils");
/**
 * Service for managing API routes in the SpinalCom system.
 * Handles CRUD operations for API routes, Swagger file uploads, and context/group management.
 *
 * The `parentType` parameter can be either `BUILDING_API_GROUP_TYPE` ("BuildingApis") or `PORTOFOLIO_API_GROUP_TYPE` ("PortofolioApis").
 */
class APIService {
    // Private constructor for singleton pattern
    constructor() { }
    /**
     * Returns the singleton instance of APIService.
     */
    static getInstance() {
        if (!this.instance)
            this.instance = new APIService();
        return this.instance;
    }
    /**
     * Initializes the API routes context in the given graph.
     * Creates the context if it does not exist.
     * @param graph SpinalGraph instance
     */
    async init(graph) {
        this.context = await graph.getContext(constant_1.API_ROUTES_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.API_ROUTES_CONTEXT_NAME, constant_1.API_ROUTES_CONTEXT_TYPE);
            this.context = await graph.addContext(spinalContext);
        }
        return this.context;
    }
    /**
     * Creates a new API route node under the specified group type ("BuildingApis" or "PortofolioApis").
     * If the route already exists, returns the existing node.
     * @param routeInfo Route information
     * @param routeGroupType  group type ("BuildingApis" or "PortofolioApis")
     */
    async createApiRoute(routeInfo, routeGroupType) {
        const apiAlreadyExist = await this.getApiRouteByRoute(routeInfo, routeGroupType);
        if (apiAlreadyExist)
            return apiAlreadyExist;
        const routeGroup = await this._getOrCreateRoutesGroup(routeGroupType);
        const { id, ...routeInfoWithoutId } = routeInfo; // Remove id from routeInfo
        const routeInfoFormatted = Object.assign({}, routeInfoWithoutId, { type: constant_1.API_ROUTE_TYPE, name: routeInfo.route });
        const routeNode = new spinal_env_viewer_graph_service_1.SpinalNode(routeInfoFormatted.name, routeInfoFormatted.type);
        for (const key in routeInfoFormatted) {
            if (Object.prototype.hasOwnProperty.call(routeInfoFormatted, key)) {
                const element = routeInfoFormatted[key];
                routeNode.info.mod_attr(key, element);
            }
        }
        // routeNode.mod_attr("info", routeInfoFormatted);
        return routeGroup.addChildInContext(routeNode, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
    }
    /**
     * Updates an existing API route node with new values.
     * @param routeId node Id of the route node
     * @param newValue New route data
     * @param routeGroupType  group type ("BuildingApis" or "PortofolioApis")
     */
    async updateApiRoute(routeId, routeNewValue, routeGroupType) {
        const { id, type, ...propertiesToUpdate } = routeNewValue; // Remove id and type from properties to update
        const route = await this.getApiRouteById(routeId, routeGroupType);
        if (!route)
            throw new Error(`no api route Found for ${routeId}`);
        for (const key in propertiesToUpdate) {
            if (Object.prototype.hasOwnProperty.call(propertiesToUpdate, key) && route.info[key]) {
                const element = propertiesToUpdate[key];
                route.info[key].set(element);
            }
        }
        return route;
    }
    /**
     * Retrieves an API route node by its ID and group type.
     * @param routeId Route node ID
     * @param routeGroupType group type ("BuildingApis" or "PortofolioApis")
     */
    async getApiRouteById(routeId, routeGroupType) {
        const routeGroup = await this._getOrCreateRoutesGroup(routeGroupType);
        const routes = await routeGroup.getChildrenInContext(this.context);
        return routes.find(el => el.getId().get() === routeId);
    }
    /**
     * Retrieves an API route node by its route and method.
     * @param apiRoute Route information
     * @param routeGroupType Parent group type ("BuildingApis" or "PortofolioApis")
     */
    async getApiRouteByRoute(apiRoute, routeGroupType) {
        const routeGroup = await this._getOrCreateRoutesGroup(routeGroupType);
        // Remove query parameters for matching
        if (apiRoute.route.includes("?"))
            apiRoute.route = apiRoute.route.substring(0, apiRoute.route.indexOf('?'));
        const routesInGroup = await routeGroup.getChildrenInContext(this.context);
        return routesInGroup.find(routeNode => {
            const { route, method } = routeNode.info.get();
            if (route && method && method.toLowerCase() === apiRoute.method.toLowerCase()) { // Check if method matches
                // Format the route to a regular expression for matching
                const routeFormatted = this._formatRouteAsRegexp(route);
                return apiRoute.route.match(routeFormatted);
            }
            return false;
        });
    }
    /**
     * Retrieves all API route nodes under the specified parent type group.
     * @param routeGroupType group type ("BuildingApis" or "PortofolioApis")
     */
    async getAllApiRoute(routeGroupType) {
        const routeGroup = await this._getOrCreateRoutesGroup(routeGroupType);
        return routeGroup.getChildrenInContext(this.context);
    }
    /**
     * Deletes an API route node by its ID and group type.
     * @param routeId Route node ID
     * @param routeGroupType group type ("BuildingApis" or "PortofolioApis")
     */
    async deleteApiRoute(routeId, routeGroupType) {
        const route = await this.getApiRouteById(routeId, routeGroupType);
        if (!route)
            throw new Error(`no api route Found for ${routeId}`);
        await (0, authorizationUtils_1.removeNodeReferences)(route);
        await route.removeFromGraph();
        return routeId;
    }
    /**
     * Uploads and parses a Swagger file, creating API route nodes for each route defined.
     * @param buffer Swagger file buffer
     * @param routeGroupType Parent group type ("BuildingApis" or "PortofolioApis")
     */
    async createRoutesFromSwaggerFile(buffer, routeGroupType) {
        const swaggerData = await this._readBuffer(buffer);
        const routes = await this._formatSwaggerFile(swaggerData);
        if (!routes || routes.length === 0)
            throw new Error("No routes found in the Swagger file");
        const promises = [];
        for (const route of routes) {
            promises.push(this.createApiRoute(route, routeGroupType));
        }
        // Use Promise.allSettled to handle all promises and return only fulfilled ones
        return Promise.allSettled(promises).then((results) => {
            return results.reduce((validItems, result) => {
                if (result.status === "fulfilled" && result.value) {
                    validItems.push(result.value);
                }
                return validItems;
            }, []);
        }).catch((err) => {
            return Promise.reject(new Error(`Error creating routes from Swagger file: ${err.message}`));
        });
    }
    //////////////////////////////////////////////
    //                  PRIVATE                 //
    //////////////////////////////////////////////
    /**
     * Gets or creates the API routes group node for the given type.
     * @param type Group type ("BuildingApis" or "PortofolioApis")
     */
    async _getOrCreateRoutesGroup(groupType) {
        const children = await this.context.getChildren([constant_1.CONTEXT_TO_API_ROUTE_GROUP_RELATION_NAME]);
        let groupFound = children.find(el => el.getType().get() === groupType);
        if (groupFound)
            return groupFound;
        const name = groupType === constant_1.BUILDING_API_GROUP_TYPE ? constant_1.BUILDING_API_GROUP_NAME : constant_1.PORTOFOLIO_API_GROUP_NAME;
        let node = new spinal_env_viewer_graph_service_1.SpinalNode(name, groupType);
        return this.context.addChildInContext(node, constant_1.CONTEXT_TO_API_ROUTE_GROUP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
    }
    /**
     * Formats a Swagger file into an array of IApiRoute objects.
     * @param swaggerFile Swagger file object
     */
    _formatSwaggerFile(swaggerFile) {
        try {
            const paths = swaggerFile.paths || [];
            const data = [];
            for (const key in paths) {
                if (Object.prototype.hasOwnProperty.call(paths, key)) {
                    const method = this._getRequestMethod(paths[key]);
                    data.push({
                        route: key,
                        method: method && method.toUpperCase(),
                        tag: this._getRequestTags(paths[key][method]),
                        scope: this._getRequestScope(paths[key][method])
                    });
                }
            }
            return data;
        }
        catch (error) {
            throw new Error("Invalid swagger file");
        }
    }
    /**
     * Gets the HTTP method from a Swagger path object.
     * @param path Swagger path object
     */
    _getRequestMethod(path) {
        const keys = Object.keys(path);
        return keys.length > 0 && keys[0];
    }
    /**
     * Gets the first tag from a Swagger path data object.
     * @param item Swagger path data
     */
    _getRequestTags(item) {
        return (item.tags && item.tags[0]) || "";
    }
    /**
     * Gets the OAuth scope from a Swagger path data object.
     * @param item Swagger path data
     */
    _getRequestScope(item) {
        return ((item.security &&
            item.security[0] &&
            item.security[0].OauthSecurity &&
            item.security[0].OauthSecurity[0]) || "");
    }
    /**
     * Reads and parses a buffer as a Swagger file object.
     * @param buffer Buffer containing Swagger JSON
     */
    _readBuffer(buffer) {
        return JSON.parse(buffer.toString());
    }
    /**
     * Formats a route string into a regular expression for matching.
     * @param route Route string
     */
    _formatRouteAsRegexp(route) {
        if (route.includes("?"))
            route = route.substring(0, route.indexOf('?'));
        const routeFormatted = route.replace(/\{(.*?)\}/g, (el) => '(.*?)');
        return new RegExp(`^${routeFormatted}$`);
    }
}
exports.APIService = APIService;
//# sourceMappingURL=apis.service.js.map