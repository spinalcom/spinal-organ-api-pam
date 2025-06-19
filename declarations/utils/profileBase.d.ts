import { SpinalContext, SpinalNode } from "spinal-model-graph";
import { IBosAuth, IBosAuthRes, IPortofolioAuth, IPortofolioAuthEdit, IPortofolioAuthRes, IProfile, IProfileEdit, IProfileRes } from "../interfaces/IProfile";
export declare class ProfileBase {
    private relationName;
    context: SpinalContext;
    constructor(relationName: string);
    /**
 * Creates a new profile node and authorizes it to access specified portofolios.
 * Throws an error if no portofolio is provided.
 * @param profileData The profile data to create.
 * @returns The created profile node and its authorized portofolios.
 */
    createProfile(profileData: IProfile): Promise<IProfileRes>;
    /**
     * Retrieves the profile node associated with the given profile ID.
     *
     * @param profileId - The unique identifier of the profile to retrieve.
     * @returns A promise that resolves to the corresponding `SpinalNode` if found, or `undefined` if not found.
     */
    getProfileNode(profileId: string): Promise<SpinalNode | undefined>;
    /**
     * Retrieves the profile node and its associated authorization structure.
     *
     * @param profile - The application profile identifier or a SpinalNode instance.
     * @returns A promise that resolves to an object containing the application profile node and its authorization structure,
     *          or `undefined` if the profile node could not be found.
     */
    getProfileWithAuthorizedPortofolio(profile: string | SpinalNode): Promise<IProfileRes>;
    /**
     * Updates an existing application profile node and its authorizations.
     * Renames the profile if the name has changed, and updates the authorized portofolios.
     * @param profileId The ID of the profile to update.
     * @param newData The new profile data.
     * @returns The updated profile node and its authorized portofolios.
     */
    updateProfile(profileId: string, newData: IProfileEdit): Promise<IProfileRes>;
    /**
     * Retrieves all application profile nodes and their associated authorization structures.
     * @returns A promise that resolves to an array of profile objects, each containing the profile node and its authorization structure.
     */
    getAllProfilesWithAuthorizedPortfolios(): Promise<IProfileRes[]>;
    /**
     * Retrieves all application profile nodes.
     * @returns A promise that resolves to an array of SpinalNode instances representing the application profiles.
     */
    getAllProfilesNodes(): Promise<SpinalNode[]>;
    /**
     * Retrieves an application profile node by its ID.
     * @param profileId The ID of the application profile.
     * @returns A promise that resolves to the SpinalNode instance representing the application profile, or `undefined` if not found.
     */
    deleteProfile(profileId: string): Promise<string>;
    /**
     * Authorizes a profile to access one or more portofolios by their IDs.
     * @param profile - The profile node or its ID.
     * @param portofolioIds - A single portofolio ID or an array of portofolio IDs.
     * @returns A promise that resolves to an array of authorized portofolio nodes.
     */
    authorizeProfileToAccessPortofolioById(profile: string | SpinalNode, portofolioIds: string | string[]): Promise<SpinalNode[]>;
    /**
     * Revokes a profile's authorization to access one or more portfolios by their IDs.
     *
     * @param profile - The profile identifier or a SpinalNode instance representing the profile.
     * @param portofolioIds - A single portfolio ID or an array of portfolio IDs to unauthorize access from.
     * @returns A promise that resolves to an array of booleans indicating the success of the unauthorization for each portfolio ID.
     */
    unauthorizeProfileToAccessPortofolioById(profile: string | SpinalNode, portofolioIds: string | string[]): Promise<boolean[]>;
    /**
     * Authorizes a profile to access specific applications within one or more portfolios.
     * @param profile - The profile node or its ID.
     * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and app IDs.
     * @returns A promise resolving to an array of authorized portfolio-app structures.
     */
    authorizeProfileToAccessPortofolioApp(profile: string | SpinalNode, portofolioAuth: IPortofolioAuth | IPortofolioAuth[]): Promise<IPortofolioAuthRes[]>;
    /**
     * Revokes a profile's authorization to access specific applications within one or more portfolios.
     * @param profile - The profile node or its ID.
     * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and app IDs to unauthorize.
     * @returns A promise resolving to an array of SpinalNode instances representing the unauthorizations.
     */
    unauthorizeProfileToAccessPortofolioApp(profile: string | SpinalNode, portofolioAuth: IPortofolioAuth | IPortofolioAuth[]): Promise<SpinalNode[]>;
    /**
     * Authorizes a profile to access specific API routes within one or more portfolios.
     * @param profile - The profile node or its ID.
     * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and API IDs.
     * @returns A promise resolving to an array of authorized portfolio-API structures.
     */
    authorizeProfileToAccessPortofolioApisRoute(profile: string | SpinalNode, portofolioAuth: IPortofolioAuth | IPortofolioAuth[]): Promise<IPortofolioAuthRes[]>;
    /**
     * Revokes a profile's authorization to access specific API routes within one or more portfolios.
     * @param profile - The profile node or its ID.
     * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and API IDs to unauthorize.
     * @returns A promise resolving to an array of IDs of the unauthorized API routes.
     */
    unauthorizeProfileToAccessPortofolioApisRoute(profile: string | SpinalNode, portofolioAuth: IPortofolioAuth | IPortofolioAuth[]): Promise<string[]>;
    /**
     * Retrieves the authorized portfolios for a given profile.
     *
     * @param {(string | SpinalNode)} profile - The profile node or its ID.
     * @returns {Promise<SpinalNode[]>} - A promise that resolves to an array of authorized portfolio nodes.
     */
    getAuthorizedPortofolio(profile: string | SpinalNode): Promise<SpinalNode[]>;
    /**
     * Retrieves the list of authorized portfolio application nodes for a given profile and portfolio ID.
     *
     * @param profile - The profile identifier or a SpinalNode instance representing the profile.
     * @param portofolioId - The unique identifier of the portfolio.
     * @returns A promise that resolves to an array of SpinalNode instances representing the authorized portfolio applications,
     *          or `undefined` if the profile node could not be resolved.
     */
    getAuthorizedPortofolioApp(profile: string | SpinalNode, portofolioId: string): Promise<SpinalNode[]>;
    /**
     * Retrieves the authorized API routes for a given profile and portfolio.
     *
     * @param profile - The profile node or its ID.
     * @param portofolioId - The unique identifier of the portfolio.
     * @returns A promise that resolves to an array of authorized API route nodes,
     *          or `undefined` if the profile node could not be resolved.
     */
    getAuthorizedPortofolioApis(profile: string | SpinalNode, portofolioId: string): Promise<SpinalNode[]>;
    /**
     * Retrieves the authorization structure for all portfolios authorized for a given profile.
     * For each portfolio, returns the portfolio node, its authorized apps, APIs, and buildings structure.
     *
     * @param profile - The profile node or its ID.
     * @returns A promise that resolves to an array of authorization structures for each portfolio.
     */
    getPortofolioAuthStructure(profile: string | SpinalNode): Promise<IPortofolioAuthRes[]>;
    /**
     * Authorizes a profile to access one or more BOS (Building Operating System) nodes by their IDs.
     *
     * @param {SpinalNode | string} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @param {string | string[]} BosId - A single BOS ID or an array of BOS IDs.
     * @returns {Promise<SpinalNode[]>} - A promise that resolves to an array of authorized BOS nodes.
     */
    authorizeProfileToAccessBos(profile: SpinalNode | string, portofolioId: string, BosId: string | string[]): Promise<SpinalNode[]>;
    /**
     * Revokes a profile's authorization to access one or more BOS (Building Operating System) nodes by their IDs.
     *
     * @param {SpinalNode | string} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @param {string | string[]} BosId - A single BOS ID or an array of BOS IDs.
     * @returns {Promise<boolean[]>} - A promise that resolves to an array of booleans indicating the success of the unauthorization for each BOS ID.
     */
    unauthorizeProfileToAccessBos(profile: SpinalNode | string, portofolioId: string, BosId: string | string[]): Promise<boolean[]>;
    /**
     * Authorizes a profile to access specific applications within one or more BOS (Building Operating System) nodes.
     *
     * @param {SpinalNode | string} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @param {IBosAuth | IBosAuth[]} bosAuth - A single or array of IBosAuth objects specifying building and app IDs.
     * @returns {Promise<IBosAuthRes[]>} - A promise resolving to an array of authorized building-app structures.
     */
    authorizeProfileToAccessBosApp(profile: SpinalNode | string, portofolioId: string, bosAuth: IBosAuth | IBosAuth[]): Promise<IBosAuthRes[]>;
    /**
     * Revokes a profile's authorization to access specific applications within one or more BOS (Building Operating System) nodes.
     *
     * @param {SpinalNode | string} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @param {IBosAuth | IBosAuth[]} bosAuth - A single or array of IBosAuth objects specifying building and app IDs to unauthorize.
     * @returns {Promise<SpinalNode[]>} - A promise resolving to an array of SpinalNode instances representing the unauthorizations.
     */
    unauthorizeProfileToAccessBosApp(profile: SpinalNode | string, portofolioId: string, bosAuth: IBosAuth | IBosAuth[]): Promise<SpinalNode[]>;
    /**
     * Authorizes a profile to access specific API routes within one or more BOS (Building Operating System) nodes.
     *
     * @param {SpinalNode | string} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @param {IBosAuth | IBosAuth[]} bosAuth - A single or array of IBosAuth objects specifying building and API IDs.
     * @returns A promise resolving to an array of authorized building-API structures.
     */
    authorizeProfileToAccessBosApiRoute(profile: SpinalNode | string, portofolioId: string, bosAuth: IBosAuth | IBosAuth[]): Promise<IBosAuthRes[]>;
    /**
     * Revokes a profile's authorization to access specific API routes within one or more BOS (Building Operating System) nodes.
     *
     * @param {SpinalNode | string} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @param {IBosAuth | IBosAuth[]} bosAuth - A single or array of IBosAuth objects specifying building and API IDs to unauthorize.
     * @returns {Promise<string[]>} - A promise resolving to an array of IDs of the unauthorized API routes.
     */
    unauthorizeProfileToAccessBosApiRoute(profile: SpinalNode | string, portofolioId: string, bosAuth: IBosAuth | IBosAuth[]): Promise<string[]>;
    /**
     * Retrieves the authorized BOS (Building Operating System) nodes for a given profile and portfolio.
     *
     * @param {(SpinalNode | string)} profile - The profile node or its ID.
     * @param {string} portofolioId - The portfolio ID.
     * @return {*}  {Promise<SpinalNode[]>} - A promise that resolves to an array of authorized BOS nodes.
     */
    getAuthorizedBos(profile: SpinalNode | string, portofolioId: string): Promise<SpinalNode[]>;
    /**
     * Retrieves the list of authorized BOS applications for a given profile, portfolio, and BOS ID.
     *
     * @param profile - The profile node or its identifier (string) for which to fetch authorized BOS applications.
     * @param portofolioId - The identifier of the portfolio to check authorization against.
     * @param bosId - The identifier of the BOS application to check authorization for.
     * @returns A promise that resolves to an array of `SpinalNode` objects representing the authorized BOS applications.
     */
    getAuthorizedBosApp(profile: SpinalNode | string, portofolioId: string, bosId: string): Promise<SpinalNode[]>;
    /**
     * Retrieves the authorized API routes for a given profile, portfolio, and BOS (Building Operating System) node.
     *
     * @param profile - The profile node or its ID.
     * @param portofolioId - The portfolio ID.
     * @param bosId - The BOS (building) ID.
     * @returns A promise that resolves to an array of authorized API route nodes for the specified BOS.
     */
    getAuthorizedBosApis(profile: SpinalNode | string, portofolioId: string, bosId: string): Promise<SpinalNode[]>;
    /**
     * Retrieves the authorization structure for all BOS (Building Operating System) nodes authorized for a given profile and portfolio.
     * For each BOS, returns the building node, its authorized apps, and APIs structure.
     *
     * @param profile - The profile node or its ID.
     * @param portofolioId - The portfolio ID.
     * @returns A promise that resolves to an array of authorization structures for each BOS.
     */
    getBosAuthStructure(profile: string | SpinalNode, portofolioId: string): Promise<IBosAuthRes[]>;
    /**
     * Retrieves all authorized BOS (Building Operating System) nodes for a given profile.
     *
     * @param {(string | SpinalNode)} profile - The profile node or its ID.
     * @return {*}  {Promise<SpinalNode[]>} - A promise that resolves to an array of authorized BOS nodes.
     */
    getAllAuthorizedBos(profile: string | SpinalNode): Promise<SpinalNode[]>;
    /**
     * Checks if a given profile has access to a specific API.
     *
     * @param profile - The profile identifier or a SpinalNode representing the profile.
     * @param apiId - The SpinalNode representing the API to check access for.
     * @returns A promise that resolves to the SpinalNode if the profile has access to the API.
     */
    profileHasAccessToApi(profile: string | SpinalNode, apiId: SpinalNode): Promise<SpinalNode>;
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
    authorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioAuth: IPortofolioAuth): Promise<IPortofolioAuthRes>;
    unauthorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioAuth: IPortofolioAuthEdit): Promise<any>;
    private _authorizeIBosAuth;
    private _unauthorizeIBosAuth;
}
