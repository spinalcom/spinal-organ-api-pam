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
exports.UserListService = void 0;
const axios_1 = require("axios");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const bcrypt = require("bcrypt");
const fileLog = require("log-to-file");
const path = require("path");
const token_service_1 = require("./token.service");
const authentification_service_1 = require("./authentification.service");
const userProfile_service_1 = require("./userProfile.service");
const authorization_service_1 = require("./authorization.service");
class UserListService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new UserListService();
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.USER_LIST_CONTEXT_NAME);
            if (!this.context) {
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.USER_LIST_CONTEXT_NAME, constant_1.USER_LIST_CONTEXT_TYPE);
            }
            const info = { name: "admin", userName: "admin", password: this._generateString(15) };
            yield this.createAdminUser(info);
            return this.context;
        });
    }
    authenticateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.authAdmin(user);
            let isAdmin = true;
            if (data.code === constant_1.HTTP_CODES.INTERNAL_ERROR) {
                data = yield this.authUserViaAuthPlateform(user);
                isAdmin = false;
            }
            if (data.code === constant_1.HTTP_CODES.OK) {
                const type = isAdmin ? constant_1.USER_TYPES.ADMIN : constant_1.USER_TYPES.USER;
                const info = { name: user.userName, userName: user.userName, type, userType: type, userId: data.data.userId };
                const playload = data.data;
                const token = data.data.token;
                const node = yield this._addUserToContext(info);
                delete data.data.userInfo.password;
                yield token_service_1.TokenService.getInstance().addUserToken(node, token, playload);
            }
            return data;
        });
    }
    getUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.context.getChildren([constant_1.CONTEXT_TO_ADMIN_USER_RELATION, constant_1.CONTEXT_TO_USER_RELATION_NAME]);
            return users.find(el => { var _a, _b; return ((_a = el.info.userName) === null || _a === void 0 ? void 0 : _a.get()) === username || ((_b = el.info.userId) === null || _b === void 0 ? void 0 : _b.get()) === username; });
        });
    }
    ///////////////////////////////////////////////
    //              Favorite Apps                //
    ///////////////////////////////////////////////
    addFavoriteApp(userId, userProfileId, appIds, portofolioId, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(userId);
            if (!Array.isArray(appIds))
                appIds = [appIds];
            const authorizedApps = yield this._getAuthorizedApps(userProfileId, portofolioId, buildingId);
            const favoriteApp = yield this.getFavoriteApps(userId, portofolioId, buildingId);
            const authorizedAppsObj = this._convertListToObj(authorizedApps);
            const favoriteAppsObj = this._convertListToObj(favoriteApp);
            return appIds.reduce((prom, appId) => __awaiter(this, void 0, void 0, function* () {
                const list = yield prom;
                const app = authorizedAppsObj[appId];
                if (!app || favoriteAppsObj[appId])
                    return list;
                const reference = yield authorization_service_1.authorizationInstance._createNodeReference(app);
                reference.info.add_attr({ appId, portofolioId });
                if (buildingId)
                    reference.info.add_attr({ buildingId });
                yield user.addChild(reference, constant_1.USER_TO_FAVORITE_APP_RELATION, constant_1.PTR_LST_TYPE);
                list.push(app);
                return list;
            }), Promise.resolve([]));
        });
    }
    removeFavoriteApp(userId, userProfileId, appIds, portofolioId, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(appIds))
                appIds = [appIds];
            const user = yield this.getUser(userId);
            const favoriteApps = yield user.getChildren(constant_1.USER_TO_FAVORITE_APP_RELATION);
            const favoriteAppObj = this._convertListToObj(favoriteApps, "appId");
            return appIds.reduce((prom, appId) => __awaiter(this, void 0, void 0, function* () {
                const list = yield prom;
                try {
                    const app = favoriteAppObj[appId];
                    const element = yield app.getElement();
                    yield app.removeFromGraph();
                    list.push(element);
                }
                catch (error) { }
                return list;
            }), Promise.resolve([]));
        });
    }
    getFavoriteApps(userId, portofolioId, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(userId);
            if (!user)
                return [];
            const children = yield user.getChildren(constant_1.USER_TO_FAVORITE_APP_RELATION);
            return children.reduce((prom, el) => __awaiter(this, void 0, void 0, function* () {
                const list = yield prom;
                const portId = el.info.portofolioId ? el.info.portofolioId.get() : undefined;
                const buildId = el.info.buildingId ? el.info.buildingId.get() : undefined;
                if (portofolioId === portId && buildId == buildingId) {
                    const element = yield el.getElement(true);
                    if (element)
                        list.push(element);
                }
                return list;
            }), Promise.resolve([]));
        });
    }
    /////////////////////////////////////////////
    //                  ADMIN                  //
    /////////////////////////////////////////////
    createAdminUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const userName = (userInfo && userInfo.userName) || constant_1.ADMIN_USERNAME;
            const userExist = yield this.getAdminUser(userName);
            if (userExist)
                return;
            const password = (userInfo && userInfo.password) || this._generateString(16);
            fileLog(JSON.stringify({ userName, password }), path.resolve(__dirname, "../../.admin.log"));
            return this._addUserToContext({ name: userName, userName, type: constant_1.USER_TYPES.ADMIN, userType: constant_1.USER_TYPES.ADMIN }, new spinal_core_connectorjs_type_1.Model({ userName, password: yield this._hashPassword(password) }), true);
        });
    }
    getAdminUser(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.context.getChildren(constant_1.CONTEXT_TO_ADMIN_USER_RELATION);
            return children.find(el => el.info.userName.get() === userName);
        });
    }
    authAdmin(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this.getAdminUser(user.userName);
            if (!node)
                return { code: constant_1.HTTP_CODES.INTERNAL_ERROR, data: "bad username and/or password" };
            const element = yield node.getElement(true);
            const success = yield this._comparePassword(user.password, element.password.get());
            if (!success)
                return { code: constant_1.HTTP_CODES.UNAUTHORIZED, data: "bad username and/or password" };
            // await this._deleteUserToken(node);
            const res = yield token_service_1.TokenService.getInstance().getAdminPlayLoad(node);
            return { code: constant_1.HTTP_CODES.OK, data: res };
        });
    }
    authUserViaAuthPlateform(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminCredential = yield this._getAuthPlateformInfo();
            const url = `${adminCredential.urlAdmin}/users/login`;
            return axios_1.default.post(url, user).then((result) => __awaiter(this, void 0, void 0, function* () {
                const data = result.data;
                data.profile = yield this._getProfileInfo(data.token, adminCredential);
                data.userInfo = yield this._getUserInfo(data.userId, adminCredential, data.token);
                return {
                    code: constant_1.HTTP_CODES.OK,
                    data
                };
            })).catch(err => {
                console.error(err);
                return {
                    code: constant_1.HTTP_CODES.UNAUTHORIZED,
                    data: "bad credential"
                };
            });
        });
    }
    //////////////////////////////////////////////////
    //                    PRIVATE                   //
    //////////////////////////////////////////////////
    _addUserToContext(info, element, isAdmin = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.context.getChildrenInContext();
            const found = users.find(el => { var _a; return ((_a = el.info.userName) === null || _a === void 0 ? void 0 : _a.get()) === info.userName; });
            if (found)
                return found;
            const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, element);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
            const relationName = isAdmin ? constant_1.CONTEXT_TO_ADMIN_USER_RELATION : constant_1.CONTEXT_TO_USER_RELATION_NAME;
            return this.context.addChildInContext(node, relationName, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    _hashPassword(password, saltRounds = 10) {
        return bcrypt.hashSync(password, saltRounds);
    }
    _comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    _generateString(length = 10) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*/-_@#&";
        let text = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            text += charset.charAt(Math.floor(Math.random() * n));
        }
        return text;
    }
    _deleteUserToken(userNode) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield userNode.getChildren(constant_1.TOKEN_RELATION_NAME);
            const promises = tokens.map(token => token_service_1.TokenService.getInstance().deleteToken(token));
            return Promise.all(promises);
        });
    }
    _getAuthorizedApps(userProfileId, portofolioId, buildingId) {
        const userProfileInstance = userProfile_service_1.UserProfileService.getInstance();
        return buildingId
            ? userProfileInstance.getAuthorizedBosApp(userProfileId, portofolioId, buildingId)
            : userProfileInstance.getAuthorizedPortofolioApp(userProfileId, portofolioId);
    }
    _getProfileInfo(userToken, adminCredential, isUser = true) {
        let urlAdmin = adminCredential.urlAdmin;
        let endpoint = "/tokens/getUserProfileByToken";
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
    _getAuthPlateformInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const adminCredential = yield authentification_service_1.AuthentificationService.getInstance().getPamToAdminCredential();
            if (!adminCredential)
                throw new Error("No authentication platform is registered");
            return adminCredential;
        });
    }
    _convertListToObj(liste, key = "id") {
        return liste.reduce((obj, item) => {
            var _a;
            const id = (_a = item.info[key]) === null || _a === void 0 ? void 0 : _a.get();
            if (id)
                obj[id] = item;
            return obj;
        }, {});
    }
}
exports.UserListService = UserListService;
//# sourceMappingURL=userList.services.js.map