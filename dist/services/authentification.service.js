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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthentificationService = void 0;
const axios_1 = require("axios");
const configFile_service_1 = require("./configFile.service");
const constant_1 = require("../constant");
const jwt = require('jsonwebtoken');
const uuid_1 = require("uuid");
const userProfile_service_1 = require("./userProfile.service");
const appProfile_service_1 = require("./appProfile.service");
const userList_services_1 = require("./userList.services");
const tokenKey = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
class AuthentificationService {
    constructor() {
        this.authPlatformIsConnected = false;
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthentificationService();
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // let urlAdmin = process.env.AUTH_SERVER_URL;
            // const clientId = process.env.AUTH_CLIENT_ID;
            // const clientSecret = process.env.AUTH_CLIENT_SECRET;
            // if (!urlAdmin || !clientId || !clientSecret) {
            //     console.info("There is not all the information needed to connect an auth platform in the .env file, so you can only login as admin");
            //     this.authPlatformIsConnected = false;
            //     return;
            // }
            // return this.registerToAdmin(urlAdmin, clientId, clientSecret)
            //     .then(async () => {
            //         console.info("Connected to the auth platform");
            //         await this.sendDataToAdmin();
            //         this.authPlatformIsConnected = true;
            //     }).catch((e) => {
            //         console.error("Impossible to connect to the auth platform, please check the information in the .env file");
            //         console.error("error message", e.message);
            //         this.authPlatformIsConnected = false;
            //     })
        });
    }
    authenticate(info) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUser = "userName" in info && "password" in info ? true : false;
            if (!isUser)
                return { code: constant_1.HTTP_CODES.BAD_REQUEST, data: "Invalid userName and/or password" };
            return userList_services_1.UserListService.getInstance().authenticateUser(info);
            // const appInfo: any = this._formatInfo(<any>info);
            // return AppListService.getInstance().authenticateApplication(appInfo)
        });
    }
    // PAM Credential
    registerToAdmin(urlAdmin, clientId, clientSecret) {
        if (!urlAdmin || !(/^https?:\/\//.test(urlAdmin)))
            throw new Error("AUTH_SERVER_URL is not valid!");
        if (!clientId)
            throw new Error("AUTH_CLIENT_ID is not valid!");
        if (!clientSecret)
            throw new Error("AUTH_CLIENT_SECRET is not valid!");
        if (urlAdmin[urlAdmin.length - 1] === "/") {
            urlAdmin = urlAdmin.substring(0, urlAdmin.lastIndexOf('/'));
        }
        return axios_1.default.post(`${urlAdmin}/register`, {
            // platformCreationParms: pamInfo,
            clientId,
            clientSecret
        }).then((result) => {
            result.data.url = urlAdmin;
            result.data.clientId = clientId;
            this.authPlatformIsConnected = true;
            return this._editPamCredential(result.data);
        }).catch((e) => {
            this.authPlatformIsConnected = false;
            throw new Error(e.message);
        });
    }
    // // PAM Credential
    // public registerToAdmin(pamInfo: IPamInfo, adminInfo: IAdmin): Promise<IPamCredential> {
    //     if (adminInfo.urlAdmin[adminInfo.urlAdmin.length - 1] === "/") {
    //         adminInfo.urlAdmin = adminInfo.urlAdmin.substring(0, adminInfo.urlAdmin.lastIndexOf('/'))
    //     }
    //     return axios.post(`${adminInfo.urlAdmin}/register`, {
    //         platformCreationParms: pamInfo,
    //         registerKey: adminInfo.registerKey
    //     }).then((result) => {
    //         result.data.url = adminInfo.urlAdmin;
    //         result.data.registerKey = adminInfo.registerKey;
    //         return this._editPamCredential(result.data)
    //     })
    // }
    getPamToAdminCredential() {
        return __awaiter(this, void 0, void 0, function* () {
            let context = yield configFile_service_1.configServiceInstance.getContext(constant_1.PAM_CREDENTIAL_CONTEXT_NAME);
            if (!context)
                return;
            return context.info.get();
        });
    }
    deleteCredentials() {
        return __awaiter(this, void 0, void 0, function* () {
            let context = yield configFile_service_1.configServiceInstance.getContext(constant_1.PAM_CREDENTIAL_CONTEXT_NAME);
            if (context)
                yield context.removeFromGraph();
            let adminContext = yield configFile_service_1.configServiceInstance.getContext(constant_1.ADMIN_CREDENTIAL_CONTEXT_NAME);
            if (!adminContext)
                yield adminContext.removeFromGraph();
            return { removed: true };
        });
    }
    // admin credential is token and id of the admin in PAM 
    createAdminCredential() {
        const clientId = (0, uuid_1.v4)();
        const token = jwt.sign({ clientId, type: 'ADMIN SERVER' }, tokenKey);
        return this.editAdminCredential({
            idPlatformOfAdmin: clientId,
            TokenAdminToPam: token
        });
    }
    editAdminCredential(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getOrCreateContext(constant_1.ADMIN_CREDENTIAL_CONTEXT_NAME, constant_1.ADMIN_CREDENTIAL_CONTEXT_TYPE);
            context.info.mod_attr("idPlatformOfAdmin", admin.idPlatformOfAdmin);
            context.info.mod_attr("TokenAdminToPam", admin.TokenAdminToPam);
            return admin;
        });
    }
    getAdminCredential() {
        return __awaiter(this, void 0, void 0, function* () {
            let context = yield configFile_service_1.configServiceInstance.getContext(constant_1.ADMIN_CREDENTIAL_CONTEXT_NAME);
            if (!context)
                return;
            return context.info.get();
        });
    }
    sendDataToAdmin(update = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const bosCredential = yield this.getPamToAdminCredential();
            if (!bosCredential)
                throw new Error("No admin registered, register an admin and retry !");
            // const endpoint = update ? "update" : "register";
            const endpoint = "register";
            const adminCredential = !update ? yield this._getOrCreateAdminCredential(true) : {};
            const data = yield this._getRequestBody(update, bosCredential, adminCredential);
            return axios_1.default.put(`${bosCredential.urlAdmin}/${endpoint}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });
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
    _getOrCreateAdminCredential(createIfNotExist = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getAdminCredential();
            if (credentials)
                return credentials;
            if (createIfNotExist)
                return this.createAdminCredential();
        });
    }
    getJsonData() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                userProfileList: yield this._formatUserProfiles(),
                appProfileList: yield this._formatAppProfiles(),
                organList: [],
                // appList: await this._formatAppList()
            };
        });
    }
    _getRequestBody(update, bosCredential, adminCredential) {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.stringify(Object.assign({ TokenBosAdmin: bosCredential.tokenPamToAdmin, platformId: bosCredential.idPlateform, jsonData: yield this.getJsonData() }, (!update && {
                URLBos: `http://localhost:8060`,
                TokenAdminBos: adminCredential.TokenAdminToPam,
                idPlatformOfAdmin: adminCredential.idPlatformOfAdmin
            })));
        });
    }
    _editPamCredential(bosCredential) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = yield this._getOrCreateContext(constant_1.PAM_CREDENTIAL_CONTEXT_NAME, constant_1.PAM_CREDENTIAL_CONTEXT_TYPE);
            const contextInfo = context.info;
            if (bosCredential.TokenBosAdmin)
                contextInfo.mod_attr("tokenPamToAdmin", bosCredential.TokenBosAdmin);
            if (bosCredential.name)
                contextInfo.mod_attr("pamName", bosCredential.name);
            if (bosCredential.id)
                contextInfo.mod_attr("idPlateform", bosCredential.id);
            if (bosCredential.url)
                contextInfo.mod_attr("urlAdmin", bosCredential.url);
            if (bosCredential.clientId)
                contextInfo.mod_attr("clientId", bosCredential.clientId);
            return contextInfo.get();
        });
    }
    _formatUserProfiles() {
        return userProfile_service_1.UserProfileService.getInstance().getAllUserProfileNodes().then((nodes) => {
            return nodes.map(el => ({
                userProfileId: el.info.id.get(),
                label: el.info.name.get()
            }));
        });
    }
    _formatAppProfiles() {
        return appProfile_service_1.AppProfileService.getInstance().getAllAppProfileNodes().then((nodes) => {
            return nodes.map(el => ({
                appProfileId: el.info.id.get(),
                label: el.info.name.get()
            }));
        });
    }
    _getOrCreateContext(contextName, contextType) {
        return __awaiter(this, void 0, void 0, function* () {
            let context = yield configFile_service_1.configServiceInstance.getContext(contextName);
            if (!context)
                context = yield configFile_service_1.configServiceInstance.addContext(contextName, contextType);
            return context;
        });
    }
    _formatInfo(info) {
        const obj = { clientId: undefined, clientSecret: undefined };
        if ("client_id" in info) {
            // info["clientId"] = info["client_id"]
            // delete info.client_id;
            obj.clientId = info["client_id"];
        }
        if ("client_secret" in info) {
            // info["clientSecret"] = info["client_secret"]
            // delete info.client_secret;
            obj.clientSecret = info["client_secret"];
        }
        return (obj.clientId && obj.clientSecret ? obj : info);
    }
}
exports.AuthentificationService = AuthentificationService;
//# sourceMappingURL=authentification.service.js.map