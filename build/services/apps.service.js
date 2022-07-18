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
exports.AppService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
class AppService {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AppService();
        }
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.APP_LIST_CONTEXT_NAME);
            if (!this.context)
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.APP_LIST_CONTEXT_NAME, constant_1.APP_LIST_CONTEXT_TYPE);
            return this.context;
        });
    }
    createAppCategory(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.getAppCategory(categoryName);
            if (found)
                throw new Error(`${categoryName} already exist`);
            const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name: categoryName, type: constant_1.APP_CATEGORY_TYPE }, undefined);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
            return this.context.addChildInContext(node, constant_1.CONTEXT_TO_APP_CATEGORY_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    getAppCategory(categoryIdOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(categoryIdOrName);
            if (node)
                return node;
            return this._findChildInContext(this.context, categoryIdOrName);
        });
    }
    getAllCategories() {
        return this.context.getChildrenInContext();
    }
    updateAppCategory(categoryId, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.getAppCategory(categoryId);
            if (!category)
                throw new Error(`no category found for ${categoryId}`);
            category.info.name.set(newName);
            return category;
        });
    }
    deleteAppCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.getAppCategory(categoryId);
            if (!category)
                throw new Error(`no category found for ${categoryId}`);
            yield category.removeFromGraph();
            return categoryId;
        });
    }
    createAppGroup(categoryId, groupName) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.getAppGroup(categoryId, groupName);
            if (found)
                throw new Error(`${groupName} already exist in ${categoryId}`);
            const category = yield this.getAppCategory(categoryId);
            const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({ name: groupName, type: constant_1.APP_GROUP_TYPE }, undefined);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
            return category.addChildInContext(node, constant_1.CATEGORY_TO_APP_GROUP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    getAllGroupsInCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.getAppCategory(categoryId);
            return category.getChildrenInContext(this.context);
        });
    }
    getAppGroup(categoryIdOrName, groupIdOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(groupIdOrName);
            if (node)
                return node;
            const category = yield this.getAppCategory(categoryIdOrName);
            if (!category)
                return;
            return this._findChildInContext(category, groupIdOrName);
        });
    }
    updateAppGroup(categoryId, groupId, groupNewName) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getAppGroup(categoryId, groupId);
            if (group) {
                group.info.name.set(groupNewName);
                return group;
            }
        });
    }
    deleteAppGroup(categoryId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getAppGroup(categoryId, groupId);
            if (group)
                group.removeFromGraph();
        });
    }
    createApp(categoryId, groupId, appInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.getAppCategory(categoryId);
            const group = yield this.getAppGroup(categoryId, groupId);
            if (category && group) {
                appInfo.categoryId = categoryId;
                appInfo.categoryName = category.getName();
                appInfo.groupId = groupId;
                appInfo.groupName = group.getName();
                appInfo.type = constant_1.APP_TYPE;
                const appId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(appInfo, undefined);
                const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appId);
                yield this.context.addChild(node, constant_1.CONTEXT_TO_APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
                return group.addChildInContext(node, constant_1.APP_GROUP_TO_APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
            }
            throw new Error("No group found for " + groupId);
        });
    }
    getAllApps() {
        return this.context.getChildren(constant_1.CONTEXT_TO_APP_RELATION_NAME);
    }
    getAllAppsInGroup(categoryId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.getAppGroup(categoryId, groupId);
            if (group) {
                return group.getChildrenInContext(this.context);
            }
            return [];
        });
    }
    getAppById(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appId);
            if (node)
                return node;
            const children = yield this.context.getChildren(constant_1.CONTEXT_TO_APP_RELATION_NAME);
            return children.find(el => el.getId().get() === appId);
        });
    }
    getApp(categoryId, groupId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appId);
            if (node)
                return node;
            const group = yield this.getAppGroup(categoryId, groupId);
            if (!group)
                return;
            return this._findChildInContext(group, appId);
        });
    }
    updateApp(categoryId, groupId, appId, newInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const appNode = yield this.getApp(categoryId, groupId, appId);
            if (appNode) {
                for (const key in newInfo) {
                    if (Object.prototype.hasOwnProperty.call(newInfo, key) && appNode.info[key]) {
                        const element = newInfo[key];
                        appNode.info[key].set(element);
                    }
                }
            }
            return appNode;
        });
    }
    deleteApp(categoryId, groupId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const appNode = yield this.getApp(categoryId, groupId, appId);
            if (appNode)
                appNode.removeFromGraph();
        });
    }
    _findChildInContext(startNode, nodeIdOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield startNode.getChildrenInContext(this.context);
            return children.find(el => {
                if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
                    //@ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(el);
                    return true;
                }
                return false;
            });
        });
    }
}
exports.AppService = AppService;
//# sourceMappingURL=apps.service.js.map