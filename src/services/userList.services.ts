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
import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { USER_LIST_CONTEXT_TYPE, USER_LIST_CONTEXT_NAME, ADMIN_USERNAME, PTR_LST_TYPE, CONTEXT_TO_ADMIN_USER_RELATION, HTTP_CODES, CONTEXT_TO_USER_RELATION_NAME, USER_TO_FAVORITE_APP_RELATION } from "../constant";
import { IUserCredential, IUserToken } from "../interfaces";
import * as fileLog from "log-to-file";
import * as path from "path";
import { TokenService } from "./token.service";
import { authorizationInstance } from "./authorization.service";
import { _convertListToObj, comparePassword, createNewUserNode, filterReferenceNodes, generatePassword, getAuthorizedAppsAsObj, getPamCredentials, getProfileInfo, getUserInfo, getUserInfoByToken } from "../utils/userListUtils";
import { getOriginalNodeFromReference } from "../utils/authorizationUtils";


export class UserListService {
    private static instance: UserListService;
    public context: SpinalContext;

    private constructor() { }

    public static getInstance(): UserListService {
        if (!this.instance) this.instance = new UserListService();
        return this.instance;
    }

    public async init(graph: SpinalGraph): Promise<SpinalContext> {
        this.context = await graph.getContext(USER_LIST_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new SpinalContext(USER_LIST_CONTEXT_NAME, USER_LIST_CONTEXT_TYPE);
            this.context = await graph.addContext(spinalContext);
        }

        // check if admin user exists, if not create it
        await this._initAdminUser();

        return this.context;
    }


    /**
     * Authenticates a user. 
     * Currently, only admin user authentication is supported; 
     * regular user authentication is handled by the authentication platform.
     * @param userCredential - The user credentials.
     * @returns A promise resolving to an object containing the HTTP code and either the token data or an error message.
     */
    public async authenticateUser(userCredential: IUserCredential): Promise<{ code: number; data: string | IUserToken }> {
        return this.authenticateAdminUser(userCredential);

        /** 
         * If the user is not an admin, we will try to authenticate the user via the Auth platform.
         * commented because user authentication is now handled by authentication platform
        */
        // if (result.code === HTTP_CODES.OK) {
        //     const type = isAdmin ? USER_TYPES.ADMIN : USER_TYPES.USER;
        //     const info = { name: user.userName, userName: user.userName, type, userType: type, userId: data.data.userId }
        //     const playload = result.data;
        //     const token = result.data.token;
        //     const node = await this._addUserToContext(info);
        //     delete result.data.userInfo.password;
        //     await TokenService.getInstance().createToken(node, token, playload);
        // }

        // return result
    }

    /**
     * Retrieves a user node (admin or regular) by username or userId.
     * @param usernameOrId - The username or userId of the user to retrieve.
     * @returns A promise that resolves to the `SpinalNode` corresponding to the user,
     *          or `undefined` if no user with the given identifier is found.
     */
    public async getUser(usernameOrId: string): Promise<SpinalNode> {
        const users = await this.context.getChildren([CONTEXT_TO_ADMIN_USER_RELATION, CONTEXT_TO_USER_RELATION_NAME]);
        return users.find(el => el.info.userName?.get() === usernameOrId || el.info.userId?.get() === usernameOrId);
    }

    ///////////////////////////////////////////////
    //              Favorite Apps                //
    ///////////////////////////////////////////////


    /**
     * Adds one or more applications to the list of a user's favorite apps.
     * Only apps that are authorized for the user's profile and not already in favorites will be added.
     * @param userId - The ID of the user.
     * @param userProfileId - The ID of the user's profile.
     * @param appIds - The application ID or array of application IDs to add as favorites.
     * @param portofolioId - The portfolio ID associated with the favorite.
     * @param buildingId - (Optional) The building ID associated with the favorite.
     * @returns A promise resolving to an array of SpinalNode objects representing the added favorite apps.
     */
    public async addAppToUserFavorite(userId: string, userProfileId: string, appIds: string | string[], portofolioId: string, buildingId?: string): Promise<SpinalNode[]> {
        const user = await this.getUser(userId);

        if (!Array.isArray(appIds)) appIds = [appIds];

        const authorizedAppsObj = await getAuthorizedAppsAsObj(userProfileId, portofolioId, buildingId);
        const favoriteApp = await this.getFavoriteApps(userId, portofolioId, buildingId);

        const favoriteAppsObj = _convertListToObj(favoriteApp);
        const promises = [];
        const apps = [];

        for (const appId of appIds) {
            const app = authorizedAppsObj[appId];
            if (!app || favoriteAppsObj[appId]) continue;

            const reference = await (authorizationInstance as any)._createNodeReference(app);
            reference.info.add_attr({ appId, portofolioId });
            if (buildingId) reference.info.add_attr({ buildingId });

            apps.push(app);
            promises.push(user.addChild(reference, USER_TO_FAVORITE_APP_RELATION, PTR_LST_TYPE));
        }

        return Promise.all(promises).then(() => apps);

        // return appIds.reduce(async (prom, appId) => {
        //     const list = await prom;
        //     const app = authorizedAppsObj[appId];
        //     if (!app || favoriteAppsObj[appId]) return list;

        //     const reference = await (authorizationInstance as any)._createNodeReference(app);
        //     reference.info.add_attr({ appId, portofolioId });
        //     if (buildingId) reference.info.add_attr({ buildingId });

        //     await user.addChild(reference, USER_TO_FAVORITE_APP_RELATION, PTR_LST_TYPE);
        //     list.push(app);

        //     return list;
        // }, Promise.resolve([]));

    }


    /**
     * Removes one or more applications from a user's list of favorite apps.
     * Only apps that are currently in the user's favorites will be removed.
     * @param userId - The ID of the user.
     * @param userProfileId - The ID of the user's profile.
     * @param appIds - The application ID or array of application IDs to remove from favorites.
     * @param portofolioId - The portfolio ID associated with the favorite.
     * @param buildingId - (Optional) The building ID associated with the favorite.
     * @returns A promise resolving to an array of removed SpinalNode objects.
     */
    public async removeFavoriteApp(userId: string, userProfileId: string, appIds: string | string[], portofolioId: string, buildingId?: string): Promise<SpinalNode[]> {
        if (!Array.isArray(appIds)) appIds = [appIds];

        const user = await this.getUser(userId);
        const favoriteApps = await user.getChildren(USER_TO_FAVORITE_APP_RELATION);
        const favoriteAppObj = _convertListToObj(favoriteApps, "appId");

        const promises = [];

        for (const appId of appIds) {
            const app = favoriteAppObj[appId];
            if (!app) continue;

            promises.push(app.removeFromGraph().then(() => getOriginalNodeFromReference(app)));

        }

        return Promise.all(promises).then((result) => {
            return result;
        })

        // return appIds.reduce(async (prom, appId) => {
        //     const list = await prom;

        //     try {
        //         const app = favoriteAppObj[appId];
        //         const element = await app.getElement();
        //         await app.removeFromGraph();

        //         list.push(element);
        //     } catch (error) { }

        //     return list
        // }, Promise.resolve([]))

    }


    /**
     * Retrieves a user's favorite apps based on their userId, portfolioId, and optionally buildingId.
     * @param userId - The ID of the user.
     * @param portofolioId - The portfolio ID associated with the favorite apps.
     * @param buildingId - (Optional) The building ID associated with the favorite apps.
     * @returns A promise resolving to an array of SpinalNode objects representing the user's favorite apps.
     */
    public async getFavoriteApps(userId: string, portofolioId: string, buildingId?: string): Promise<SpinalNode[]> {
        const user = await this.getUser(userId);
        if (!user) return [];

        const favoriteAppsReferences = await user.getChildren(USER_TO_FAVORITE_APP_RELATION);
        const filteredApps = filterReferenceNodes(favoriteAppsReferences, portofolioId, buildingId);

        const promises = filteredApps.map(appRef => getOriginalNodeFromReference(appRef));
        return Promise.all(promises);

        // return children.reduce(async (prom, el) => {
        //     const list = await prom;
        //     const portId = el.info.portofolioId ? el.info.portofolioId.get() : undefined;
        //     const buildId = el.info.buildingId ? el.info.buildingId.get() : undefined;
        //     if (portofolioId === portId && buildId == buildingId) {
        //         const element = await el.getElement(true);
        //         if (element) list.push(element);
        //     }

        //     return list
        // }, Promise.resolve([]));
    }

    /////////////////////////////////////////////
    //                  ADMIN                  //
    /////////////////////////////////////////////




    /**
     * Initializes the admin user in the context if it does not exist.
     * @returns {Promise<SpinalNode>} The admin user node.
     */
    private async _initAdminUser(): Promise<SpinalNode> {
        const adminUser = await this.getAdminUser(ADMIN_USERNAME);
        if (adminUser) return adminUser;

        return this.createAdminUser();
    }

    /**
     * Creates the admin user node with a generated password and logs the credentials to a file.
     * @returns {Promise<SpinalNode>} The created admin user node.
     */
    public async createAdminUser(): Promise<SpinalNode> {
        const password = generatePassword(10);
        const userName = ADMIN_USERNAME;
        // add admin credential to ".admin.log" file
        fileLog(JSON.stringify({ userName, password }), path.resolve(__dirname, "../../.admin.log"));

        const userNode = await createNewUserNode(userName, password);

        return this.context.addChildInContext(userNode, CONTEXT_TO_ADMIN_USER_RELATION, PTR_LST_TYPE, this.context);
    }


    /**
     * Retrieves an admin user node by their username.
     *
     * @param userName - The username of the admin user to retrieve.
     * @returns A promise that resolves to the `SpinalNode` corresponding to the admin user,
     *          or `undefined` if no user with the given username is found.
     */
    public async getAdminUser(userName: string): Promise<SpinalNode> {
        const children = await this.context.getChildren(CONTEXT_TO_ADMIN_USER_RELATION);
        return children.find(el => el.info.userName.get() === userName);
    }


    /**
     * Authentifies an admin user by verifying the provided credentials.
     * @param userCredential - The credentials of the user attempting to authenticate.
     * @returns A promise resolving to an object containing the HTTP code and either the token data or an error message.
     */
    private async authenticateAdminUser(userCredential: IUserCredential): Promise<{ code: number; data: any | string }> {
        const userNode = await this.getAdminUser(userCredential.userName);
        if (!userNode) return { code: HTTP_CODES.NOT_FOUND, data: "bad username and/or password" };

        const element = await userNode.getElement(true);
        const realPassword = element.password?.get();

        const passwordIsCorrect = await comparePassword(userCredential.password, realPassword);
        if (!passwordIsCorrect) return { code: HTTP_CODES.UNAUTHORIZED, data: "bad username and/or password" };

        const tokenPlayLoad = await TokenService.getInstance().generateTokenForAdmin(userNode);
        return { code: HTTP_CODES.OK, data: tokenPlayLoad };

        // const tokenPlayLoad = await TokenService.getInstance().generateTokenForAdmin(userNode);
        // return { code: HTTP_CODES.OK, data: tokenPlayLoad };
    }


    /**
     * Authenticates a user via the authentication platform.
     * @param user - The user credentials to authenticate.
     * @returns A promise resolving to an object containing the HTTP code and user data or an error message.
     */
    public async authUserViaAuthPlateform(user: IUserCredential): Promise<{ code: HTTP_CODES; data: any }> {
        const adminCredential = await getPamCredentials();

        const url = `${adminCredential.urlAdmin}/users/login`;

        return axios.post(url, user).then(async (result) => {
            const data = this.getUserDataFormatted(result.data, adminCredential);

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


    /**
     * Retrieves user data and formats it by adding profile and user info.
     * @param data - The user data to format.
     * @param adminCredential - Optional admin credentials for fetching user info.
     * @param useToken - Whether to use the token for fetching user info.
     * @returns A promise resolving to the formatted user data.
     */
    public async getUserDataFormatted(data: any, adminCredential?: any, useToken: boolean = false) {
        adminCredential = adminCredential || await getPamCredentials();

        data.profile = await getProfileInfo(data.token, adminCredential);
        data.userInfo = await (useToken ? getUserInfoByToken(adminCredential, data.token) : getUserInfo(data.userId, adminCredential, data.token));

        return data;
    }


}