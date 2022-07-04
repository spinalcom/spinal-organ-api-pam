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

import {
    AUTHORIZED_API_CONTEXT_NAME,
    AUTHORIZED_API_CONTEXT_TYPE,
    AUTHORIZED_APPS_CONTEXT_TYPE,
    AUTHORIZED_APP_CONTEXT_NAME,
    AUTHORIZED_BOS_CONTEXT_NAME,
    AUTHORIZED_BOS_CONTEXT_TYPE,
    CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME,
    CONTEXT_TO_AUTHORIZED_APPS_RELATION_NAME,
    CONTEXT_TO_AUTHORIZED_BOS_RELATION_NAME, PTR_LST_TYPE
} from "../constant";
import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { APIService } from "./apis.service";
import { AppService } from './apps.service';
import { BuildingService } from "./building.service";

export default class AuthorizationService {
    private static instance: AuthorizationService;

    private constructor() { }


    public static getInstance(): AuthorizationService {
        if (!this.instance) this.instance = new AuthorizationService();
        return this.instance;
    }

    public async profileHasAccess(profile: SpinalNode, element: SpinalNode, elementType: string): Promise<boolean> {
        const context = await this._getContextByType(profile, elementType);
        if (!context) return false;
        return element.belongsToContext(context);
    }

    //////////////////////////////////////////////////////////
    //                  APPS AUTHORIZATION                  //
    //////////////////////////////////////////////////////////

    public async authorizeProfileToAccessApp(profile: SpinalNode, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        const authAppcontext = await this._getAuthorizedAppsContext(profile, true);
        if (!authAppcontext) return;

        const promises = appIds.map(id => this._addAppToContext(authAppcontext, id))

        return Promise.all(promises).then((result) => {
            return authAppcontext.getChildren(CONTEXT_TO_AUTHORIZED_APPS_RELATION_NAME)
        })
    }

    public async unauthorizeProfileToAccessApp(profile: SpinalNode, appIds: string | string[]): Promise<string[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        const authAppcontext = await this._getAuthorizedAppsContext(profile);
        if (!authAppcontext) return;

        const promises = appIds.map(el => this._removeAppToContext(authAppcontext, el));

        return Promise.all(promises);
    }

    public async getAuthorizedAppsFromProfile(profile: SpinalNode): Promise<SpinalNode[]> {
        const authAppcontext = await this._getAuthorizedAppsContext(profile);
        if (!authAppcontext) return [];

        return authAppcontext.getChildren(CONTEXT_TO_AUTHORIZED_APPS_RELATION_NAME);
    }

    //////////////////////////////////////////////////////////
    //            API's ROUTES AUTHORIZATION                //
    //////////////////////////////////////////////////////////

    public async authorizeProfileToAccessApisRoutes(profile: SpinalNode, apiRoutesIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apiRoutesIds)) apiRoutesIds = [apiRoutesIds];
        const authApicontext = await this._getAuthorizedApisRoutesContext(profile, true);
        if (!authApicontext) return;

        const promises = apiRoutesIds.map(id => this._addApiToContext(authApicontext, id))

        return Promise.all(promises).then((result) => {
            return authApicontext.getChildren(CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME);
        })
    }

    public async unauthorizeProfileToAccessApisRoutes(profile: SpinalNode, apiRoutesIds: string | string[]): Promise<string[]> {
        if (!Array.isArray(apiRoutesIds)) apiRoutesIds = [apiRoutesIds];
        const authcontext = await this._getAuthorizedApisRoutesContext(profile);
        if (!authcontext) return;

        const promises = apiRoutesIds.map(el => this._removeApiToContext(authcontext, el));

        return Promise.all(promises);
    }

    public async getAuthorizedApisRoutesFromProfile(profile: SpinalNode): Promise<SpinalNode[]> {
        const authAppcontext = await this._getAuthorizedApisRoutesContext(profile);
        if (!authAppcontext) return [];

        return authAppcontext.getChildren(CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME);
    }

    //////////////////////////////////////////////////////////
    //                  BOS AUTHORIZATION                   //
    //////////////////////////////////////////////////////////

    public async authorizeProfileToAccessBos(profile: SpinalNode, bosIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(bosIds)) bosIds = [bosIds];
        const authApicontext = await this._getAuthorizedBosContext(profile, true);
        if (!authApicontext) return;

        const promises = bosIds.map(id => this._addBosToContext(authApicontext, id))

        return Promise.all(promises).then((result) => {
            return authApicontext.getChildren(CONTEXT_TO_AUTHORIZED_BOS_RELATION_NAME);
        })
    }

    public async unauthorizeProfileToAccessBos(profile: SpinalNode, bosIds: string | string[]): Promise<string[]> {
        if (!Array.isArray(bosIds)) bosIds = [bosIds];
        const authcontext = await this._getAuthorizedBosContext(profile);
        if (!authcontext) return;

        const promises = bosIds.map(el => this._removeBosToContext(authcontext, el));

        return Promise.all(promises);
    }

    public async getAuthorizedBosFromProfile(profile: SpinalNode): Promise<SpinalNode[]> {
        const authAppcontext = await this._getAuthorizedBosContext(profile);
        if (!authAppcontext) return [];

        return authAppcontext.getChildren(CONTEXT_TO_AUTHORIZED_BOS_RELATION_NAME);
    }


    //////////////////////////////////////////////////////////
    //                     PRIVATES                         //
    //////////////////////////////////////////////////////////

    private async _getAuthorizedAppsContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
        return this._getOrCreateContext(profile, AUTHORIZED_APP_CONTEXT_NAME, createIfNotExist, AUTHORIZED_APPS_CONTEXT_TYPE);
    }

    private async _getAuthorizedApisRoutesContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
        return this._getOrCreateContext(profile, AUTHORIZED_API_CONTEXT_NAME, createIfNotExist, AUTHORIZED_API_CONTEXT_TYPE);
    }

    private async _getAuthorizedBosContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
        return this._getOrCreateContext(profile, AUTHORIZED_BOS_CONTEXT_NAME, createIfNotExist, AUTHORIZED_BOS_CONTEXT_TYPE)
    }

    private async _getProfileGraph(profile: SpinalNode): Promise<SpinalGraph | void> {
        if (profile) return profile.getElement();
    }

    private async _addAppToContext(context: SpinalContext, id: string) {
        try {
            const node = await AppService.getInstance().getAppById(id);
            if (node) return context.addChildInContext(node, CONTEXT_TO_AUTHORIZED_APPS_RELATION_NAME, PTR_LST_TYPE, context);
        } catch (error) { }
    }

    private async _addApiToContext(context: SpinalContext, id: string): Promise<SpinalNode> {
        try {
            const node = await APIService.getInstance().getApiRouteById(id);
            if (node)
                return context.addChildInContext(node, CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME, PTR_LST_TYPE, context);

        } catch (error) { }
    }

    private async _addBosToContext(context, id: string): Promise<SpinalNode> {
        try {
            const node = await BuildingService.getInstance().getBuilding(id);
            if (node)
                return context.addChildInContext(node, CONTEXT_TO_AUTHORIZED_BOS_RELATION_NAME, PTR_LST_TYPE, context);

        } catch (error) { }
    }

    private async _removeAppToContext(context: SpinalContext, id: string) {
        try {
            const node = await AppService.getInstance().getAppById(id);
            if (node) {
                await context.removeChild(node, CONTEXT_TO_AUTHORIZED_APPS_RELATION_NAME, PTR_LST_TYPE);
                return node.getId().get()
            }
        } catch (error) { }
    }

    private async _removeApiToContext(context: SpinalContext, id: string) {
        try {
            const node = await APIService.getInstance().getApiRouteById(id);
            if (node) {
                await context.removeChild(node, CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME, PTR_LST_TYPE);
                return node.getId().get();
            }
        } catch (error) { }
    }

    private async _removeBosToContext(context: SpinalContext, id: string) {
        try {
            const node = await BuildingService.getInstance().getBuilding(id);
            if (node) {
                await context.removeChild(node, CONTEXT_TO_AUTHORIZED_BOS_RELATION_NAME, PTR_LST_TYPE);
                return node.getId().get();
            }
        } catch (error) { }
    }

    private async _getOrCreateContext(profile: SpinalNode, contextName: string, createIfNotExist: boolean, contextType?: string): Promise<SpinalContext> {
        const graph = await this._getProfileGraph(profile);
        if (graph) {
            let context = await graph.getContext(contextName);
            if (context) return context;
            if (!createIfNotExist) return;

            let newContext = new SpinalContext(contextName, contextType);
            return graph.addContext(newContext);
        }
    }

    private _getContextByType(profile: SpinalNode, elementType: string): Promise<SpinalContext | void> {
        switch (elementType) {
            case AUTHORIZED_API_CONTEXT_TYPE:
                return this._getAuthorizedApisRoutesContext(profile);
            case AUTHORIZED_APPS_CONTEXT_TYPE:
                return this._getAuthorizedAppsContext(profile)

            default:
                break;
        }
    }
}


const authorizationInstance = AuthorizationService.getInstance();
export { authorizationInstance, AuthorizationService };