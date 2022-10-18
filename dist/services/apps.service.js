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
exports.AppService = exports.AppsType = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const building_service_1 = require("./building.service");
const configFile_service_1 = require("./configFile.service");
const portofolio_service_1 = require("./portofolio.service");
const spinal_env_viewer_plugin_excel_manager_service_1 = require("spinal-env-viewer-plugin-excel-manager-service");
exports.AppsType = Object.freeze({
    admin: "admin",
    building: "building",
    portofolio: "portofolio"
});
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
    //////////////////////////////////
    //              CREATE          //
    //////////////////////////////////
    createAdminApp(appInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupNode = yield this._getApplicationGroupNode(constant_1.ADMIN_APPS_GROUP_NAME, constant_1.ADMIN_APPS_GROUP_TYPE, true);
            if (!groupNode)
                return;
            const children = yield groupNode.getChildren([constant_1.APP_RELATION_NAME]);
            const appExist = children.find(el => el.getName().get() === appInfo.name);
            if (appExist)
                return appExist;
            appInfo.type = constant_1.ADMIN_APP_TYPE;
            const appId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(appInfo, undefined);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appId);
            return groupNode.addChildInContext(node, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    createPortofolioApp(appInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupNode = yield this._getApplicationGroupNode(constant_1.PORTOFOLIO_APPS_GROUP_NAME, constant_1.PORTOFOLIO_APPS_GROUP_TYPE, true);
            if (!groupNode)
                return;
            const children = yield groupNode.getChildren([constant_1.APP_RELATION_NAME]);
            const appExist = children.find(el => el.getName().get() === appInfo.name);
            if (appExist)
                return appExist;
            appInfo.type = constant_1.PORTOFOLIO_APP_TYPE;
            const appId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(appInfo, undefined);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appId);
            return groupNode.addChildInContext(node, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    createBuildingApp(appInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupNode = yield this._getApplicationGroupNode(constant_1.BUILDING_APPS_GROUP_NAME, constant_1.BUILDING_APPS_GROUP_TYPE, true);
            if (!groupNode)
                return;
            const children = yield groupNode.getChildren([constant_1.APP_RELATION_NAME]);
            const appExist = children.find(el => el.getName().get() === appInfo.name);
            if (appExist)
                return appExist;
            appInfo.type = constant_1.BUILDING_APP_TYPE;
            const appId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(appInfo, undefined);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appId);
            return groupNode.addChildInContext(node, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    //////////////////////////////////
    //              GET             //
    //////////////////////////////////
    getAllAdminApps() {
        return __awaiter(this, void 0, void 0, function* () {
            const groupNode = yield this._getApplicationGroupNode(constant_1.ADMIN_APPS_GROUP_NAME, constant_1.ADMIN_APPS_GROUP_TYPE);
            if (!groupNode)
                return [];
            return groupNode.getChildren([constant_1.APP_RELATION_NAME]);
        });
    }
    getAllPortofolioApps() {
        return __awaiter(this, void 0, void 0, function* () {
            const groupNode = yield this._getApplicationGroupNode(constant_1.PORTOFOLIO_APPS_GROUP_NAME, constant_1.PORTOFOLIO_APPS_GROUP_TYPE);
            if (!groupNode)
                return [];
            return groupNode.getChildren([constant_1.APP_RELATION_NAME]);
        });
    }
    getAllBuildingApps() {
        return __awaiter(this, void 0, void 0, function* () {
            const groupNode = yield this._getApplicationGroupNode(constant_1.BUILDING_APPS_GROUP_NAME, constant_1.BUILDING_APPS_GROUP_TYPE);
            if (!groupNode)
                return [];
            return groupNode.getChildren([constant_1.APP_RELATION_NAME]);
        });
    }
    getAdminApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.getAllAdminApps();
            return children.find(el => el.getId().get() === appId);
        });
    }
    getPortofolioApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.getAllPortofolioApps();
            return children.find(el => el.getId().get() === appId);
        });
    }
    getBuildingApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.getAllBuildingApps();
            return children.find(el => el.getId().get() === appId);
        });
    }
    //////////////////////////////////
    //              UPDATES         //
    //////////////////////////////////
    updateAdminApp(appId, newInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const appNode = yield this.getAdminApp(appId);
            if (appNode) {
                for (const key in newInfo) {
                    if (Object.prototype.hasOwnProperty.call(newInfo, key) && appNode.info[key]) {
                        const element = newInfo[key];
                        appNode.info[key].set(element);
                    }
                }
                return appNode;
            }
        });
    }
    updatePortofolioApp(appId, newInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const appNode = yield this.getPortofolioApp(appId);
            if (appNode) {
                for (const key in newInfo) {
                    if (Object.prototype.hasOwnProperty.call(newInfo, key) && appNode.info[key]) {
                        const element = newInfo[key];
                        appNode.info[key].set(element);
                    }
                }
                return appNode;
            }
        });
    }
    updateBuildingApp(appId, newInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const appNode = yield this.getBuildingApp(appId);
            if (appNode) {
                for (const key in newInfo) {
                    if (Object.prototype.hasOwnProperty.call(newInfo, key) && appNode.info[key]) {
                        const element = newInfo[key];
                        appNode.info[key].set(element);
                    }
                }
                return appNode;
            }
        });
    }
    //////////////////////////////////
    //              DELETE          //
    //////////////////////////////////
    deleteAdminApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const appNode = yield this.getAdminApp(appId);
            if (appNode) {
                yield appNode.removeFromGraph();
                return true;
            }
            return false;
        });
    }
    deletePortofolioApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const appNode = yield this.getPortofolioApp(appId);
            if (appNode) {
                yield appNode.removeFromGraph();
                return true;
            }
            return false;
        });
    }
    deleteBuildingApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const appNode = yield this.getBuildingApp(appId);
            if (appNode) {
                yield appNode.removeFromGraph();
                return true;
            }
            return false;
        });
    }
    //////////////////////////////////
    //              LINK            //
    //////////////////////////////////
    linkAppToPortofolio(portfolioId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const portofolio = yield portofolio_service_1.PortofolioService.getInstance().getPortofolio(portfolioId);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return false;
            const app = yield this.getPortofolioApp(appId);
            if (!(app instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return false;
            try {
                yield portofolio.addChild(app, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
            }
            catch (error) { }
            return true;
        });
    }
    linkAppToBuilding(buildingId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const building = yield building_service_1.BuildingService.getInstance().getBuildingById(buildingId);
            if (!(building instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return false;
            const app = yield this.getBuildingApp(appId);
            if (!(app instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return false;
            try {
                yield building.addChild(app, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
            }
            catch (error) { }
            return true;
        });
    }
    //////////////////////////////////
    //         EXCEl / JSON         //
    //////////////////////////////////
    uploadApps(appType, fileData, isExcel = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            if (!isExcel)
                data = JSON.parse(JSON.stringify(fileData.toString()));
            else
                data = yield this._convertExcelToJson(fileData);
            const formattedApps = this._formatAppsJson(data);
            return formattedApps.reduce((prom, item) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                try {
                    let app;
                    if (appType === exports.AppsType.admin)
                        app = yield this.createAdminApp(item);
                    else if (appType === exports.AppsType.portofolio)
                        app = yield this.createPortofolioApp(item);
                    else if (appType === exports.AppsType.building)
                        app = yield this.createBuildingApp(item);
                    liste.push(app);
                }
                catch (error) { }
                return liste;
            }), Promise.resolve([]));
        });
    }
    //////////////////////////////////
    //              PRIVATES        //
    //////////////////////////////////
    _getApplicationGroupNode(name, type, createIt = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.context.getChildren([constant_1.CONTEXT_TO_APPS_GROUP]);
            const found = children.find(el => el.getName().get() === name && el.getType().get() === type);
            if (found || !createIt)
                return found;
            const node = new spinal_env_viewer_graph_service_1.SpinalNode(name, type);
            return this.context.addChildInContext(node, constant_1.CONTEXT_TO_APPS_GROUP, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    _convertExcelToJson(excelData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield spinal_env_viewer_plugin_excel_manager_service_1.SpinalExcelManager.convertExcelToJson(excelData);
            return Object.values(data).flat();
        });
    }
    _formatAppsJson(jsonData) {
        return jsonData.reduce((liste, app) => {
            const requiredAttrs = ["name", "icon", "tags", "categoryName", "groupName"];
            const notValid = requiredAttrs.find(el => !app[el]);
            if (!notValid) {
                app.hasViewer = app.hasViewer || false;
                app.packageName = app.packageName || app.name;
                if (typeof app.tags === "string")
                    app.tags = app.tags.split(",");
                liste.push(app);
            }
            return liste;
        }, []);
    }
}
exports.AppService = AppService;
//# sourceMappingURL=apps.service.js.map