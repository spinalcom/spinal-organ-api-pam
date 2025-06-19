import { SpinalContext, SpinalGraph } from "spinal-env-viewer-graph-service";
import { IAppCredential, IApplicationToken, IOAuth2Credential } from "../interfaces";
/**
 * Service class to manage the list of connected applications.
 * Handles initialization of the application context, authentication of applications,
 * and management of application nodes within the context.
 */
export declare class AppListService {
    private static instance;
    context: SpinalContext;
    private constructor();
    /**
     * Returns the singleton instance of AppListService.
     */
    static getInstance(): AppListService;
    /**
     * Initializes the application context in the given graph.
     * Creates the context if it does not exist.
     * @param graph The SpinalGraph instance
     * @returns The initialized SpinalContext
     */
    init(graph: SpinalGraph): Promise<SpinalContext>;
    /**
     * Authenticates an application using its credentials.
     * Adds the application to the context and stores its token.
     * @param application The application credentials
     * @returns An object containing the HTTP code and either the token data or an error message
     */
    authenticateApplication(application: IAppCredential | IOAuth2Credential): Promise<{
        code: number;
        data: string | IApplicationToken;
    }>;
    /**
     * Adds an application node to the context.
     * Updates the node if it already exists.
     * @param info Information about the user/application
     * @param element Optional spinal.Model element
     * @returns The created or updated SpinalNode
     */
    private _addApplicationToAppConnectedContext;
    /**
     * Retrieves the profile information for a given user token.
     * @param appToken The application's token
     * @param adminCredential The admin platform credentials
     * @returns The profile information object
     */
    private _getProfileInfoInAuth;
    /**
     * Retrieves application information by its ID.
     * @param applicationId The application ID
     * @param adminCredential The admin platform credentials
     * @param userToken The user's token
     * @returns The application information object
     */
    private _getApplicationInfoInAuth;
    /**
     * Retrieves the authentication platform information from the AuthentificationService.
     * @returns The admin platform credentials
     * @throws Error if no authentication platform is registered
     */
    private _getAuthPlateformInfo;
}
