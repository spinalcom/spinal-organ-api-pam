import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { HTTP_CODES } from "../constant";
import { IUserCredential, IUserToken } from "../interfaces";
export declare class UserListService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): UserListService;
    init(graph: SpinalGraph): Promise<SpinalContext>;
    /**
     * Authenticates a user.
     * Currently, only admin user authentication is supported;
     * regular user authentication is handled by the authentication platform.
     * @param userCredential - The user credentials.
     * @returns A promise resolving to an object containing the HTTP code and either the token data or an error message.
     */
    authenticateUser(userCredential: IUserCredential): Promise<{
        code: number;
        data: string | IUserToken;
    }>;
    /**
     * Retrieves a user node (admin or regular) by username or userId.
     * @param usernameOrId - The username or userId of the user to retrieve.
     * @returns A promise that resolves to the `SpinalNode` corresponding to the user,
     *          or `undefined` if no user with the given identifier is found.
     */
    getUser(usernameOrId: string): Promise<SpinalNode>;
    /**
     * Adds one or more applications to the list of a user's favorite apps.
     * Only apps that are authorized for the user's profile and not already in favorites will be added.
     * @param userId - The ID of the user.
     * @param userProfileId - The ID of the user's profile.
     * @param appIds - The application ID or array of application IDs to add as favorites.
     * @param portofolioId - The portfolio ID associated with the favorite.
     * @param buildingId - (Optional) The building ID associated with the favorite.
     * @returns A promise resolving to an array of SpinalNode objects representing the added favorite apps.
     */
    addAppToUserFavorite(userId: string, userProfileId: string, appIds: string | string[], portofolioId: string, buildingId?: string): Promise<SpinalNode[]>;
    /**
     * Removes one or more applications from a user's list of favorite apps.
     * Only apps that are currently in the user's favorites will be removed.
     * @param userId - The ID of the user.
     * @param userProfileId - The ID of the user's profile.
     * @param appIds - The application ID or array of application IDs to remove from favorites.
     * @param portofolioId - The portfolio ID associated with the favorite.
     * @param buildingId - (Optional) The building ID associated with the favorite.
     * @returns A promise resolving to an array of removed SpinalNode objects.
     */
    removeFavoriteApp(userId: string, userProfileId: string, appIds: string | string[], portofolioId: string, buildingId?: string): Promise<SpinalNode[]>;
    /**
     * Retrieves a user's favorite apps based on their userId, portfolioId, and optionally buildingId.
     * @param userId - The ID of the user.
     * @param portofolioId - The portfolio ID associated with the favorite apps.
     * @param buildingId - (Optional) The building ID associated with the favorite apps.
     * @returns A promise resolving to an array of SpinalNode objects representing the user's favorite apps.
     */
    getFavoriteApps(userId: string, portofolioId: string, buildingId?: string): Promise<SpinalNode[]>;
    /**
     * Initializes the admin user in the context if it does not exist.
     * @returns {Promise<SpinalNode>} The admin user node.
     */
    private _initAdminUser;
    /**
     * Creates the admin user node with a generated password and logs the credentials to a file.
     * @returns {Promise<SpinalNode>} The created admin user node.
     */
    createAdminUser(): Promise<SpinalNode>;
    /**
     * Retrieves an admin user node by their username.
     *
     * @param userName - The username of the admin user to retrieve.
     * @returns A promise that resolves to the `SpinalNode` corresponding to the admin user,
     *          or `undefined` if no user with the given username is found.
     */
    getAdminUser(userName: string): Promise<SpinalNode>;
    /**
     * Authentifies an admin user by verifying the provided credentials.
     * @param userCredential - The credentials of the user attempting to authenticate.
     * @returns A promise resolving to an object containing the HTTP code and either the token data or an error message.
     */
    private authenticateAdminUser;
    /**
     * Authenticates a user via the authentication platform.
     * @param user - The user credentials to authenticate.
     * @returns A promise resolving to an object containing the HTTP code and user data or an error message.
     */
    authUserViaAuthPlateform(user: IUserCredential): Promise<{
        code: HTTP_CODES;
        data: any;
    }>;
    /**
     * Retrieves user data and formats it by adding profile and user info.
     * @param data - The user data to format.
     * @param adminCredential - Optional admin credentials for fetching user info.
     * @param useToken - Whether to use the token for fetching user info.
     * @returns A promise resolving to the formatted user data.
     */
    getUserDataFormatted(data: any, adminCredential?: any, useToken?: boolean): Promise<any>;
}
