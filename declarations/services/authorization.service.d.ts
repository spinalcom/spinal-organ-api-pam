import { SpinalNode } from "spinal-env-viewer-graph-service";
export default class AuthorizationService {
    private static instance;
    private context;
    private profileToContext;
    private constructor();
    static getInstance(): AuthorizationService;
    /**
     * Checks if the given profile has access to the specified node.
     * Traverses the authorized portofolio context of the profile to find a reference
     * to the node (by id). Returns the real node if access is found, otherwise undefined.
     *
     * @param profile - The profile node to check access for.
     * @param anySpinalNode - The node or node id to check access to.
     * @returns The real SpinalNode if access exists, otherwise undefined.
     */
    profileHasAccessToNode(profile: SpinalNode, anySpinalNode: SpinalNode | string): Promise<SpinalNode>;
    /**
     * Authorizes a profile to access a specific portofolio.
     * If the profile is not already linked to the portofolio, creates a reference and links it.
     *
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portofolio to authorize access to.
     * @returns The real SpinalNode of the portofolio if successful, otherwise undefined.
     */
    authorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioId: string): Promise<SpinalNode>;
    /**
     * Authorizes a profile to access a specific app within a portofolio.
     * If the app is not already linked to the portofolio reference, creates a reference and links it.
     *
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portofolio.
     * @param appId - The ID of the app to authorize access to.
     * @returns The real SpinalNode of the app if successful, otherwise null.
     */
    private authorizeProfileToAccessOnePortofolioApp;
    /**
     * Authorizes a profile to access multiple apps within a portofolio.
     * For each appId, if not already linked, creates a reference and links it to the portofolio reference.
     *
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portofolio.
     * @param appIds - The IDs of the apps to authorize access to.
     * @returns An array of real SpinalNode apps that were authorized.
     */
    authorizeProfileToAccessPortofolioApps(profile: SpinalNode, portofolioId: string, appIds: string | string[]): Promise<SpinalNode[]>;
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
    unauthorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioId: string): Promise<boolean>;
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
    unauthorizeProfileToAccessPortofolioApp(profile: SpinalNode, portofolioOriginalId: string, appIds: string | string[]): Promise<SpinalNode[]>;
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
    getAuthorizedPortofolioFromProfile(profile: SpinalNode): Promise<SpinalNode[]>;
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
    getAuthorizedPortofolioAppFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]>;
    /**
 * Authorizes a profile to access a specific API route within a portfolio.
 * If the API route is not already linked to the portfolio reference, creates a reference and links it.
 *
 * @param profile - The profile node to authorize.
 * @param portofolioId - The ID of the portfolio.
 * @param apiRouteId - The ID of the API route to authorize access to.
 * @returns The real SpinalNode of the API route if successful, otherwise undefined.
 */
    authorizeProfileToAccessOnePortofolioApiRoute(profile: SpinalNode, portofolioId: string, apiRouteId: string): Promise<SpinalNode>;
    /**
     * Authorizes a profile to access multiple API routes within a portfolio.
     * For each apiRouteId, if not already linked, creates a reference and links it to the portfolio reference.
     *
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portfolio.
     * @param apiRoutesIds - The IDs of the API routes to authorize access to.
     * @returns An array of real SpinalNode API routes that were authorized.
     */
    authorizeProfileToAccessPortofolioApisRoutes(profile: SpinalNode, portofolioId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]>;
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
    unauthorizeProfileToAccessPortofolioApisRoutes(profile: SpinalNode, portofolioId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]>;
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
    getAuthorizedPortofolioApisRoutesFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]>;
    /**
     * Authorizes a profile to access a specific BOS (Building Operating System) within a portfolio.
     * If the BOS is not already linked to the portfolio reference, creates a reference and links it.
     *
     * @param profile - The profile node to authorize.
     * @param portofolioId - The ID of the portfolio.
     * @param BosId - The ID of the BOS to authorize access to.
     * @returns The real SpinalNode of the BOS if successful, otherwise undefined.
     */
    authorizeProfileToAccessBos(profile: SpinalNode, portofolioId: string, BosId: string): Promise<SpinalNode>;
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
    private authorizeProfileToAccessOneBosApp;
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
    authorizeProfileToAccessBosApp(profile: SpinalNode, portofolioId: string, BosId: string, appIds: string | string[], isCompatibleWithBosC: boolean): Promise<SpinalNode[]>;
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
    unauthorizeProfileToAccessBos(profile: SpinalNode, portofolioId: string, BosId: string): Promise<boolean>;
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
    unauthorizeProfileToAccessBosApp(profile: SpinalNode, portofolioId: string, BosId: string, appIds: string | string[], isCompatibleWithBosC: boolean): Promise<SpinalNode[]>;
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
    getAuthorizedBosFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]>;
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
    getAuthorizedBosAppFromProfile(profile: SpinalNode, portofolioId: string, BosId: string): Promise<SpinalNode[]>;
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
    authorizeProfileToAccessOneBosApisRoutes(profile: SpinalNode, portofolioId: string, bosId: string, apiRouteId: string): Promise<SpinalNode>;
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
    authorizeProfileToAccessBosApisRoutes(profile: SpinalNode, portofolioId: string, bosId: string, apiRoutesIds: string | string[], isCompatibleWithBosC: boolean): Promise<SpinalNode[]>;
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
    unauthorizeProfileToAccessBosApisRoutes(profile: SpinalNode, portofolioId: string, bosId: string, apiRoutesIds: string | string[], isCompatibleWithBosC: boolean): Promise<SpinalNode[]>;
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
    getAuthorizedBosApisRoutesFromProfile(profile: SpinalNode, portofolioId: string, BosId: string): Promise<SpinalNode[]>;
    private _removeEmptyPortofolioFromProfile;
    private _removeEmptyBosFromProfile;
}
declare const authorizationInstance: AuthorizationService;
export { authorizationInstance, AuthorizationService };
