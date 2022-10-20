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
import * as jwt from "jsonwebtoken";
import { Model } from 'spinal-core-connectorjs_type';


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
        if (this.context) return this.context;

        this.context = await configServiceInstance.addContext(TOKEN_LIST_CONTEXT_NAME, TOKEN_LIST_CONTEXT_TYPE);

        return this.context;
    }



    public async addUserToken(userNode: SpinalNode, secret?: string, durationInMin?: number): Promise<any> {
        const playload: any = {
            userInfo: userNode.info.get()
        };
        durationInMin = durationInMin || 60 * 60;
        const key = secret || this._generateString(15);
        const token = jwt.sign(playload, key, { expiresIn: durationInMin });

        const now = Date.now();
        playload.createdToken = now;
        playload.expieredToken = now + (durationInMin * 60 * 1000);
        playload.userId = userNode.getId().get();
        playload.token = token;

        const tokenNode = await this.addTokenToContext(token, playload);
        await userNode.addChild(tokenNode, TOKEN_RELATION_NAME, PTR_LST_TYPE);
        return playload;
    }


    public addTokenToContext(token: string, data: any): Promise<SpinalNode> {
        const node = new SpinalNode(token, TOKEN_TYPE, new Model(data));
        return this.context.addChildInContext(node, TOKEN_RELATION_NAME, PTR_LST_TYPE)
    }

    public async getTokenData(token: string): Promise<any> {
        const found = await this.context.getChild((node) => node.getName().get() === token, TOKEN_RELATION_NAME, PTR_LST_TYPE);
        if (!found) return;

        return found.getElement(true);
    }

    public async deleteToken(token: SpinalNode | string): Promise<boolean> {
        const found = token instanceof SpinalNode ? token : await this.context.getChild((node) => node.getName().get() === token, TOKEN_RELATION_NAME, PTR_LST_TYPE);
        if (!found) return true;

        try {
            await this.context.removeChild(found, TOKEN_RELATION_NAME, PTR_LST_TYPE);
            return true;
        } catch (error) {
            return false;
        }
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

}