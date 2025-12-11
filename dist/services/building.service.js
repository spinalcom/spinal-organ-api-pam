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
exports.BuildingService = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const portofolio_service_1 = require("./portofolio.service");
const _1 = require(".");
const adminProfile_service_1 = require("./adminProfile.service");
const buildingUtils_1 = require("../utils/buildingUtils");
const authorizationUtils_1 = require("../utils/authorizationUtils");
const adminProfileInstance = adminProfile_service_1.AdminProfileService.getInstance();
class BuildingService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new BuildingService();
        return this.instance;
    }
    async init(graph) {
        this.context = await graph.getContext(constant_1.BUILDING_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.BUILDING_CONTEXT_NAME, constant_1.BUILDING_CONTEXT_TYPE);
            this.context = await graph.addContext(spinalContext);
        }
        return this.context;
    }
    /**
     * Creates a new building node with the provided building information, including geolocation coord, applications, and APIs.
     * If the location is not specified, it attempts to retrieve the geographical position based on the address.
     * Links the specified applications and APIs to the newly created building node, and adds the node to the context.
     *
     * @param buildingInfo - The information required to create the building, including address, location, appIds, and apiIds.
     * @returns A promise that resolves to the details of the created building, including the node, linked applications, and APIs.
     */
    async createBuilding(buildingInfo) {
        if (!buildingInfo.location || !buildingInfo.location.latlng) {
            const coord = await (0, buildingUtils_1.getBuildingGeoPosition)(buildingInfo.address);
            buildingInfo.location = coord || {};
        }
        const appIds = Object.assign([], buildingInfo.appIds);
        const apiIds = Object.assign([], buildingInfo.apiIds);
        const buildingNode = await (0, buildingUtils_1.createBuildingNode)(buildingInfo);
        return Promise.all([this.linkApplicationToBuilding(buildingNode, appIds || []), this.linkApiToBuilding(buildingNode, apiIds || [])])
            .then(async ([apps, apis]) => {
            await this.context.addChildInContext(buildingNode, constant_1.BUILDING_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
            return { node: buildingNode, apps, apis };
        });
    }
    /**
     * Retrieves all buildings nodes from the context.
     *
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof BuildingService
     */
    async getAllBuildings() {
        return this.context.getChildren([constant_1.BUILDING_RELATION_NAME]);
    }
    /**
     * gets a building node by its ID.
     *
     * @param {string} id
     * @return {*}  {Promise<SpinalNode>}
     * @memberof BuildingService
     */
    async getBuildingById(id) {
        const children = await this.context.getChildren([constant_1.BUILDING_RELATION_NAME]);
        return children.find(el => el.getId().get() === id);
    }
    /**
     * Deletes a building node by its ID.
     *
     * @param {string} id
     * @return {*}  {Promise<boolean>}
     * @memberof BuildingService
     */
    async deleteBuildingById(id) {
        const buildingNode = await this.getBuildingById(id);
        if (!buildingNode)
            return false;
        await buildingNode.removeFromGraph();
        await (0, authorizationUtils_1.removeNodeReferences)(buildingNode);
        return true;
    }
    /**
     * Retrieves all buildings and their associated applications.
     *
     * @return {*}  {Promise<{ buildingNode: SpinalNode, apps: SpinalNode[] }[]>}
     * @memberof BuildingService
     */
    async getAllBuildingsAndTheirApps() {
        const buildings = await this.getAllBuildings();
        const promises = buildings.map(async (building) => {
            const apps = await this.getAppsLinkedToBuilding(building);
            return {
                buildingNode: building,
                apps
            };
        });
        return Promise.all(promises);
    }
    /**
     * Links a building to a portfolio.
     *
     * @param {string} portfolioId
     * @param {IBuildingCreation} building
     * @return {*}  {Promise<IBuildingDetails>}
     * @memberof BuildingService
     */
    async linkBuildingToPortofolio(portfolioId, building) {
        return portofolio_service_1.PortofolioService.getInstance().linkBuildingToPortofolio(portfolioId, building);
    }
    /**
     * Retrieves a building from a portfolio by its ID.
     *
     * @param {string} portofolioId
     * @param {string} buildingId
     * @return {*}  {(Promise<void | SpinalNode>)}
     * @memberof BuildingService
     */
    async getBuildingFromPortofolio(portofolioId, buildingId) {
        return portofolio_service_1.PortofolioService.getInstance().getBuildingFromPortofolio(portofolioId, buildingId);
    }
    /**
     * Retrieves all buildings from a portfolio by its ID.
     *
     * @param {string} portfolioId
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof BuildingService
     */
    async getAllBuildingsFromPortofolio(portfolioId) {
        return portofolio_service_1.PortofolioService.getInstance().getPortofolioBuildings(portfolioId);
    }
    /**
     * Updates a building's information and its linked applications and APIs.
     *
     * @param {string} buildingId - The ID of the building to update.
     * @param {IEditBuilding} newData - The new data to update the building with.
     * @return {*}  {Promise<IBuildingDetails>} - The updated building details.
     * @memberof BuildingService
     */
    async updateBuilding(buildingId, buildingNewData) {
        const buildingNode = await this.getBuildingById(buildingId);
        if (!buildingNode)
            throw new Error(`no Building found for ${buildingId}`);
        // link the new apps and apis
        await this._linkNewAppsAndApis(buildingNewData, buildingNode);
        // unlink the unauthorized apps and apis
        await this._unlinkUnauthorizedAppsAndApis(buildingNewData, buildingNode);
        const { appIds, apiIds, unauthorizeAppIds, unauthorizeApiIds, ...dataToUpdate } = buildingNewData; // Destructure to remove appIds and apiIds
        if (buildingNewData.address !== buildingNode.info.address.get()) {
            // If the address has changed, we need to update the location
            buildingNewData.location = await (0, buildingUtils_1.getBuildingGeoPosition)(buildingNewData.address);
        }
        // update buildingNode info
        for (const key in buildingNewData) {
            if (Object.prototype.hasOwnProperty.call(buildingNewData, key)) {
                const newValue = buildingNewData[key];
                if (typeof buildingNode.info[key] === "undefined")
                    buildingNode.info.add_attr({ [key]: newValue });
                else
                    buildingNode.info[key].set(newValue);
            }
        }
        return this.getBuildingStructure(buildingNode);
    }
    /**
     * Retrieves the structure of a building, including its applications and APIs.
     *
     * @param {(string | SpinalNode)} building
     * @return {*}  {Promise<IBuildingDetails>}
     * @memberof BuildingService
     */
    async getBuildingStructure(building) {
        if (typeof building === "string")
            building = await this.getBuildingById(building);
        if (!(building instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return;
        const buildingApps = await this.getAppsLinkedToBuilding(building);
        const buildingApis = await this.getApisFromBuilding(building);
        return {
            node: building,
            apps: buildingApps,
            apis: buildingApis
        };
    }
    //////////////////////////////////////////////////////
    //                      APPS                        //
    //////////////////////////////////////////////////////
    /**
     * Links applications to a building.
     *
     * @param {(string | SpinalNode)} building
     * @param {(string | string[])} applicationIds
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof BuildingService
     */
    async linkApplicationToBuilding(building, applicationIds) {
        const buildingNode = building instanceof spinal_env_viewer_graph_service_1.SpinalNode ? building : await this.getBuildingById(building);
        // if (typeof building === "string") building = await this.getBuildingById(building);
        if (!(buildingNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            throw new Error(`No building found for ${building}`);
        if (!Array.isArray(applicationIds))
            applicationIds = [applicationIds];
        const getOnlyAppNotLinked = async (appId) => {
            const appIsAlreadyLinked = await this.buildingHasApp(buildingNode, appId);
            return !appIsAlreadyLinked;
        };
        const appsToLink = await this._filterApps(applicationIds, getOnlyAppNotLinked);
        const promises = appsToLink.map(async (appNode) => buildingNode.addChildInContext(appNode, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context));
        return Promise.all(promises).then(async (appsLinked) => {
            await adminProfileInstance.syncAdminProfile(); // Sync the admin profile after linking apps
            return appsLinked;
        });
    }
    /**
     * Retrieves all applications linked to a building.
     *
     * @param {(string | SpinalNode)} building
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof BuildingService
     */
    async getAppsLinkedToBuilding(building) {
        if (typeof building === "string")
            building = await this.getBuildingById(building);
        if (!(building instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return [];
        return building.getChildren([constant_1.APP_RELATION_NAME]);
    }
    /**
     * Retrieves a specific application linked to a building by its ID.
     *
     * @param {(string | SpinalNode)} building
     * @param {string} appId
     * @return {*}  {Promise<SpinalNode>}
     * @memberof BuildingService
     */
    async getAppFromBuilding(building, appId) {
        const applicationsLinked = await this.getAppsLinkedToBuilding(building);
        return applicationsLinked.find(app => app.getId().get() === appId);
    }
    /**
     * Removes applications from a building.
     *
     * @param {(string | SpinalNode)} building
     * @param {(string | string[])} applicationId
     * @return {*}  {Promise<string[]>}
     * @memberof BuildingService
     */
    async removeAppFromBuilding(building, applicationId) {
        const buildingNode = building instanceof spinal_env_viewer_graph_service_1.SpinalNode ? building : await this.getBuildingById(building);
        // if (typeof building === "string") building = await this.getBuildingById(building);
        if (!(buildingNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return [];
        if (!Array.isArray(applicationId))
            applicationId = [applicationId];
        const getOnlyAppLinked = async (appId) => {
            const appIsLinked = await this.buildingHasApp(buildingNode, appId);
            return appIsLinked;
        };
        const appsToUnlink = await this._filterApps(applicationId, getOnlyAppLinked);
        const promises = appsToUnlink.map(async (appNode) => {
            await buildingNode.removeChild(appNode, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
            await (0, authorizationUtils_1.removeRelationFromReference)(buildingNode, appNode, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
            return appNode.getId().get();
        });
        return Promise.all(promises).then(async (result) => {
            await adminProfileInstance.syncAdminProfile(); // Sync the admin profile after unlinking apps
            return result;
        });
    }
    /**
     * Checks if a building has a specific application linked to it.
     *
     * @param {(string | SpinalNode)} building
     * @param {string} appId
     * @return {*}  {Promise<boolean>}
     * @memberof BuildingService
     */
    async buildingHasApp(building, appId) {
        const app = await this.getAppFromBuilding(building, appId);
        return app ? true : false;
    }
    //////////////////////////////////////////////////////
    //                      APIS                        //
    //////////////////////////////////////////////////////
    /**
     * Links APIs to a building.
     *
     * @param {(string | SpinalNode)} building
     * @param {(string | string[])} apisIds
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof BuildingService
     */
    async linkApiToBuilding(building, apisIds) {
        const buildingNode = building instanceof spinal_env_viewer_graph_service_1.SpinalNode ? building : await this.getBuildingById(building);
        // if (typeof building === "string") building = await this.getBuildingById(building);
        if (!(buildingNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            throw new Error(`No building found for ${building}`);
        if (!Array.isArray(apisIds))
            apisIds = [apisIds];
        const getOnlyApisNotLinked = async (apiId) => {
            const apiIsAlreadyLinked = await this.buildingHasApi(buildingNode, apiId);
            return !apiIsAlreadyLinked;
        };
        const apisToLink = await this._filterApis(apisIds, getOnlyApisNotLinked);
        const promises = apisToLink.map(async (apiNode) => buildingNode.addChildInContext(apiNode, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context));
        return Promise.all(promises).then(async (apisLinked) => {
            await adminProfileInstance.syncAdminProfile(); // Sync the admin profile after linking apps
            return apisLinked;
        });
    }
    /**
     * Removes APIs from a building.
     *
     * @param {(string | SpinalNode)} building
     * @param {(string | string[])} apisIds
     * @return {*}  {Promise<string[]>}
     * @memberof BuildingService
     */
    async removeApisFromBuilding(building, apisIds) {
        // if (typeof building === "string") building = await this.getBuildingById(building);
        const buildingNode = building instanceof spinal_env_viewer_graph_service_1.SpinalNode ? building : await this.getBuildingById(building);
        if (!(buildingNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return [];
        if (!Array.isArray(apisIds))
            apisIds = [apisIds];
        const getOnlyApisLinked = async (apiId) => {
            const apiIsLinked = await this.buildingHasApi(building, apiId);
            return apiIsLinked;
        };
        const apisToUnlink = await this._filterApis(apisIds, getOnlyApisLinked);
        const promises = apisToUnlink.map(async (apiNode) => {
            await buildingNode.removeChild(apiNode, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
            await (0, authorizationUtils_1.removeRelationFromReference)(buildingNode, apiNode, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
            return apiNode.getId().get();
        });
        return Promise.all(promises).then(async (result) => {
            await adminProfileInstance.syncAdminProfile(); // Sync the admin profile after unlinking apps
            return result;
        });
    }
    /**
     * Retrieves all APIs linked to a building.
     *
     * @param {(string | SpinalNode)} building
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof BuildingService
     */
    async getApisFromBuilding(building) {
        if (typeof building === "string")
            building = await this.getBuildingById(building);
        if (!(building instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return [];
        return building.getChildren([constant_1.API_RELATION_NAME]);
    }
    /**
     * Retrieves a specific API linked to a building by its ID.
     *
     * @param {(string | SpinalNode)} building
     * @param {string} apiId
     * @return {*}  {Promise<SpinalNode>}
     * @memberof BuildingService
     */
    async getApiFromBuilding(building, apiId) {
        const children = await this.getApisFromBuilding(building);
        return children.find(el => el.getId().get() === apiId);
    }
    /**
     * Checks if a building has a specific API linked to it.
     *
     * @param {(string | SpinalNode)} building
     * @param {string} apiId
     * @return {*}  {Promise<boolean>}
     * @memberof BuildingService
     */
    async buildingHasApi(building, apiId) {
        const app = await this.getApiFromBuilding(building, apiId);
        return app ? true : false;
    }
    /**
     * Uploads a Swagger file to create routes for a building.
     *
     * @param {Buffer} buffer
     * @return {*}  {Promise<any[]>}
     * @memberof BuildingService
     */
    async uploadSwaggerFile(buffer) {
        return _1.APIService.getInstance().createRoutesFromSwaggerFile(buffer, constant_1.BUILDING_API_GROUP_TYPE);
    }
    /////////////////////////////////////////////////////
    //                  PRIVATES                       //
    /////////////////////////////////////////////////////
    _unlinkUnauthorizedAppsAndApis(buildingNewData, buildingNode) {
        const unlinlinkPromises = [];
        if (buildingNewData.unauthorizeAppIds?.length > 0)
            unlinlinkPromises.push(this.removeAppFromBuilding(buildingNode, buildingNewData.unauthorizeAppIds));
        if (buildingNewData.unauthorizeApiIds?.length > 0)
            unlinlinkPromises.push(this.removeApisFromBuilding(buildingNode, buildingNewData.unauthorizeApiIds));
        return Promise.all(unlinlinkPromises);
    }
    _linkNewAppsAndApis(buildingNewData, buildingNode) {
        const linkingPromises = [];
        if (buildingNewData.authorizeAppIds?.length > 0)
            linkingPromises.push(this.linkApplicationToBuilding(buildingNode, buildingNewData.authorizeAppIds));
        if (buildingNewData.authorizeApiIds?.length > 0)
            linkingPromises.push(this.linkApiToBuilding(buildingNode, buildingNewData.authorizeApiIds));
        return Promise.all(linkingPromises);
    }
    async _filterApps(applicationIds, predicate) {
        const promises = applicationIds.map(async (appId) => {
            const conditions = await predicate(appId);
            if (!conditions)
                return null;
            const appNode = await _1.AppService.getInstance().getBuildingAppById(appId);
            return appNode ? appNode : null;
        });
        const appNodes = await Promise.all(promises);
        return appNodes.filter(Boolean); // Filter out nulls
    }
    async _filterApis(apisIds, predicate) {
        const promises = apisIds.map(async (apiId) => {
            const conditions = await predicate(apiId);
            if (!conditions)
                return null;
            const appNode = await _1.AppService.getInstance().getBuildingAppById(apiId);
            return appNode ? appNode : null;
        });
        const apiNodes = await Promise.all(promises);
        return apiNodes.filter(Boolean); // Filter out nulls
    }
}
exports.BuildingService = BuildingService;
//# sourceMappingURL=building.service.js.map