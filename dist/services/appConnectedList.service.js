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
exports.AppListService = void 0;
const axios_1 = require("axios");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const authentification_service_1 = require("./authentification.service");
/**
 * Service class to manage the list of connected applications.
 * Handles initialization of the application context, authentication of applications,
 * and management of application nodes within the context.
 */
class AppListService {
    constructor() { }
    /**
     * Returns the singleton instance of AppListService.
     */
    static getInstance() {
        if (!this.instance)
            this.instance = new AppListService();
        return this.instance;
    }
    /**
     * Initializes the application context in the given graph.
     * Creates the context if it does not exist.
     * @param graph The SpinalGraph instance
     * @returns The initialized SpinalContext
     */
    async init(graph) {
        this.context = await graph.getContext(constant_1.APP_CONNECTED_LIST_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.APP_CONNECTED_LIST_CONTEXT_NAME, constant_1.APP_CONNECTED_LIST_CONTEXT_TYPE);
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
    async authenticateApplication(application) {
        // throw new AuthError(`This authentication method is deprecated. Please use the new authentication method.`);
        const authPlatformInfo = await this._getAuthPlateformInfo();
        const url = `${authPlatformInfo.urlAdmin}/applications/login`;
        return axios_1.default.post(url, application).then(async (result) => {
            const data = result.data;
            data.profile = await this._getProfileInfoInAuth(data.token, authPlatformInfo);
            data.userInfo = await this._getApplicationInfoInAuth(data.applicationId, authPlatformInfo, data.token);
            // const type = USER_TYPES.APP;
            // const info = { name: data.userInfo?.name || application.clientId, applicationId: data.applicationId, clientId: application.clientId, type, userType: type }
            // const node = await this._addApplicationToAppConnectedContext(info);
            // await TokenService.getInstance().addUserToken(node, data.token, data);
            return {
                code: constant_1.HTTP_CODES.OK,
                data
            };
        }).catch(err => {
            console.error(err);
            return {
                code: constant_1.HTTP_CODES.UNAUTHORIZED,
                data: "bad credential"
            };
        });
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
    async _addApplicationToAppConnectedContext(info, element) {
        const applications = await this.context.getChildrenInContext();
        const appFound = applications.find(app => app.info.clientId?.get() === info.clientId);
        if (appFound) {
            for (const key in info) {
                if (Object.prototype.hasOwnProperty.call(info, key)) {
                    const value = info[key];
                    if (typeof appFound.info[key] === "undefined")
                        appFound.info.add_attr({ [key]: value });
                    if (appFound.info[key])
                        appFound.info[key].set(value);
                }
            }
            return appFound;
        }
        const appNodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, element); // use createNode to ensure element is created
        const appNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appNodeId);
        return this.context.addChildInContext(appNode, constant_1.CONTEXT_TO_APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
    }
    /**
     * Retrieves the profile information for a given user token.
     * @param appToken The application's token
     * @param adminCredential The admin platform credentials
     * @returns The profile information object
     */
    _getProfileInfoInAuth(appToken, adminCredential) {
        let urlAdmin = adminCredential.urlAdmin;
        let endpoint = "/tokens/getAppProfileByToken";
        return axios_1.default.post(urlAdmin + endpoint, {
            platformId: adminCredential.idPlateform,
            token: appToken
        }).then((result) => {
            return result.data;
        }).catch(err => {
            return {};
        });
    }
    /**
     * Retrieves application information by its ID.
     * @param applicationId The application ID
     * @param adminCredential The admin platform credentials
     * @param userToken The user's token
     * @returns The application information object
     */
    _getApplicationInfoInAuth(applicationId, adminCredential, appToken) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": appToken
            },
        };
        return axios_1.default.get(`${adminCredential.urlAdmin}/applications/${applicationId}`, config).then((result) => {
            return result.data;
        }).catch((err) => {
            console.error(err);
        });
    }
    /**
     * Retrieves the authentication platform information from the AuthentificationService.
     * @returns The admin platform credentials
     * @throws Error if no authentication platform is registered
     */
    async _getAuthPlateformInfo() {
        const adminCredential = await authentification_service_1.AuthentificationService.getInstance().getPamCredentials();
        if (!adminCredential)
            throw new Error("No authentication platform is registered");
        return adminCredential;
    }
}
exports.AppListService = AppListService;
//# sourceMappingURL=appConnectedList.service.js.map