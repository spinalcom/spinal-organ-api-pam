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
exports.UserListService = void 0;
const axios_1 = require("axios");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const fileLog = require("log-to-file");
const path = require("path");
const token_service_1 = require("./token.service");
const authorization_service_1 = require("./authorization.service");
const userListUtils_1 = require("../utils/userListUtils");
const authorizationUtils_1 = require("../utils/authorizationUtils");
class UserListService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new UserListService();
        return this.instance;
    }
    async init(graph) {
        this.context = await graph.getContext(constant_1.USER_LIST_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.USER_LIST_CONTEXT_NAME, constant_1.USER_LIST_CONTEXT_TYPE);
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
    async authenticateUser(userCredential) {
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
    async getUser(usernameOrId) {
        const users = await this.context.getChildren([constant_1.CONTEXT_TO_ADMIN_USER_RELATION, constant_1.CONTEXT_TO_USER_RELATION_NAME]);
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
    async addAppToUserFavorite(userId, userProfileId, appIds, portofolioId, buildingId) {
        const user = await this.getUser(userId);
        if (!Array.isArray(appIds))
            appIds = [appIds];
        const authorizedAppsObj = await (0, userListUtils_1.getAuthorizedAppsAsObj)(userProfileId, portofolioId, buildingId);
        const favoriteApp = await this.getFavoriteApps(userId, portofolioId, buildingId);
        const favoriteAppsObj = (0, userListUtils_1._convertListToObj)(favoriteApp);
        const promises = [];
        const apps = [];
        for (const appId of appIds) {
            const app = authorizedAppsObj[appId];
            if (!app || favoriteAppsObj[appId])
                continue;
            const reference = await authorization_service_1.authorizationInstance._createNodeReference(app);
            reference.info.add_attr({ appId, portofolioId });
            if (buildingId)
                reference.info.add_attr({ buildingId });
            apps.push(app);
            promises.push(user.addChild(reference, constant_1.USER_TO_FAVORITE_APP_RELATION, constant_1.PTR_LST_TYPE));
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
    async removeFavoriteApp(userId, userProfileId, appIds, portofolioId, buildingId) {
        if (!Array.isArray(appIds))
            appIds = [appIds];
        const user = await this.getUser(userId);
        const favoriteApps = await user.getChildren(constant_1.USER_TO_FAVORITE_APP_RELATION);
        const favoriteAppObj = (0, userListUtils_1._convertListToObj)(favoriteApps, "appId");
        const promises = [];
        for (const appId of appIds) {
            const app = favoriteAppObj[appId];
            if (!app)
                continue;
            promises.push(app.removeFromGraph().then(() => (0, authorizationUtils_1.getOriginalNodeFromReference)(app)));
        }
        return Promise.all(promises).then((result) => {
            return result;
        });
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
    async getFavoriteApps(userId, portofolioId, buildingId) {
        const user = await this.getUser(userId);
        if (!user)
            return [];
        const favoriteAppsReferences = await user.getChildren(constant_1.USER_TO_FAVORITE_APP_RELATION);
        const filteredApps = (0, userListUtils_1.filterReferenceNodes)(favoriteAppsReferences, portofolioId, buildingId);
        const promises = filteredApps.map(appRef => (0, authorizationUtils_1.getOriginalNodeFromReference)(appRef));
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
    async _initAdminUser() {
        const adminUser = await this.getAdminUser(constant_1.ADMIN_USERNAME);
        if (adminUser)
            return adminUser;
        return this.createAdminUser();
    }
    /**
     * Creates the admin user node with a generated password and logs the credentials to a file.
     * @returns {Promise<SpinalNode>} The created admin user node.
     */
    async createAdminUser() {
        const password = (0, userListUtils_1.generatePassword)(10);
        const userName = constant_1.ADMIN_USERNAME;
        // add admin credential to ".admin.log" file
        fileLog(JSON.stringify({ userName, password }), path.resolve(__dirname, "../../.admin.log"));
        const userNode = await (0, userListUtils_1.createNewUserNode)(userName, password);
        return this.context.addChildInContext(userNode, constant_1.CONTEXT_TO_ADMIN_USER_RELATION, constant_1.PTR_LST_TYPE, this.context);
    }
    /**
     * Retrieves an admin user node by their username.
     *
     * @param userName - The username of the admin user to retrieve.
     * @returns A promise that resolves to the `SpinalNode` corresponding to the admin user,
     *          or `undefined` if no user with the given username is found.
     */
    async getAdminUser(userName) {
        const children = await this.context.getChildren(constant_1.CONTEXT_TO_ADMIN_USER_RELATION);
        return children.find(el => el.info.userName.get() === userName);
    }
    /**
     * Authentifies an admin user by verifying the provided credentials.
     * @param userCredential - The credentials of the user attempting to authenticate.
     * @returns A promise resolving to an object containing the HTTP code and either the token data or an error message.
     */
    async authenticateAdminUser(userCredential) {
        const userNode = await this.getAdminUser(userCredential.userName);
        if (!userNode)
            return { code: constant_1.HTTP_CODES.NOT_FOUND, data: "bad username and/or password" };
        const element = await userNode.getElement(true);
        const realPassword = element.password?.get();
        const passwordIsCorrect = await (0, userListUtils_1.comparePassword)(userCredential.password, realPassword);
        if (!passwordIsCorrect)
            return { code: constant_1.HTTP_CODES.UNAUTHORIZED, data: "bad username and/or password" };
        const tokenPlayLoad = await token_service_1.TokenService.getInstance().generateTokenForAdmin(userNode);
        return { code: constant_1.HTTP_CODES.OK, data: tokenPlayLoad };
        // const tokenPlayLoad = await TokenService.getInstance().generateTokenForAdmin(userNode);
        // return { code: HTTP_CODES.OK, data: tokenPlayLoad };
    }
    /**
     * Authenticates a user via the authentication platform.
     * @param user - The user credentials to authenticate.
     * @returns A promise resolving to an object containing the HTTP code and user data or an error message.
     */
    async authUserViaAuthPlateform(user) {
        const adminCredential = await (0, userListUtils_1.getPamCredentials)();
        const url = `${adminCredential.urlAdmin}/users/login`;
        return axios_1.default.post(url, user).then(async (result) => {
            const data = this.getUserDataFormatted(result.data, adminCredential);
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
    /**
     * Retrieves user data and formats it by adding profile and user info.
     * @param data - The user data to format.
     * @param adminCredential - Optional admin credentials for fetching user info.
     * @param useToken - Whether to use the token for fetching user info.
     * @returns A promise resolving to the formatted user data.
     */
    async getUserDataFormatted(data, adminCredential, useToken = false) {
        adminCredential = adminCredential || await (0, userListUtils_1.getPamCredentials)();
        data.profile = await (0, userListUtils_1.getProfileInfo)(data.token, adminCredential);
        data.userInfo = await (useToken ? (0, userListUtils_1.getUserInfoByToken)(adminCredential, data.token) : (0, userListUtils_1.getUserInfo)(data.userId, adminCredential, data.token));
        return data;
    }
}
exports.UserListService = UserListService;
//# sourceMappingURL=userList.services.js.map