import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApplicationToken, IUserToken } from "../interfaces";
export declare class TokenService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): TokenService;
    init(graph: SpinalGraph): Promise<SpinalContext>;
    /**
     * Purge invalid tokens from the context.
     *
     * @return {*}  {(Promise<(IUserToken | IApplicationToken)[]>)}
     * @memberof TokenService
     */
    purgeToken(): Promise<(IUserToken | IApplicationToken)[]>;
    /**
     * Create a token for a user and add it to the context.
     *
     * @param {SpinalNode} userNode
     * @param {string} token
     * @param {*} playload
     * @return {*}  {Promise<any>}
     * @memberof TokenService
     */
    createToken(userNode: SpinalNode, playload: any, isAdmin?: boolean): Promise<any>;
    /**
     * Get or generate a token key for signing JWT tokens.
     * If a secret is already set in the context, it will return that.
     * Otherwise, it generates a new random string and sets it in the context.
     *
     * @return {*}  {string} - The token key.
     * @memberof TokenService
     */
    getOrGenerateTokenKey(): string;
    private _generateToken;
    /**
     * Generate a token for admin a user.
     *
     * @param {SpinalNode} userNode
     * @param {string} [secret]
     * @param {(number | string)} [durationInMin]
     * @return {*}  {Promise<any>}
     * @memberof TokenService
     */
    generateTokenForAdmin(userNode: SpinalNode): Promise<any>;
    /**
     * link a token to a context.
     *
     * @param {string} token
     * @param {*} data
     * @return {*}  {Promise<SpinalNode>}
     * @memberof TokenService
     */
    addTokenToContext(token: string, data: any): Promise<SpinalNode>;
    /**
     * Get the token data from the cache or from the context.
     *
     * @param {string} token
     * @return {*}  {Promise<any>}
     * @memberof TokenService
     */
    getTokenData(token: string): Promise<any>;
    addUserToken(userNode: SpinalNode, token: string, playload: any): Promise<any>;
    /**
     * Get a token node by its name.
     *
     * @param {string} token
     * @return {*}  {Promise<SpinalNode>}
     * @memberof TokenService
     */
    getTokenNode(token: string): Promise<SpinalNode>;
    /**
     * remove a token.
     *
     * @param {(SpinalNode | string)} token
     * @return {*}  {Promise<boolean>}
     * @memberof TokenService
     */
    deleteToken(token: SpinalNode | string): Promise<boolean>;
    /**
     * Check if a token is valid.
     *
     * @param {string} token
     * @param {boolean} [deleteIfExpired=false]
     * @return {*}  {(Promise<IUserToken | IApplicationToken>)}
     * @memberof TokenService
     */
    tokenIsValid(token: string, deleteIfExpired?: boolean): Promise<IUserToken | IApplicationToken>;
    /**
     * Get the profile ID associated with a token.
     *
     * @param {string} token
     * @return {*}  {Promise<string>}
     * @memberof TokenService
     */
    getProfileIdByToken(token: string): Promise<string>;
    /**
     * Verify a token in the authentication platform.
     *
     * @param {string} token - The JWT token to verify.
     * @param {"user" | "app"} [actor="user"] - The actor type, either "user" or "app".
     * @return {*}  {Promise<any>} - Resolves with the verification result.
     * @memberof TokenService
     */
    verifyTokenInAuthPlatform(token: string, actor?: "user" | "app" | "code"): Promise<any>;
    /**
     * Verify a token using the admin secret key.
     *
     * @param {string} token - The JWT token to verify.
     * @return {*}  {Promise<any>} - Resolves with the decoded token if valid, rejects if invalid.
     * @memberof TokenService
     */
    verifyTokenForAdmin(token: string): Promise<any>;
    public: any;
    /**
     * Check if the token is an application token.
     *
     * @param {*} tokenInfo
     * @return {*}  {boolean}
     * @memberof TokenService
     */
    isAppToken(tokenInfo: any): boolean;
    /**
     * Check if the token is an user token.
     *
     * @param {*} tokenInfo
     * @return {*}  {boolean}
     * @memberof TokenService
     */
    isUserToken(tokenInfo: any): boolean;
    private _generateString;
    private _getAllTokens;
    private _scheduleTokenPurge;
}
