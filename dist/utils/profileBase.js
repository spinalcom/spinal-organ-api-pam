"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileBase = void 0;
const spinal_model_graph_1 = require("spinal-model-graph");
const profileUtils_1 = require("./profileUtils");
const constant_1 = require("../constant");
const authorization_service_1 = require("../services/authorization.service");
const AuthError_1 = require("../security/AuthError");
class ProfileBase {
    constructor(relationName) {
        this.relationName = relationName;
    }
    /**
 * Creates a new profile node and authorizes it to access specified portofolios.
 * Throws an error if no portofolio is provided.
 * @param profileData The profile data to create.
 * @returns The created profile node and its authorized portofolios.
 */
    async createProfile(profileData, isCompatibleWithBosC) {
        const authorizationDataFormatted = (0, profileUtils_1.formatAndMergePortofolioAuthorization)(profileData.authorize, isCompatibleWithBosC);
        if (authorizationDataFormatted.length === 0)
            throw new AuthError_1.AuthError("At least one portofolio must be authorized in the profile", constant_1.HTTP_CODES.BAD_REQUEST);
        const profileNode = await (0, profileUtils_1._createProfileNode)(profileData);
        const promises = [];
        for (const portofolio of authorizationDataFormatted) {
            promises.push(this.authorizeProfileToAccessPortofolio(profileNode, portofolio, isCompatibleWithBosC));
        }
        return Promise.all(promises).then(async (itemsAuthorized) => {
            await this.context.addChildInContext(profileNode, this.relationName, constant_1.PTR_LST_TYPE, this.context);
            return { node: profileNode, authorized: itemsAuthorized };
        });
    }
    /**
     * Retrieves the profile node associated with the given profile ID.
     *
     * @param profileId - The unique identifier of the profile to retrieve.
     * @returns A promise that resolves to the corresponding `SpinalNode` if found, or `undefined` if not found.
     */
    getProfileNode(profileId) {
        return (0, profileUtils_1._getProfileNode)(profileId, this.context);
    }
    /**
     * Retrieves the profile node and its associated authorization structure.
     *
     * @param profile - The application profile identifier or a SpinalNode instance.
     * @returns A promise that resolves to an object containing the application profile node and its authorization structure,
     *          or `undefined` if the profile node could not be found.
     */
    async getProfileWithAuthorizedPortofolio(profile) {
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!profileNode)
            return;
        return {
            node: profileNode,
            authorized: await this.getPortofolioAuthStructure(profileNode)
        };
    }
    /**
     * Updates an existing application profile node and its authorizations.
     * Renames the profile if the name has changed, and updates the authorized portofolios.
     * @param profileId The ID of the profile to update.
     * @param newData The new profile data.
     * @returns The updated profile node and its authorized portofolios.
     */
    async updateProfile(profileId, newData, isCompatibleWithBosC) {
        const profileNode = await (0, profileUtils_1._getProfileNode)(profileId, this.context);
        if (!profileNode)
            return;
        if (newData.name && newData.name.trim() !== profileNode.info.name.get()) {
            (0, profileUtils_1._renameProfile)(profileNode, newData.name);
        }
        const newAuthorizationFormatted = (0, profileUtils_1.formatAndMergePortofolioAuthorization)(newData.authorize, isCompatibleWithBosC);
        const promises = [];
        for (const portofolio of newAuthorizationFormatted) {
            promises.push(this.authorizeProfileToAccessPortofolio(profileNode, portofolio, isCompatibleWithBosC));
            promises.push(this.unauthorizeProfileToAccessPortofolio(profileNode, portofolio, isCompatibleWithBosC));
        }
        return Promise.all(promises).then(() => {
            return this.getProfileWithAuthorizedPortofolio(profileNode);
        });
    }
    /**
     * Retrieves all application profile nodes and their associated authorization structures.
     * @returns A promise that resolves to an array of profile objects, each containing the profile node and its authorization structure.
     */
    async getAllProfilesWithAuthorizedPortfolios() {
        const profiles = await this.getAllProfilesNodes();
        const promises = profiles.map(profile => this.getProfileWithAuthorizedPortofolio(profile));
        return Promise.all(promises);
    }
    /**
     * Retrieves all application profile nodes.
     * @returns A promise that resolves to an array of SpinalNode instances representing the application profiles.
     */
    async getAllProfilesNodes() {
        const profileNodes = await this.context.getChildren(this.relationName);
        return profileNodes;
    }
    /**
     * Retrieves an application profile node by its ID.
     * @param profileId The ID of the application profile.
     * @returns A promise that resolves to the SpinalNode instance representing the application profile, or `undefined` if not found.
     */
    async deleteProfile(profileId) {
        const profile = await (0, profileUtils_1._getProfileNode)(profileId, this.context);
        if (!profile)
            throw new Error(`no profile Found for ${profile}`);
        await profile.removeFromGraph();
        return profileId;
    }
    /// END CRUD
    /// AUTH BEGIN
    //////////////////////////////////////////////////////
    //                      PORTOFOLIO                  //
    //////////////////////////////////////////////////////
    /**
     * Authorizes a profile to access one or more portofolios by their IDs.
     * @param profile - The profile node or its ID.
     * @param portofolioIds - A single portofolio ID or an array of portofolio IDs.
     * @returns A promise that resolves to an array of authorized portofolio nodes.
     */
    async authorizeProfileToAccessPortofolioById(profile, portofolioIds) {
        portofolioIds = Array.isArray(portofolioIds) ? portofolioIds : [portofolioIds];
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        const promises = portofolioIds.map(portofolioId => authorization_service_1.authorizationInstance.authorizeProfileToAccessPortofolio(profileNode, portofolioId));
        return Promise.all(promises);
    }
    /**
     * Revokes a profile's authorization to access one or more portfolios by their IDs.
     *
     * @param profile - The profile identifier or a SpinalNode instance representing the profile.
     * @param portofolioIds - A single portfolio ID or an array of portfolio IDs to unauthorize access from.
     * @returns A promise that resolves to an array of booleans indicating the success of the unauthorization for each portfolio ID.
     */
    async unauthorizeProfileToAccessPortofolioById(profile, portofolioIds) {
        portofolioIds = Array.isArray(portofolioIds) ? portofolioIds : [portofolioIds];
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        const promises = portofolioIds.map(portofolioId => authorization_service_1.authorizationInstance.unauthorizeProfileToAccessPortofolio(profileNode, portofolioId));
        return Promise.all(promises);
    }
    /**
     * Authorizes a profile to access specific applications within one or more portfolios.
     * @param profile - The profile node or its ID.
     * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and app IDs.
     * @returns A promise resolving to an array of authorized portfolio-app structures.
     */
    async authorizeProfileToAccessPortofolioApp(profile, portofolioAuth, isCompatibleWithBosC) {
        portofolioAuth = Array.isArray(portofolioAuth) ? portofolioAuth : [portofolioAuth];
        const node = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(node instanceof spinal_model_graph_1.SpinalNode))
            return;
        const itemsFormatted = (0, profileUtils_1.formatAndMergePortofolioAuthorization)(portofolioAuth, isCompatibleWithBosC);
        const promises = itemsFormatted.map(async ({ appsIds, portofolioId }) => {
            if (appsIds && appsIds.length === 0)
                return null;
            const portofolio = await authorization_service_1.authorizationInstance.authorizeProfileToAccessPortofolio(node, portofolioId);
            const apps = await authorization_service_1.authorizationInstance.authorizeProfileToAccessPortofolioApps(node, portofolioId, appsIds);
            return { portofolio, apps };
        });
        return Promise.all(promises).then((result) => result.filter(Boolean));
    }
    /**
     * Revokes a profile's authorization to access specific applications within one or more portfolios.
     * @param profile - The profile node or its ID.
     * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and app IDs to unauthorize.
     * @returns A promise resolving to an array of SpinalNode instances representing the unauthorizations.
     */
    async unauthorizeProfileToAccessPortofolioApp(profile, portofolioAuth, isCompatibleWithBosC) {
        portofolioAuth = Array.isArray(portofolioAuth) ? portofolioAuth : [portofolioAuth];
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        const formattedData = (0, profileUtils_1.formatAndMergePortofolioAuthorization)(portofolioAuth, isCompatibleWithBosC);
        const promises = [];
        for (const data of formattedData) {
            if (!data.unauthorizeAppsIds || data.unauthorizeAppsIds.length === 0)
                continue;
            promises.push(authorization_service_1.authorizationInstance.unauthorizeProfileToAccessPortofolioApp(profileNode, data.portofolioId, data.unauthorizeAppsIds));
        }
        return Promise.all(promises).then((result) => {
            return result.flat();
        });
    }
    /**
     * Authorizes a profile to access specific API routes within one or more portfolios.
     * @param profile - The profile node or its ID.
     * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and API IDs.
     * @returns A promise resolving to an array of authorized portfolio-API structures.
     */
    async authorizeProfileToAccessPortofolioApisRoute(profile, portofolioAuth, isCompatibleWithBosC) {
        portofolioAuth = Array.isArray(portofolioAuth) ? portofolioAuth : [portofolioAuth];
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        const itemsFormatted = (0, profileUtils_1.formatAndMergePortofolioAuthorization)(portofolioAuth, isCompatibleWithBosC);
        const promises = itemsFormatted.map(async ({ apisIds, portofolioId }) => {
            if (apisIds && apisIds.length === 0)
                return null;
            const portofolio = await authorization_service_1.authorizationInstance.authorizeProfileToAccessPortofolio(profileNode, portofolioId);
            const apis = await authorization_service_1.authorizationInstance.authorizeProfileToAccessPortofolioApisRoutes(profileNode, portofolioId, apisIds);
            return { portofolio, apis };
        });
        return Promise.all(promises).then((result) => result.filter(Boolean));
    }
    /**
     * Revokes a profile's authorization to access specific API routes within one or more portfolios.
     * @param profile - The profile node or its ID.
     * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and API IDs to unauthorize.
     * @returns A promise resolving to an array of IDs of the unauthorized API routes.
     */
    async unauthorizeProfileToAccessPortofolioApisRoute(profile, portofolioAuth, isCompatibleWithBosC) {
        portofolioAuth = Array.isArray(portofolioAuth) ? portofolioAuth : [portofolioAuth];
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        const itemsFormatted = (0, profileUtils_1.formatAndMergePortofolioAuthorization)(portofolioAuth, isCompatibleWithBosC);
        const promises = itemsFormatted.map(async ({ unauthorizeApisIds, portofolioId }) => {
            if (!unauthorizeApisIds || unauthorizeApisIds.length === 0)
                return null;
            return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessPortofolioApisRoutes(profileNode, portofolioId, unauthorizeApisIds);
        });
        return Promise.all(promises).then((result) => {
            const res = result.flat();
            return res.map(el => el?.getId().get()).filter(Boolean);
        });
    }
    /**
     * Retrieves the authorized portfolios for a given profile.
     *
     * @param {(string | SpinalNode)} profile - The profile node or its ID.
     * @returns {Promise<SpinalNode[]>} - A promise that resolves to an array of authorized portfolio nodes.
     */
    async getAuthorizedPortofolio(profile) {
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        return authorization_service_1.authorizationInstance.getAuthorizedPortofolioFromProfile(profileNode);
    }
    /**
     * Retrieves the list of authorized portfolio application nodes for a given profile and portfolio ID.
     *
     * @param profile - The profile identifier or a SpinalNode instance representing the profile.
     * @param portofolioId - The unique identifier of the portfolio.
     * @returns A promise that resolves to an array of SpinalNode instances representing the authorized portfolio applications,
     *          or `undefined` if the profile node could not be resolved.
     */
    async getAuthorizedPortofolioApp(profile, portofolioId) {
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        return authorization_service_1.authorizationInstance.getAuthorizedPortofolioAppFromProfile(profileNode, portofolioId);
    }
    /**
     * Retrieves the authorized API routes for a given profile and portfolio.
     *
     * @param profile - The profile node or its ID.
     * @param portofolioId - The unique identifier of the portfolio.
     * @returns A promise that resolves to an array of authorized API route nodes,
     *          or `undefined` if the profile node could not be resolved.
     */
    async getAuthorizedPortofolioApis(profile, portofolioId) {
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        return authorization_service_1.authorizationInstance.getAuthorizedPortofolioApisRoutesFromProfile(profileNode, portofolioId);
    }
    /**
     * Retrieves the authorization structure for all portfolios authorized for a given profile.
     * For each portfolio, returns the portfolio node, its authorized apps, APIs, and buildings structure.
     *
     * @param profile - The profile node or its ID.
     * @returns A promise that resolves to an array of authorization structures for each portfolio.
     */
    async getPortofolioAuthStructure(profile) {
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        const portofolios = await this.getAuthorizedPortofolio(profile);
        const promises = portofolios.map(async (portofolio) => {
            const portofolioId = portofolio.getId().get();
            return {
                portofolio,
                apps: await this.getAuthorizedPortofolioApp(profile, portofolioId),
                apis: await this.getAuthorizedPortofolioApis(profile, portofolioId),
                buildings: await this.getBosAuthStructure(profile, portofolioId)
            };
        });
        return Promise.all(promises);
    }
    /////////////////////////////////////////////
    //                  BOS                    //
    /////////////////////////////////////////////
    /**
     * Authorizes a profile to access one or more BOS (Building Operating System) nodes by their IDs.
     *
     * @param {SpinalNode | string} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @param {string | string[]} BosId - A single BOS ID or an array of BOS IDs.
     * @returns {Promise<SpinalNode[]>} - A promise that resolves to an array of authorized BOS nodes.
     */
    async authorizeProfileToAccessBos(profile, portofolioId, BosId) {
        BosId = Array.isArray(BosId) ? BosId : [BosId];
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        const results = [];
        // use for loop with await to have sequential execution
        // else it can duplicate portofolio authorization in some cases
        for (const id of BosId) {
            const res = await authorization_service_1.authorizationInstance.authorizeProfileToAccessBos(profileNode, portofolioId, id);
            results.push(res);
        }
        return results;
        // const promises = BosId.map(id => authorizationInstance.authorizeProfileToAccessBos(profileNode, portofolioId, id))
        // return Promise.all(promises);
    }
    /**
     * Revokes a profile's authorization to access one or more BOS (Building Operating System) nodes by their IDs.
     *
     * @param {SpinalNode | string} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @param {string | string[]} BosId - A single BOS ID or an array of BOS IDs.
     * @returns {Promise<boolean[]>} - A promise that resolves to an array of booleans indicating the success of the unauthorization for each BOS ID.
     */
    async unauthorizeProfileToAccessBos(profile, portofolioId, BosId) {
        BosId = Array.isArray(BosId) ? BosId : [BosId];
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        const promises = BosId.map(id => authorization_service_1.authorizationInstance.unauthorizeProfileToAccessBos(profileNode, portofolioId, id));
        return Promise.all(promises);
    }
    /**
     * Authorizes a profile to access specific applications within one or more BOS (Building Operating System) nodes.
     *
     * @param {SpinalNode | string} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @param {IBosAuth | IBosAuth[]} bosAuth - A single or array of IBosAuth objects specifying building and app IDs.
     * @returns {Promise<IBosAuthRes[]>} - A promise resolving to an array of authorized building-app structures.
     */
    async authorizeProfileToAccessBosApp(profile, portofolioId, bosAuth, isCompatibleWithBosC) {
        bosAuth = Array.isArray(bosAuth) ? bosAuth : [bosAuth];
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        const itemsFormatted = (0, profileUtils_1.formatAndMergeBosAuthorization)(bosAuth);
        const promises = itemsFormatted.map(async ({ appsIds, buildingId }) => {
            if (appsIds && appsIds.length === 0)
                return null;
            const bos = await authorization_service_1.authorizationInstance.authorizeProfileToAccessBos(profileNode, portofolioId, buildingId);
            const apps = await authorization_service_1.authorizationInstance.authorizeProfileToAccessBosApp(profileNode, portofolioId, buildingId, appsIds, isCompatibleWithBosC);
            return { building: bos, apps };
        });
        return Promise.all(promises).then((result) => result.filter(Boolean));
    }
    /**
     * Revokes a profile's authorization to access specific applications within one or more BOS (Building Operating System) nodes.
     *
     * @param {SpinalNode | string} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @param {IBosAuth | IBosAuth[]} bosAuth - A single or array of IBosAuth objects specifying building and app IDs to unauthorize.
     * @returns {Promise<SpinalNode[]>} - A promise resolving to an array of SpinalNode instances representing the unauthorizations.
     */
    async unauthorizeProfileToAccessBosApp(profile, portofolioId, bosAuth, isCompatibleWithBosC) {
        bosAuth = Array.isArray(bosAuth) ? bosAuth : [bosAuth];
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        const itemsFormatted = (0, profileUtils_1.formatAndMergeBosAuthorization)(bosAuth);
        const promises = itemsFormatted.map(({ buildingId, unauthorizeAppsIds }) => {
            return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessBosApp(profileNode, portofolioId, buildingId, unauthorizeAppsIds, isCompatibleWithBosC);
        });
        return Promise.all(promises).then((result) => result.flat());
    }
    /**
     * Authorizes a profile to access specific API routes within one or more BOS (Building Operating System) nodes.
     *
     * @param {SpinalNode | string} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @param {IBosAuth | IBosAuth[]} bosAuth - A single or array of IBosAuth objects specifying building and API IDs.
     * @returns A promise resolving to an array of authorized building-API structures.
     */
    async authorizeProfileToAccessBosApiRoute(profile, portofolioId, bosAuth, isCompatibleWithBosC) {
        bosAuth = Array.isArray(bosAuth) ? bosAuth : [bosAuth];
        const node = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(node instanceof spinal_model_graph_1.SpinalNode))
            return;
        const itemsFormatted = (0, profileUtils_1.formatAndMergeBosAuthorization)(bosAuth);
        const promises = itemsFormatted.map(async ({ apisIds, buildingId }) => {
            if (apisIds && apisIds.length === 0)
                return null;
            const bos = await authorization_service_1.authorizationInstance.authorizeProfileToAccessBos(node, portofolioId, buildingId);
            const apis = await authorization_service_1.authorizationInstance.authorizeProfileToAccessBosApisRoutes(node, portofolioId, buildingId, apisIds, isCompatibleWithBosC);
            return { building: bos, apis };
        });
        return Promise.all(promises).then((result) => result.filter(Boolean));
    }
    /**
     * Revokes a profile's authorization to access specific API routes within one or more BOS (Building Operating System) nodes.
     *
     * @param {SpinalNode | string} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @param {IBosAuth | IBosAuth[]} bosAuth - A single or array of IBosAuth objects specifying building and API IDs to unauthorize.
     * @returns {Promise<string[]>} - A promise resolving to an array of IDs of the unauthorized API routes.
     */
    async unauthorizeProfileToAccessBosApiRoute(profile, portofolioId, bosAuth, isCompatibleWithBosC) {
        bosAuth = Array.isArray(bosAuth) ? bosAuth : [bosAuth];
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        const itemsFormatted = (0, profileUtils_1.formatAndMergeBosAuthorization)(bosAuth);
        const promises = itemsFormatted.map(({ buildingId, unauthorizeApisIds }) => {
            return authorization_service_1.authorizationInstance.unauthorizeProfileToAccessBosApisRoutes(profileNode, portofolioId, buildingId, unauthorizeApisIds || [], isCompatibleWithBosC);
        });
        return Promise.all(promises).then((result) => {
            const res = result.flat();
            return res.map(el => el?.getId().get());
        });
    }
    /**
     * Retrieves the authorized BOS (Building Operating System) nodes for a given profile and portfolio.
     *
     * @param {(SpinalNode | string)} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @return {*}  {Promise<SpinalNode[]>} - A promise that resolves to an array of authorized BOS nodes.
     */
    async getAuthorizedBos(profile, portofolioId) {
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        return authorization_service_1.authorizationInstance.getAuthorizedBosFromProfile(profileNode, portofolioId);
    }
    /**
     * Retrieves the list of authorized BOS applications for a given profile, portfolio, and BOS ID.
     *
     * @param profile - The profile node or its identifier (string) for which to fetch authorized BOS applications.
     * @param portofolioId - The identifier of the portfolio to check authorization against.
     * @param bosId - The identifier of the BOS application to check authorization for.
     * @returns A promise that resolves to an array of `SpinalNode` objects representing the authorized BOS applications.
     */
    async getAuthorizedBosApp(profile, portofolioId, bosId) {
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        return authorization_service_1.authorizationInstance.getAuthorizedBosAppFromProfile(profileNode, portofolioId, bosId);
    }
    /**
     * Retrieves the authorized API routes for a given profile, portfolio, and BOS (Building Operating System) node.
     *
     * @param profile - The profile node or its ID.
     * @param portofolioId - The portfolio ID.
     * @param bosId - The BOS (building) ID.
     * @returns A promise that resolves to an array of authorized API route nodes for the specified BOS.
     */
    async getAuthorizedBosApis(profile, portofolioId, bosId) {
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        return authorization_service_1.authorizationInstance.getAuthorizedBosApisRoutesFromProfile(profileNode, portofolioId, bosId);
    }
    /**
     * Retrieves the authorization structure for all BOS (Building Operating System) nodes authorized for a given profile and portfolio.
     * For each BOS, returns the building node, its authorized apps, and APIs structure.
     *
     * @param profile - The profile node or its ID.
     * @param portofolioId - The portfolio ID.
     * @returns A promise that resolves to an array of authorization structures for each BOS.
     */
    async getBosAuthStructure(profile, portofolioId) {
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        if (!(profileNode instanceof spinal_model_graph_1.SpinalNode))
            return;
        const buildings = await this.getAuthorizedBos(profile, portofolioId);
        const promises = buildings.map(async (building) => {
            const bosId = building.getId().get();
            return {
                building,
                apps: await this.getAuthorizedBosApp(profile, portofolioId, bosId),
                apis: await this.getAuthorizedBosApis(profile, portofolioId, bosId)
            };
        });
        return Promise.all(promises);
    }
    /**
     * Retrieves all authorized BOS (Building Operating System) nodes for a given profile.
     *
     * @param {(string | SpinalNode)} profile - The profile node or its ID.
     * @return {*}  {Promise<SpinalNode[]>} - A promise that resolves to an array of authorized BOS nodes.
     */
    async getAllAuthorizedBos(profile) {
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        const portofolios = await this.getAuthorizedPortofolio(profileNode);
        const promises = portofolios.map(el => this.getAuthorizedBos(profileNode, el.getId().get()));
        return Promise.all(promises).then((result) => result.flat());
    }
    /**
     * Checks if a given profile has access to a specific API.
     *
     * @param profile - The profile identifier or a SpinalNode representing the profile.
     * @param apiId - The SpinalNode representing the API to check access for.
     * @returns A promise that resolves to the SpinalNode if the profile has access to the API.
     */
    async profileHasAccessToApi(profile, apiId) {
        const profileNode = profile instanceof spinal_model_graph_1.SpinalNode ? profile : await (0, profileUtils_1._getProfileNode)(profile, this.context);
        return authorization_service_1.authorizationInstance.profileHasAccessToNode(profileNode, apiId);
    }
    /**
     * Authorizes a profile to access a specific portfolio, its APIs, and associated BOS (building) nodes.
     * For the given portfolio authorization object, this method:
     *   - Authorizes the profile to access the portfolio by ID.
     *   - Authorizes the profile to access specified API routes within the portfolio.
     *   - Authorizes the profile to access specified BOS (building) nodes and their APIs.
     *
     * @param profile - The profile node to authorize.
     * @param portofolioAuth - The portfolio authorization object containing portfolio ID, APIs, and building access details.
     * @returns A promise resolving to an object containing the authorized portfolio node, APIs, and buildings structure.
     */
    async authorizeProfileToAccessPortofolio(profile, portofolioAuth, isCompatibleWithBosC) {
        // Ensure porto
        const [portofolio] = await this.authorizeProfileToAccessPortofolioById(profile, portofolioAuth.portofolioId);
        const apisData = await this.authorizeProfileToAccessPortofolioApisRoute(profile, portofolioAuth, isCompatibleWithBosC);
        const appsData = await this.authorizeProfileToAccessPortofolioApp(profile, portofolioAuth, isCompatibleWithBosC);
        // const buildingProm = portofolioAuth.building.map(bos => this._authorizeIBosAuth(profile, bos, portofolioAuth.portofolioId, isCompatibleWithBosC))
        // use reduce to have sequential execution
        // else it can duplicate portofolio authorization in some cases
        const buildingProm = portofolioAuth.building.reduce(async (resultProm, bos) => {
            const result = await resultProm;
            const res = await this._authorizeIBosAuth(profile, bos, portofolioAuth.portofolioId, isCompatibleWithBosC);
            result.push(res);
            return result;
        }, Promise.resolve([]));
        return {
            portofolio,
            apis: apisData[0]?.apis,
            apps: appsData[0]?.apps,
            buildings: await buildingProm
        };
    }
    /////////////////// private methods ///////////////////
    async unauthorizeProfileToAccessPortofolio(profile, portofolioAuth, isCompatibleWithBosC) {
        await this.unauthorizeProfileToAccessPortofolioApisRoute(profile, { portofolioId: portofolioAuth.portofolioId, unauthorizeApisIds: portofolioAuth.unauthorizeApisIds || [] }, isCompatibleWithBosC);
        await this.unauthorizeProfileToAccessPortofolioApp(profile, { portofolioId: portofolioAuth.portofolioId, unauthorizeAppsIds: portofolioAuth.unauthorizeAppsIds || [] }, isCompatibleWithBosC);
        let buildingProm = [];
        if (isCompatibleWithBosC)
            buildingProm = portofolioAuth.unauthorizeBuildingIds?.map(bosId => this.unauthorizeProfileToAccessBos(profile, portofolioAuth.portofolioId, bosId));
        else
            buildingProm = portofolioAuth.building.map(bos => this._unauthorizeIBosAuth(profile, bos, portofolioAuth.portofolioId, isCompatibleWithBosC));
        await Promise.all(buildingProm);
    }
    async _authorizeIBosAuth(profile, bosAuth, portofolioId, isCompatibleWithBosC) {
        const [building] = await this.authorizeProfileToAccessBos(profile, portofolioId, bosAuth.buildingId);
        const apisData = await this.authorizeProfileToAccessBosApiRoute(profile, portofolioId, bosAuth, isCompatibleWithBosC);
        const appsData = await this.authorizeProfileToAccessBosApp(profile, portofolioId, bosAuth, isCompatibleWithBosC);
        return {
            building,
            apis: apisData[0]?.apis,
            apps: appsData[0]?.apps
        };
    }
    async _unauthorizeIBosAuth(profile, bosAuth, portofolioId, isCompatibleWithBosC) {
        const apisData = await this.unauthorizeProfileToAccessBosApiRoute(profile, portofolioId, { buildingId: bosAuth.buildingId, unauthorizeApisIds: bosAuth.unauthorizeApisIds }, isCompatibleWithBosC);
        const appsData = await this.unauthorizeProfileToAccessBosApp(profile, portofolioId, { buildingId: bosAuth.buildingId, unauthorizeAppsIds: bosAuth.unauthorizeAppsIds }, isCompatibleWithBosC);
        return [apisData, appsData];
    }
}
exports.ProfileBase = ProfileBase;
//# sourceMappingURL=profileBase.js.map