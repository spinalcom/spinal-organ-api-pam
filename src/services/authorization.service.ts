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
    AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE,
    AUTHORIZED_PORTOFOLIO_CONTEXT_NAME,
    AUTHORIZED_BOS_CONTEXT_NAME,
    AUTHORIZED_BOS_CONTEXT_TYPE,
    CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME,
    PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION,
    PTR_LST_TYPE, APP_RELATION_NAME, PROFILE_TO_AUTHORIZED_BOS_RELATION
} from "../constant";
import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { APIService } from "./apis.service";
import { BuildingService } from "./building.service";
import { PortofolioService } from "./portofolio.service";

export default class AuthorizationService {
    private static instance: AuthorizationService;

    private constructor() { }


    public static getInstance(): AuthorizationService {
        if (!this.instance) this.instance = new AuthorizationService();
        return this.instance;
    }

    public async profileHasAccess(profile: SpinalNode, node: SpinalNode, elementType: string): Promise<boolean> {
        const context = await this._getContextByType(profile, elementType);
        if (!context) return false;
        return node.belongsToContext(context);
    }

    public async removePortofolioReferences(profile: SpinalNode, portofolioId: string): Promise<void> {
        const promises = [this._getAuthorizedBosContext(profile, false), this._getAuthorizedPortofolioContext(profile, false)]
        return Promise.all(promises).then(async ([bosContext, PortofolioContext]) => {
            if (PortofolioContext) await this.unauthorizeProfileToAccessPortofolio(profile, portofolioId);
        }).catch((err) => {

        });
    }


    /////////////////////////////////////////////////////////
    //                  PORTOFOLIO AUTH                    //
    /////////////////////////////////////////////////////////

    public async authorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioId: string): Promise<SpinalNode> {

        const context = await this._getAuthorizedPortofolioContext(profile, true);
        let reference = await this._getReference(context, portofolioId);
        if (reference) return reference;

        const portofolio = await PortofolioService.getInstance().getPortofolio(portofolioId);
        if (!portofolio) return;
        reference = await this._createNodeReference(portofolio);
        return context.addChildInContext(reference, PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, PTR_LST_TYPE, context);
    }

    public async unauthorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioId: string): Promise<void> {

        const context = await this._getAuthorizedPortofolioContext(profile, false);
        if (!context) return;

        let reference = await this._getReference(context, portofolioId);
        if (!reference) return;

        return context.removeChild(reference, PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, PTR_LST_TYPE);
    }

    public async authorizeProfileToAccessPortofolioApp(profile: SpinalNode, portofolioId: string, appIds: string | string[], portofolioRef?: SpinalNode): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];

        const reference = portofolioRef || await this.authorizeProfileToAccessPortofolio(profile, portofolioId);

        const context = await this._getAuthorizedPortofolioContext(profile, true);
        return appIds.reduce(async (prom, id) => {
            let liste = await prom;
            const app = await PortofolioService.getInstance().getAppFromPortofolio(portofolioId, id);
            if (app) {
                const appExist = reference.getChildrenIds().find(id => id === app.getId().get());
                if (!appExist) await reference.addChildInContext(app, APP_RELATION_NAME, PTR_LST_TYPE, context);
                liste.push(app);
            }

            return liste;
        }, Promise.resolve([]));
    }

    public async unauthorizeProfileToAccessPortofolioApp(profile: SpinalNode, portofolioId: string, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        const context = await this._getAuthorizedPortofolioContext(profile, false);
        if (!context) return;
        const reference = await this._getReference(context, portofolioId);
        if (!reference) return;

        const data = await appIds.reduce(async (prom, id) => {
            let liste = await prom;
            const app = await PortofolioService.getInstance().getAppFromPortofolio(portofolioId, id);

            if (app) {
                await reference.removeChild(app, APP_RELATION_NAME, PTR_LST_TYPE);
                liste.push(app);
            }

            return liste;
        }, Promise.resolve([]));

        await this._checkPortofolioValidity(profile, portofolioId, reference);

        return data;
    }

    public async getAuthorizedPortofolioFromProfile(profile: SpinalNode): Promise<SpinalNode[]> {
        const context = await this._getAuthorizedPortofolioContext(profile, false);
        if (!context) return [];
        const children = await context.getChildren([PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION]);

        return children.reduce(async (prom, item) => {
            const liste = await prom;

            if (item) {
                const element = await item.getElement();
                liste.push(element);
            }

            return liste
        }, Promise.resolve([]))
    }

    public async getAuthorizedPortofolioAppFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
        const context = await this._getAuthorizedPortofolioContext(profile, false);
        if (!context) return [];

        const reference = await this._getReference(context, portofolioId);
        if (!reference) return [];

        return reference.getChildren(APP_RELATION_NAME);
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

        const promises = apiRoutesIds.map(el => this._removeApiFromContext(authcontext, el));

        return Promise.all(promises);
    }

    public async getAuthorizedApisRoutesFromProfile(profile: SpinalNode): Promise<SpinalNode[]> {
        const authAppcontext = await this._getAuthorizedApisRoutesContext(profile);
        if (!authAppcontext) return [];

        return authAppcontext.getChildren(CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME);
    }

    // //////////////////////////////////////////////////////////
    // //                  BOS AUTHORIZATION                   //
    // //////////////////////////////////////////////////////////

    public async authorizeProfileToAccessBos(profile: SpinalNode, BosId: string): Promise<SpinalNode> {

        const context = await this._getAuthorizedBosContext(profile, true);
        let reference = await this._getReference(context, BosId);
        if (reference) return reference;

        const bos = await BuildingService.getInstance().getBuildingById(BosId);
        if (!bos) return;
        reference = await this._createNodeReference(bos);
        return context.addChildInContext(reference, PROFILE_TO_AUTHORIZED_BOS_RELATION, PTR_LST_TYPE, context);
    }

    public async unauthorizeProfileToAccessBos(profile: SpinalNode, BosId: string): Promise<void> {

        const context = await this._getAuthorizedBosContext(profile, false);
        if (!context) return;

        let reference = await this._getReference(context, BosId);
        if (!reference) return;

        return context.removeChild(reference, PROFILE_TO_AUTHORIZED_BOS_RELATION, PTR_LST_TYPE);
    }

    public async authorizeProfileToAccessBosApp(profile: SpinalNode, BosId: string, appIds: string | string[], BosRef?: SpinalNode): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        const reference = BosRef || await this.authorizeProfileToAccessBos(profile, BosId);

        const context = await this._getAuthorizedBosContext(profile, true);
        return appIds.reduce(async (prom, id) => {
            let liste = await prom;
            const app = await BuildingService.getInstance().getAppFromBuilding(BosId, id);

            if (app) {
                const appExist = reference.getChildrenIds().find(id => id === app.getId().get())
                if (!appExist) await reference.addChildInContext(app, APP_RELATION_NAME, PTR_LST_TYPE, context);
                liste.push(app);
            }

            return liste;
        }, Promise.resolve([]));

    }

    public async unauthorizeProfileToAccessBosApp(profile: SpinalNode, BosId: string, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        const context = await this._getAuthorizedBosContext(profile, false);
        if (!context) return;

        let reference = await this._getReference(context, BosId);
        if (!reference) return;

        const data = await appIds.reduce(async (prom, id) => {
            let liste = await prom;
            const app = await BuildingService.getInstance().getAppFromBuilding(BosId, id);

            if (app) {
                await reference.removeChild(app, APP_RELATION_NAME, PTR_LST_TYPE);
                liste.push(app);
            }

            return liste;
        }, Promise.resolve([]));

        await this._checkBosValidity(profile, BosId, reference);
        return data;
    }

    public async getAuthorizedBosFromProfile(profile: SpinalNode): Promise<SpinalNode[]> {
        const context = await this._getAuthorizedBosContext(profile, false);
        if (!context) return [];
        const children = await context.getChildren([PROFILE_TO_AUTHORIZED_BOS_RELATION]);

        return children.reduce(async (prom, item) => {
            const liste = await prom;

            if (item) {
                const element = await item.getElement();
                liste.push(element);
            }

            return liste
        }, Promise.resolve([]))
    }

    public async getAuthorizedBosAppFromProfile(profile: SpinalNode, bosId: string): Promise<SpinalNode[]> {
        const context = await this._getAuthorizedBosContext(profile, false);
        if (!context) return [];

        const reference = await this._getReference(context, bosId);
        if (!reference) return [];

        return reference.getChildren(APP_RELATION_NAME);
    }


    //////////////////////////////////////////////////////////
    //                     PRIVATES                         //
    //////////////////////////////////////////////////////////

    private async _getAuthorizedPortofolioContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
        return this._getOrCreateContext(profile, AUTHORIZED_PORTOFOLIO_CONTEXT_NAME, createIfNotExist, AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE);
    }

    private async _getAuthorizedApisRoutesContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
        return this._getOrCreateContext(profile, AUTHORIZED_API_CONTEXT_NAME, createIfNotExist, AUTHORIZED_API_CONTEXT_TYPE);
    }

    private async _getAuthorizedBosContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
        return this._getOrCreateContext(profile, AUTHORIZED_BOS_CONTEXT_NAME, createIfNotExist, AUTHORIZED_BOS_CONTEXT_TYPE)
    }


    private async _addApiToContext(context: SpinalContext, id: string): Promise<SpinalNode> {
        try {
            const node = await APIService.getInstance().getApiRouteById(id);
            if (node) {
                const apiExist = context.getChildrenIds().find(id => id === node.getId().get());
                if (!apiExist) return context.addChildInContext(node, CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME, PTR_LST_TYPE, context);

                return node;
            }

        } catch (error) { }
    }

    private async _removeApiFromContext(context: SpinalContext, id: string): Promise<string> {
        try {
            const node = await APIService.getInstance().getApiRouteById(id);
            if (node) {
                await context.removeChild(node, CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME, PTR_LST_TYPE);
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

    private async _getProfileGraph(profile: SpinalNode): Promise<SpinalGraph | void> {
        if (profile) return profile.getElement();
    }

    private async _getReference(context: SpinalContext, referenceId: string): Promise<SpinalNode> {
        const children = await context.getChildren();

        for (const child of children) {
            const element: any = await child.getElement(true);
            if (element && element.getId().get() === referenceId) return child;
        }
    }

    private async _createNodeReference(node: SpinalNode): Promise<SpinalNode> {
        const refNode = new SpinalNode(node.getName().get(), node.getType().get(), node);
        refNode.info.name.set(node.info.name);
        return refNode;
    }

    private _getContextByType(profile: SpinalNode, elementType: string): Promise<SpinalContext | void> {
        switch (elementType) {
            case AUTHORIZED_API_CONTEXT_TYPE:
                return this._getAuthorizedApisRoutesContext(profile);
            case AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE:
                return this._getAuthorizedPortofolioContext(profile);
            case AUTHORIZED_BOS_CONTEXT_TYPE:
                return this._getAuthorizedBosContext(profile);

            default:
                break;
        }
    }

    private async _checkPortofolioValidity(profile: SpinalNode, portofolioId: string, reference: SpinalNode) {
        const children = await reference.getChildren(APP_RELATION_NAME);
        if (children.length > 0) return;
        return this.unauthorizeProfileToAccessPortofolio(profile, portofolioId);
    }

    private async _checkBosValidity(profile: SpinalNode, bosId: string, reference: SpinalNode) {
        const children = await reference.getChildren(APP_RELATION_NAME);
        if (children.length > 0) return;
        return this.unauthorizeProfileToAccessBos(profile, bosId);
    }
}


const authorizationInstance = AuthorizationService.getInstance();
export { authorizationInstance, AuthorizationService };