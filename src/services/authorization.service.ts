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
    PTR_LST_TYPE, APP_RELATION_NAME, PROFILE_TO_AUTHORIZED_BOS_RELATION, API_RELATION_NAME
} from "../constant";
import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { Lst, Ptr } from "spinal-core-connectorjs_type";
import { APIService } from "./apis.service";
import { BuildingService } from "./building.service";
import { PortofolioService } from "./portofolio.service";
import * as toArray from "async-iterator-to-array";

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

    public async authorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioId: string): Promise<SpinalNode> {

        const context = await this._getAuthorizedPortofolioContext(profile, true);
        let reference = await this._getReference(context, portofolioId);

        if (reference) {
            return this._getRealNode(reference);
        }

        const portofolio = await PortofolioService.getInstance().getPortofolio(portofolioId);
        if (!portofolio) return;
        reference = await this._createNodeReference(portofolio);
        await context.addChildInContext(reference, PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, PTR_LST_TYPE, context);
        return portofolio;
    }

    public async authorizeProfileToAccessPortofolioApp(profile: SpinalNode, portofolioId: string, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];

        await this.authorizeProfileToAccessPortofolio(profile, portofolioId);
        const context = await this._getAuthorizedPortofolioContext(profile, false);
        const reference = await this._getReference(context, portofolioId);

        return appIds.reduce(async (prom, id) => {
            let liste = await prom;
            const app = await PortofolioService.getInstance().getAppFromPortofolio(portofolioId, id);
            if (app) {
                let appExist = await this._getReference(reference, app.getId().get(), [APP_RELATION_NAME]);

                if (!appExist) {
                    appExist = await this._createNodeReference(app);
                    await reference.addChildInContext(appExist, APP_RELATION_NAME, PTR_LST_TYPE, context)
                };

                liste.push(app);
            }

            return liste;
        }, Promise.resolve([]));
    }


    // unauthorize
    public async unauthorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioId: string): Promise<boolean> {
        const { context, portofolioRef } = await this._getRefTree(profile, portofolioId);
        if (context && portofolioRef) {
            try {
                await context.removeChild(portofolioRef, PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, PTR_LST_TYPE);
            } catch (error) {
                return false
            }
        }

        return false
    }

    public async unauthorizeProfileToAccessPortofolioApp(profile: SpinalNode, portofolioId: string, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        const { portofolioRef } = await this._getRefTree(profile, portofolioId);
        if (!portofolioRef) return [];

        const data = await appIds.reduce(async (prom, id) => {
            let liste = await prom;
            const app = await PortofolioService.getInstance().getAppFromPortofolio(portofolioId, id);

            if (app) {
                const appExist = await this._getReference(portofolioRef, app.getId().get(), [APP_RELATION_NAME]);

                try {
                    await portofolioRef.removeChild(appExist, APP_RELATION_NAME, PTR_LST_TYPE);
                    liste.push(app);
                } catch (error) { }
            }

            return liste;
        }, Promise.resolve([]));

        await this._checkPortofolioValidity(profile, portofolioId, portofolioRef);

        return data;
    }

    // get
    public async getAuthorizedPortofolioFromProfile(profile: SpinalNode): Promise<SpinalNode[]> {
        const context = await this._getAuthorizedPortofolioContext(profile, false);
        if (!context) return [];

        const children = await context.getChildren([PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION]);

        return children.reduce(async (prom, item) => {
            const liste = await prom;

            if (item) {
                const element = this._getRealNode(item);
                liste.push(element);
            }

            return liste
        }, Promise.resolve([]))
    }

    public async getAuthorizedPortofolioAppFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
        const { context, portofolioRef } = await this._getRefTree(profile, portofolioId);

        if (context && portofolioRef) {
            const children = await portofolioRef.getChildren(APP_RELATION_NAME);
            return children.reduce(async (prom, item) => {
                const liste = await prom;

                if (item) {
                    const element = this._getRealNode(item);
                    liste.push(element);
                }

                return liste
            }, Promise.resolve([]))
        }

        return []
    }

    // //////////////////////////////////////////////////////////
    // //                  BOS AUTHORIZATION                   //
    // //////////////////////////////////////////////////////////

    // authorize
    public async authorizeProfileToAccessBos(profile: SpinalNode, portofolioId: string, BosId: string): Promise<SpinalNode> {

        await this.authorizeProfileToAccessPortofolio(profile, portofolioId);
        const { context, portofolioRef } = await this._getRefTree(profile, portofolioId);

        const bos = await PortofolioService.getInstance().getBuildingFromPortofolio(portofolioId, BosId);
        if (!bos) return;

        const bosExist = await this._getReference(portofolioRef, BosId, [PROFILE_TO_AUTHORIZED_BOS_RELATION]);

        if (!bosExist) {
            const reference = await this._createNodeReference(bos);
            await portofolioRef.addChildInContext(reference, PROFILE_TO_AUTHORIZED_BOS_RELATION, PTR_LST_TYPE, context);
        }

        return bos;
    }

    public async authorizeProfileToAccessBosApp(profile: SpinalNode, portofolioId: string, BosId: string, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        await this.authorizeProfileToAccessBos(profile, portofolioId, BosId);
        const { context, bosRef } = await this._getRefTree(profile, portofolioId, BosId);

        return appIds.reduce(async (prom, id) => {
            let liste = await prom;
            const app = await BuildingService.getInstance().getAppFromBuilding(BosId, id);

            if (app) {
                let appExist = await this._getReference(bosRef, app.getId().get(), [APP_RELATION_NAME]);

                if (!appExist) {
                    appExist = await this._createNodeReference(app);
                    await bosRef.addChildInContext(appExist, APP_RELATION_NAME, PTR_LST_TYPE, context)
                };

                liste.push(app);
            }

            return liste;
        }, Promise.resolve([]));
    }


    // unauthorize
    public async unauthorizeProfileToAccessBos(profile: SpinalNode, portofolioId: string, BosId: string): Promise<boolean> {
        const { portofolioRef, bosRef } = await this._getRefTree(profile, portofolioId, BosId);

        if (portofolioRef && bosRef) {
            try {
                await portofolioRef.removeChild(bosRef, PROFILE_TO_AUTHORIZED_BOS_RELATION, PTR_LST_TYPE);
                return true;
            } catch (error) { }
        }

        return false
    }

    public async unauthorizeProfileToAccessBosApp(profile: SpinalNode, portofolioId: string, BosId: string, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        const { bosRef } = await this._getRefTree(profile, portofolioId, BosId)

        if (!bosRef) return;

        const data = await appIds.reduce(async (prom, id) => {
            let liste = await prom;
            const app = await BuildingService.getInstance().getAppFromBuilding(BosId, id);

            if (app) {
                const appRef = await this._getReference(bosRef, app.getId().get(), [APP_RELATION_NAME]);

                if (appRef) {
                    await bosRef.removeChild(appRef, APP_RELATION_NAME, PTR_LST_TYPE);
                    liste.push(app);
                }
            }

            return liste;
        }, Promise.resolve([]));

        await this._checkBosValidity(profile, portofolioId, BosId, bosRef);
        return data;
    }


    // get
    public async getAuthorizedBosFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
        const { portofolioRef } = await this._getRefTree(profile, portofolioId);

        const children = await portofolioRef.getChildren(PROFILE_TO_AUTHORIZED_BOS_RELATION);

        return children.reduce(async (prom, item) => {
            const liste = await prom;

            if (item) {
                const element = this._getRealNode(item);
                liste.push(element);
            }

            return liste
        }, Promise.resolve([]))
    }

    public async getAuthorizedBosAppFromProfile(profile: SpinalNode, portofolioId: string, BosId: string): Promise<SpinalNode[]> {
        const { bosRef } = await this._getRefTree(profile, portofolioId, BosId);
        if (!bosRef) return [];

        const children = await bosRef.getChildren(APP_RELATION_NAME);

        return children.reduce(async (prom, item) => {
            const liste = await prom;

            if (item) {
                const element = this._getRealNode(item);
                liste.push(element);
            }

            return liste
        }, Promise.resolve([]))
    }


    //////////////////////////////////////////////////////////
    //            API's ROUTES AUTHORIZATION                //
    //////////////////////////////////////////////////////////

    //authorize
    public async authorizeProfileToAccessPortofolioApisRoutes(profile: SpinalNode, portofolioId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apiRoutesIds)) apiRoutesIds = [apiRoutesIds];
        // const authApicontext = await this._getAuthorizedApisRoutesContext(profile, true);
        // if (!authApicontext) return;

        await this.authorizeProfileToAccessPortofolio(profile, portofolioId);
        const { context, portofolioRef } = await this._getRefTree(profile, portofolioId);


        return apiRoutesIds.reduce(async (prom, id: string) => {
            const liste = await prom;
            const node = await PortofolioService.getInstance().getApiFromPortofolio(portofolioId, id);
            if (node) {
                let apiExist = await this._getReference(portofolioRef, id, [API_RELATION_NAME]);

                if (!apiExist) {
                    const _temp = await this._createNodeReference(node);
                    apiExist = await portofolioRef.addChildInContext(_temp, API_RELATION_NAME, PTR_LST_TYPE, context);
                }

                liste.push(node);
            }

            return liste;
        }, Promise.resolve([]))
    }

    public async authorizeProfileToAccessBosApisRoutes(profile: SpinalNode, portofolioId: string, bosId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apiRoutesIds)) apiRoutesIds = [apiRoutesIds];

        await this.authorizeProfileToAccessBos(profile, portofolioId, bosId);
        const { context, bosRef } = await this._getRefTree(profile, portofolioId, bosId);
        if (!bosRef) return;

        return apiRoutesIds.reduce(async (prom, id: string) => {
            const liste = await prom;
            const node = await BuildingService.getInstance().getApiFromBuilding(bosId, id);
            if (node) {
                let apiExist = await this._getReference(bosRef, id, [API_RELATION_NAME]);

                if (!apiExist) {
                    const _temp = await this._createNodeReference(node);
                    apiExist = await bosRef.addChildInContext(_temp, API_RELATION_NAME, PTR_LST_TYPE, context);
                }

                liste.push(node);
            }

            return liste;
        }, Promise.resolve([]))
    }

    // unauthorize
    public async unauthorizeProfileToAccessPortofolioApisRoutes(profile: SpinalNode, portofolioId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apiRoutesIds)) apiRoutesIds = [apiRoutesIds];
        const { portofolioRef } = await this._getRefTree(profile, portofolioId)
        if (!portofolioRef) return;

        return apiRoutesIds.reduce(async (prom, id: string) => {
            const liste = await prom;

            const route = await PortofolioService.getInstance().getApiFromPortofolio(portofolioId, id);

            if (route) {
                const routeRef = await this._getReference(portofolioRef, id, [API_RELATION_NAME]);
                try {
                    await portofolioRef.removeChild(routeRef, API_RELATION_NAME, PTR_LST_TYPE);
                    liste.push(route);
                } catch (error) { }
            }

            return liste;
            // this._removeApiFromContext(authcontext, el)
        }, Promise.resolve([]));

    }

    public async unauthorizeProfileToAccessBosApisRoutes(profile: SpinalNode, portofolioId: string, bosId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apiRoutesIds)) apiRoutesIds = [apiRoutesIds];
        const { bosRef } = await this._getRefTree(profile, portofolioId, bosId)

        if (!bosRef) return;

        return apiRoutesIds.reduce(async (prom, id: string) => {
            const liste = await prom;

            const route = await BuildingService.getInstance().getApiFromBuilding(bosId, id);
            if (route) {
                const routeRef = await this._getReference(bosRef, id, [API_RELATION_NAME]);
                try {
                    await bosRef.removeChild(routeRef, API_RELATION_NAME, PTR_LST_TYPE);
                    liste.push(route);
                } catch (error) { }
            }

            return liste;
            // this._removeApiFromContext(authcontext, el)
        }, Promise.resolve([]));
    }

    // get
    public async getAuthorizedApisRoutesFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
        const { portofolioRef } = await this._getRefTree(profile, portofolioId);
        if (!portofolioRef) return [];

        const children = await portofolioRef.getChildren(API_RELATION_NAME);

        return children.reduce(async (prom, item) => {
            const liste = await prom;

            if (item) {
                const element = this._getRealNode(item);
                liste.push(element);
            }

            return liste
        }, Promise.resolve([]))
    }


    public async getAuthorizedBosApisRoutesFromProfile(profile: SpinalNode, portofolioId: string, BosId: string): Promise<SpinalNode[]> {
        const { bosRef } = await this._getRefTree(profile, portofolioId, BosId);
        if (!bosRef) return [];

        const children = await bosRef.getChildren(API_RELATION_NAME);
        return children.reduce(async (prom, item) => {
            const liste = await prom;

            if (item) {
                const element = this._getRealNode(item);
                liste.push(element);
            }

            return liste
        }, Promise.resolve([]))
    }


    //////////////////////////////////////////////////////////
    //                     PRIVATES                         //
    //////////////////////////////////////////////////////////


    private async _getRefTree(profile: SpinalNode, portofolioId?: string, BosId?: string): Promise<{ context?: SpinalNode; portofolioRef?: SpinalNode; bosRef?: SpinalNode }> {
        const context = await this._getAuthorizedPortofolioContext(profile, false);
        if (!context || !portofolioId) return { context };

        const portofolioRef = await this._getReference(context, portofolioId);
        if (!portofolioRef || !BosId) return { context, portofolioRef };

        const bosRef = await this._getReference(portofolioRef, BosId, [PROFILE_TO_AUTHORIZED_BOS_RELATION]);
        return { context, portofolioRef, bosRef }
    }

    private async _getAuthorizedPortofolioContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
        return this._getOrCreateContext(profile, AUTHORIZED_PORTOFOLIO_CONTEXT_NAME, createIfNotExist, AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE);
    }

    private async _getAuthorizedApisRoutesContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
        return this._getOrCreateContext(profile, AUTHORIZED_API_CONTEXT_NAME, createIfNotExist, AUTHORIZED_API_CONTEXT_TYPE);
    }

    private async _getAuthorizedBosContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
        return this._getOrCreateContext(profile, AUTHORIZED_BOS_CONTEXT_NAME, createIfNotExist, AUTHORIZED_BOS_CONTEXT_TYPE)
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

    private async _getReference(startNode: SpinalNode, referenceId: string, relationName: string[] = []): Promise<SpinalNode> {
        let queue = [startNode];

        while (queue.length > 0) {
            const child = queue.shift();
            if (child instanceof SpinalNode) {
                const element: any = await child.getElement(true);
                if (element && element.getId().get() === referenceId) return child;
                const children = await child.visitChildren(relationName);
                queue.push(...toArray(children));
            }
        }
    }

    private _getRealNode(refNode: SpinalNode): Promise<SpinalNode> {
        return refNode.getElement(false);
    }

    private async _createNodeReference(node: SpinalNode): Promise<SpinalNode> {
        const refNode = new SpinalNode(node.getName().get(), node.getType().get(), node);
        refNode.info.name.set(node.info.name);
        this._addRefToNode(node, refNode);
        return refNode;
    }

    private _addRefToNode(node: SpinalNode, ref: SpinalNode) {

        if (node.info.references) {
            return new Promise((resolve, reject) => {
                node.info.references.load((lst) => {
                    lst.push(ref);
                    resolve(ref);
                })
            })

        } else {
            node.info.add_attr({
                references: new Ptr(new Lst([ref]))
            })
            return Promise.resolve(ref);
        }
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
        const children = await reference.getChildren();
        if (children.length > 0) return;
        return this.unauthorizeProfileToAccessPortofolio(profile, portofolioId);
    }

    private async _checkBosValidity(profile: SpinalNode, portofolioId: string, bosId: string, reference: SpinalNode) {
        const children = await reference.getChildren();
        if (children.length > 0) return;
        return this.unauthorizeProfileToAccessBos(profile, portofolioId, bosId);
    }
}


const authorizationInstance = AuthorizationService.getInstance();
export { authorizationInstance, AuthorizationService };