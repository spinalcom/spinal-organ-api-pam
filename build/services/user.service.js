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
exports.SpinalTwinAdminUser = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
class SpinalTwinAdminUser {
    createUser(user) {
        return this.findEmail(user.email)
            .then((exist) => __awaiter(this, void 0, void 0, function* () {
            if (exist) {
                return Promise.resolve(constant_1.USER_NOT_FOUND);
            }
            const userId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(user, undefined);
            user.id = userId;
            let context = yield configFile_service_1.configServiceInstance.getContext(constant_1.USER_LIST_CONTEXT_NAME);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(context.info.id.get(), userId, context.info.id.get(), constant_1.CONTEXT_TO_USER_RELATION_NAME, constant_1.PTR_LST_TYPE).then(() => {
                return Promise.resolve(user);
            });
        }))
            .catch((e) => {
            return Promise.resolve(e);
        });
    }
    getUserByID(id) { }
    getAllUser(contextId) { }
    getUser(id, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let context = yield configFile_service_1.configServiceInstance.getContext(constant_1.USER_LIST_CONTEXT_NAME);
            if (typeof email === 'string' && typeof password === 'string')
                return this.findUserWithEmailPassword(email, password);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(context.info.id.get(), [
                constant_1.CONTEXT_TO_USER_RELATION_NAME,
            ])
                .then((children) => {
                if (children.length < 0) {
                    return Promise.reject(constant_1.USER_BASE_EMPTY);
                }
                for (let i = 0; i < children.length; i = i + 1) {
                    if (children[i].hasOwnProperty('id') && children[i].id.get() === id) {
                        return Promise.resolve(children[i]);
                    }
                }
                return Promise.resolve(constant_1.USER_NOT_FOUND);
            })
                .catch((e) => {
                console.error(e);
                return Promise.resolve(e);
            });
        });
    }
    addNode(userId, childId, relationName, relationType) { }
    findEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            let context = yield configFile_service_1.configServiceInstance.getContext(constant_1.USER_LIST_CONTEXT_NAME);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(context.info.id.get(), [
                constant_1.CONTEXT_TO_USER_RELATION_NAME,
            ]).then((children) => {
                if (children.length < 0) {
                    return Promise.resolve(false);
                }
                for (let i = 0; i < children.length; i = i + 1) {
                    if (children[i].hasOwnProperty('email') &&
                        children[i].email.get() === email) {
                        return Promise.resolve(true);
                    }
                }
                return Promise.resolve(false);
            });
        });
    }
    findUserWithEmailPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let context = yield configFile_service_1.configServiceInstance.getContext(constant_1.USER_LIST_CONTEXT_NAME);
            return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildren(context.info.id.get(), [
                constant_1.CONTEXT_TO_USER_RELATION_NAME,
            ])
                .then((children) => {
                if (children.length < 0) {
                    return Promise.reject(constant_1.USER_BASE_EMPTY);
                }
                for (let i = 0; i < children.length; i = i + 1) {
                    if (children[i].hasOwnProperty('email') &&
                        children[i].email.get() === email &&
                        children[i].hasOwnProperty('password') &&
                        children[i].password.get() === password) {
                        return Promise.resolve(children[i]);
                    }
                }
                return Promise.resolve(constant_1.USER_NOT_FOUND);
            })
                .catch((e) => {
                console.error(e);
                return Promise.resolve(e);
            });
        });
    }
    addUserProfileToUser(userId, userProfileId) { }
    updateUser(user, userId) {
        if (typeof userId === 'undefined' || typeof user === 'undefined') {
            return;
        }
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(userId);
        if (node) {
            node.info.name.set(user.name);
            node.info.email.set(user.email);
            node.info.firstname.set(user.firstname);
            node.info.userProfileId.set(user.userProfileId);
        }
        return node;
    }
    deleteUser(userId) { }
}
exports.SpinalTwinAdminUser = SpinalTwinAdminUser;
//# sourceMappingURL=user.service.js.map