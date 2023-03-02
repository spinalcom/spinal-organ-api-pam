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

import axios from "axios";
import { SpinalContext, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { USER_LIST_CONTEXT_TYPE, USER_LIST_CONTEXT_NAME, ADMIN_USERNAME, ADMIN_USER_TYPE, PTR_LST_TYPE, CONTEXT_TO_ADMIN_USER_RELATION, USER_TYPES, HTTP_CODES, TOKEN_TYPE, TOKEN_RELATION_NAME, APP_LIST_CONTEXT_NAME, APP_CATEGORY_TYPE, APP_LIST_CONTEXT_TYPE, CONTEXT_TO_USER_RELATION_NAME, CONTEXT_TO_APP_RELATION_NAME } from "../constant";
import { IAppCredential, IApplicationToken, IOAuth2Credential, IPamCredential, IUserCredential, IUserInfo, IUserToken } from "../interfaces";
import { configServiceInstance } from "./configFile.service";
import { Model } from 'spinal-core-connectorjs_type';
import * as bcrypt from 'bcrypt';
import * as fileLog from "log-to-file";
import * as path from "path";
import { TokenService } from "./token.service";
import { AuthentificationService } from './authentification.service'


export class AppListService {
    private static instance: AppListService;
    public context: SpinalContext;

    private constructor() { }

    public static getInstance(): AppListService {
        if (!this.instance) this.instance = new AppListService();
        return this.instance;
    }

    public async init(): Promise<SpinalContext> {
        this.context = await configServiceInstance.getContext(APP_LIST_CONTEXT_NAME);
        if (!this.context) {
            this.context = await configServiceInstance.addContext(APP_LIST_CONTEXT_NAME, APP_LIST_CONTEXT_TYPE);
        }

        return this.context;
    }


    public async authenticateApplication(application: IAppCredential | IOAuth2Credential): Promise<{ code: number; data: string | IApplicationToken }> {

        const adminCredential = await this._getAuthPlateformInfo();

        const url = `${adminCredential.urlAdmin}/applications/login`;
        return axios.post(url, application).then(async (result) => {
            const data = result.data;
            data.profile = await this._getProfileInfo(data.token, adminCredential);
            data.userInfo = await this._getApplicationInfo(data.userId, adminCredential, data.token);

            const type = USER_TYPES.APP;
            const info = { clientId: application.clientId, type, userType: type }

            const node = await this._addUserToContext(info);
            await TokenService.getInstance().addUserToken(node, data.token, data);

            return {
                code: HTTP_CODES.OK,
                data
            }
        }).catch(err => {
            console.error(err)
            return {
                code: HTTP_CODES.UNAUTHORIZED,
                data: "bad credential"
            }
        })
    }


    //////////////////////////////////////////////////
    //                    PRIVATE                   //
    //////////////////////////////////////////////////


    private async _addUserToContext(info: { [key: string]: any }, element?: spinal.Model): Promise<SpinalNode> {
        const users = await this.context.getChildrenInContext();

        const found = users.find(el => el.info.clientId?.get() === info.clientId);
        if (found) return found;

        const nodeId = SpinalGraphService.createNode(info, element);
        const node = SpinalGraphService.getRealNode(nodeId);
        return this.context.addChildInContext(node, CONTEXT_TO_APP_RELATION_NAME, PTR_LST_TYPE, this.context);
    }

    private _getProfileInfo(userToken: string, adminCredential: IPamCredential) {
        let urlAdmin = adminCredential.urlAdmin;
        let endpoint = "/tokens/getAppProfileByToken";
        return axios.post(urlAdmin + endpoint, {
            platformId: adminCredential.idPlateform,
            token: userToken
        }).then((result) => {
            if (!result.data) return;
            const data = result.data;
            delete data.password;
            return data;
        }).catch(err => {
            return {};
        })
    }

    private _getApplicationInfo(applicationId: string, adminCredential: IPamCredential, userToken: string) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // "x-access-token": adminCredential.tokenBosAdmin
                "x-access-token": userToken
            },
        }
        return axios.get(`${adminCredential.urlAdmin}/application/${applicationId}`, config).then((result) => {
            return result.data;
        }).catch((err) => {
            console.error(err);
        })
    }

    private async _getAuthPlateformInfo() {
        const adminCredential = await AuthentificationService.getInstance().getPamToAdminCredential();
        if (!adminCredential) throw new Error("No authentication platform is registered");
        return adminCredential;
    }
}