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

import { IAdminCredential, IPamCredential, IUserCredential, IUserToken } from "../interfaces";
import axios from "axios";
import { SpinalGraph } from "spinal-env-viewer-graph-service";
import { ADMIN_CREDENTIAL_CONTEXT_NAME, ADMIN_CREDENTIAL_CONTEXT_TYPE, PAM_CREDENTIAL_CONTEXT_NAME, PAM_CREDENTIAL_CONTEXT_TYPE, HTTP_CODES } from "../constant";
import { v4 as uuidv4 } from 'uuid';
import { UserListService } from "./userList.services";
import { getRequestBody, getOrCreateContext } from "../utils/authPlatformUtils";


const tokenKey = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
const jwt = require('jsonwebtoken');


export class AuthentificationService {
    private static instance: AuthentificationService;
    public authPlatformIsConnected: boolean = false;
    graph: SpinalGraph;

    private constructor() { }

    public static getInstance(): AuthentificationService {
        if (!this.instance) this.instance = new AuthentificationService();
        return this.instance;
    }

    async init(graph: SpinalGraph) {
        this.graph = graph;
    }


    /**
     * Authenticates a user based on the provided credentials.
     *
     * @param userCredential - The credentials of the user to authenticate.
     * @returns A promise that resolves to an object containing a status code and either a string or a token object (`IUserToken`).
     */
    public async authenticate(userCredential: IUserCredential): Promise<{ code: number; data: string | IUserToken }> {
        return UserListService.getInstance().authenticateUser(userCredential);
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
    public registerPamInAuthPlatform(authApiUrl: string, clientId: string, clientSecret: string): Promise<IPamCredential> {

        // Ensure the URL starts with http:// or https://
        if (!authApiUrl || !(/^https?:\/\//.test(authApiUrl))) throw new Error("AUTH_SERVER_URL is not valid!");
        if (!clientId) throw new Error("AUTH_CLIENT_ID is not valid!");
        if (!clientSecret) throw new Error("AUTH_CLIENT_SECRET is not valid!");


        authApiUrl = authApiUrl.endsWith("/") ? authApiUrl.replace(/\/$/, () => "") : authApiUrl; // Ensure the URL ends with a slash

        return axios.post(authApiUrl + "/register", { clientId, clientSecret }).then((result) => {
            this.authPlatformIsConnected = true;
            const responseData = Object.assign({}, result.data, { url: authApiUrl, clientId });

            // save PAM credential in the graph, it will be used to send data to auth platform
            return this._saveOrEditPamCredentials(responseData);
        }).catch((e) => {
            this.authPlatformIsConnected = false;
            throw new Error(e.message);
        })
    }

    /**
 * Retrieves PAM authorization credentials from the graph.
 * @description authorization credentials are used to authenticate the PAM platform in the authAdmin platform.
 * @return {*}  {Promise<IPamCredential>}
 * @memberof AuthentificationService
 */
    public async getPamCredentials(): Promise<IPamCredential> {
        let context = await this.graph.getContext(PAM_CREDENTIAL_CONTEXT_NAME);
        if (!context) return;

        return context.info.get();
    }


    /**
     * Updates the PAM token in the authentication platform.
     * @returns A promise that resolves to the updated token data.
     * @memberof AuthentificationService
     */
    public async updatePamTokenInAuthPlatform(): Promise<{ token: string; code: number }> {
        let pamCredentials = await this.getPamCredentials();

        if (!pamCredentials) throw new Error("No admin registered, register an admin and retry !");

        const { urlAdmin, clientId, tokenPamToAdmin } = pamCredentials;

        return axios.post(`${urlAdmin}/platforms/updatePlatformToken`, { clientId, token: tokenPamToAdmin }, {
            headers: { 'Content-Type': 'application/json' },
        }).then(async (result) => {
            if (result.data.error) throw new Error(result.data.error);

            await this._saveOrEditPamCredentials({ token: result.data.token });
            return result.data;
        })
    }

    /**
     * Saves or edits PAM credentials in the graph.
     *
     * @private
     * @param {*} bosCredential
     * @return {*}  {Promise<IPamCredential>}
     * @memberof AuthentificationService
     */
    private async _saveOrEditPamCredentials(bosCredential: any): Promise<IPamCredential> {
        const context = await getOrCreateContext(this.graph, PAM_CREDENTIAL_CONTEXT_NAME, PAM_CREDENTIAL_CONTEXT_TYPE);

        // Map the keys of bosCredential to the keys used in the graph context
        const keysUsedInGraph = {
            token: "tokenPamToAdmin",
            TokenBosAdmin: "tokenPamToAdmin",
            name: "pamName",
            id: "idPlateform",
            url: "urlAdmin",
            clientId: "clientId"
        } as const;

        for (const key in bosCredential) {
            if (bosCredential.hasOwnProperty(key)) {
                const mappedKey = keysUsedInGraph[key];
                if (mappedKey && bosCredential[key] !== undefined) context.info.mod_attr(mappedKey, bosCredential[key]);
            }
        }

        return context.info.get();
    }


    /**
     * Disconnects the PAM platform from the authentication platform.
     * @returns A promise that resolves to an object indicating whether the disconnection was successful.
     * @memberof AuthentificationService
     */
    public async disconnectPamFromAuthPlateform() {

        // send disconnect request to authAdmin platform


        await this.deletePamCredentialsFromGraph();
        await this.deleteAuthCredentialsFromGraph();

        return { removed: true }
    }

    /**
     * Deletes PAM credentials from the graph.
     * @private
     * @return {*}  {Promise<void>}
     * @memberof AuthentificationService
     */
    private async deletePamCredentialsFromGraph(): Promise<void> {
        let context = await this.graph.getContext(PAM_CREDENTIAL_CONTEXT_NAME);
        if (context) return context.removeFromGraph();
    }



    /**
     * Deletes Auth Platform credentials from the graph.
     * @private
     * @return {*}  {Promise<void>}
     * @memberof AuthentificationService
     */
    private async deleteAuthCredentialsFromGraph() {
        let adminContext = await this.graph.getContext(ADMIN_CREDENTIAL_CONTEXT_NAME);
        if (!adminContext) await adminContext.removeFromGraph();
    }



    /**
     * Creates a new token for the admin server and saves it in the graph.
     * @return {*}  {Promise<IAdminCredential>}
     * @memberof AuthentificationService
     */
    public async createAuthPlatformCredentials(): Promise<IAdminCredential> {

        await this.deleteAuthCredentialsFromGraph(); // Ensure no previous credentials exist

        const clientId = uuidv4();
        const token = jwt.sign({ clientId, type: 'ADMIN SERVER' }, tokenKey); // Generate a new token for the admin server

        return this.saveOrEditAuthCredentials({ idPlatformOfAdmin: clientId, TokenAdminToPam: token })
    }

    /**
     * Creates a new (or update if exists) the auth plateform credentials in the graph.
     * @return {*}  {Promise<IAdminCredential>}
     * @memberof AuthentificationService
     */
    public async saveOrEditAuthCredentials(authCredentials: IAdminCredential): Promise<IAdminCredential> {
        const context = await getOrCreateContext(this.graph, ADMIN_CREDENTIAL_CONTEXT_NAME, ADMIN_CREDENTIAL_CONTEXT_TYPE);

        for (const key in authCredentials) {
            if (authCredentials.hasOwnProperty(key)) {
                const value = authCredentials[key];
                context.info.mod_attr(key, value);
            }
        }

        return authCredentials;
    }


    /**
     * Retrieves Auth Platform credentials from the graph.
     * @returns A promise that resolves to the admin credentials, or undefined if not found.
     * @memberof AuthentificationService
     */
    public async getAuthCredentials(): Promise<IAdminCredential> {
        let context = await this.graph.getContext(ADMIN_CREDENTIAL_CONTEXT_NAME);
        if (!context) return;

        return context.info.get();
    }


    /**
     * Sends PAM informations (profiles list, organ list) to the authentication platform. 
     * 
     * @param {boolean} [update=false]
     * @return {*} 
     * @memberof AuthentificationService
     */
    public async sendPamInfoToAuth(update: boolean = false) {
        const pamCredential = await this.getPamCredentials();
        if (!pamCredential) throw new Error("No auth platform registered, register one and retry !");

        const authCredential = await this.getAuthCredentials();
        if (!authCredential) throw new Error("No admin registered, register an admin and retry !");


        const data = await getRequestBody(update, pamCredential, authCredential);

        if (pamCredential.urlAdmin.endsWith("/"))
            pamCredential.urlAdmin = pamCredential.urlAdmin.replace(/\/$/, () => "")

        return axios.put(`${pamCredential.urlAdmin}/register`, data, {
            headers: { 'Content-Type': 'application/json' },
        }).catch(async (err) => {
            if (err.response.status === HTTP_CODES.UNAUTHORIZED) { // if the token is expired
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
    private async _getOrCreateAdminCredential(createIfNotExist: boolean = false): Promise<IAdminCredential> {
        const credentials = await this.getAuthCredentials();
        if (credentials) return credentials;

        if (createIfNotExist) return this.createAuthPlatformCredentials();
    }

}


