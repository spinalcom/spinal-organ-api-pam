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

import { API_ROUTES_CONTEXT_NAME, API_ROUTES_CONTEXT_TYPE, API_RELATION_NAME, API_ROUTE_TYPE, BUILDING_API_GROUP_NAME, BUILDING_API_GROUP_TYPE, CONTEXT_TO_API_ROUTE_GROUP_RELATION_NAME, PORTOFOLIO_API_GROUP_NAME, PORTOFOLIO_API_GROUP_TYPE, PTR_LST_TYPE } from "../constant";
import { SpinalContext, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { configServiceInstance } from "./configFile.service";
import { IApiRoute, ISwaggerFile, ISwaggerPath, ISwaggerPathData } from "../interfaces";
import { removeNodeReferences } from "../utils/utils";

export class APIService {
    private static instance: APIService;
    public context: SpinalContext;

    private constructor() { }

    public static getInstance(): APIService {
        if (!this.instance) this.instance = new APIService();

        return this.instance;
    }

    public async init(): Promise<SpinalContext> {
        this.context = await configServiceInstance.getContext(API_ROUTES_CONTEXT_NAME);
        if (!this.context) this.context = await configServiceInstance.addContext(API_ROUTES_CONTEXT_NAME, API_ROUTES_CONTEXT_TYPE);
        return this.context;
    }


    // 
    public async createApiRoute(routeInfo: IApiRoute, parentType: string): Promise<SpinalNode> {
        const apiExist = await this.getApiRouteByRoute(routeInfo, parentType);
        if (apiExist) return apiExist;
        delete routeInfo.id;
        routeInfo.type = API_ROUTE_TYPE;
        routeInfo.name = routeInfo.route;
        const parent = await this._getOrGetRoutesGroup(parentType);
        const routeId = SpinalGraphService.createNode(routeInfo, undefined);
        const node = SpinalGraphService.getRealNode(routeId);
        return parent.addChildInContext(node, API_RELATION_NAME, PTR_LST_TYPE, this.context);
    }

    public async updateApiRoute(routeId: string, newValue: IApiRoute, parentType) {
        delete newValue.id;
        delete newValue.type;

        const route = await this.getApiRouteById(routeId, parentType);
        if (!route) throw new Error(`no api route Found for ${routeId}`);

        for (const key in newValue) {
            if (Object.prototype.hasOwnProperty.call(newValue, key) && route.info[key]) {
                const element = newValue[key];
                route.info[key].set(element);
            }
        }

        return route;
    }

    public async getApiRouteById(routeId: string, parentType: string): Promise<void | SpinalNode> {
        // const node = SpinalGraphService.getRealNode(routeId);
        // if (node) return node;

        const parent = await this._getOrGetRoutesGroup(parentType);

        const children = await parent.getChildrenInContext(this.context);
        return children.find(el => el.getId().get() === routeId);
    }

    public async getApiRouteByRoute(apiRoute: IApiRoute, parentType: string): Promise<void | SpinalNode> {
        const parent = await this._getOrGetRoutesGroup(parentType);

        const children = await parent.getChildrenInContext(this.context);
        return children.find(el => {
            const { route, method } = el.info.get();
            if (route && method) return route.toLowerCase() === apiRoute.route.toLowerCase() && method.toLowerCase() === apiRoute.method.toLowerCase();
            return false;
        });
    }

    public async getAllApiRoute(parentType: string): Promise<SpinalNode[]> {
        const parent = await this._getOrGetRoutesGroup(parentType);
        return parent.getChildrenInContext(this.context);
    }

    public async deleteApiRoute(routeId: string, parentType): Promise<string> {
        const route = await this.getApiRouteById(routeId, parentType);
        if (!route) throw new Error(`no api route Found for ${routeId}`);
        await removeNodeReferences(route)
        await route.removeFromGraph();
        return routeId;
    }

    public async uploadSwaggerFile(buffer: Buffer, parentType): Promise<any[]> {
        const swaggerData = await this._readBuffer(buffer);
        const routes = await this._formatSwaggerFile(swaggerData);
        return routes.reduce(async (prom, route) => {
            const list = await prom
            try {
                const r = await this.createApiRoute(route, parentType);
                list.push(r);
            } catch (error) { }
            return list;
        }, Promise.resolve([]))

    }


    //////////////////////////////////////////////
    //                  PRIVATE                 //
    //////////////////////////////////////////////


    private async _getOrGetRoutesGroup(type: string) {
        const children = await this.context.getChildren([CONTEXT_TO_API_ROUTE_GROUP_RELATION_NAME]);
        let found = children.find(el => el.getType().get() === type);

        if (found) return found;

        const name = type === BUILDING_API_GROUP_TYPE ? BUILDING_API_GROUP_NAME : PORTOFOLIO_API_GROUP_NAME;

        let node = new SpinalNode(name, type);
        return this.context.addChildInContext(node, CONTEXT_TO_API_ROUTE_GROUP_RELATION_NAME, PTR_LST_TYPE, this.context);
    }

    private _formatSwaggerFile(swaggerFile: ISwaggerFile): Promise<IApiRoute[]> {
        try {
            const paths = swaggerFile.paths || [];
            const data: any = [];

            for (const key in paths) {
                if (Object.prototype.hasOwnProperty.call(paths, key)) {
                    const method = this._getMethod(paths[key]);
                    let item = {
                        route: key,
                        method: method && method.toUpperCase(),
                        tag: this._getTags(paths[key][method]),
                        scope: this._getScope(paths[key][method])
                    };

                    data.push(item);
                }
            }

            return data;
        } catch (error) {
            throw new Error("Invalid swagger file");
        }
    }

    private _getMethod(path: ISwaggerPath): string {
        const keys = Object.keys(path);
        return keys.length > 0 && keys[0];
    }

    private _getTags(item: ISwaggerPathData): string {
        return (item.tags && item.tags[0]) || "";
    }

    private _getScope(item: ISwaggerPathData): string {
        return (
            (item.security &&
                item.security[0] &&
                item.security[0].OauthSecurity &&
                item.security[0].OauthSecurity[0]) || ""
        );
    }

    private _readBuffer(buffer: Buffer): Promise<ISwaggerFile> {
        return JSON.parse(buffer.toString())
    }

}