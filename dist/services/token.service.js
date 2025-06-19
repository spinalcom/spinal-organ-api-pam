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
exports.TokenService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const adminProfile_service_1 = require("./adminProfile.service");
const jwt = require("jsonwebtoken");
const globalCache = require("global-cache");
const cron = require("node-cron");
const authentification_service_1 = require("./authentification.service");
const axios_1 = require("axios");
class TokenService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new TokenService();
        return this.instance;
    }
    async init(graph) {
        this.context = await graph.getContext(constant_1.TOKEN_LIST_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.TOKEN_LIST_CONTEXT_NAME, constant_1.TOKEN_LIST_CONTEXT_TYPE);
            this.context = await graph.addContext(spinalContext);
            this.getOrGenerateTokenKey(); // Ensure the token key is set in the context
        }
        await this._scheduleTokenPurge();
        return this.context;
    }
    /**
     * Purge invalid tokens from the context.
     *
     * @return {*}  {(Promise<(IUserToken | IApplicationToken)[]>)}
     * @memberof TokenService
     */
    async purgeToken() {
        const tokens = await this._getAllTokens();
        const promises = tokens.map(token => this.tokenIsValid(token, true));
        return Promise.all(promises);
    }
    /**
     * Create a token for a user and add it to the context.
     *
     * @param {SpinalNode} userNode
     * @param {string} token
     * @param {*} playload
     * @return {*}  {Promise<any>}
     * @memberof TokenService
     */
    async createToken(userNode, playload, isAdmin = false) {
        const tokenExpiration = isAdmin ? "7d" : "1h";
        const token = this._generateToken(playload, tokenExpiration);
        const tokenDecoded = await this.verifyTokenForAdmin(token);
        playload = Object.assign(playload, { createdToken: tokenDecoded.iat, expieredToken: tokenDecoded.exp, token });
        const tokenNode = await this.addTokenToContext(token, playload);
        await userNode.addChild(tokenNode, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
        return playload;
    }
    /**
     * Get or generate a token key for signing JWT tokens.
     * If a secret is already set in the context, it will return that.
     * Otherwise, it generates a new random string and sets it in the context.
     *
     * @return {*}  {string} - The token key.
     * @memberof TokenService
     */
    getOrGenerateTokenKey() {
        if (this.context?.info?.secret)
            return this.context.info.secret.get();
        const secret = this._generateString(20);
        this.context.info.add_attr({ secret });
        return secret;
    }
    _generateToken(payload, expiresIn = "1h") {
        const tokenKey = this.getOrGenerateTokenKey();
        return jwt.sign(payload, tokenKey, { expiresIn });
    }
    /**
     * Generate a token for admin a user.
     *
     * @param {SpinalNode} userNode
     * @param {string} [secret]
     * @param {(number | string)} [durationInMin]
     * @return {*}  {Promise<any>}
     * @memberof TokenService
     */
    async generateTokenForAdmin(userNode) {
        const adminProfile = await adminProfile_service_1.AdminProfileService.getInstance().getAdminProfile();
        let playload = {
            userInfo: userNode.info.get(),
            userId: userNode.getId().get(),
            profile: { profileId: adminProfile.getId().get() }
        };
        const isAdmin = true;
        return this.createToken(userNode, playload, isAdmin);
        // const tokenKey = this.getOrGenerateTokenKey();
        // const token = jwt.sign(playload, tokenKey, { expiresIn: "7d" });
        // const tokenDecoded = await this.verifyTokenForAdmin(token);
        // playload = Object.assign(playload, { createdToken: tokenDecoded.iat, expieredToken: tokenDecoded.exp, token });
        // return playload;
    }
    /**
     * link a token to a context.
     *
     * @param {string} token
     * @param {*} data
     * @return {*}  {Promise<SpinalNode>}
     * @memberof TokenService
     */
    async addTokenToContext(token, data) {
        const node = new spinal_env_viewer_graph_service_1.SpinalNode(token, constant_1.TOKEN_TYPE, new spinal_core_connectorjs_type_1.Model(data));
        const child = await this.context.addChildInContext(node, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
        globalCache.set(data.token, data);
        return child;
    }
    /**
     * Get the token data from the cache or from the context.
     *
     * @param {string} token
     * @return {*}  {Promise<any>}
     * @memberof TokenService
     */
    async getTokenData(token) {
        const tokenInCache = globalCache.get(token);
        if (tokenInCache)
            return tokenInCache;
        const tokenNode = await this.getTokenNode(token);
        if (!tokenNode)
            return;
        const nodeElement = await tokenNode.getElement(true);
        if (nodeElement) {
            globalCache.set(token, nodeElement.get());
            return nodeElement.get();
        }
    }
    /**
     * Get a token node by its name.
     *
     * @param {string} token
     * @return {*}  {Promise<SpinalNode>}
     * @memberof TokenService
     */
    getTokenNode(token) {
        return this.context.getChild((node) => node.getName().get() === token, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
    }
    /**
     * remove a token.
     *
     * @param {(SpinalNode | string)} token
     * @return {*}  {Promise<boolean>}
     * @memberof TokenService
     */
    async deleteToken(token) {
        if (!(token instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            token = await this.getTokenNode(token);
        if (!token)
            return false;
        try {
            const parents = await token.getParents(constant_1.TOKEN_RELATION_NAME);
            for (const parent of parents) {
                await parent.removeChild(token, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Check if a token is valid.
     *
     * @param {string} token
     * @param {boolean} [deleteIfExpired=false]
     * @return {*}  {(Promise<IUserToken | IApplicationToken>)}
     * @memberof TokenService
     */
    async tokenIsValid(token, deleteIfExpired = false) {
        let isAdminToken = false;
        try {
            const adminTokenData = this.getTokenData(token);
            if (!adminTokenData)
                throw new Error("Token not found in cache or context"); // Check if the token is in the cache or context
            isAdminToken = true;
            await this.verifyTokenForAdmin(token); // Verify the token using the admin secret key
            return adminTokenData;
        }
        catch (error) {
            if (isAdminToken)
                return; // If it is an admin token and verification failed, return undefined;
            return this.verifyTokenInAuthPlatform(token);
        }
    }
    /**
     * Get the profile ID associated with a token.
     *
     * @param {string} token
     * @return {*}  {Promise<string>}
     * @memberof TokenService
     */
    async getProfileIdByToken(token) {
        const data = await this.tokenIsValid(token);
        if (data)
            return data.profile.profileId || data.profile.userProfileBosConfigId || data.profile.appProfileBosConfigId;
        return;
    }
    /**
     * Verify a token in the authentication platform.
     *
     * @param {string} token - The JWT token to verify.
     * @param {"user" | "app"} [actor="user"] - The actor type, either "user" or "app".
     * @return {*}  {Promise<any>} - Resolves with the verification result.
     * @memberof TokenService
     */
    async verifyTokenInAuthPlatform(token, actor = "user") {
        const authAdmin = await authentification_service_1.AuthentificationService.getInstance().getPamCredentials();
        return axios_1.default.post(`${authAdmin.urlAdmin}/tokens/verifyToken`, { tokenParam: token, actor }).then((result) => {
            return result.data;
        });
    }
    /**
     * Verify a token using the admin secret key.
     *
     * @param {string} token - The JWT token to verify.
     * @return {*}  {Promise<any>} - Resolves with the decoded token if valid, rejects if invalid.
     * @memberof TokenService
     */
    async verifyTokenForAdmin(token) {
        const tokenKey = this.getOrGenerateTokenKey();
        return new Promise((resolve, reject) => {
            jwt.verify(token, tokenKey, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
    }
    /**
     * Check if the token is an application token.
     *
     * @param {*} tokenInfo
     * @return {*}  {boolean}
     * @memberof TokenService
     */
    isAppToken(tokenInfo) {
        return tokenInfo && tokenInfo.profile.hasOwnProperty("appProfileBosConfigId");
    }
    /**
     * Check if the token is an user token.
     *
     * @param {*} tokenInfo
     * @return {*}  {boolean}
     * @memberof TokenService
     */
    isUserToken(tokenInfo) {
        return tokenInfo && tokenInfo.profile.hasOwnProperty("userProfileBosConfigId");
    }
    //////////////////////////////////////////////////
    //                        PRIVATE               //
    //////////////////////////////////////////////////
    _generateString(length = 10) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let text = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            text += charset.charAt(Math.floor(Math.random() * n));
        }
        return text;
    }
    async _getAllTokens() {
        const tokens = await this.context.getChildren(constant_1.TOKEN_RELATION_NAME);
        return tokens.map(el => el.getName().get());
    }
    _scheduleTokenPurge() {
        // cron.schedule('0 0 23 * * *', async () => {
        cron.schedule('30 */1 * * *', async () => {
            console.log(new Date().toUTCString(), "purge invalid tokens");
            await this.purgeToken();
        });
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map