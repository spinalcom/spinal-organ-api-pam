import { IAdminCredential, IPamCredential, IUserCredential, IUserToken } from "../interfaces";
import { SpinalGraph } from "spinal-env-viewer-graph-service";
export declare class AuthentificationService {
    private static instance;
    authPlatformIsConnected: boolean;
    graph: SpinalGraph;
    private constructor();
    static getInstance(): AuthentificationService;
    init(graph: SpinalGraph): Promise<void>;
    /**
     * Authenticates a user based on the provided credentials.
     *
     * @param userCredential - The credentials of the user to authenticate.
     * @returns A promise that resolves to an object containing a status code and either a string or a token object (`IUserToken`).
     */
    authenticate(userCredential: IUserCredential): Promise<{
        code: number;
        data: string | IUserToken;
    }>;
    /**
     * Registers the PAM platform in the authentication platform.
     *
     * @param authApiUrl - The URL of the authentication API.
     * @param clientId - The PAM client ID for authentication.
     * @param clientSecret - The PAM client secret for authentication.
     * @returns A promise that resolves to the saved PAM credential.
     * @throws Error if any of the parameters are invalid or registration fails.
     */
    registerPamInAuthPlatform(authApiUrl: string, clientId: string, clientSecret: string): Promise<IPamCredential>;
    /**
 * Retrieves PAM authorization credentials from the graph.
 * @description authorization credentials are used to authenticate the PAM platform in the authAdmin platform.
 * @return {*}  {Promise<IPamCredential>}
 * @memberof AuthentificationService
 */
    getPamCredentials(): Promise<IPamCredential>;
    /**
     * Updates the PAM token in the authentication platform.
     * @returns A promise that resolves to the updated token data.
     * @memberof AuthentificationService
     */
    updatePamTokenInAuthPlatform(): Promise<{
        token: string;
        code: number;
    }>;
    /**
     * Saves or edits PAM credentials in the graph.
     *
     * @private
     * @param {*} bosCredential
     * @return {*}  {Promise<IPamCredential>}
     * @memberof AuthentificationService
     */
    private _saveOrEditPamCredentials;
    /**
     * Disconnects the PAM platform from the authentication platform.
     * @returns A promise that resolves to an object indicating whether the disconnection was successful.
     * @memberof AuthentificationService
     */
    disconnectPamFromAuthPlateform(): Promise<{
        removed: boolean;
    }>;
    /**
     * Deletes PAM credentials from the graph.
     * @private
     * @return {*}  {Promise<void>}
     * @memberof AuthentificationService
     */
    private deletePamCredentialsFromGraph;
    /**
     * Deletes Auth Platform credentials from the graph.
     * @private
     * @return {*}  {Promise<void>}
     * @memberof AuthentificationService
     */
    private deleteAuthCredentialsFromGraph;
    /**
     * Creates a new token for the admin server and saves it in the graph.
     * @return {*}  {Promise<IAdminCredential>}
     * @memberof AuthentificationService
     */
    createAuthPlatformCredentials(): Promise<IAdminCredential>;
    /**
     * Creates a new (or update if exists) the auth plateform credentials in the graph.
     * @return {*}  {Promise<IAdminCredential>}
     * @memberof AuthentificationService
     */
    saveOrEditAuthCredentials(authCredentials: IAdminCredential): Promise<IAdminCredential>;
    /**
     * Retrieves Auth Platform credentials from the graph.
     * @returns A promise that resolves to the admin credentials, or undefined if not found.
     * @memberof AuthentificationService
     */
    getAuthCredentials(): Promise<IAdminCredential>;
    /**
     * Sends PAM informations (profiles list, organ list) to the authentication platform.
     *
     * @param {boolean} [update=false]
     * @return {*}
     * @memberof AuthentificationService
     */
    sendPamInfoToAuth(update?: boolean): any;
    /**
     * Retrieves or creates admin credentials.
     * @private
     * @param {boolean} [createIfNotExist=false]
     * @return {*}  {Promise<IAdminCredential>}
     * @memberof AuthentificationService
     */
    private _getOrCreateAdminCredential;
}
