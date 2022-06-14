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
exports.AppsController = void 0;
const services_1 = require("../../../services");
const appServiceInstance = services_1.AppService.getInstance();
class AppsController {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AppsController();
        }
        return this.instance;
    }
    createAppCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const appCategory = yield appServiceInstance.createAppCategory(name);
                return res.status(200).send(appCategory.info.get());
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    getAppCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const appCategory = yield appServiceInstance.getAppCategory(id);
                if (appCategory)
                    return res.status(200).send(appCategory.info.get());
                return res.status(404).send(`no category found for ${id}`);
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield appServiceInstance.getAllCategories();
                if (categories)
                    return res.status(200).send(categories.map(el => el.info.get()));
                return res.status(200).send([]);
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    updateAppCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name } = req.body;
                const categoryUpdated = yield appServiceInstance.updateAppCategory(id, name);
                if (categoryUpdated)
                    return res.status(200).send(categoryUpdated.info.get());
                return res.status(404).send(`no category found for ${id}`);
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    deleteAppCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield appServiceInstance.deleteAppCategory(id);
                return res.status(200).send("app category deleted");
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    createAppGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const { name } = req.body;
                const appGroup = yield appServiceInstance.createAppGroup(categoryId, name);
                return res.status(200).send(appGroup.info.get());
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    getAllGroupsInCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const groups = yield appServiceInstance.getAllGroupsInCategory(categoryId);
                if (groups)
                    return res.status(200).send(groups.map(el => el.info.get()));
                return res.status(200).send([]);
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    getAppGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, groupId } = req.params;
                const appGroup = yield appServiceInstance.getAppGroup(categoryId, groupId);
                if (appGroup)
                    return res.status(200).send(appGroup.info.get());
                return res.status(404).send(`no group found for ${groupId}`);
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    updateAppGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, groupId } = req.params;
                const { name } = req.body;
                const groupUpdated = yield appServiceInstance.updateAppGroup(categoryId, groupId, name);
                if (groupUpdated)
                    return res.status(200).send(groupUpdated.info.get());
                return res.status(404).send(`no group found for ${groupId}`);
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    deleteAppGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, groupId } = req.params;
                yield appServiceInstance.deleteAppGroup(categoryId, groupId);
                return res.status(200).send("app group deleted");
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    createApp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, groupId } = req.params;
                const data = req.body;
                const app = yield appServiceInstance.createApp(categoryId, groupId, data);
                return res.status(200).send(app.info.get());
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    getAllAppsInGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    const { categoryId, groupId } = req.params;
                    const apps = yield appServiceInstance.getAllAppsInGroup(categoryId, groupId);
                    if (apps)
                        return res.status(200).send(apps.map(el => el.info.get()));
                    return res.status(200).send([]);
                }
                catch (error) {
                    return res.status(500).send(error.message);
                }
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    getAllApps(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apps = yield appServiceInstance.getAllApps();
                return res.status(200).send(apps.map(el => el.info.get()));
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    getAppById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const app = yield appServiceInstance.getAppById(id);
                if (app)
                    return res.status(200).send(app.info.get());
                return res.status(404).send(`no app find for ${id}`);
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    getApp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, groupId, appId } = req.params;
                const app = yield appServiceInstance.getApp(categoryId, groupId, appId);
                if (app)
                    return res.status(200).send(app.info.get());
                return res.status(404).send(`no App found for ${appId}`);
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    updateApp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, groupId, appId } = req.params;
                const data = req.body;
                const appUpdated = yield appServiceInstance.updateApp(categoryId, groupId, appId, data);
                if (appUpdated)
                    return res.status(200).send(appUpdated.info.get());
                return res.status(404).send(`no app found for ${appId}`);
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    deleteApp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, groupId, appId } = req.params;
                yield appServiceInstance.deleteApp(categoryId, groupId, appId);
                return res.status(200).send("app deleted");
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
}
exports.AppsController = AppsController;
exports.default = AppsController.getInstance();
//# sourceMappingURL=apps.controller.js.map