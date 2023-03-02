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
exports.AppListService = void 0;
const axios_1 = require("axios");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
const token_service_1 = require("./token.service");
const authentification_service_1 = require("./authentification.service");
class AppListService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new AppListService();
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.APP_LIST_CONTEXT_NAME);
            if (!this.context) {
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.APP_LIST_CONTEXT_NAME, constant_1.APP_LIST_CONTEXT_TYPE);
            }
            return this.context;
        });
    }
    authenticateApplication(application) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminCredential = yield this._getAuthPlateformInfo();
            const url = `${adminCredential.urlAdmin}/applications/login`;
            return axios_1.default.post(url, application).then((result) => __awaiter(this, void 0, void 0, function* () {
                const data = result.data;
                data.profile = yield this._getProfileInfo(data.token, adminCredential);
                data.userInfo = yield this._getApplicationInfo(data.userId, adminCredential, data.token);
                const type = constant_1.USER_TYPES.APP;
                const info = { clientId: application.clientId, type, userType: type };
                const node = yield this._addUserToContext(info);
                yield token_service_1.TokenService.getInstance().addUserToken(node, data.token, data);
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
    _addUserToContext(info, element) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.context.getChildrenInContext();
            const found = users.find(el => { var _a; return ((_a = el.info.clientId) === null || _a === void 0 ? void 0 : _a.get()) === info.clientId; });
            if (found)
                return found;
            const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, element);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
            return this.context.addChildInContext(node, constant_1.CONTEXT_TO_APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    _getProfileInfo(userToken, adminCredential) {
        let urlAdmin = adminCredential.urlAdmin;
        let endpoint = "/tokens/getAppProfileByToken";
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
    _getApplicationInfo(applicationId, adminCredential, userToken) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // "x-access-token": adminCredential.tokenBosAdmin
                "x-access-token": userToken
            },
        };
        return axios_1.default.get(`${adminCredential.urlAdmin}/application/${applicationId}`, config).then((result) => {
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
}
exports.AppListService = AppListService;
//# sourceMappingURL=appList.services.js.map