import { SpinalContext, SpinalNode } from "spinal-model-graph";
import { IBosAuth, IBosAuthEdit, IBosAuthRes, IPortofolioAuth, IPortofolioAuthEdit, IPortofolioAuthRes, IProfile, IProfileEdit, IProfileRes } from "../interfaces/IProfile";
import { _createProfileNode, _getProfileNode, _renameProfile, formatAndMergeBosAuthorization, formatAndMergePortofolioAuthorization } from "./profileUtils";
import { HTTP_CODES, PTR_LST_TYPE } from "../constant";
import { authorizationInstance } from "../services/authorization.service";
import { AuthError } from "../security/AuthError";

export class ProfileBase {
    public context: SpinalContext;

    constructor(private relationName: string) { }


    /**
 * Creates a new profile node and authorizes it to access specified portofolios.
 * Throws an error if no portofolio is provided.
 * @param profileData The profile data to create.
 * @returns The created profile node and its authorized portofolios.
 */
    public async createProfile(profileData: IProfile, isCompatibleWithBosC: boolean): Promise<IProfileRes> {

        const authorizationDataFormatted = formatAndMergePortofolioAuthorization(profileData.authorize, isCompatibleWithBosC);

        if (authorizationDataFormatted.length === 0) throw new AuthError("At least one portofolio must be authorized in the profile", HTTP_CODES.BAD_REQUEST);

        const profileNode = await _createProfileNode(profileData);
        const promises = [];

        for (const portofolio of authorizationDataFormatted) {
            promises.push(this.authorizeProfileToAccessPortofolio(profileNode, portofolio, isCompatibleWithBosC));
        }

        return Promise.all(promises).then(async (itemsAuthorized) => {
            await this.context.addChildInContext(profileNode, this.relationName, PTR_LST_TYPE, this.context);
            return { node: profileNode, authorized: itemsAuthorized };
        });

    }


    /**
     * Retrieves the profile node associated with the given profile ID.
     *
     * @param profileId - The unique identifier of the profile to retrieve.
     * @returns A promise that resolves to the corresponding `SpinalNode` if found, or `undefined` if not found.
     */
    public getProfileNode(profileId: string): Promise<SpinalNode | undefined> {
        return _getProfileNode(profileId, this.context);
    }

    /**
     * Retrieves the profile node and its associated authorization structure.
     *
     * @param profile - The application profile identifier or a SpinalNode instance.
     * @returns A promise that resolves to an object containing the application profile node and its authorization structure,
     *          or `undefined` if the profile node could not be found.
     */
    public async getProfileWithAuthorizedPortofolio(profile: string | SpinalNode): Promise<IProfileRes> {
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!profileNode) return;

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
    public async updateProfile(profileId: string, newData: IProfileEdit, isCompatibleWithBosC: boolean): Promise<IProfileRes> {
        const profileNode = await _getProfileNode(profileId, this.context);
        if (!profileNode) return;

        if (newData.name && newData.name.trim() !== profileNode.info.name.get()) {
            _renameProfile(profileNode, newData.name);
        }

        const newAuthorizationFormatted = formatAndMergePortofolioAuthorization(newData.authorize, isCompatibleWithBosC);
        const promises = [];

        for (const portofolio of newAuthorizationFormatted) {
            promises.push(this.authorizeProfileToAccessPortofolio(profileNode, portofolio, isCompatibleWithBosC));
            promises.push(this.unauthorizeProfileToAccessPortofolio(profileNode, portofolio, isCompatibleWithBosC));
        }

        return Promise.all(promises).then(() => {
            return this.getProfileWithAuthorizedPortofolio(profileNode)
        });
    }

    /**
     * Retrieves all application profile nodes and their associated authorization structures.
     * @returns A promise that resolves to an array of profile objects, each containing the profile node and its authorization structure.
     */
    public async getAllProfilesWithAuthorizedPortfolios(): Promise<IProfileRes[]> {
        const profiles = await this.getAllProfilesNodes();

        const promises = profiles.map(profile => this.getProfileWithAuthorizedPortofolio(profile));
        return Promise.all(promises);
    }

    /**
     * Retrieves all application profile nodes.
     * @returns A promise that resolves to an array of SpinalNode instances representing the application profiles.
     */
    public async getAllProfilesNodes(): Promise<SpinalNode[]> {
        const profileNodes = await this.context.getChildren(this.relationName);
        return profileNodes;
    }

    /**
     * Retrieves an application profile node by its ID.
     * @param profileId The ID of the application profile.
     * @returns A promise that resolves to the SpinalNode instance representing the application profile, or `undefined` if not found.
     */
    public async deleteProfile(profileId: string): Promise<string> {
        const profile = await _getProfileNode(profileId, this.context);
        if (!profile) throw new Error(`no profile Found for ${profile}`);

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
    public async authorizeProfileToAccessPortofolioById(profile: string | SpinalNode, portofolioIds: string | string[]): Promise<SpinalNode[]> {
        portofolioIds = Array.isArray(portofolioIds) ? portofolioIds : [portofolioIds];
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;

        const promises = portofolioIds.map(portofolioId => authorizationInstance.authorizeProfileToAccessPortofolio(profileNode, portofolioId))

        return Promise.all(promises);
    }


    /**
     * Revokes a profile's authorization to access one or more portfolios by their IDs.
     *
     * @param profile - The profile identifier or a SpinalNode instance representing the profile.
     * @param portofolioIds - A single portfolio ID or an array of portfolio IDs to unauthorize access from.
     * @returns A promise that resolves to an array of booleans indicating the success of the unauthorization for each portfolio ID.
     */
    public async unauthorizeProfileToAccessPortofolioById(profile: string | SpinalNode, portofolioIds: string | string[]): Promise<boolean[]> {
        portofolioIds = Array.isArray(portofolioIds) ? portofolioIds : [portofolioIds];

        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;

        const promises = portofolioIds.map(portofolioId => authorizationInstance.unauthorizeProfileToAccessPortofolio(profileNode, portofolioId));

        return Promise.all(promises);
    }


    /**
     * Authorizes a profile to access specific applications within one or more portfolios.
     * @param profile - The profile node or its ID.
     * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and app IDs.
     * @returns A promise resolving to an array of authorized portfolio-app structures.
     */
    public async authorizeProfileToAccessPortofolioApp(profile: string | SpinalNode, portofolioAuth: IPortofolioAuth | IPortofolioAuth[], isCompatibleWithBosC: boolean): Promise<IPortofolioAuthRes[]> {
        portofolioAuth = Array.isArray(portofolioAuth) ? portofolioAuth : [portofolioAuth];
        const node = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(node instanceof SpinalNode)) return;

        const itemsFormatted = formatAndMergePortofolioAuthorization(portofolioAuth, isCompatibleWithBosC);

        const promises = itemsFormatted.map(async ({ appsIds, portofolioId }) => {
            if (appsIds && appsIds.length === 0) return null;

            const portofolio = await authorizationInstance.authorizeProfileToAccessPortofolio(node, portofolioId);
            const apps = await authorizationInstance.authorizeProfileToAccessPortofolioApps(node, portofolioId, appsIds);
            return { portofolio, apps }
        })

        return Promise.all(promises).then((result) => result.filter(Boolean));
    }

    /**
     * Revokes a profile's authorization to access specific applications within one or more portfolios.
     * @param profile - The profile node or its ID.
     * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and app IDs to unauthorize.
     * @returns A promise resolving to an array of SpinalNode instances representing the unauthorizations.
     */
    public async unauthorizeProfileToAccessPortofolioApp(profile: string | SpinalNode, portofolioAuth: IPortofolioAuth | IPortofolioAuth[], isCompatibleWithBosC: boolean): Promise<SpinalNode[]> {
        portofolioAuth = Array.isArray(portofolioAuth) ? portofolioAuth : [portofolioAuth];
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;

        const formattedData = formatAndMergePortofolioAuthorization(portofolioAuth, isCompatibleWithBosC);
        const promises = [];

        for (const data of formattedData) {
            if (!data.unauthorizeAppsIds || data.unauthorizeAppsIds.length === 0) continue;
            promises.push(authorizationInstance.unauthorizeProfileToAccessPortofolioApp(profileNode, data.portofolioId, data.unauthorizeAppsIds));
        }

        return Promise.all(promises).then((result) => {
            return result.flat();
        })
    }


    /**
     * Authorizes a profile to access specific API routes within one or more portfolios.
     * @param profile - The profile node or its ID.
     * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and API IDs.
     * @returns A promise resolving to an array of authorized portfolio-API structures.
     */
    public async authorizeProfileToAccessPortofolioApisRoute(profile: string | SpinalNode, portofolioAuth: IPortofolioAuth | IPortofolioAuth[], isCompatibleWithBosC: boolean): Promise<IPortofolioAuthRes[]> {
        portofolioAuth = Array.isArray(portofolioAuth) ? portofolioAuth : [portofolioAuth];
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;

        const itemsFormatted = formatAndMergePortofolioAuthorization(portofolioAuth, isCompatibleWithBosC);

        const promises = itemsFormatted.map(async ({ apisIds, portofolioId }) => {
            if (apisIds && apisIds.length === 0) return null;

            const portofolio = await authorizationInstance.authorizeProfileToAccessPortofolio(profileNode, portofolioId);
            const apis = await authorizationInstance.authorizeProfileToAccessPortofolioApisRoutes(profileNode, portofolioId, apisIds);
            return { portofolio, apis }
        })

        return Promise.all(promises).then((result) => result.filter(Boolean));
    }



    /**
     * Revokes a profile's authorization to access specific API routes within one or more portfolios.
     * @param profile - The profile node or its ID.
     * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and API IDs to unauthorize.
     * @returns A promise resolving to an array of IDs of the unauthorized API routes.
     */
    public async unauthorizeProfileToAccessPortofolioApisRoute(profile: string | SpinalNode, portofolioAuth: IPortofolioAuth | IPortofolioAuth[], isCompatibleWithBosC: boolean): Promise<string[]> {
        portofolioAuth = Array.isArray(portofolioAuth) ? portofolioAuth : [portofolioAuth];
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;

        const itemsFormatted = formatAndMergePortofolioAuthorization(portofolioAuth, isCompatibleWithBosC);

        const promises = itemsFormatted.map(async ({ unauthorizeApisIds, portofolioId }) => {
            if (!unauthorizeApisIds || unauthorizeApisIds.length === 0) return null;
            return authorizationInstance.unauthorizeProfileToAccessPortofolioApisRoutes(profileNode, portofolioId, unauthorizeApisIds);
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
    public async getAuthorizedPortofolio(profile: string | SpinalNode): Promise<SpinalNode[]> {
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;
        return authorizationInstance.getAuthorizedPortofolioFromProfile(profileNode);
    }


    /**
     * Retrieves the list of authorized portfolio application nodes for a given profile and portfolio ID.
     *
     * @param profile - The profile identifier or a SpinalNode instance representing the profile.
     * @param portofolioId - The unique identifier of the portfolio.
     * @returns A promise that resolves to an array of SpinalNode instances representing the authorized portfolio applications,
     *          or `undefined` if the profile node could not be resolved.
     */
    public async getAuthorizedPortofolioApp(profile: string | SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;
        return authorizationInstance.getAuthorizedPortofolioAppFromProfile(profileNode, portofolioId)
    }


    /**
     * Retrieves the authorized API routes for a given profile and portfolio.
     *
     * @param profile - The profile node or its ID.
     * @param portofolioId - The unique identifier of the portfolio.
     * @returns A promise that resolves to an array of authorized API route nodes,
     *          or `undefined` if the profile node could not be resolved.
     */
    public async getAuthorizedPortofolioApis(profile: string | SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;
        return authorizationInstance.getAuthorizedPortofolioApisRoutesFromProfile(profileNode, portofolioId);
    }

    /**
     * Retrieves the authorization structure for all portfolios authorized for a given profile.
     * For each portfolio, returns the portfolio node, its authorized apps, APIs, and buildings structure.
     *
     * @param profile - The profile node or its ID.
     * @returns A promise that resolves to an array of authorization structures for each portfolio.
     */
    public async getPortofolioAuthStructure(profile: string | SpinalNode): Promise<IPortofolioAuthRes[]> {
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;

        const portofolios = await this.getAuthorizedPortofolio(profile);
        const promises = portofolios.map(async portofolio => {
            const portofolioId = portofolio.getId().get();
            return {
                portofolio,
                apps: await this.getAuthorizedPortofolioApp(profile, portofolioId),
                apis: await this.getAuthorizedPortofolioApis(profile, portofolioId),
                buildings: await this.getBosAuthStructure(profile, portofolioId)
            }
        })

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
    public async authorizeProfileToAccessBos(profile: SpinalNode | string, portofolioId: string, BosId: string | string[]): Promise<SpinalNode[]> {
        BosId = Array.isArray(BosId) ? BosId : [BosId];
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;

        const results = [];

        // use for loop with await to have sequential execution
        // else it can duplicate portofolio authorization in some cases
        for (const id of BosId) {
            const res = await authorizationInstance.authorizeProfileToAccessBos(profileNode, portofolioId, id);
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
    public async unauthorizeProfileToAccessBos(profile: SpinalNode | string, portofolioId: string, BosId: string | string[]): Promise<boolean[]> {
        BosId = Array.isArray(BosId) ? BosId : [BosId];
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;

        const promises = BosId.map(id => authorizationInstance.unauthorizeProfileToAccessBos(profileNode, portofolioId, id))
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
    public async authorizeProfileToAccessBosApp(profile: SpinalNode | string, portofolioId: string, bosAuth: IBosAuth | IBosAuth[], isCompatibleWithBosC: boolean): Promise<IBosAuthRes[]> {
        bosAuth = Array.isArray(bosAuth) ? bosAuth : [bosAuth];

        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;

        const itemsFormatted = formatAndMergeBosAuthorization(bosAuth);

        const promises = itemsFormatted.map(async ({ appsIds, buildingId }) => {
            if (appsIds && appsIds.length === 0) return null;

            const bos = await authorizationInstance.authorizeProfileToAccessBos(profileNode, portofolioId, buildingId);
            const apps = await authorizationInstance.authorizeProfileToAccessBosApp(profileNode, portofolioId, buildingId, appsIds, isCompatibleWithBosC);

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
    public async unauthorizeProfileToAccessBosApp(profile: SpinalNode | string, portofolioId: string, bosAuth: IBosAuth | IBosAuth[], isCompatibleWithBosC: boolean): Promise<SpinalNode[]> {
        bosAuth = Array.isArray(bosAuth) ? bosAuth : [bosAuth];

        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;

        const itemsFormatted = formatAndMergeBosAuthorization(bosAuth);

        const promises = itemsFormatted.map(({ buildingId, unauthorizeAppsIds }) => {
            return authorizationInstance.unauthorizeProfileToAccessBosApp(profileNode, portofolioId, buildingId, unauthorizeAppsIds, isCompatibleWithBosC);
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
    public async authorizeProfileToAccessBosApiRoute(profile: SpinalNode | string, portofolioId: string, bosAuth: IBosAuth | IBosAuth[], isCompatibleWithBosC: boolean): Promise<IBosAuthRes[]> {
        bosAuth = Array.isArray(bosAuth) ? bosAuth : [bosAuth];

        const node = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(node instanceof SpinalNode)) return;

        const itemsFormatted = formatAndMergeBosAuthorization(bosAuth);
        const promises = itemsFormatted.map(async ({ apisIds, buildingId }) => {
            if (apisIds && apisIds.length === 0) return null;

            const bos = await authorizationInstance.authorizeProfileToAccessBos(node, portofolioId, buildingId);
            const apis = await authorizationInstance.authorizeProfileToAccessBosApisRoutes(node, portofolioId, buildingId, apisIds, isCompatibleWithBosC);

            return { building: bos, apis };
        })

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
    public async unauthorizeProfileToAccessBosApiRoute(profile: SpinalNode | string, portofolioId: string, bosAuth: IBosAuth | IBosAuth[], isCompatibleWithBosC: boolean): Promise<string[]> {
        bosAuth = Array.isArray(bosAuth) ? bosAuth : [bosAuth];

        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;

        const itemsFormatted = formatAndMergeBosAuthorization(bosAuth);

        const promises = itemsFormatted.map(({ buildingId, unauthorizeApisIds }) => {
            return authorizationInstance.unauthorizeProfileToAccessBosApisRoutes(profileNode, portofolioId, buildingId, unauthorizeApisIds || [], isCompatibleWithBosC);
        })

        return Promise.all(promises).then((result) => {
            const res = result.flat();
            return res.map(el => el?.getId().get());
        })
    }


    /**
     * Retrieves the authorized BOS (Building Operating System) nodes for a given profile and portfolio.
     *
     * @param {(SpinalNode | string)} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @return {*}  {Promise<SpinalNode[]>} - A promise that resolves to an array of authorized BOS nodes.
     */
    public async getAuthorizedBos(profile: SpinalNode | string, portofolioId: string,): Promise<SpinalNode[]> {
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;
        return authorizationInstance.getAuthorizedBosFromProfile(profileNode, portofolioId);
    }


    /**
     * Retrieves the list of authorized BOS applications for a given profile, portfolio, and BOS ID.
     *
     * @param profile - The profile node or its identifier (string) for which to fetch authorized BOS applications.
     * @param portofolioId - The identifier of the portfolio to check authorization against.
     * @param bosId - The identifier of the BOS application to check authorization for.
     * @returns A promise that resolves to an array of `SpinalNode` objects representing the authorized BOS applications.
     */
    public async getAuthorizedBosApp(profile: SpinalNode | string, portofolioId: string, bosId: string): Promise<SpinalNode[]> {
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;
        return authorizationInstance.getAuthorizedBosAppFromProfile(profileNode, portofolioId, bosId);
    }


    /**
     * Retrieves the authorized API routes for a given profile, portfolio, and BOS (Building Operating System) node.
     *
     * @param profile - The profile node or its ID.
     * @param portofolioId - The portfolio ID.
     * @param bosId - The BOS (building) ID.
     * @returns A promise that resolves to an array of authorized API route nodes for the specified BOS.
     */
    public async getAuthorizedBosApis(profile: SpinalNode | string, portofolioId: string, bosId: string): Promise<SpinalNode[]> {
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;
        return authorizationInstance.getAuthorizedBosApisRoutesFromProfile(profileNode, portofolioId, bosId);
    }


    /**
     * Retrieves the authorization structure for all BOS (Building Operating System) nodes authorized for a given profile and portfolio.
     * For each BOS, returns the building node, its authorized apps, and APIs structure.
     *
     * @param profile - The profile node or its ID.
     * @param portofolioId - The portfolio ID.
     * @returns A promise that resolves to an array of authorization structures for each BOS.
     */
    public async getBosAuthStructure(profile: string | SpinalNode, portofolioId: string): Promise<IBosAuthRes[]> {
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        if (!(profileNode instanceof SpinalNode)) return;

        const buildings = await this.getAuthorizedBos(profile, portofolioId);

        const promises = buildings.map(async building => {
            const bosId = building.getId().get()
            return {
                building,
                apps: await this.getAuthorizedBosApp(profile, portofolioId, bosId),
                apis: await this.getAuthorizedBosApis(profile, portofolioId, bosId)
            }
        })

        return Promise.all(promises);
    }

    /**
     * Retrieves all authorized BOS (Building Operating System) nodes for a given profile.
     *
     * @param {(string | SpinalNode)} profile - The profile node or its ID.
     * @return {*}  {Promise<SpinalNode[]>} - A promise that resolves to an array of authorized BOS nodes.
     */
    public async getAllAuthorizedBos(profile: string | SpinalNode): Promise<SpinalNode[]> {
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
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
    public async profileHasAccessToApi(profile: string | SpinalNode, apiId: SpinalNode): Promise<SpinalNode> {
        const profileNode = profile instanceof SpinalNode ? profile : await _getProfileNode(profile, this.context);
        return authorizationInstance.profileHasAccessToNode(profileNode, apiId);
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
    public async authorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioAuth: IPortofolioAuth, isCompatibleWithBosC: boolean): Promise<IPortofolioAuthRes> {
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

            return result
        }, Promise.resolve([]));

        return {
            portofolio,
            apis: apisData[0]?.apis,
            apps: appsData[0]?.apps,
            buildings: await buildingProm
        }
    }

    /////////////////// private methods ///////////////////

    public async unauthorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioAuth: IPortofolioAuthEdit & { unauthorizeBuildingIds?: string[] }, isCompatibleWithBosC: boolean): Promise<any> {
        await this.unauthorizeProfileToAccessPortofolioApisRoute(profile, { portofolioId: portofolioAuth.portofolioId, unauthorizeApisIds: portofolioAuth.unauthorizeApisIds || [] }, isCompatibleWithBosC);
        await this.unauthorizeProfileToAccessPortofolioApp(profile, { portofolioId: portofolioAuth.portofolioId, unauthorizeAppsIds: portofolioAuth.unauthorizeAppsIds || [] }, isCompatibleWithBosC);

        let buildingProm = [];

        if (isCompatibleWithBosC) buildingProm = portofolioAuth.unauthorizeBuildingIds?.map(bosId => this.unauthorizeProfileToAccessBos(profile, portofolioAuth.portofolioId, bosId));
        else buildingProm = portofolioAuth.building.map(bos => this._unauthorizeIBosAuth(profile, bos, portofolioAuth.portofolioId, isCompatibleWithBosC))

        await Promise.all(buildingProm);
    }


    private async _authorizeIBosAuth(profile: SpinalNode, bosAuth: IBosAuth, portofolioId: string, isCompatibleWithBosC: boolean): Promise<IBosAuthRes> {
        const [building] = await this.authorizeProfileToAccessBos(profile, portofolioId, bosAuth.buildingId);
        const apisData = await this.authorizeProfileToAccessBosApiRoute(profile, portofolioId, bosAuth, isCompatibleWithBosC);
        const appsData = await this.authorizeProfileToAccessBosApp(profile, portofolioId, bosAuth, isCompatibleWithBosC);

        return {
            building,
            apis: apisData[0]?.apis,
            apps: appsData[0]?.apps
        }
    }

    private async _unauthorizeIBosAuth(profile: SpinalNode, bosAuth: IBosAuthEdit, portofolioId: string, isCompatibleWithBosC: boolean): Promise<any> {
        const apisData = await this.unauthorizeProfileToAccessBosApiRoute(profile, portofolioId, { buildingId: bosAuth.buildingId, unauthorizeApisIds: bosAuth.unauthorizeApisIds }, isCompatibleWithBosC);
        const appsData = await this.unauthorizeProfileToAccessBosApp(profile, portofolioId, { buildingId: bosAuth.buildingId, unauthorizeAppsIds: bosAuth.unauthorizeAppsIds }, isCompatibleWithBosC);

        return [apisData, appsData];
    }


}