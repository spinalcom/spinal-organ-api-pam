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

import { IAdmin, IAdminAppProfile, IAdminCredential, IAdminOrgan, IAdminUserProfile, IBosCredential, IJsonData, IPamInfo } from "../interfaces";
import axios from "axios";
import * as path from "path";
import { SpinalContext } from "spinal-env-viewer-graph-service";
import { configServiceInstance } from "./configFile.service";
import { ADMIN_CREDENTIAL_CONTEXT_NAME, ADMIN_CREDENTIAL_CONTEXT_TYPE, BOS_CREDENTIAL_CONTEXT_NAME, BOS_CREDENTIAL_CONTEXT_TYPE } from "../constant";
const jwt = require('jsonwebtoken');
import { v4 as uuidv4 } from 'uuid';
import { UserProfileService } from "./userProfile.service";
import { AppProfileService } from "./appProfile.service";

const tokenKey = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';


export class AuthentificationService {
    private static instance: AuthentificationService;
    private constructor() { }

    public static getInstance(): AuthentificationService {
        if (!this.instance) this.instance = new AuthentificationService();
        return this.instance;
    }


    // BOS Credential
    public registerToAdmin(pamInfo: IPamInfo, adminInfo: IAdmin): Promise<IBosCredential> {
        return axios.post(`${adminInfo.urlAdmin}/register`, {
            platformCreationParms: pamInfo,
            registerKey: adminInfo.registerKey
        }).then((result) => {
            result.data.url = adminInfo.urlAdmin;
            result.data.registerKey = adminInfo.registerKey;
            return this.editBosCredential(result.data)
        })
    }

    public async getBosToAminCredential(): Promise<IBosCredential> {
        let context = await configServiceInstance.getContext(BOS_CREDENTIAL_CONTEXT_NAME);
        if (!context) return;

        return context.info.get();
    }

    public async editBosCredential(bosCredential: any): Promise<IBosCredential> {
        const context = await this._getOrCreateContext(BOS_CREDENTIAL_CONTEXT_NAME, BOS_CREDENTIAL_CONTEXT_TYPE);
        const contextInfo = context.info;

        if (bosCredential.TokenBosAdmin) contextInfo.mod_attr("tokenBosAdmin", bosCredential.TokenBosAdmin);
        if (bosCredential.name) contextInfo.mod_attr("bosName", bosCredential.name);
        if (bosCredential.id) contextInfo.mod_attr("idPlateform", bosCredential.id);
        if (bosCredential.url) contextInfo.mod_attr("urlAdmin", bosCredential.url);
        if (bosCredential.registerKey) contextInfo.mod_attr("registerKey", bosCredential.registerKey);

        return contextInfo.get();
    }



    // Admin credential

    public createAdminCredential(): Promise<IAdminCredential> {
        const clientId = uuidv4();
        const token = jwt.sign({ clientId, type: 'ADMIN SERVER' }, tokenKey);

        return this.editAdminCredential({
            idPlatformOfAdmin: clientId,
            TokenAdminBos: token
        })
    }

    public async editAdminCredential(admin: IAdminCredential): Promise<IAdminCredential> {
        const context = await this._getOrCreateContext(ADMIN_CREDENTIAL_CONTEXT_NAME, ADMIN_CREDENTIAL_CONTEXT_TYPE);
        context.info.mod_attr("idPlatformOfAdmin", admin.idPlatformOfAdmin);
        context.info.mod_attr("TokenAdminBos", admin.TokenAdminBos);
        return admin;
    }

    public async getAdminCredential(): Promise<IAdminCredential> {
        let context = await configServiceInstance.getContext(ADMIN_CREDENTIAL_CONTEXT_NAME);
        if (!context) return;

        return context.info.get();
    }



    public async sendDataToAdmin(update: boolean = false) {
        const bosCredential = await this.getBosToAminCredential();
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

    private async _getOrCreateAdminCredential(createIfNotExist: boolean = false): Promise<IAdminCredential> {
        const credentials = await this.getAdminCredential();
        if (credentials) return credentials;
        if (createIfNotExist) return this.createAdminCredential();
    }

    private async getJsonData(): Promise<IJsonData> {
        return {
            userProfileList: await this._formatUserProfiles(),
            appProfileList: await this._formatAppProfiles(),
            organList: await this._formatOrganList(),
            // appList: await this._formatAppList()
        }
    }

    private async _getRequestBody(update: boolean, bosCredential: IBosCredential, adminCredential: IAdminCredential) {
        return JSON.stringify({
            TokenBosAdmin: bosCredential.tokenBosAdmin,
            platformId: bosCredential.idPlateform,
            jsonData: await this.getJsonData(),
            ...(!update && {
                URLBos: `http://localhost:8060`,
                TokenAdminBos: adminCredential.TokenAdminBos,
                idPlatformOfAdmin: adminCredential.idPlatformOfAdmin
            }),
        })
    }

    // public async updateToken(oldToken: string) {
    //     const adminInfo = await this.getAdminCredential();
    //     const decodeToken = jwt.verify(oldToken, tokenKey);
    //     if (oldToken === adminInfo.TokenAdminBos && decodeToken.clienId === adminInfo.idPlatformOfAdmin) {
    //         const newToken = jwt
    //     } 
    // }






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

    private _formatAppList() {
        return []
    }

    private _formatOrganList(): IAdminOrgan[] {
        return []
    }


    private async _getOrCreateContext(contextName: string, contextType: string): Promise<SpinalContext> {
        let context = await configServiceInstance.getContext(contextName);
        if (!context) context = await configServiceInstance.addContext(contextName, contextType);
        return context;
    }

}