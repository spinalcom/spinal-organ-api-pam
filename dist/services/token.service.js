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
exports.TokenService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const adminProfile_service_1 = require("./adminProfile.service");
const jwt = require("jsonwebtoken");
const globalCache = require("global-cache");
class TokenService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new TokenService();
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.TOKEN_LIST_CONTEXT_NAME);
            if (this.context)
                return this.context;
            this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.TOKEN_LIST_CONTEXT_NAME, constant_1.TOKEN_LIST_CONTEXT_TYPE);
            return this.context;
        });
    }
    addUserToken(userNode, token, playload) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenNode = yield this.addTokenToContext(token, playload);
            yield userNode.addChild(tokenNode, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
            return playload;
        });
    }
    getAdminPlayLoad(userNode, secret, durationInMin) {
        return __awaiter(this, void 0, void 0, function* () {
            const playload = {
                userInfo: userNode.info.get()
            };
            durationInMin = durationInMin || 7 * 24 * 60 * 60; // par default 7jrs
            const key = secret || this._generateString(15);
            const token = jwt.sign(playload, key, { expiresIn: durationInMin });
            const adminProfile = yield adminProfile_service_1.AdminProfileService.getInstance().getAdminProfile();
            const now = Date.now();
            playload.createdToken = now;
            playload.expieredToken = now + (durationInMin * 60 * 1000);
            playload.userId = userNode.getId().get();
            playload.token = token;
            playload.profile = {
                profileId: adminProfile.getId().get()
            };
            return playload;
        });
    }
    addTokenToContext(token, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = new spinal_env_viewer_graph_service_1.SpinalNode(token, constant_1.TOKEN_TYPE, new spinal_core_connectorjs_type_1.Model(data));
            const child = yield this.context.addChildInContext(node, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
            globalCache.set(data.token, data);
            return child;
        });
    }
    getTokenData(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = globalCache.get(token);
            if (data)
                return data;
            const found = yield this.context.getChild((node) => node.getName().get() === token, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
            if (!found)
                return;
            const element = yield found.getElement(true);
            if (element) {
                globalCache.set(token, element.get());
                return element.get();
            }
        });
    }
    deleteToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = token instanceof spinal_env_viewer_graph_service_1.SpinalNode ? token : yield this.context.getChild((node) => node.getName().get() === token, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
            if (!found)
                return true;
            try {
                yield this.context.removeChild(found, constant_1.TOKEN_RELATION_NAME, constant_1.PTR_LST_TYPE);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    tokenIsValid(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getTokenData(token);
            const expirationTime = data === null || data === void 0 ? void 0 : data.expieredToken;
            const tokenExpired = expirationTime ? Date.now() >= expirationTime * 1000 : true;
            if (!data || tokenExpired)
                return;
            return data;
        });
    }
    //////////////////////////////////////////////////
    //                        PRIVATE               //
    //////////////////////////////////////////////////
    _generateString(length = 10) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*/-_@#&";
        let text = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            text += charset.charAt(Math.floor(Math.random() * n));
        }
        return text;
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map