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

import { SpinalContext, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { USER_LIST_CONTEXT_TYPE, USER_LIST_CONTEXT_NAME, ADMIN_USERNAME, ADMIN_USER_TYPE, PTR_LST_TYPE, CONTEXT_TO_ADMIN_USER_RELATION, USER_TYPES, HTTP_CODES } from "../constant";
import { IUserCredential, IUserInfo } from "../interfaces";
import { configServiceInstance } from "./configFile.service";
import { Model } from 'spinal-core-connectorjs_type';
import * as bcrypt from 'bcrypt';
import { has } from "lodash";

export class UserService {
    private static instance: UserService;
    public context: SpinalContext;

    private constructor() { }

    public static getInstance(): UserService {
        if (!this.instance) this.instance = new UserService();
        return this.instance;
    }

    public async init(): Promise<SpinalContext> {
        this.context = await configServiceInstance.getContext(USER_LIST_CONTEXT_NAME);
        if (this.context) return this.context;

        this.context = await configServiceInstance.addContext(USER_LIST_CONTEXT_NAME, USER_LIST_CONTEXT_TYPE);

        const info = { userName: "admin", password: Math.random().toString(36).slice(-8) };

        await this.createAdminUser(info)

        return this.context;
    }


    public async createAdminUser(userInfo?: IUserInfo): Promise<SpinalNode> {
        const userName = (userInfo && userInfo.userName) || ADMIN_USERNAME;

        const userExist = await this.getAdminUser(userName);
        if (userExist) return;

        const password = (userInfo && userInfo.password) || Math.random().toString(36).slice(-8)

        if (userInfo.password) delete userInfo.password;

        userInfo.name = userName;
        userInfo.userName = userName;
        userInfo.type = USER_TYPES.ADMIN;

        const nodeId = SpinalGraphService.createNode(userInfo, new Model({
            userName,
            password: await this._hashPassword(password)
        }))

        const node = SpinalGraphService.getRealNode(nodeId);

        return this.context.addChildInContext(node, CONTEXT_TO_ADMIN_USER_RELATION, PTR_LST_TYPE, this.context);
    }

    public async getAdminUser(userName: string): Promise<SpinalNode> {
        const children = await this.context.getChildren(CONTEXT_TO_ADMIN_USER_RELATION);
        return children.find(el => el.info.userName().get() === userName);
    }


    public async loginAdmin(user: IUserCredential) {
        const node = await this.getAdminUser(user.userName);
        if (!node) throw { code: HTTP_CODES.UNAUTHORIZED, message: "bad username and/or password" };

        const element = await node.getElement(true);
        const success = await this._comparePassword(user.password, element.password.get());
        if (!success) throw { code: HTTP_CODES.UNAUTHORIZED, message: "bad username and/or password" };

        // Ajouter un token;
    }



    //////////////////////////////////////////////////
    //                        PRIVATE               //
    //////////////////////////////////////////////////


    private _hashPassword(password: string, saltRounds: number = 10): Promise<string> {
        return bcrypt.hashSync(password, saltRounds);
    }

    private _comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    private linkUserT() {

    }
}