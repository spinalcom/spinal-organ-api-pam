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

import { IAdmin, IAdminAppProfile, IAdminCredential, IAdminOrgan, IAdminUserProfile, IPamCredential, IJsonData, IPamInfo, IUserCredential, IAppCredential, IApplicationToken, IUserToken } from "../interfaces";
import axios from "axios";
import { SpinalContext } from "spinal-env-viewer-graph-service";
import { configServiceInstance } from "./configFile.service";
import { ADMIN_CREDENTIAL_CONTEXT_NAME, ADMIN_CREDENTIAL_CONTEXT_TYPE, PAM_CREDENTIAL_CONTEXT_NAME, PAM_CREDENTIAL_CONTEXT_TYPE, HTTP_CODES } from "../constant";
const jwt = require('jsonwebtoken');
import { v4 as uuidv4 } from 'uuid';
import { UserProfileService } from "./userProfile.service";
import { AppProfileService } from "./appProfile.service";

import * as globalCache from 'global-cache';
import { UserService } from "./users.services";
import { TokenService } from "./token.service";
const tokenKey = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';


export class AuthentificationService {
    private static instance: AuthentificationService;
    private constructor() { }

    public static getInstance(): AuthentificationService {
        if (!this.instance) this.instance = new AuthentificationService();
        return this.instance;
    }

    public async authenticate(info: IUserCredential | IAppCredential): Promise<{ code: number; data: string | IApplicationToken | IUserToken }> {
        const adminCredential = await this.getPamToAdminCredential();
        if (!adminCredential) throw new Error("No authentication platform is registered");

        const isUser = "userName" in info && "password" in info ? true : false;
        const url = `${adminCredential.urlAdmin}/${isUser ? 'users' : 'applications'}/login`;

        return this._sendLoginRequest(url, info, adminCredential, isUser);
    }

    public async authenticateAdmin(info: IUserCredential): Promise<{ code: number; message: any }> {
        const data = await UserService.getInstance().loginAdmin(info);
        if (data.code === HTTP_CODES.OK) this._saveUserToken(data.message, false);
        return data;
    }

    public async tokenIsValid(token: string): Promise<boolean> {
        const data = await this._getTokenData(token);
        const expirationTime = data?.expieredToken;
        const tokenExpired = expirationTime ? Date.now() >= expirationTime * 1000 : true;
        if (!data || tokenExpired) return false;
        return true;
    }


    // PAM Credential
    public registerToAdmin(pamInfo: IPamInfo, adminInfo: IAdmin): Promise<IPamCredential> {
        return axios.post(`${adminInfo.urlAdmin}/register`, {
            platformCreationParms: pamInfo,
            registerKey: adminInfo.registerKey
        }).then((result) => {
            result.data.url = adminInfo.urlAdmin;
            result.data.registerKey = adminInfo.registerKey;
            return this._editPamCredential(result.data)
        })
    }

    public async getPamToAdminCredential(): Promise<IPamCredential> {
        let context = await configServiceInstance.getContext(PAM_CREDENTIAL_CONTEXT_NAME);
        if (!context) return;

        return context.info.get();
    }



    public async deleteCredentials() {
        let context = await configServiceInstance.getContext(PAM_CREDENTIAL_CONTEXT_NAME);
        if (context) await context.removeFromGraph();

        let adminContext = await configServiceInstance.getContext(ADMIN_CREDENTIAL_CONTEXT_NAME);
        if (!adminContext) await adminContext.removeFromGraph();

        return { removed: true }
    }

    // Admin credential

    public createAdminCredential(): Promise<IAdminCredential> {
        const clientId = uuidv4();
        const token = jwt.sign({ clientId, type: 'ADMIN SERVER' }, tokenKey);

        return this.editAdminCredential({
            idPlatformOfAdmin: clientId,
            TokenAdminToPam: token
        })
    }

    public async editAdminCredential(admin: IAdminCredential): Promise<IAdminCredential> {
        const context = await this._getOrCreateContext(ADMIN_CREDENTIAL_CONTEXT_NAME, ADMIN_CREDENTIAL_CONTEXT_TYPE);
        context.info.mod_attr("idPlatformOfAdmin", admin.idPlatformOfAdmin);
        context.info.mod_attr("TokenAdminToPam", admin.TokenAdminToPam);
        return admin;
    }

    public async getAdminCredential(): Promise<IAdminCredential> {
        let context = await configServiceInstance.getContext(ADMIN_CREDENTIAL_CONTEXT_NAME);
        if (!context) return;

        return context.info.get();
    }

    public async sendDataToAdmin(update: boolean = false) {
        const bosCredential = await this.getPamToAdminCredential();
        if (!bosCredential) throw new Error("No admin registered, register an admin and retry !");

        // const endpoint = update ? "update" : "register";
        const endpoint = "register";

        const adminCredential: any = !update ? await this._getOrCreateAdminCredential(true) : {};


        const data = await this._getRequestBody(update, bosCredential, adminCredential);

        return axios.put(`${bosCredential.urlAdmin}/${endpoint}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }



    // public async updateToken(oldToken: string) {
    //     const adminInfo = await this.getAdminCredential();
    //     const decodeToken = jwt.verify(oldToken, tokenKey);
    //     if (oldToken === adminInfo.TokenAdminBos && decodeToken.clienId === adminInfo.idPlatformOfAdmin) {
    //         const newToken = jwt
    //     } 
    // }



    //////////////////////////////////////////////////
    //                      PRIVATE                 //
    //////////////////////////////////////////////////

    private async _getOrCreateAdminCredential(createIfNotExist: boolean = false): Promise<IAdminCredential> {
        const credentials = await this.getAdminCredential();
        if (credentials) return credentials;
        if (createIfNotExist) return this.createAdminCredential();
    }

    private async getJsonData(): Promise<IJsonData> {
        return {
            userProfileList: await this._formatUserProfiles(),
            appProfileList: await this._formatAppProfiles(),
            organList: [],
            // appList: await this._formatAppList()
        }
    }

    private async _getRequestBody(update: boolean, bosCredential: IPamCredential, adminCredential: IAdminCredential) {
        return JSON.stringify({
            TokenBosAdmin: bosCredential.tokenPamToAdmin,
            platformId: bosCredential.idPlateform,
            jsonData: await this.getJsonData(),
            ...(!update && {
                URLBos: `http://localhost:8060`,
                TokenAdminBos: adminCredential.TokenAdminToPam,
                idPlatformOfAdmin: adminCredential.idPlatformOfAdmin
            }),
        })
    }

    private async _editPamCredential(bosCredential: any): Promise<IPamCredential> {
        const context = await this._getOrCreateContext(PAM_CREDENTIAL_CONTEXT_NAME, PAM_CREDENTIAL_CONTEXT_TYPE);
        const contextInfo = context.info;

        if (bosCredential.TokenBosAdmin) contextInfo.mod_attr("tokenPamToAdmin", bosCredential.TokenBosAdmin);
        if (bosCredential.name) contextInfo.mod_attr("pamName", bosCredential.name);
        if (bosCredential.id) contextInfo.mod_attr("idPlateform", bosCredential.id);
        if (bosCredential.url) contextInfo.mod_attr("urlAdmin", bosCredential.url);
        if (bosCredential.registerKey) contextInfo.mod_attr("registerKey", bosCredential.registerKey);

        return contextInfo.get();
    }


    private _sendLoginRequest(url: string, info: IUserCredential | IAppCredential, adminCredential: IPamCredential, isUser: boolean = true): Promise<{ code: number; data: string | IApplicationToken | IUserToken }> {

        return axios.post(url, info).then(async (result) => {
            const data = result.data;
            data.profile = await this._getProfileInfo(data.token, adminCredential, isUser);
            if (isUser) data.userInfo = await this._getUserInfo(data.userId, adminCredential, data.token);
            this._saveUserToken(data);
            return {
                code: HTTP_CODES.OK,
                data
            }
        }).catch(err => {
            return {
                code: HTTP_CODES.UNAUTHORIZED,
                data: "bad credential"
            }
        })
    }

    private _getProfileInfo(userToken: string, adminCredential: IPamCredential, isUser: boolean) {
        let urlAdmin = adminCredential.urlAdmin;
        let endpoint = isUser ? "/tokens/getUserProfileByToken" : "";
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

    private _getUserInfo(userId: string, adminCredential: IPamCredential, userToken: string) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // "x-access-token": adminCredential.tokenBosAdmin
                "x-access-token": userToken
            },
        }
        return axios.get(`${adminCredential.urlAdmin}/users/${userId}`, config).then((result) => {
            return result.data;
        }).catch((err) => {
            console.error(err);
        })
    }

    private _formatUserProfiles(): Promise<IAdminUserProfile[]> {
        return UserProfileService.getInstance().getAllUserProfilesNodes().then((nodes) => {
            return nodes.map(el => ({
                userProfileId: el.info.id.get(),
                label: el.info.name.get()
            }))
        })
    }

    private _formatAppProfiles(): Promise<IAdminAppProfile[]> {
        return AppProfileService.getInstance().getAllAppProfileNodes().then((nodes) => {
            return nodes.map(el => ({
                appProfileId: el.info.id.get(),
                label: el.info.name.get()
            }))
        })
    }


    private async _getOrCreateContext(contextName: string, contextType: string): Promise<SpinalContext> {
        let context = await configServiceInstance.getContext(contextName);
        if (!context) context = await configServiceInstance.addContext(contextName, contextType);
        return context;
    }


    private async _saveUserToken(data: IUserToken | IApplicationToken, addToGraph: boolean = true): Promise<void> {
        globalCache.set(data.token, data);
        if (addToGraph) await TokenService.getInstance().addTokenToContext(data.token, data);
    }

    public async _getTokenData(token: string): Promise<IApplicationToken | IUserToken> {
        const data = globalCache.get(token);
        if (data) return data;

        const found = await TokenService.getInstance().getTokenData(token);
        return found;
    }
}