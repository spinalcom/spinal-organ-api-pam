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
exports.UserService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const bcrypt = require("bcrypt");
class UserService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new UserService();
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.USER_LIST_CONTEXT_NAME);
            if (this.context)
                return this.context;
            this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.USER_LIST_CONTEXT_NAME, constant_1.USER_LIST_CONTEXT_TYPE);
            const info = { userName: "admin", password: Math.random().toString(36).slice(-8) };
            yield this.createAdminUser(info);
            return this.context;
        });
    }
    createAdminUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const userName = (userInfo && userInfo.userName) || constant_1.ADMIN_USERNAME;
            const userExist = yield this.getAdminUser(userName);
            if (userExist)
                return;
            const password = (userInfo && userInfo.password) || Math.random().toString(36).slice(-8);
            if (userInfo.password)
                delete userInfo.password;
            userInfo.name = userName;
            userInfo.userName = userName;
            userInfo.type = constant_1.USER_TYPES.ADMIN;
            const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(userInfo, new spinal_core_connectorjs_type_1.Model({
                userName,
                password: yield this._hashPassword(password)
            }));
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
            return this.context.addChildInContext(node, constant_1.CONTEXT_TO_ADMIN_USER_RELATION, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    getAdminUser(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.context.getChildren(constant_1.CONTEXT_TO_ADMIN_USER_RELATION);
            return children.find(el => el.info.userName().get() === userName);
        });
    }
    loginAdmin(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this.getAdminUser(user.userName);
            if (!node)
                throw { code: constant_1.HTTP_CODES.UNAUTHORIZED, message: "bad username and/or password" };
            const element = yield node.getElement(true);
            const success = yield this._comparePassword(user.password, element.password.get());
            if (!success)
                throw { code: constant_1.HTTP_CODES.UNAUTHORIZED, message: "bad username and/or password" };
            // Ajouter un token;
        });
    }
    //////////////////////////////////////////////////
    //                        PRIVATE               //
    //////////////////////////////////////////////////
    _hashPassword(password, saltRounds = 10) {
        return bcrypt.hashSync(password, saltRounds);
    }
    _comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    linkUserT() {
    }
}
exports.UserService = UserService;
//# sourceMappingURL=users.services.js.map