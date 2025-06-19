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
import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { PTR_LST_TYPE, APP_CONNECTED_LIST_CONTEXT_TYPE, APP_CONNECTED_LIST_CONTEXT_NAME, CONTEXT_TO_APP_RELATION_NAME } from "../constant";
import { IAppCredential, IApplicationToken, IOAuth2Credential, IPamCredential } from "../interfaces";
import { AuthentificationService } from './authentification.service'
import { AuthError } from "../security/AuthError";


/**
 * Service class to manage the list of connected applications.
 * Handles initialization of the application context, authentication of applications,
 * and management of application nodes within the context.
 */
export class AppListService {
    private static instance: AppListService;
    public context: SpinalContext;

    private constructor() { }

    /**
     * Returns the singleton instance of AppListService.
     */
    public static getInstance(): AppListService {
        if (!this.instance) this.instance = new AppListService();
        return this.instance;
    }

    /**
     * Initializes the application context in the given graph.
     * Creates the context if it does not exist.
     * @param graph The SpinalGraph instance
     * @returns The initialized SpinalContext
     */
    public async init(graph: SpinalGraph): Promise<SpinalContext> {
        this.context = await graph.getContext(APP_CONNECTED_LIST_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new SpinalContext(APP_CONNECTED_LIST_CONTEXT_NAME, APP_CONNECTED_LIST_CONTEXT_TYPE);
            this.context = await graph.addContext(spinalContext);
        }

        return this.context;
    }

    /**
     * Authenticates an application using its credentials.
     * Adds the application to the context and stores its token.
     * @param application The application credentials
     * @returns An object containing the HTTP code and either the token data or an error message
     */
    public async authenticateApplication(application: IAppCredential | IOAuth2Credential): Promise<{ code: number; data: string | IApplicationToken }> {

        throw new AuthError(`This authentication method is deprecated. Please use the new authentication method.`);


        // const authPlatformInfo = await this._getAuthPlateformInfo();
        // const url = `${authPlatformInfo.urlAdmin}/applications/login`;
        // return axios.post(url, application).then(async (result) => {
        //     const data = result.data;
        //     data.profile = await this._getProfileInfoInAuth(data.token, authPlatformInfo);
        //     data.userInfo = await this._getApplicationInfoInAuth(data.applicationId, authPlatformInfo, data.token);

        //     const type = USER_TYPES.APP;
        //     const info = { name: data.userInfo?.name || application.clientId, applicationId: data.applicationId, clientId: application.clientId, type, userType: type }

        //     const node = await this._addApplicationToAppConnectedContext(info);
        //     await TokenService.getInstance().createToken(node, data.token, data);

        //     return {
        //         code: HTTP_CODES.OK,
        //         data
        //     }
        // }).catch(err => {
        //     console.error(err)
        //     return {
        //         code: HTTP_CODES.UNAUTHORIZED,
        //         data: "bad credential"
        //     }
        // })
    }


    //////////////////////////////////////////////////
    //                    PRIVATE                   //
    //////////////////////////////////////////////////

    /**
     * Adds an application node to the context.
     * Updates the node if it already exists.
     * @param info Information about the user/application
     * @param element Optional spinal.Model element
     * @returns The created or updated SpinalNode
     */
    private async _addApplicationToAppConnectedContext(info: { [key: string]: any }, element?: spinal.Model): Promise<SpinalNode> {
        const applications = await this.context.getChildrenInContext();

        const appFound = applications.find(app => app.info.clientId?.get() === info.clientId);

        if (appFound) {
            for (const key in info) {
                if (Object.prototype.hasOwnProperty.call(info, key)) {
                    const value = info[key];
                    if (typeof appFound.info[key] === "undefined") appFound.info.add_attr({ [key]: value });
                    if (appFound.info[key]) appFound.info[key].set(value);
                }
            }
            return appFound;
        }

        const appNodeId = SpinalGraphService.createNode(info, element); // use createNode to ensure element is created
        const appNode = SpinalGraphService.getRealNode(appNodeId);
        return this.context.addChildInContext(appNode, CONTEXT_TO_APP_RELATION_NAME, PTR_LST_TYPE, this.context);
    }

    /**
     * Retrieves the profile information for a given user token.
     * @param appToken The application's token
     * @param adminCredential The admin platform credentials
     * @returns The profile information object
     */
    private _getProfileInfoInAuth(appToken: string, adminCredential: IPamCredential) {
        let urlAdmin = adminCredential.urlAdmin;
        let endpoint = "/tokens/getAppProfileByToken";

        return axios.post(urlAdmin + endpoint, {
            platformId: adminCredential.idPlateform,
            token: appToken
        }).then((result) => {
            return result.data;
        }).catch(err => {
            return {};
        })
    }

    /**
     * Retrieves application information by its ID.
     * @param applicationId The application ID
     * @param adminCredential The admin platform credentials
     * @param userToken The user's token
     * @returns The application information object
     */
    private _getApplicationInfoInAuth(applicationId: string, adminCredential: IPamCredential, appToken: string) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": appToken
            },
        }
        return axios.get(`${adminCredential.urlAdmin}/applications/${applicationId}`, config).then((result) => {
            return result.data;
        }).catch((err) => {
            console.error(err);
        })
    }

    /**
     * Retrieves the authentication platform information from the AuthentificationService.
     * @returns The admin platform credentials
     * @throws Error if no authentication platform is registered
     */
    private async _getAuthPlateformInfo() {
        const adminCredential = await AuthentificationService.getInstance().getPamCredentials();
        if (!adminCredential) throw new Error("No authentication platform is registered");
        return adminCredential;
    }
}