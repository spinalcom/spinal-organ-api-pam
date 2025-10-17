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

import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { TOKEN_LIST_CONTEXT_TYPE, TOKEN_LIST_CONTEXT_NAME, TOKEN_TYPE, PTR_LST_TYPE, TOKEN_RELATION_NAME } from "../constant";
import { Model } from 'spinal-core-connectorjs_type';
import { AdminProfileService } from "./adminProfile.service";
import * as jwt from "jsonwebtoken";
import * as globalCache from 'global-cache';
import { IApplicationToken, IUserToken } from "../interfaces";
import * as cron from 'node-cron';
import { AuthentificationService } from "./authentification.service";
import axios from "axios";

export class TokenService {
    private static instance: TokenService;
    public context: SpinalContext;

    private constructor() { }

    public static getInstance(): TokenService {
        if (!this.instance) this.instance = new TokenService();
        return this.instance;
    }

    public async init(graph: SpinalGraph): Promise<SpinalContext> {
        this.context = await graph.getContext(TOKEN_LIST_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new SpinalContext(TOKEN_LIST_CONTEXT_NAME, TOKEN_LIST_CONTEXT_TYPE);
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
    public async purgeToken(): Promise<(IUserToken | IApplicationToken)[]> {
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
    public async createToken(userNode: SpinalNode, playload: any, isAdmin: boolean = false): Promise<any> {
        const tokenExpiration = isAdmin ? "7d" : "1h";
        const token = this._generateToken(playload, tokenExpiration);
        const tokenDecoded = await this.verifyTokenForAdmin(token);
        playload = Object.assign(playload, { createdToken: tokenDecoded.iat, expieredToken: tokenDecoded.exp, token });

        const tokenNode = await this.addTokenToContext(token, playload);
        await userNode.addChild(tokenNode, TOKEN_RELATION_NAME, PTR_LST_TYPE);
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
    public getOrGenerateTokenKey(): string {
        if (this.context?.info?.secret) return this.context.info.secret.get();

        const secret = this._generateString(20);
        this.context.info.add_attr({ secret });
        return secret;
    }


    private _generateToken(payload: any, expiresIn = "1h"): string {
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
    public async generateTokenForAdmin(userNode: SpinalNode): Promise<any> {
        const adminProfile = await AdminProfileService.getInstance().getAdminProfile();

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
    public async addTokenToContext(token: string, data: any): Promise<SpinalNode> {
        const node = new SpinalNode(token, TOKEN_TYPE, new Model(data));
        const child = await this.context.addChildInContext(node, TOKEN_RELATION_NAME, PTR_LST_TYPE)
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
    public async getTokenData(token: string): Promise<any> {
        const tokenInCache = globalCache.get(token);
        if (tokenInCache) return tokenInCache;

        const tokenNode = await this.getTokenNode(token);
        if (!tokenNode) return;

        const nodeElement = await tokenNode.getElement(true);
        if (nodeElement) {
            globalCache.set(token, nodeElement.get())
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
    public getTokenNode(token: string): Promise<SpinalNode> {
        return this.context.getChild((node) => node.getName().get() === token, TOKEN_RELATION_NAME, PTR_LST_TYPE);
    }


    /**
     * remove a token.
     *
     * @param {(SpinalNode | string)} token
     * @return {*}  {Promise<boolean>}
     * @memberof TokenService
     */
    public async deleteToken(token: SpinalNode | string): Promise<boolean> {
        if (!(token instanceof SpinalNode)) token = await this.getTokenNode(token);
        if (!token) return false;

        try {
            const parents = await token.getParents(TOKEN_RELATION_NAME);
            for (const parent of parents) {
                await parent.removeChild(token, TOKEN_RELATION_NAME, PTR_LST_TYPE);
            }
            return true;
        } catch (error) {
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
    public async tokenIsValid(token: string, deleteIfExpired: boolean = false): Promise<IUserToken | IApplicationToken> {

        let isAdminToken = false;

        try {
            const adminTokenData = await this.getTokenData(token);
            if (!adminTokenData) throw new Error("Token not found in cache or context"); // Check if the token is in the cache or context

            isAdminToken = true;
            await this.verifyTokenForAdmin(token) // Verify the token using the admin secret key
            return adminTokenData;
        } catch (error) {
            if (isAdminToken) return; // If it is an admin token and verification failed, return undefined;

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
    public async getProfileIdByToken(token: string): Promise<string> {
        const data: any = await this.tokenIsValid(token);
        if (data) return data.profile.profileId || data.profile.userProfileBosConfigId || data.profile.appProfileBosConfigId;

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
    public async verifyTokenInAuthPlatform(token: string, actor: "user" | "app" = "user") {
        const authAdmin = await AuthentificationService.getInstance().getPamCredentials();

        return axios.post(`${authAdmin.urlAdmin}/tokens/verifyToken`, { tokenParam: token, platformId: authAdmin.idPlateform, actor }).then((result) => {
            return result.data;
        })
    }

    /**
     * Verify a token using the admin secret key.
     *
     * @param {string} token - The JWT token to verify.
     * @return {*}  {Promise<any>} - Resolves with the decoded token if valid, rejects if invalid.
     * @memberof TokenService
     */
    public async verifyTokenForAdmin(token: string): Promise<any> {
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
    public isAppToken(tokenInfo: any): boolean {
        return tokenInfo && tokenInfo.profile.hasOwnProperty("appProfileBosConfigId");
    }

    /**
     * Check if the token is an user token.
     *
     * @param {*} tokenInfo
     * @return {*}  {boolean}
     * @memberof TokenService
     */
    public isUserToken(tokenInfo: any): boolean {
        return tokenInfo && tokenInfo.profile.hasOwnProperty("userProfileBosConfigId");
    }

    //////////////////////////////////////////////////
    //                        PRIVATE               //
    //////////////////////////////////////////////////


    private _generateString(length = 10): string {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let text = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            text += charset.charAt(Math.floor(Math.random() * n));
        }
        return text;
    }

    private async _getAllTokens(): Promise<string[]> {
        const tokens = await this.context.getChildren(TOKEN_RELATION_NAME);
        return tokens.map(el => el.getName().get())
    }

    private _scheduleTokenPurge() {
        // cron.schedule('0 0 23 * * *', async () => {
        cron.schedule('30 */1 * * *', async () => {
            console.log(new Date().toUTCString(), "purge invalid tokens");
            await this.purgeToken();
        })
    }
}