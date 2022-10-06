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
const globalCache = require("global-cache");
const tokenKey = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
class AuthentificationService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthentificationService();
        return this.instance;
    }
    authenticate(info) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminCredential = yield this.getPamToAdminCredential();
            if (!adminCredential)
                throw new Error("No authentication platform is registered");
            const isUser = "userName" in info && "password" in info ? true : false;
            const url = `${adminCredential.urlAdmin}/${isUser ? 'users' : 'applications'}/login`;
            return this._sendLoginRequest(url, info, adminCredential, isUser);
        });
    }
    tokenIsValid(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._getTokenData(token);
            const expirationTime = data === null || data === void 0 ? void 0 : data.expieredToken;
            const tokenExpired = expirationTime ? Date.now() >= expirationTime * 1000 : true;
            if (!data || tokenExpired)
                return false;
            return true;
        });
    }
    // PAM Credential
    registerToAdmin(pamInfo, adminInfo) {
        return axios_1.default.post(`${adminInfo.urlAdmin}/register`, {
            platformCreationParms: pamInfo,
            registerKey: adminInfo.registerKey
        }).then((result) => {
            result.data.url = adminInfo.urlAdmin;
            result.data.registerKey = adminInfo.registerKey;
            return this._editPamCredential(result.data);
        });
    }
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
    // Admin credential
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
            if (bosCredential.registerKey)
                contextInfo.mod_attr("registerKey", bosCredential.registerKey);
            return contextInfo.get();
        });
    }
    _sendLoginRequest(url, info, adminCredential, isUser = true) {
        return axios_1.default.post(url, info).then((result) => __awaiter(this, void 0, void 0, function* () {
            const data = result.data;
            data.profile = yield this._getProfileInfo(data.token, adminCredential, isUser);
            if (isUser)
                data.userInfo = yield this._getUserInfo(data.userId, adminCredential, data.token);
            this._saveUserToken(data);
            return {
                code: constant_1.HTTP_CODES.OK,
                data
            };
        })).catch(err => {
            return {
                code: constant_1.HTTP_CODES.UNAUTHORIZED,
                data: "bad credential"
            };
        });
    }
    _getProfileInfo(userToken, adminCredential, isUser) {
        let urlAdmin = adminCredential.urlAdmin;
        let endpoint = isUser ? "/tokens/getUserProfileByToken" : "";
        return axios_1.default.post(urlAdmin + endpoint, {
            platformId: adminCredential.idPlateform,
            token: userToken
        }).then((result) => {
            if (!result.data)
                return;
            const data = result.data;
            delete data.password;
            return data;
        }).catch(err => {
            return {};
        });
    }
    _getUserInfo(userId, adminCredential, userToken) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // "x-access-token": adminCredential.tokenBosAdmin
                "x-access-token": userToken
            },
        };
        return axios_1.default.get(`${adminCredential.urlAdmin}/users/${userId}`, config).then((result) => {
            return result.data;
        }).catch((err) => {
            console.error(err);
        });
    }
    _formatUserProfiles() {
        return userProfile_service_1.UserProfileService.getInstance().getAllUserProfilesNodes().then((nodes) => {
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
    _saveUserToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            globalCache.set(data.token, data);
        });
    }
    _getTokenData(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = globalCache.get(token);
            if (data)
                return data;
            // Edit here
        });
    }
}
exports.AuthentificationService = AuthentificationService;
//# sourceMappingURL=authentification.service.js.map