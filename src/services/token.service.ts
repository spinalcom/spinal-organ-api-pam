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

import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { TOKEN_LIST_CONTEXT_TYPE, TOKEN_LIST_CONTEXT_NAME, TOKEN_TYPE, PTR_LST_TYPE, TOKEN_RELATION_NAME } from "../constant";
import { configServiceInstance } from "./configFile.service";
import { Model } from 'spinal-core-connectorjs_type';
import { AdminProfileService } from "./adminProfile.service";
import * as jwt from "jsonwebtoken";
import * as globalCache from 'global-cache';
import { IApplicationToken, IUserToken } from "../interfaces";
import * as cron from 'node-cron';

export class TokenService {
    private static instance: TokenService;
    public context: SpinalContext;

    private constructor() { }

    public static getInstance(): TokenService {
        if (!this.instance) this.instance = new TokenService();
        return this.instance;
    }

    public async init(): Promise<SpinalContext> {
        this.context = await configServiceInstance.getContext(TOKEN_LIST_CONTEXT_NAME);
        if (!this.context) {
            this.context = await configServiceInstance.addContext(TOKEN_LIST_CONTEXT_NAME, TOKEN_LIST_CONTEXT_TYPE);
        }

        await this._scheduleTokenPurge();
        return this.context;
    }


    public async purgeToken(): Promise<(IUserToken | IApplicationToken)[]> {
        const tokens = await this._getAllTokens();
        const promises = tokens.map(token => this.tokenIsValid(token, true));
        return Promise.all(promises);
    }

    public async addUserToken(userNode: SpinalNode, token: string, playload: any): Promise<any> {
        const tokenNode = await this.addTokenToContext(token, playload);
        await userNode.addChild(tokenNode, TOKEN_RELATION_NAME, PTR_LST_TYPE);
        return playload;
    }

    public async getAdminPlayLoad(userNode: SpinalNode, secret?: string, durationInMin?: number): Promise<any> {
        const playload: any = {
            userInfo: userNode.info.get()
        };

        durationInMin = durationInMin || 7 * 24 * 60 * 60; // par default 7jrs
        const key = secret || this._generateString(15);
        const token = jwt.sign(playload, key, { expiresIn: durationInMin });

        const adminProfile = await AdminProfileService.getInstance().getAdminProfile()
        const now = Date.now();
        playload.createdToken = now;
        playload.expieredToken = now + (durationInMin * 60 * 1000);
        playload.userId = userNode.getId().get();
        playload.token = token;
        playload.profile = {
            profileId: adminProfile.getId().get()
        }

        return playload;
    }

    public async addTokenToContext(token: string, data: any): Promise<SpinalNode> {
        const node = new SpinalNode(token, TOKEN_TYPE, new Model(data));
        const child = await this.context.addChildInContext(node, TOKEN_RELATION_NAME, PTR_LST_TYPE)
        globalCache.set(data.token, data);
        return child;
    }

    public async getTokenData(token: string): Promise<any> {
        const data = globalCache.get(token);
        if (data) return data;

        const found = await this.context.getChild((node) => node.getName().get() === token, TOKEN_RELATION_NAME, PTR_LST_TYPE);
        if (!found) return;

        const element = await found.getElement(true);
        if (element) {
            globalCache.set(token, element.get())
            return element.get();
        }
    }

    public async deleteToken(token: SpinalNode | string): Promise<boolean> {
        const found = token instanceof SpinalNode ? token : await this.context.getChild((node) => node.getName().get() === token, TOKEN_RELATION_NAME, PTR_LST_TYPE);
        if (!found) return true;

        try {
            const parents = await found.getParents(TOKEN_RELATION_NAME);
            for (const parent of parents) {
                await parent.removeChild(found, TOKEN_RELATION_NAME, PTR_LST_TYPE);
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    public async tokenIsValid(token: string, deleteIfExpired: boolean = false): Promise<IUserToken | IApplicationToken> {
        const data = await this.getTokenData(token);
        if (!data) return;

        const expirationTime = data.expieredToken;
        const tokenExpired = expirationTime ? Date.now() >= expirationTime * 1000 : true;

        if (tokenExpired) {
            if (deleteIfExpired) await this.deleteToken(token);
            return;
        }

        return data;
    }

    public async getProfileIdByToken(token: string): Promise<string> {
        const data: any = await this.tokenIsValid(token);
        if (data) return data.profile.profileId || data.profile.userProfileBosConfigId || data.profile.appProfileBosConfigId;

        return;
    }

    //////////////////////////////////////////////////
    //                        PRIVATE               //
    //////////////////////////////////////////////////


    private _generateString(length = 10): string {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*/-_@#&";
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