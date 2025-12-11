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
exports.AuthorizationService = exports.authorizationInstance = void 0;
const constant_1 = require("../constant");
const building_service_1 = require("./building.service");
const portofolio_service_1 = require("./portofolio.service");
const authorizationUtils_1 = require("../utils/authorizationUtils");
class AuthorizationService {
    constructor() {
        this.profileToContext = {};
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthorizationService();
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
    async profileHasAccessToNode(profile, anySpinalNode) {
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, createContextIfNotExist);
        if (!context)
            return;
        const anySpinalNodeId = typeof anySpinalNode === "string" ? anySpinalNode : anySpinalNode.getId().get();
        const nodeAlreadyLinked = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, anySpinalNodeId);
        return (nodeAlreadyLinked && (0, authorizationUtils_1.getOriginalNodeFromReference)(nodeAlreadyLinked)) || null;
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
    async authorizeProfileToAccessPortofolio(profile, portofolioId) {
        const portofolioIsLinked = await this.profileHasAccessToNode(profile, portofolioId);
        if (portofolioIsLinked)
            return portofolioIsLinked;
        const originalPortofolioNode = await portofolio_service_1.PortofolioService.getInstance().getPortofolioNode(portofolioId);
        if (!originalPortofolioNode)
            return;
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, createContextIfNotExist);
        const portofolioReference = await (0, authorizationUtils_1.createNodeReference)(originalPortofolioNode);
        await context.addChildInContext(portofolioReference, constant_1.PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, constant_1.PTR_LST_TYPE, context);
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
    async authorizeProfileToAccessOnePortofolioApp(profile, portofolioId, appId) {
        const app = await portofolio_service_1.PortofolioService.getInstance().portofolioHasApp(portofolioId, appId);
        if (!app)
            return null;
        const originalPortofolioNode = await this.authorizeProfileToAccessPortofolio(profile, portofolioId);
        if (!originalPortofolioNode)
            return null;
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, createContextIfNotExist);
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, originalPortofolioNode.getId().get());
        const appIsAleadyLinked = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, portofolioRef, appId);
        if (appIsAleadyLinked)
            return app;
        const appReference = await (0, authorizationUtils_1.createNodeReference)(app);
        portofolioRef.addChildInContext(appReference, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
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
    async authorizeProfileToAccessPortofolioApps(profile, portofolioId, appIds) {
        if (!Array.isArray(appIds))
            appIds = [appIds];
        if (!appIds.length)
            return [];
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
        });
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
    async unauthorizeProfileToAccessPortofolio(profile, portofolioId) {
        try {
            const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, false);
            const portofolioReference = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
            await (0, authorizationUtils_1.CleanReferenceTree)(context, portofolioReference);
            return true;
        }
        catch (error) {
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
    async unauthorizeProfileToAccessPortofolioApp(profile, portofolioOriginalId, appIds) {
        if (!Array.isArray(appIds))
            appIds = [appIds];
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, false);
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioOriginalId);
        if (!portofolioRef)
            return [];
        const promises = appIds.map(async (appId) => {
            const appReference = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, portofolioRef, appId);
            if (!appReference)
                return null;
            return (0, authorizationUtils_1.removeReferenceNode)(appReference);
        });
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
    async getAuthorizedPortofolioFromProfile(profile) {
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, !createContextIfNotExist);
        if (!context)
            return [];
        const portofolioLinked = await context.getChildren([constant_1.PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION]);
        const promises = portofolioLinked.map(async (portofolio) => (0, authorizationUtils_1.getOriginalNodeFromReference)(portofolio));
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
    async getAuthorizedPortofolioAppFromProfile(profile, portofolioId) {
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, !createContextIfNotExist);
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        if (!portofolioRef)
            return [];
        const appRefs = await portofolioRef.getChildren(constant_1.APP_RELATION_NAME);
        const promises = appRefs.map(async (appRef) => (0, authorizationUtils_1.getOriginalNodeFromReference)(appRef));
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
    async authorizeProfileToAccessOnePortofolioApiRoute(profile, portofolioId, apiRouteId) {
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, createContextIfNotExist);
        const apiRoute = await portofolio_service_1.PortofolioService.getInstance().getApiFromPortofolio(portofolioId, apiRouteId);
        if (!apiRoute)
            return;
        const portofolioOriginalNode = await this.authorizeProfileToAccessPortofolio(profile, portofolioId);
        if (!portofolioOriginalNode)
            return;
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        const apiRouteAlreadyAuthorized = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, portofolioRef, apiRouteId);
        if (apiRouteAlreadyAuthorized)
            return apiRoute;
        const apiRouteReference = await (0, authorizationUtils_1.createNodeReference)(apiRoute);
        await portofolioRef.addChildInContext(apiRouteReference, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
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
    async authorizeProfileToAccessPortofolioApisRoutes(profile, portofolioId, apiRoutesIds) {
        if (!Array.isArray(apiRoutesIds))
            apiRoutesIds = [apiRoutesIds];
        if (!apiRoutesIds.length)
            return [];
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
    async unauthorizeProfileToAccessPortofolioApisRoutes(profile, portofolioId, apiRoutesIds) {
        if (!Array.isArray(apiRoutesIds))
            apiRoutesIds = [apiRoutesIds];
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, !createContextIfNotExist);
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        if (!portofolioRef)
            return [];
        const promises = apiRoutesIds.map(async (apiRouteId) => {
            const apiRouteReference = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, portofolioRef, apiRouteId);
            if (!apiRouteReference)
                return null;
            await (0, authorizationUtils_1.removeReferenceNode)(apiRouteReference);
            return (0, authorizationUtils_1.getOriginalNodeFromReference)(apiRouteReference);
        });
        return Promise.all(promises).then(async (removedApis) => {
            await this._removeEmptyPortofolioFromProfile(profile, portofolioId, portofolioRef);
            return removedApis.filter(api => api !== null);
        });
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
    async getAuthorizedPortofolioApisRoutesFromProfile(profile, portofolioId) {
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, !createContextIfNotExist);
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        if (!portofolioRef)
            return [];
        const apiRefs = await portofolioRef.getChildren(constant_1.API_RELATION_NAME);
        const promises = apiRefs.map(async (apiRef) => (0, authorizationUtils_1.getOriginalNodeFromReference)(apiRef));
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
    async authorizeProfileToAccessBos(profile, portofolioId, BosId) {
        const originalPortofolioNode = await this.authorizeProfileToAccessPortofolio(profile, portofolioId);
        if (!originalPortofolioNode)
            return;
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, createContextIfNotExist);
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        const bosOriginNalNode = await portofolio_service_1.PortofolioService.getInstance().getBuildingFromPortofolio(portofolioId, BosId);
        if (!bosOriginNalNode)
            return;
        const bosAlreadyAuthorized = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, portofolioRef, BosId);
        if (bosAlreadyAuthorized)
            return bosOriginNalNode;
        const bosReference = await (0, authorizationUtils_1.createNodeReference)(bosOriginNalNode);
        await portofolioRef.addChildInContext(bosReference, constant_1.PROFILE_TO_AUTHORIZED_BOS_RELATION, constant_1.PTR_LST_TYPE, context);
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
    async authorizeProfileToAccessOneBosApp(profile, portofolioId, BosId, appId) {
        const bosNode = await this.authorizeProfileToAccessBos(profile, portofolioId, BosId);
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, createContextIfNotExist);
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        const bosRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, portofolioRef, BosId);
        const appOriginalNode = await building_service_1.BuildingService.getInstance().getAppFromBuilding(BosId, appId);
        if (!appOriginalNode)
            return;
        const appAlreadyAuthorized = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, bosRef, appId);
        if (appAlreadyAuthorized)
            return appOriginalNode;
        const appReference = await (0, authorizationUtils_1.createNodeReference)(appOriginalNode);
        await bosRef.addChildInContext(appReference, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
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
    async authorizeProfileToAccessBosApp(profile, portofolioId, BosId, appIds, isCompatibleWithBosC) {
        if (!Array.isArray(appIds))
            appIds = [appIds];
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
            // if the profile is not compatible with bosConfig we need to check and remove it if empty
            if (!isCompatibleWithBosC)
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
    async unauthorizeProfileToAccessBos(profile, portofolioId, BosId) {
        try {
            const createContextIfNotExist = true;
            const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, !createContextIfNotExist);
            const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
            const bosRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, portofolioRef, BosId);
            if (portofolioRef && bosRef) {
                await (0, authorizationUtils_1.CleanReferenceTree)(context, bosRef);
                await this._removeEmptyPortofolioFromProfile(profile, portofolioId, portofolioRef);
                return true;
            }
            return false;
        }
        catch (error) {
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
    async unauthorizeProfileToAccessBosApp(profile, portofolioId, BosId, appIds, isCompatibleWithBosC) {
        if (!Array.isArray(appIds))
            appIds = [appIds];
        // const { bosRef, portofolioRef } = await this._getRefTree(profile, portofolioId, BosId)
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, !createContextIfNotExist);
        const bosRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, BosId);
        if (!bosRef)
            return;
        const promises = appIds.map(async (appId) => {
            const appReference = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, bosRef, appId);
            if (!appReference)
                return null;
            await (0, authorizationUtils_1.removeReferenceNode)(appReference);
            return (0, authorizationUtils_1.getOriginalNodeFromReference)(appReference);
        });
        return Promise.all(promises).then(async (removedApps) => {
            // if the profile is not compatible with bosConfig we need to check and remove it if empty
            if (!isCompatibleWithBosC)
                await this._removeEmptyBosFromProfile(profile, portofolioId, BosId, bosRef);
            return removedApps.filter(app => app !== null);
        });
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
    async getAuthorizedBosFromProfile(profile, portofolioId) {
        // const { portofolioRef } = await this._getRefTree(profile, portofolioId);
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, false);
        if (!context)
            return [];
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        if (!portofolioRef)
            return [];
        const bosRefs = await portofolioRef.getChildren([constant_1.PROFILE_TO_AUTHORIZED_BOS_RELATION]);
        const promises = bosRefs.map(async (bosRef) => (0, authorizationUtils_1.getOriginalNodeFromReference)(bosRef));
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
    async getAuthorizedBosAppFromProfile(profile, portofolioId, BosId) {
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, !createContextIfNotExist);
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        if (!portofolioRef)
            return [];
        const bosRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, portofolioRef, BosId);
        if (!bosRef)
            return [];
        const appRefs = await bosRef.getChildren(constant_1.APP_RELATION_NAME);
        const promises = appRefs.map(async (appRef) => (0, authorizationUtils_1.getOriginalNodeFromReference)(appRef));
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
    async authorizeProfileToAccessOneBosApisRoutes(profile, portofolioId, bosId, apiRouteId) {
        const apiRoute = await building_service_1.BuildingService.getInstance().getApiFromBuilding(bosId, apiRouteId);
        if (!apiRoute)
            return;
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, createContextIfNotExist);
        const bosOriginNalNode = this.authorizeProfileToAccessBos(profile, portofolioId, bosId);
        if (!bosOriginNalNode)
            return;
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        const bosRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, portofolioRef, bosId);
        if (!bosRef)
            return;
        const apiRouteAlreadyAuthorized = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, bosRef, apiRouteId);
        if (apiRouteAlreadyAuthorized)
            return apiRoute;
        const apiRouteReference = await (0, authorizationUtils_1.createNodeReference)(apiRoute);
        await bosRef.addChildInContext(apiRouteReference, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
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
    async authorizeProfileToAccessBosApisRoutes(profile, portofolioId, bosId, apiRoutesIds, isCompatibleWithBosC) {
        if (!Array.isArray(apiRoutesIds))
            apiRoutesIds = [apiRoutesIds];
        if (!apiRoutesIds.length)
            return [];
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
            // if the profile is not compatible with bosConfig we need to check and remove it if empty
            if (!isCompatibleWithBosC)
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
    async unauthorizeProfileToAccessBosApisRoutes(profile, portofolioId, bosId, apiRoutesIds, isCompatibleWithBosC) {
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, !createContextIfNotExist);
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        if (!portofolioRef)
            return [];
        const bosRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, portofolioRef, bosId);
        if (!bosRef)
            return [];
        if (!apiRoutesIds || !apiRoutesIds.length)
            return [];
        if (typeof apiRoutesIds === 'string')
            apiRoutesIds = [apiRoutesIds];
        const promises = apiRoutesIds.map(async (apiRouteId) => {
            const apiRouteReference = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, bosRef, apiRouteId);
            if (!apiRouteReference)
                return null;
            await (0, authorizationUtils_1.removeReferenceNode)(apiRouteReference);
            return (0, authorizationUtils_1.getOriginalNodeFromReference)(apiRouteReference);
        });
        return Promise.all(promises).then(async (removedApis) => {
            // if the profile is not compatible with bosConfig we need to check and remove it if empty
            if (!isCompatibleWithBosC)
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
    async getAuthorizedBosApisRoutesFromProfile(profile, portofolioId, BosId) {
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, false);
        if (!context)
            return [];
        const portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        if (!portofolioRef)
            return [];
        const bosRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, portofolioRef, BosId);
        if (!bosRef)
            return [];
        const apiRefs = await bosRef.getChildren(constant_1.API_RELATION_NAME);
        const promises = apiRefs.map(async (apiRef) => (0, authorizationUtils_1.getOriginalNodeFromReference)(apiRef));
        return Promise.all(promises).then((apis) => apis.filter(api => api !== undefined));
    }
    //////////////////////////////////////////////////////////
    //                     PRIVATES                         //
    //////////////////////////////////////////////////////////
    async _removeEmptyPortofolioFromProfile(profile, portofolioId, portofolioRef) {
        if (!portofolioRef) {
            const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, false);
            portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        }
        if (!portofolioRef)
            return;
        const childrenList = await portofolioRef.getChildren();
        if (childrenList.length > 0)
            return;
        return (0, authorizationUtils_1.removeReferenceNode)(portofolioRef);
    }
    async _removeEmptyBosFromProfile(profile, portofolioId, bosId, bosReference, portofolioRef) {
        // console.warn("Don't remove empty BOS for now, to be compatible with old behavior");
        const createContextIfNotExist = true;
        const context = await (0, authorizationUtils_1._getAuthorizedPortofolioContext)(profile, !createContextIfNotExist);
        if (!portofolioRef)
            portofolioRef = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, context, portofolioId);
        if (!portofolioRef)
            return;
        if (!bosReference)
            bosReference = await (0, authorizationUtils_1.findNodeReferenceInProfileTree)(context, portofolioRef, bosId);
        if (!bosReference)
            return;
        const childrenList = await bosReference.getChildren();
        if (childrenList.length > 0)
            return;
        await (0, authorizationUtils_1.removeReferenceNode)(bosReference);
        return this._removeEmptyPortofolioFromProfile(profile, portofolioId, portofolioRef);
    }
}
exports.default = AuthorizationService;
exports.AuthorizationService = AuthorizationService;
const authorizationInstance = AuthorizationService.getInstance();
exports.authorizationInstance = authorizationInstance;
//# sourceMappingURL=authorization.service.js.map