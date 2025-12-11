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
exports.AuthentificationService = void 0;
const axios_1 = require("axios");
const constant_1 = require("../constant");
const uuid_1 = require("uuid");
const userList_services_1 = require("./userList.services");
const authPlatformUtils_1 = require("../utils/authPlatformUtils");
const spinalCodeUnique_service_1 = require("./spinalCodeUnique.service");
const AuthError_1 = require("../security/AuthError");
const appConnectedList_service_1 = require("./appConnectedList.service");
const tokenKey = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
const jwt = require('jsonwebtoken');
class AuthentificationService {
    constructor() {
        this.authPlatformIsConnected = false;
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthentificationService();
        return this.instance;
    }
    async init(graph) {
        this.graph = graph;
    }
    async createRedirectLinkToBosConfig(buildIngInfo, token) {
        const body = {};
        const pamCredential = await this.getPamCredentials();
        if (!pamCredential)
            throw new Error("No auth platform registered, register one and retry !");
        if (pamCredential.urlAdmin.endsWith("/"))
            pamCredential.urlAdmin = pamCredential.urlAdmin.replace(/\/$/, () => ""); // Ensure the URL does not end with a slash
        const data = {
            // TokenBosAdmin: pamCredential.tokenPamToAdmin,
            // platformId: pamCredential.idPlateform,
            bosurl: buildIngInfo.bosUrl,
            bosApiUrl: buildIngInfo.apiUrl,
            // buildingId: buildIngInfo.id,
            token
        };
        return axios_1.default.post(`${pamCredential.urlAdmin}/tokens/generate_redirect_url`, data).then((result) => {
            // console.log("result data", result.data)
            const sessionId = result.data.sessionId;
            if (!sessionId)
                return pamCredential.urlAdmin + "/tokens/redirect/error"; // edit this to return an error url
            return `${pamCredential.urlAdmin}/tokens/redirect/${sessionId}`; // edit this to return result.data.url
        });
    }
    consumeCodeUnique(code) {
        try {
            return spinalCodeUnique_service_1.SpinalCodeUniqueService.getInstance().consumeCode(code);
        }
        catch (error) {
            throw new AuthError_1.OtherError(constant_1.HTTP_CODES.BAD_REQUEST, "Code unique not valid");
        }
    }
    async authenticate(info) {
        const isUser = "userName" in info && "password" in info ? true : false;
        if (isUser) {
            return userList_services_1.UserListService.getInstance().authenticateUser(info);
        }
        const appInfo = this._formatInfo(info);
        return appConnectedList_service_1.AppListService.getInstance().authenticateApplication(appInfo);
    }
    /**
     * Registers the PAM platform in the authentication platform.
     *
     * @param authApiUrl - The URL of the authentication API.
     * @param clientId - The PAM client ID for authentication.
     * @param clientSecret - The PAM client secret for authentication.
     * @returns A promise that resolves to the saved PAM credential.
     * @throws Error if any of the parameters are invalid or registration fails.
     */
    registerPamInAuthPlatform(authApiUrl, clientId, clientSecret) {
        // Ensure the URL starts with http:// or https://
        if (!authApiUrl || !(/^https?:\/\//.test(authApiUrl)))
            throw new Error("AUTH_SERVER_URL is not valid!");
        if (!clientId)
            throw new Error("AUTH_CLIENT_ID is not valid!");
        if (!clientSecret)
            throw new Error("AUTH_CLIENT_SECRET is not valid!");
        authApiUrl = authApiUrl.endsWith("/") ? authApiUrl.replace(/\/$/, () => "") : authApiUrl; // Ensure the URL ends with a slash
        return axios_1.default.post(authApiUrl + "/register", { clientId, clientSecret })
            .then(async (result) => {
            this.authPlatformIsConnected = true;
            const responseData = Object.assign({}, result.data, { url: authApiUrl, clientId });
            // save PAM credential in the graph, it will be used to send data to auth platform
            const pamInfo = await this._saveOrEditPamCredentials(responseData);
            return pamInfo;
        }).catch((e) => {
            this.authPlatformIsConnected = false;
            throw new Error(e.message);
        });
    }
    /**
 * Retrieves PAM authorization credentials from the graph.
 * @description authorization credentials are used to authenticate the PAM platform in the authAdmin platform.
 * @return {*}  {Promise<IPamCredential>}
 * @memberof AuthentificationService
 */
    async getPamCredentials() {
        let context = await this.graph.getContext(constant_1.PAM_CREDENTIAL_CONTEXT_NAME);
        if (!context)
            return;
        return context.info.get();
    }
    /**
     * Updates the PAM token in the authentication platform.
     * @returns A promise that resolves to the updated token data.
     * @memberof AuthentificationService
     */
    async updatePamTokenInAuthPlatform() {
        let pamCredentials = await this.getPamCredentials();
        if (!pamCredentials)
            throw new Error("No admin registered, register an admin and retry !");
        const { urlAdmin, clientId, tokenPamToAdmin } = pamCredentials;
        return axios_1.default.post(`${urlAdmin}/platforms/updatePlatformToken`, { clientId, token: tokenPamToAdmin }, {
            headers: { 'Content-Type': 'application/json' },
        }).then(async (result) => {
            if (result.data.error)
                throw new Error(result.data.error);
            await this._saveOrEditPamCredentials({ token: result.data.token });
            return result.data;
        });
    }
    /**
     * Saves or edits PAM credentials in the graph.
     *
     * @private
     * @param {*} bosCredential
     * @return {*}  {Promise<IPamCredential>}
     * @memberof AuthentificationService
     */
    async _saveOrEditPamCredentials(bosCredential) {
        const context = await (0, authPlatformUtils_1.getOrCreateContext)(this.graph, constant_1.PAM_CREDENTIAL_CONTEXT_NAME, constant_1.PAM_CREDENTIAL_CONTEXT_TYPE);
        // Map the keys of bosCredential to the keys used in the graph context
        const keysUsedInGraph = {
            token: "tokenPamToAdmin",
            TokenBosAdmin: "tokenPamToAdmin",
            name: "pamName",
            id: "idPlateform",
            url: "urlAdmin",
            clientId: "clientId"
        };
        for (const key in bosCredential) {
            if (bosCredential.hasOwnProperty(key)) {
                const mappedKey = keysUsedInGraph[key];
                if (mappedKey && bosCredential[key] !== undefined) {
                    const value = bosCredential[key];
                    if (typeof context.info[mappedKey] === "undefined")
                        context.info.add_attr({ [mappedKey]: value });
                    else
                        context.info[mappedKey].set(value);
                }
            }
        }
        return context.info.get();
    }
    /**
     * Disconnects the PAM platform from the authentication platform.
     * @returns A promise that resolves to an object indicating whether the disconnection was successful.
     * @memberof AuthentificationService
     */
    async disconnectPamFromAuthPlateform() {
        // send disconnect request to authAdmin platform
        await this.deletePamCredentialsFromGraph();
        await this.deleteAuthCredentialsFromGraph();
        return { removed: true };
    }
    /**
     * Deletes PAM credentials from the graph.
     * @private
     * @return {*}  {Promise<void>}
     * @memberof AuthentificationService
     */
    async deletePamCredentialsFromGraph() {
        let context = await this.graph.getContext(constant_1.PAM_CREDENTIAL_CONTEXT_NAME);
        if (context)
            return context.removeFromGraph();
    }
    /**
     * Deletes Auth Platform credentials from the graph.
     * @private
     * @return {*}  {Promise<void>}
     * @memberof AuthentificationService
     */
    async deleteAuthCredentialsFromGraph() {
        let adminContext = await this.graph.getContext(constant_1.ADMIN_CREDENTIAL_CONTEXT_NAME);
        if (adminContext)
            await adminContext.removeFromGraph();
    }
    /**
     * Creates a new token for the admin server and saves it in the graph.
     * @return {*}  {Promise<IAdminCredential>}
     * @memberof AuthentificationService
     */
    async createAuthPlatformCredentials() {
        await this.deleteAuthCredentialsFromGraph(); // Ensure no previous credentials exist
        const clientId = (0, uuid_1.v4)();
        const token = jwt.sign({ clientId, type: 'ADMIN SERVER' }, tokenKey); // Generate a new token for the admin server
        return this.saveOrEditAuthCredentials({ idPlatformOfAdmin: clientId, TokenAdminToPam: token });
    }
    /**
     * Creates a new (or update if exists) the auth plateform credentials in the graph.
     * @return {*}  {Promise<IAdminCredential>}
     * @memberof AuthentificationService
     */
    async saveOrEditAuthCredentials(authCredentials) {
        const context = await (0, authPlatformUtils_1.getOrCreateContext)(this.graph, constant_1.ADMIN_CREDENTIAL_CONTEXT_NAME, constant_1.ADMIN_CREDENTIAL_CONTEXT_TYPE);
        for (const key in authCredentials) {
            if (authCredentials.hasOwnProperty(key)) {
                const value = authCredentials[key];
                if (typeof context.info[key] === "undefined")
                    context.info.add_attr({ [key]: value });
                else
                    context.info[key].set(value);
            }
        }
        return authCredentials;
    }
    /**
     * Retrieves Auth Platform credentials from the graph.
     * @returns A promise that resolves to the admin credentials, or undefined if not found.
     * @memberof AuthentificationService
     */
    async getAuthCredentials() {
        let context = await this.graph.getContext(constant_1.ADMIN_CREDENTIAL_CONTEXT_NAME);
        if (!context)
            return;
        return context.info.get();
    }
    /**
     * Sends PAM informations (profiles list, organ list) to the authentication platform.
     *
     * @param {boolean} [update=false]
     * @return {*}
     * @memberof AuthentificationService
     */
    async sendPamInfoToAuth(update = false) {
        const pamCredential = await this.getPamCredentials();
        if (!pamCredential)
            throw new Error("No auth platform registered, register one and retry !");
        const authCredential = await this._getOrCreateAdminCredential(true); // create admin credential if not exist;
        if (!authCredential)
            throw new Error("No admin registered, register an admin and retry !");
        const data = await (0, authPlatformUtils_1.getRequestBody)(update, pamCredential, authCredential);
        if (pamCredential.urlAdmin.endsWith("/"))
            pamCredential.urlAdmin = pamCredential.urlAdmin.replace(/\/$/, () => "");
        return axios_1.default.put(`${pamCredential.urlAdmin}/register`, data, {
            headers: { 'Content-Type': 'application/json' },
        }).catch(async (err) => {
            if (err.response.status === constant_1.HTTP_CODES.UNAUTHORIZED) { // if the token is expired
                await this.updatePamTokenInAuthPlatform(); // update the token of the platform in authAdmin
                return this.sendPamInfoToAuth(update); // try again to send data
            }
            throw err;
        });
    }
    /**
     * Retrieves or creates admin credentials.
     * @private
     * @param {boolean} [createIfNotExist=false]
     * @return {*}  {Promise<IAdminCredential>}
     * @memberof AuthentificationService
     */
    async _getOrCreateAdminCredential(createIfNotExist = false) {
        const credentials = await this.getAuthCredentials();
        if (credentials)
            return credentials;
        if (createIfNotExist)
            return this.createAuthPlatformCredentials();
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