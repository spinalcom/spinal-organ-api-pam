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
exports.AppService = exports.AppsType = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const building_service_1 = require("./building.service");
const portofolio_service_1 = require("./portofolio.service");
const adminProfile_service_1 = require("./adminProfile.service");
const applicationUtils_1 = require("../utils/applicationUtils");
const authorizationUtils_1 = require("../utils/authorizationUtils");
exports.AppsType = {
    admin: "admin",
    building: "building",
    portofolio: "portofolio"
};
class AppService {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AppService();
        }
        return this.instance;
    }
    async init(graph) {
        this.context = await graph.getContext(constant_1.APP_LIST_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.APP_LIST_CONTEXT_NAME, constant_1.APP_LIST_CONTEXT_TYPE);
            this.context = await graph.addContext(spinalContext);
        }
        return this.context;
    }
    //////////////////////////////////
    //              CREATE          //
    //////////////////////////////////
    /**
     * Creates a new Admin App node if it does not already exist.
     * @param appInfo - The information for the Admin App.
     * @returns The created or existing SpinalNode.
     */
    async createAdminApp(appInfo) {
        const groupNode = await this._getApplicationGroupNode(constant_1.ADMIN_APPS_GROUP_NAME, constant_1.ADMIN_APPS_GROUP_TYPE, true);
        if (!groupNode)
            return;
        const applications = await groupNode.getChildren([constant_1.APP_RELATION_NAME]);
        let appExist = applications.find(app => app.getName().get().toLowerCase() === appInfo.name.toLowerCase());
        if (!appExist) {
            appInfo = Object.assign({}, appInfo, { type: constant_1.ADMIN_APP_TYPE });
            const appId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(appInfo, undefined); // Create the app node with the provided info
            const appNode = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appId);
            appExist = await groupNode.addChildInContext(appNode, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        }
        await adminProfile_service_1.AdminProfileService.getInstance().addAppToAdminProfil(appExist);
        return appExist;
    }
    /**
     * Creates a new Portofolio App node if it does not already exist.
     * @param appInfo - The information for the Portofolio App.
     * @returns The created or existing SpinalNode.
     */
    async createPortofolioApp(appInfo) {
        const groupNode = await this._getApplicationGroupNode(constant_1.PORTOFOLIO_APPS_GROUP_NAME, constant_1.PORTOFOLIO_APPS_GROUP_TYPE, true);
        if (!groupNode)
            return;
        const children = await groupNode.getChildren([constant_1.APP_RELATION_NAME]);
        const appExist = children.find(el => el.getName().get().toLowerCase() === appInfo.name.toLowerCase());
        if (appExist)
            return appExist;
        appInfo = Object.assign({}, appInfo, { type: constant_1.PORTOFOLIO_APP_TYPE });
        const appId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(appInfo, undefined);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appId);
        return groupNode.addChildInContext(node, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
    }
    /**
     * Creates a new Building App node if it does not already exist.
     * @param appInfo - The information for the Building App.
     * @returns The created or existing SpinalNode.
     */
    async createBuildingApp(appInfo) {
        const groupNode = await this._getApplicationGroupNode(constant_1.BUILDING_APPS_GROUP_NAME, constant_1.BUILDING_APPS_GROUP_TYPE, true);
        if (!groupNode)
            return;
        const children = await groupNode.getChildren([constant_1.APP_RELATION_NAME]);
        const appExist = children.find(el => el.getName().get().toLowerCase() === appInfo.name.toLowerCase());
        if (appExist)
            return appExist;
        appInfo = Object.assign({}, appInfo, { type: constant_1.BUILDING_APP_TYPE });
        const appId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(appInfo, undefined);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(appId);
        return groupNode.addChildInContext(node, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
    }
    //////////////////////////////////
    //              GET             //
    //////////////////////////////////
    /**
     * Retrieves all Admin App nodes.
     * @returns Promise resolving to an array of SpinalNode representing admin apps.
     */
    async getAllAdminApps() {
        const groupNode = await this._getApplicationGroupNode(constant_1.ADMIN_APPS_GROUP_NAME, constant_1.ADMIN_APPS_GROUP_TYPE);
        if (!groupNode)
            return [];
        return groupNode.getChildren([constant_1.APP_RELATION_NAME]);
    }
    /**
     * Retrieves all Portofolio App nodes.
     * @returns Promise resolving to an array of SpinalNode representing portofolio apps.
     */
    async getAllPortofolioApps() {
        const groupNode = await this._getApplicationGroupNode(constant_1.PORTOFOLIO_APPS_GROUP_NAME, constant_1.PORTOFOLIO_APPS_GROUP_TYPE);
        if (!groupNode)
            return [];
        return groupNode.getChildren([constant_1.APP_RELATION_NAME]);
    }
    /**
     * Retrieves all Building App nodes.
     * @returns Promise resolving to an array of SpinalNode representing building apps.
     */
    async getAllBuildingApps() {
        const groupNode = await this._getApplicationGroupNode(constant_1.BUILDING_APPS_GROUP_NAME, constant_1.BUILDING_APPS_GROUP_TYPE);
        if (!groupNode)
            return [];
        return groupNode.getChildren([constant_1.APP_RELATION_NAME]);
    }
    /**
     * Retrieves a specific Admin App node by its ID.
     * @param appId - The ID of the Admin App.
     * @returns Promise resolving to the SpinalNode or undefined if not found.
     */
    async getAdminAppById(appId) {
        const children = await this.getAllAdminApps();
        return children.find(el => el.getId().get() === appId);
    }
    /**
     * Retrieves a specific Portofolio App node by its ID.
     * @param appId - The ID of the Portofolio App.
     * @returns Promise resolving to the SpinalNode or undefined if not found.
     */
    async getPortofolioAppById(appId) {
        const children = await this.getAllPortofolioApps();
        return children.find(el => el.getId().get() === appId);
    }
    /**
     * Retrieves a specific Building App node by its ID.
     * @param appId - The ID of the Building App.
     * @returns Promise resolving to the SpinalNode or undefined if not found.
     */
    async getBuildingAppById(appId) {
        const children = await this.getAllBuildingApps();
        return children.find(el => el.getId().get() === appId);
    }
    //////////////////////////////////
    //              UPDATES         //
    //////////////////////////////////
    /**
     * Updates an Admin App node with new information.
     * @param appId - The ID of the Admin App to update.
     * @param newInfo - The new information to update the app with.
     * @returns The updated SpinalNode or undefined if not found.
     */
    async updateAdminApp(appId, newInfo) {
        const appNode = await this.getAdminAppById(appId);
        if (!appNode)
            return;
        const { id, ...appInfo } = newInfo; // Exclude the id from the appInfo to avoid overwriting it
        for (const key in appInfo) {
            if (Object.prototype.hasOwnProperty.call(appInfo, key)) {
                const element = appInfo[key];
                if (typeof appNode.info[key] === "undefined")
                    appNode.info.add_attr({ [key]: element });
                if (appNode.info[key])
                    appNode.info[key].set(element);
            }
        }
        return appNode;
    }
    /**
     * Updates a Portofolio App node with new information.
     * @param appId - The ID of the Portofolio App to update.
     * @param newInfo - The new information to update the app with.
     * @returns The updated SpinalNode or undefined if not found.
     */
    async updatePortofolioApp(appId, newInfo) {
        const appNode = await this.getPortofolioAppById(appId);
        if (!appNode)
            return;
        const { id, ...appInfo } = newInfo; // Exclude the id from the appInfo to avoid overwriting it
        for (const key in appInfo) {
            if (Object.prototype.hasOwnProperty.call(appInfo, key)) {
                const element = appInfo[key];
                if (typeof appNode.info[key] === "undefined")
                    appNode.info.add_attr({ [key]: element });
                if (appNode.info[key])
                    appNode.info[key].set(element);
            }
        }
        return appNode;
    }
    /**
     * Updates a Building App node with new information.
     * @param appId - The ID of the Building App to update.
     * @param newInfo - The new information to update the app with.
     * @returns The updated SpinalNode or undefined if not found.
     */
    async updateBuildingApp(appId, newInfo) {
        const appNode = await this.getBuildingAppById(appId);
        if (!appNode)
            return;
        const { id, ...appInfo } = newInfo; // Exclude the id from the appInfo to avoid overwriting it
        for (const key in appInfo) {
            if (Object.prototype.hasOwnProperty.call(appInfo, key)) {
                const element = appInfo[key];
                if (typeof appNode.info[key] === "undefined")
                    appNode.info.add_attr({ [key]: element });
                if (appNode.info[key])
                    appNode.info[key].set(element);
            }
        }
        return appNode;
    }
    //////////////////////////////////
    //              DELETE          //
    //////////////////////////////////
    /**
     * Deletes an Admin App node by its ID.
     * If the app does not exist, it returns false.
     * @param {string} appId
     * @return {*}  {Promise<boolean>}
     * @memberof AppService
     */
    async deleteAdminApp(appId) {
        const appNode = await this.getAdminAppById(appId);
        if (!appNode)
            return false;
        await appNode.removeFromGraph();
        await (0, authorizationUtils_1.removeNodeReferences)(appNode);
        return true;
    }
    /**
     * Deletes a Portofolio App node by its ID.
     * If the app does not exist, it returns false.
     * @param {string} appId
     * @return {*}  {Promise<boolean>}
     * @memberof AppService
     */
    async deletePortofolioApp(appId) {
        const appNode = await this.getPortofolioAppById(appId);
        if (!appNode)
            return false;
        await appNode.removeFromGraph();
        await (0, authorizationUtils_1.removeNodeReferences)(appNode);
        return true;
    }
    /**
     * Deletes a Building App node by its ID.
     * If the app does not exist, it returns false.
     * @param {string} appId
     * @return {*}  {Promise<boolean>}
     * @memberof AppService
     */
    async deleteBuildingApp(appId) {
        const appNode = await this.getBuildingAppById(appId);
        if (!appNode)
            return false;
        await appNode.removeFromGraph();
        await (0, authorizationUtils_1.removeNodeReferences)(appNode);
        return true;
    }
    //////////////////////////////////
    //              LINK            //
    //////////////////////////////////
    /**
     * links a portofolio app to a portfolio.
     * If the app or portfolio does not exist, it returns false.
     * If the app is already linked, it does nothing and returns true.
     * @param {string} portfolioId
     * @param {string} appId
     * @return {*}  {Promise<boolean>}
     * @memberof AppService
     */
    async linkAppToPortofolio(portfolioId, appId) {
        return portofolio_service_1.PortofolioService.getInstance().linkAppToPortofolio(portfolioId, appId);
        // const portofolio = await PortofolioService.getInstance().getPortofolio(portfolioId);
        // if (!(portofolio instanceof SpinalNode)) return false;
        // const app = await this.getPortofolioAppById(appId);
        // if (!(app instanceof SpinalNode)) return false;
        // try {
        //   await portofolio.addChild(app, APP_RELATION_NAME, PTR_LST_TYPE);
        // } catch (error) { }
        // return true
    }
    /**
     * links a building app to a building.
     * If the app or building does not exist, it returns false.
     * If the app is already linked, it does nothing and returns true.
     * @param {string} buildingId
     * @param {string} appId
     * @return {*}  {Promise<boolean>}
     * @memberof AppService
     */
    async linkAppToBuilding(buildingId, appId) {
        const building = await building_service_1.BuildingService.getInstance().getBuildingById(buildingId);
        if (!(building instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return false;
        const app = await this.getBuildingAppById(appId);
        if (!(app instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return false;
        try {
            await building.addChild(app, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
        }
        catch (error) { }
        return true;
    }
    //////////////////////////////////
    //         EXCEl / JSON         //
    //////////////////////////////////
    async uploadApps(appType, fileData, isExcel = false) {
        const apps = await (0, applicationUtils_1.convertAndFormatFileUploaded)(fileData, isExcel);
        // Map each app type to its corresponding creation method
        const appTypeToMethod = {
            [exports.AppsType.admin]: this.createAdminApp.bind(this),
            [exports.AppsType.portofolio]: this.createPortofolioApp.bind(this),
            [exports.AppsType.building]: this.createBuildingApp.bind(this)
        };
        const promises = [];
        for (const app of apps) {
            if (!appTypeToMethod[appType]) {
                console.warn(`Unknown app type: ${appType}`);
                continue; // Skip unknown app types
            }
            promises.push(appTypeToMethod[appType](app)); // Call the corresponding method to create the app
        }
        return Promise.allSettled(promises).then((results) => {
            return results.reduce((appCreated, result) => {
                if (result.status === "fulfilled") {
                    appCreated.push(result.value);
                }
                return appCreated;
            }, []);
        });
        // return apps.reduce(async (prom, item) => {
        //   const liste = await prom;
        //   try {
        //     let app;
        //     if (appType === AppsType.admin) app = await this.createAdminApp(item);
        //     else if (appType === AppsType.portofolio) app = await this.createPortofolioApp(item);
        //     else if (appType === AppsType.building) app = await this.createBuildingApp(item);
        //     liste.push(app)
        //   } catch (error) { }
        //   return liste;
        // }, Promise.resolve([]))
    }
    //////////////////////////////////
    //              PRIVATES        //
    //////////////////////////////////
    async _getApplicationGroupNode(appGroupName, appGroupType, createGroupIfNotExist = false) {
        const appsGroups = await this.context.getChildren([constant_1.CONTEXT_TO_APPS_GROUP]);
        const found = appsGroups.find(appsGroup => appsGroup.getName().get() === appGroupName && appsGroup.getType().get() === appGroupType);
        if (found || !createGroupIfNotExist)
            return found;
        const node = new spinal_env_viewer_graph_service_1.SpinalNode(appGroupName, appGroupType);
        return this.context.addChildInContext(node, constant_1.CONTEXT_TO_APPS_GROUP, constant_1.PTR_LST_TYPE, this.context);
    }
}
exports.AppService = AppService;
//# sourceMappingURL=apps.service.js.map