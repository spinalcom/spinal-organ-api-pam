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

import { PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, PTR_LST_TYPE, APP_RELATION_NAME, PROFILE_TO_AUTHORIZED_BOS_RELATION, API_RELATION_NAME } from "../constant";
import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { BuildingService } from "./building.service";
import { PortofolioService } from "./portofolio.service";
import { _getAuthorizedPortofolioContext, CleanReferenceTree, createNodeReference, findNodeReferenceInProfileTree, getOriginalNodeFromReference, getReferenceFromOriginalNode, removeReferenceNode } from "../utils/authorizationUtils";

export default class AuthorizationService {
    private static instance: AuthorizationService;
    private context: SpinalContext;
    private profileToContext: { [key: string]: SpinalNode } = {};

    private constructor() { }


    public static getInstance(): AuthorizationService {
        if (!this.instance) this.instance = new AuthorizationService();
        return this.instance;
    }

    // async getContext(profileNode: SpinalNode, createContextIfNotExist: boolean = false): Promise<SpinalContext> {
    //     const profileId = profileNode.getId().get();

    //     if (this.profileToContext[profileId]) return this.profileToContext[profileId];
    //     if (!createContextIfNotExist) return;

    //     const context = await _getAuthorizedPortofolioContext(profileNode, createContextIfNotExist);
    //     this.profileToContext[profileId] = context;

    //     return context;
    // }

    /**
     * Checks if the given profile has access to the specified node.
     * Traverses the authorized portofolio context of the profile to find a reference
     * to the node (by id). Returns the real node if access is found, otherwise undefined.
     * 
     * @param profile - The profile node to check access for.
     * @param anySpinalNode - The node or node id to check access to.
     * @returns The real SpinalNode if access exists, otherwise undefined.
     */
    public async profileHasAccessToNode(profile: SpinalNode, anySpinalNode: SpinalNode | string): Promise<SpinalNode> {
        const createContextIfNotExist = true;

        const context = await _getAuthorizedPortofolioContext(profile, createContextIfNotExist);
        if (!context) return;

        const anySpinalNodeId = typeof anySpinalNode === "string" ? anySpinalNode : anySpinalNode.getId().get();

        const nodeAlreadyLinked = await findNodeReferenceInProfileTree(context, context, anySpinalNodeId);

        return (nodeAlreadyLinked && getOriginalNodeFromReference(nodeAlreadyLinked)) || null;
    }


    /////////////////////////////////////////////////////////
    //                  PORTOFOLIO AUTH                    //
    /////////////////////////////////////////////////////////

    /**
     * Authorizes a profile to access a specific portofolio.
     * If the profile is not already linked to the portofolio, creates a reference and links it.
     * 
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portofolio to authorize access to.
     * @returns The real SpinalNode of the portofolio if successful, otherwise undefined.
     */
    public async authorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioId: string): Promise<SpinalNode> {

        const portofolioIsLinked = await this.profileHasAccessToNode(profile, portofolioId);
        if (portofolioIsLinked) return portofolioIsLinked;

        const originalPortofolioNode = await PortofolioService.getInstance().getPortofolioNode(portofolioId);
        if (!originalPortofolioNode) return;

        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, createContextIfNotExist);

        const portofolioReference = await createNodeReference(originalPortofolioNode);
        await context.addChildInContext(portofolioReference, PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, PTR_LST_TYPE, context);
        return originalPortofolioNode;
    }


    /**
     * Authorizes a profile to access a specific app within a portofolio.
     * If the app is not already linked to the portofolio reference, creates a reference and links it.
     * 
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portofolio.
     * @param appId - The ID of the app to authorize access to.
     * @returns The real SpinalNode of the app if successful, otherwise null.
     */
    private async authorizeProfileToAccessOnePortofolioApp(profile: SpinalNode, portofolioId: string, appId: string): Promise<SpinalNode> {

        const app = await PortofolioService.getInstance().portofolioHasApp(portofolioId, appId);
        if (!app) return null;

        const originalPortofolioNode = await this.authorizeProfileToAccessPortofolio(profile, portofolioId);
        if (!originalPortofolioNode) return null;

        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, createContextIfNotExist);
        const portofolioRef = await findNodeReferenceInProfileTree(context, context, originalPortofolioNode.getId().get());

        const appIsAleadyLinked = await findNodeReferenceInProfileTree(context, portofolioRef, appId);
        if (appIsAleadyLinked) return app;

        const appReference = await createNodeReference(app);
        portofolioRef.addChildInContext(appReference, APP_RELATION_NAME, PTR_LST_TYPE, context);
        return app;
    }


    /**
     * Authorizes a profile to access multiple apps within a portofolio.
     * For each appId, if not already linked, creates a reference and links it to the portofolio reference.
     * 
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portofolio.
     * @param appIds - The IDs of the apps to authorize access to.
     * @returns An array of real SpinalNode apps that were authorized.
     */
    public async authorizeProfileToAccessPortofolioApps(profile: SpinalNode, portofolioId: string, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        if (!appIds.length) return [];

        let index = 0;
        let firstCreated;

        // Try to authorize the first appId, if it fails, continue with the next ones until one succeeds
        // This ensures to not have a duplicate portofolio reference in the profile tree
        while (!firstCreated && index < appIds.length) {
            firstCreated = await this.authorizeProfileToAccessOnePortofolioApp(profile, portofolioId, appIds[index]);
            index++;
        }

        const restAppIds = appIds.slice(index);
        const promises = restAppIds.map((appId) => this.authorizeProfileToAccessOnePortofolioApp(profile, portofolioId, appId));

        return Promise.all(promises).then(async (apps) => {
            await this._removeEmptyPortofolioFromProfile(profile, portofolioId);
            return apps.filter(app => app !== undefined).concat(firstCreated ? [firstCreated] : []);
        })
    }


    /**
     * Revokes a profile's authorization to access a specific portfolio.
     *
     * This method locates the portfolio reference within the profile's tree and removes
     * the association, effectively revoking access. Returns `true` if the operation
     * succeeds, or `false` if an error occurs during the process.
     *
     * @param profile - The profile node whose access is to be revoked.
     * @param portofolioId - The unique identifier of the portfolio to unauthorize.
     * @returns A promise that resolves to `true` if the profile was successfully unauthorized, or `false` otherwise.
     */
    public async unauthorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioId: string): Promise<boolean> {
        try {
            const context = await _getAuthorizedPortofolioContext(profile, false);
            const portofolioReference = await findNodeReferenceInProfileTree(context, context, portofolioId);

            await CleanReferenceTree(context, portofolioReference);
            return true;
        } catch (error) {
            return false;
        }
    }


    /**
     * Revokes a profile's authorization to access specific app(s) within a portfolio.
     *
     * For each appId, finds the reference node in the profile's portfolio tree and removes it.
     * After removal, checks if the portfolio reference is still valid (has children), and if not,
     * revokes the profile's access to the portfolio as well.
     *
     * @param profile - The profile node whose app access is to be revoked.
     * @param portofolioOriginalId - The unique identifier of the original portfolio.
     * @param appIds - The ID(s) of the app(s) to unauthorize.
     * @returns A promise that resolves to an array of removed app references.
     */
    public async unauthorizeProfileToAccessPortofolioApp(profile: SpinalNode, portofolioOriginalId: string, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        const context = await _getAuthorizedPortofolioContext(profile, false);

        const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioOriginalId);
        if (!portofolioRef) return [];

        const promises = appIds.map(async (appId) => {
            const appReference = await findNodeReferenceInProfileTree(context, portofolioRef, appId);
            if (!appReference) return null;

            return removeReferenceNode(appReference);
        })

        return Promise.all(promises).then(async (removedApps) => {
            await this._removeEmptyPortofolioFromProfile(profile, portofolioOriginalId, portofolioRef);
            return removedApps;
        });
    }



    /**
     * Retrieves the list of authorized portfolio nodes associated with a given profile.
     *
     * This method fetches the context for authorized portfolios related to the provided profile node.
     * If the context exists, it retrieves all child nodes linked via the `PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION`
     * relation, resolves their original nodes, and returns an array of authorized portfolio nodes.
     * If no context is found, an empty array is returned.
     *
     * @param profile - The profile node for which to retrieve authorized portfolios.
     * @returns A promise that resolves to an array of authorized portfolio nodes (`SpinalNode[]`).
     */
    public async getAuthorizedPortofolioFromProfile(profile: SpinalNode): Promise<SpinalNode[]> {
        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, !createContextIfNotExist);
        if (!context) return [];

        const portofolioLinked = await context.getChildren([PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION]);
        const promises = portofolioLinked.map(async (portofolio) => getOriginalNodeFromReference(portofolio));

        return Promise.all(promises).then((portofolios) => portofolios.filter(portofolio => portofolio !== undefined));
    }


    /**
     * Retrieves the list of authorized app nodes within a specific portfolio for a given profile.
     *
     * This method locates the portfolio reference in the profile's authorization tree,
     * fetches all child nodes linked via the `APP_RELATION_NAME` relation, resolves their
     * original nodes, and returns an array of authorized app nodes.
     * If the portfolio reference is not found, an empty array is returned.
     *
     * @param profile - The profile node for which to retrieve authorized apps.
     * @param portofolioId - The ID of the portfolio to check.
     * @returns A promise that resolves to an array of authorized app nodes (`SpinalNode[]`).
     */
    public async getAuthorizedPortofolioAppFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, !createContextIfNotExist);

        const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
        if (!portofolioRef) return [];

        const appRefs = await portofolioRef.getChildren(APP_RELATION_NAME);
        const promises = appRefs.map(async (appRef) => getOriginalNodeFromReference(appRef));

        return Promise.all(promises).then((apps) => apps.filter(app => app !== undefined));
    }


    /**
 * Authorizes a profile to access a specific API route within a portfolio.
 * If the API route is not already linked to the portfolio reference, creates a reference and links it.
 *
 * @param profile - The profile node to authorize.
 * @param portofolioId - The ID of the portfolio.
 * @param apiRouteId - The ID of the API route to authorize access to.
 * @returns The real SpinalNode of the API route if successful, otherwise undefined.
 */
    public async authorizeProfileToAccessOnePortofolioApiRoute(profile: SpinalNode, portofolioId: string, apiRouteId: string): Promise<SpinalNode> {
        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, createContextIfNotExist);
        const apiRoute = await PortofolioService.getInstance().getApiFromPortofolio(portofolioId, apiRouteId);
        if (!apiRoute) return;
        const portofolioOriginalNode = await this.authorizeProfileToAccessPortofolio(profile, portofolioId);

        if (!portofolioOriginalNode) return;
        const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
        const apiRouteAlreadyAuthorized = await findNodeReferenceInProfileTree(context, portofolioRef, apiRouteId);

        if (apiRouteAlreadyAuthorized) return apiRoute;
        const apiRouteReference = await createNodeReference(apiRoute);

        await portofolioRef.addChildInContext(apiRouteReference, API_RELATION_NAME, PTR_LST_TYPE, context);
        return apiRoute;
    }

    /**
     * Authorizes a profile to access multiple API routes within a portfolio.
     * For each apiRouteId, if not already linked, creates a reference and links it to the portfolio reference.
     * 
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portfolio.
     * @param apiRoutesIds - The IDs of the API routes to authorize access to.
     * @returns An array of real SpinalNode API routes that were authorized.
     */
    public async authorizeProfileToAccessPortofolioApisRoutes(profile: SpinalNode, portofolioId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apiRoutesIds)) apiRoutesIds = [apiRoutesIds];

        if (!apiRoutesIds.length) return [];
        let index = 0;
        let firstCreated;
        // Try to authorize the first apiRouteId, if it fails, continue with the next ones until one succeeds
        // This ensures to not have a duplicate portofolio reference in the profile tree
        while (!firstCreated && index < apiRoutesIds.length) {
            firstCreated = await this.authorizeProfileToAccessOnePortofolioApiRoute(profile, portofolioId, apiRoutesIds[index]);
            index++;
        }

        const restApiRoutesIds = apiRoutesIds.slice(index);
        const promises = restApiRoutesIds.map((apiRouteId) => this.authorizeProfileToAccessOnePortofolioApiRoute(profile, portofolioId, apiRouteId));
        return Promise.all(promises).then(async (apis) => {
            await this._removeEmptyPortofolioFromProfile(profile, portofolioId);
            return apis.filter(api => api !== undefined).concat(firstCreated ? [firstCreated] : []);
        });
    }


    /**
     * Revokes a profile's authorization to access specific API routes within a given portfolio.
     *
     * This method removes references to the specified API routes from the profile's authorization tree
     * for the provided portfolio. If the portfolio or any of the API route references do not exist,
     * they are skipped. After removal, the portfolio's validity is checked and updated if necessary.
     *
     * @param profile - The profile node from which to remove API route access.
     * @param portofolioId - The ID of the portfolio whose API routes are being unauthorize.
     * @param apiRoutesIds - A single API route ID or an array of API route IDs to revoke access for.
     * @returns A promise that resolves to an array of the original API route nodes that were removed.
     */
    public async unauthorizeProfileToAccessPortofolioApisRoutes(profile: SpinalNode, portofolioId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apiRoutesIds)) apiRoutesIds = [apiRoutesIds];

        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, !createContextIfNotExist);
        const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
        if (!portofolioRef) return [];

        const promises = apiRoutesIds.map(async (apiRouteId: string) => {
            const apiRouteReference = await findNodeReferenceInProfileTree(context, portofolioRef, apiRouteId);
            if (!apiRouteReference) return null;

            await removeReferenceNode(apiRouteReference);
            return getOriginalNodeFromReference(apiRouteReference);
        });

        return Promise.all(promises).then(async (removedApis) => {
            await this._removeEmptyPortofolioFromProfile(profile, portofolioId, portofolioRef);
            return removedApis.filter(api => api !== null);
        })

    }

    /**
    * Retrieves the list of authorized API route nodes within a specific portfolio for a given profile.
    *
    * This method locates the portfolio reference in the profile's authorization tree,
    * fetches all child nodes linked via the `API_RELATION_NAME` relation, resolves their
    * original nodes, and returns an array of authorized API route nodes.
    * If the portfolio reference is not found, an empty array is returned.
    *
    * @param profile - The profile node for which to retrieve authorized API routes.
    * @param portofolioId - The ID of the portfolio to check.
    * @returns A promise that resolves to an array of authorized API route nodes (`SpinalNode[]`).
    */
    public async getAuthorizedPortofolioApisRoutesFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, !createContextIfNotExist);
        const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
        if (!portofolioRef) return [];

        const apiRefs = await portofolioRef.getChildren(API_RELATION_NAME);
        const promises = apiRefs.map(async (apiRef) => getOriginalNodeFromReference(apiRef));
        return Promise.all(promises).then((apis) => apis.filter(api => api !== undefined));
    }



    // //////////////////////////////////////////////////////////
    // //                  BOS AUTHORIZATION                   //
    // //////////////////////////////////////////////////////////

    /**
     * Authorizes a profile to access a specific BOS (Building Operating System) within a portfolio.
     * If the BOS is not already linked to the portfolio reference, creates a reference and links it.
     *
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portfolio.
     * @param BosId - The ID of the BOS to authorize access to.
     * @returns The real SpinalNode of the BOS if successful, otherwise undefined.
     */
    public async authorizeProfileToAccessBos(profile: SpinalNode, portofolioId: string, BosId: string): Promise<SpinalNode> {
        const originalPortofolioNode = await this.authorizeProfileToAccessPortofolio(profile, portofolioId);
        if (!originalPortofolioNode) return;

        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, createContextIfNotExist);
        const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);

        const bosOriginNalNode = await PortofolioService.getInstance().getBuildingFromPortofolio(portofolioId, BosId);
        if (!bosOriginNalNode) return;

        const bosAlreadyAuthorized = await findNodeReferenceInProfileTree(context, portofolioRef, BosId);
        if (bosAlreadyAuthorized) return bosOriginNalNode;

        const bosReference = await createNodeReference(bosOriginNalNode);
        await portofolioRef.addChildInContext(bosReference, PROFILE_TO_AUTHORIZED_BOS_RELATION, PTR_LST_TYPE, context);

        return bosOriginNalNode;
    }

    /**
     * Authorizes a profile to access a specific app within a BOS (Building Operating System).
     * If the app is not already linked to the BOS reference, creates a reference and links it.
     *
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portfolio.
     * @param BosId - The ID of the BOS.
     * @param appId - The ID of the app to authorize access to.
     * @returns The real SpinalNode of the app if successful, otherwise undefined.
     */
    private async authorizeProfileToAccessOneBosApp(profile: SpinalNode, portofolioId: string, BosId: string, appId: string): Promise<SpinalNode> {
        const bosNode = await this.authorizeProfileToAccessBos(profile, portofolioId, BosId);

        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, createContextIfNotExist);

        const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
        const bosRef = await findNodeReferenceInProfileTree(context, portofolioRef, BosId);

        const appOriginalNode = await BuildingService.getInstance().getAppFromBuilding(BosId, appId);
        if (!appOriginalNode) return;

        const appAlreadyAuthorized = await findNodeReferenceInProfileTree(context, bosRef, appId);
        if (appAlreadyAuthorized) return appOriginalNode;

        const appReference = await createNodeReference(appOriginalNode);
        await bosRef.addChildInContext(appReference, APP_RELATION_NAME, PTR_LST_TYPE, context);
        return appOriginalNode;
    }


    /**
     * Authorizes a profile to access multiple apps within a BOS (Building Operating System).
     * For each appId, if not already linked, creates a reference and links it to the BOS reference.
     * 
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portfolio.
     * @param BosId - The ID of the BOS.
     * @param appIds - The IDs of the apps to authorize access to.
     * @returns An array of real SpinalNode apps that were authorized.
     */
    public async authorizeProfileToAccessBosApp(profile: SpinalNode, portofolioId: string, BosId: string, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];

        let index = 0;
        let firstCreated;

        // Try to authorize the first appId, if it fails, continue with the next ones until one succeeds
        // This ensures to not have a duplicate bos reference in the profile tree
        while (!firstCreated && index < appIds.length) {
            firstCreated = await this.authorizeProfileToAccessOneBosApp(profile, portofolioId, BosId, appIds[index]);
            index++;
        }
        const restAppIds = appIds.slice(index);
        const promises = restAppIds.map((appId) => this.authorizeProfileToAccessOneBosApp(profile, portofolioId, BosId, appId));

        return Promise.all(promises).then(async (apps) => {
            await this._removeEmptyBosFromProfile(profile, portofolioId, BosId);
            return apps.filter(app => app !== undefined).concat(firstCreated ? [firstCreated] : []);
        });
    }



    /**
     * Revokes a profile's authorization to access a specific BOS (Building Operating System) within a given portfolio.
     *
     * This method attempts to locate the portfolio and BOS references within the profile's authorization context.
     * If both references are found, it cleans the BOS reference tree and checks the validity of the portfolio.
     * Returns `true` if the operation succeeds, otherwise returns `false`.
     *
     * @param profile - The profile node whose access is to be revoked.
     * @param portofolioId - The unique identifier of the portfolio.
     * @param BosId - The unique identifier of the BOS to unauthorize access to.
     * @returns A promise that resolves to `true` if the profile was successfully unauthorized, or `false` otherwise.
     */
    public async unauthorizeProfileToAccessBos(profile: SpinalNode, portofolioId: string, BosId: string): Promise<boolean> {
        try {
            const createContextIfNotExist = true;
            const context = await _getAuthorizedPortofolioContext(profile, !createContextIfNotExist);
            const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
            const bosRef = await findNodeReferenceInProfileTree(context, portofolioRef, BosId);


            if (portofolioRef && bosRef) {
                await CleanReferenceTree(context, bosRef);
                await this._removeEmptyPortofolioFromProfile(profile, portofolioId, portofolioRef);
                return true;
            }

            return false
        } catch (error) {
            return false;
        }
    }



    /**
     * Revokes a profile's authorization to access specific app(s) within a BOS (Building Operating System).
     *
     * For each appId, finds the reference node in the profile's BOS tree and removes it.
     * After removal, checks if the BOS reference is still valid (has children), and if not,
     * revokes the profile's access to the BOS as well.
     *
     * @param profile - The profile node whose app access is to be revoked.
     * @param portofolioId - The unique identifier of the portfolio.
     * @param BosId - The unique identifier of the BOS.
     * @param appIds - The ID(s) of the app(s) to unauthorize.
     * @returns A promise that resolves to an array of removed app references.
     */
    public async unauthorizeProfileToAccessBosApp(profile: SpinalNode, portofolioId: string, BosId: string, appIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];
        // const { bosRef, portofolioRef } = await this._getRefTree(profile, portofolioId, BosId)
        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, !createContextIfNotExist);

        const bosRef = await findNodeReferenceInProfileTree(context, context, BosId);
        if (!bosRef) return;

        const promises = appIds.map(async (appId: string) => {
            const appReference = await findNodeReferenceInProfileTree(context, bosRef, appId);
            if (!appReference) return null;

            await removeReferenceNode(appReference);
            return getOriginalNodeFromReference(appReference);
        });

        return Promise.all(promises).then(async (removedApps) => {
            await this._removeEmptyBosFromProfile(profile, portofolioId, BosId, bosRef);
            return removedApps.filter(app => app !== null);
        })
    }


    /**
     * Retrieves the list of authorized BOS (Building Operating System) nodes within a specific portfolio for a given profile.
     *
     * This method locates the portfolio reference in the profile's authorization tree,
     * fetches all child nodes linked via the `PROFILE_TO_AUTHORIZED_BOS_RELATION` relation, resolves their
     * original nodes, and returns an array of authorized BOS nodes.
     * If the portfolio reference is not found, an empty array is returned.
     *
     * @param profile - The profile node for which to retrieve authorized BOS nodes.
     * @param portofolioId - The ID of the portfolio to check.
     * @returns A promise that resolves to an array of authorized BOS nodes (`SpinalNode[]`).
     */
    public async getAuthorizedBosFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
        // const { portofolioRef } = await this._getRefTree(profile, portofolioId);
        const context = await _getAuthorizedPortofolioContext(profile, false);
        if (!context) return [];
        const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
        if (!portofolioRef) return [];

        const bosRefs = await portofolioRef.getChildren([PROFILE_TO_AUTHORIZED_BOS_RELATION]);

        const promises = bosRefs.map(async (bosRef) => getOriginalNodeFromReference(bosRef));
        return Promise.all(promises).then((bosNodes) => bosNodes.filter(bos => bos !== undefined));
    }


    /**
     * Retrieves the list of authorized BOS application nodes for a given profile, portfolio, and BOS ID.
     *
     * This method navigates the profile tree to find the specified portfolio and BOS references,
     * then fetches all application nodes related to the BOS. Only valid application nodes are returned.
     *
     * @param profile - The root profile node from which to start the search.
     * @param portofolioId - The unique identifier of the portfolio to search within the profile tree.
     * @param BosId - The unique identifier of the BOS (Business Operating System) node.
     * @returns A promise that resolves to an array of authorized application nodes (`SpinalNode[]`).
     */
    public async getAuthorizedBosAppFromProfile(profile: SpinalNode, portofolioId: string, BosId: string): Promise<SpinalNode[]> {

        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, !createContextIfNotExist);
        const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
        if (!portofolioRef) return [];

        const bosRef = await findNodeReferenceInProfileTree(context, portofolioRef, BosId);
        if (!bosRef) return [];

        const appRefs = await bosRef.getChildren(APP_RELATION_NAME);
        const promises = appRefs.map(async (appRef) => getOriginalNodeFromReference(appRef));
        return Promise.all(promises).then((apps) => apps.filter(app => app !== undefined));
    }


    //////////////////////////////////////////////////////////
    //            API's ROUTES AUTHORIZATION                //
    //////////////////////////////////////////////////////////


    /**
     * Authorizes a profile to access a specific API route within a BOS (Building Operating System).
     * If the API route is not already linked to the BOS reference, creates a reference and links it.
     *
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portfolio.
     * @param bosId - The ID of the BOS.
     * @param apiRouteId - The ID of the API route to authorize access to.
     * @returns The real SpinalNode of the API route if successful, otherwise undefined.
     */
    public async authorizeProfileToAccessOneBosApisRoutes(profile: SpinalNode, portofolioId: string, bosId: string, apiRouteId: string): Promise<SpinalNode> {
        const apiRoute = await BuildingService.getInstance().getApiFromBuilding(bosId, apiRouteId);
        if (!apiRoute) return;

        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, createContextIfNotExist);
        const bosOriginNalNode = this.authorizeProfileToAccessBos(profile, portofolioId, bosId);
        if (!bosOriginNalNode) return;
        const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
        const bosRef = await findNodeReferenceInProfileTree(context, portofolioRef, bosId);
        if (!bosRef) return;

        const apiRouteAlreadyAuthorized = await findNodeReferenceInProfileTree(context, bosRef, apiRouteId);
        if (apiRouteAlreadyAuthorized) return apiRoute;

        const apiRouteReference = await createNodeReference(apiRoute);
        await bosRef.addChildInContext(apiRouteReference, API_RELATION_NAME, PTR_LST_TYPE, context);
        return apiRoute;
    }

    /**
     * Authorizes a profile to access multiple API routes within a BOS (Building Operating System).
     * For each apiRouteId, if not already linked, creates a reference and links it to the BOS reference.
     * 
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portfolio.
     * @param bosId - The ID of the BOS.
     * @param apiRoutesIds - The IDs of the API routes to authorize access to.
     * @returns An array of real SpinalNode API routes that were authorized.
     */
    public async authorizeProfileToAccessBosApisRoutes(profile: SpinalNode, portofolioId: string, bosId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]> {
        if (!Array.isArray(apiRoutesIds)) apiRoutesIds = [apiRoutesIds];

        if (!apiRoutesIds.length) return [];
        let index = 0;
        let firstCreated;
        // Try to authorize the first apiRouteId, if it fails, continue with the next ones until one succeeds
        // This ensures to not have a duplicate bos reference in the profile tree
        while (!firstCreated && index < apiRoutesIds.length) {
            firstCreated = await this.authorizeProfileToAccessOneBosApisRoutes(profile, portofolioId, bosId, apiRoutesIds[index]);
            index++;
        }
        const restApiRoutesIds = apiRoutesIds.slice(index);
        const promises = restApiRoutesIds.map((apiRouteId) => this.authorizeProfileToAccessOneBosApisRoutes(profile, portofolioId, bosId, apiRouteId));

        return Promise.all(promises).then(async (apis) => {
            await this._removeEmptyBosFromProfile(profile, portofolioId, bosId);
            return apis.filter(api => api !== undefined).concat(firstCreated ? [firstCreated] : []);
        });

    }


    /**
     * Revokes a profile's authorization to access specific API routes within a BOS (Building Operating System).
     *
     * For each apiRouteId, finds the reference node in the profile's BOS tree and removes it.
     * After removal, checks if the BOS reference is still valid (has children), and if not,
     * revokes the profile's access to the BOS as well.
     *
     * @param profile - The profile node whose API route access is to be revoked.
     * @param portofolioId - The unique identifier of the portfolio.
     * @param bosId - The unique identifier of the BOS.
     * @param apiRoutesIds - The ID(s) of the API route(s) to unauthorize.
     * @returns A promise that resolves to an array of removed API route references.
     */
    public async unauthorizeProfileToAccessBosApisRoutes(profile: SpinalNode, portofolioId: string, bosId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]> {

        const createContextIfNotExist = true;
        const context = await _getAuthorizedPortofolioContext(profile, !createContextIfNotExist);
        const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
        if (!portofolioRef) return [];
        const bosRef = await findNodeReferenceInProfileTree(context, portofolioRef, bosId);
        if (!bosRef) return [];
        if (!apiRoutesIds || !apiRoutesIds.length) return [];
        if (typeof apiRoutesIds === 'string') apiRoutesIds = [apiRoutesIds];

        const promises = apiRoutesIds.map(async (apiRouteId: string) => {
            const apiRouteReference = await findNodeReferenceInProfileTree(context, bosRef, apiRouteId);
            if (!apiRouteReference) return null;
            await removeReferenceNode(apiRouteReference);
            return getOriginalNodeFromReference(apiRouteReference);
        });

        return Promise.all(promises).then(async (removedApis) => {
            await this._removeEmptyBosFromProfile(profile, portofolioId, bosId, bosRef, portofolioRef);
            return removedApis.filter(api => api !== null);
        });
    }


    /**
     * Retrieves the list of authorized BOS API route nodes for a given profile, portfolio, and BOS ID.
     *
     * This method navigates the profile tree to find the specified portfolio and BOS nodes,
     * then collects all API route nodes related to the BOS. Only nodes that can be resolved
     * to their original references are returned.
     *
     * @param profile - The root profile node from which to start the search.
     * @param portofolioId - The unique identifier of the portfolio node.
     * @param BosId - The unique identifier of the BOS node.
     * @returns A promise that resolves to an array of authorized BOS API route nodes.
     */
    public async getAuthorizedBosApisRoutesFromProfile(profile: SpinalNode, portofolioId: string, BosId: string): Promise<SpinalNode[]> {
        const context = await _getAuthorizedPortofolioContext(profile, false);
        if (!context) return [];
        const portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
        if (!portofolioRef) return [];
        const bosRef = await findNodeReferenceInProfileTree(context, portofolioRef, BosId);
        if (!bosRef) return [];
        const apiRefs = await bosRef.getChildren(API_RELATION_NAME);
        const promises = apiRefs.map(async (apiRef) => getOriginalNodeFromReference(apiRef));
        return Promise.all(promises).then((apis) => apis.filter(api => api !== undefined));
    }


    //////////////////////////////////////////////////////////
    //                     PRIVATES                         //
    //////////////////////////////////////////////////////////



    private async _removeEmptyPortofolioFromProfile(profile: SpinalNode, portofolioId: string, portofolioRef?: SpinalNode) {
        if (!portofolioRef) {
            const context = await _getAuthorizedPortofolioContext(profile, false);
            portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
        }
        if (!portofolioRef) return;

        const childrenList = await portofolioRef.getChildren();
        if (childrenList.length > 0) return;

        return removeReferenceNode(portofolioRef);
    }

    private async _removeEmptyBosFromProfile(profile: SpinalNode, portofolioId: string, bosId: string, bosReference?: SpinalNode, portofolioRef?: SpinalNode) {

        console.warn("Don't remove empty BOS for now, to be compatible with old behavior");

        // const createContextIfNotExist = true;
        // const context = await _getAuthorizedPortofolioContext(profile, !createContextIfNotExist);
        // if (!portofolioRef) portofolioRef = await findNodeReferenceInProfileTree(context, context, portofolioId);
        // if (!portofolioRef) return;
        // if (!bosReference) bosReference = await findNodeReferenceInProfileTree(context, portofolioRef, bosId);
        // if (!bosReference) return;

        // const childrenList = await bosReference.getChildren();
        // if (childrenList.length > 0) return;

        // await removeReferenceNode(bosReference);
        // return this._removeEmptyPortofolioFromProfile(profile, portofolioId, portofolioRef);
    }
}


const authorizationInstance = AuthorizationService.getInstance();
export { authorizationInstance, AuthorizationService };