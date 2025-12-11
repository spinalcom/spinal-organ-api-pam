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
exports.PortofolioService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const apps_service_1 = require("./apps.service");
const interfaces_1 = require("../interfaces");
const building_service_1 = require("./building.service");
const apis_service_1 = require("./apis.service");
const adminProfile_service_1 = require("./adminProfile.service");
const authorizationUtils_1 = require("../utils/authorizationUtils");
const buildingUtils_1 = require("../utils/buildingUtils");
const profileUtils_1 = require("../utils/profileUtils");
const adminProfileInstance = adminProfile_service_1.AdminProfileService.getInstance();
class PortofolioService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new PortofolioService();
        return this.instance;
    }
    async init(graph) {
        this.context = await graph.getContext(constant_1.PORTOFOLIO_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.PORTOFOLIO_CONTEXT_NAME, constant_1.PORTOFOLIO_CONTEXT_TYPE);
            this.context = await graph.addContext(spinalContext);
        }
        return this.context;
    }
    /**
     * Creates a new portfolio node with the specified name, links the provided applications and APIs to it,
     * adds the node to the context, and synchronizes the admin profile.
     *
     * @param portofolioName - The name of the portfolio to create.
     * @param appsIds - An optional array of application IDs to link to the portfolio. Defaults to an empty array.
     * @param apisIds - An optional array of API IDs to link to the portfolio. Defaults to an empty array.
     * @returns A promise that resolves to the details of the created portfolio, including the node, linked apps, empty buildings array, and linked APIs.
     */
    async createPortofolio(portofolioName, appsIds = [], apisIds = []) {
        const node = new spinal_env_viewer_graph_service_1.SpinalNode(portofolioName, constant_1.PORTOFOLIO_TYPE);
        const apps = await this.linkSeveralAppsToPortofolio(node, appsIds);
        const apis = await this.linkSeveralApisToPortofolio(node, apisIds);
        await this.context.addChildInContext(node, constant_1.CONTEXT_TO_PORTOFOLIO_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        await adminProfileInstance.syncAdminProfile();
        return { node, apps, buildings: [], apis };
    }
    /**
     * Renames a portfolio node with the specified new name.
     *
     * @param portfolioId - The unique identifier of the portfolio to rename.
     * @param newName - The new name to assign to the portfolio.
     * @returns A promise that resolves to `true` if the portfolio was successfully renamed,
     *          or `false` if the new name is empty or the portfolio node could not be found.
     */
    async renamePortofolio(portfolioId, newName) {
        if (newName.trim() === '')
            return false;
        const portofolioNode = await this.getPortofolioNode(portfolioId);
        if (!portofolioNode)
            return false;
        portofolioNode.info.name.set(newName.trim());
        return true;
    }
    /**
     * Updates a portfolio node with new data, including renaming, linking/unlinking apps and APIs.
     *
     * @param portofolioId - The unique identifier of the portfolio to update.
     * @param newData - The new data to apply to the portfolio.
     * @returns A promise that resolves to the updated portfolio details, or undefined if the portfolio does not exist.
     */
    async updatePortofolio(portofolioId, newData, isCompatibleWithBosC) {
        const portofolioNode = await this.getPortofolioNode(portofolioId);
        if (!portofolioNode)
            return;
        const convertedData = (0, interfaces_1.convertIEditPortofolio)(portofolioId, newData);
        const [dataFormatted] = (0, profileUtils_1.formatAndMergePortofolioAuthorization)([convertedData], isCompatibleWithBosC);
        if (dataFormatted)
            return;
        if (newData.name?.trim())
            await this.renamePortofolio(portofolioId, newData.name.trim());
        if (dataFormatted.appsIds)
            await this.linkSeveralAppsToPortofolio(portofolioNode, dataFormatted.appsIds);
        if (dataFormatted.apisIds)
            await this.linkSeveralApisToPortofolio(portofolioNode, dataFormatted.apisIds);
        if (dataFormatted.unauthorizeAppsIds)
            await this.removeSeveralAppsFromPortofolio(portofolioNode, dataFormatted.unauthorizeAppsIds);
        if (dataFormatted.unauthorizeApisIds)
            await this.removeSeveralApisFromPortofolio(portofolioNode, dataFormatted.unauthorizeApisIds);
        return this.getPortofolioDetails(portofolioNode);
    }
    /**
     * Retrieves all portfolio nodes from the context.
     *
     * @returns A promise that resolves to an array of SpinalNode instances representing all portfolios.
     */
    getAllPortofolio() {
        return this.context.getChildren([constant_1.CONTEXT_TO_PORTOFOLIO_RELATION_NAME]);
    }
    /**
     * Retrieves a portfolio node by its ID.
     *
     * @param {string} portofolioId
     * @return {*}  {Promise<SpinalNode>}
     * @memberof PortofolioService
     */
    async getPortofolioNode(portofolioId) {
        const portofolios = await this.getAllPortofolio();
        return portofolios.find((el) => el.getId().get() === portofolioId);
    }
    /**
     * Retrieves the details of a portfolio, including its node, linked applications, buildings, and APIs.
     *
     * @param {string | SpinalNode} portofolio - The ID or SpinalNode of the portfolio to retrieve.
     * @return {*}  {Promise<IPortofolioDetails>}
     * @memberof PortofolioService
     */
    async getPortofolioDetails(portofolio) {
        const portfolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!portfolioNode) {
            const id = typeof portofolio === "string" ? portofolio : portofolio.getId().get();
            throw new Error(`No portofolio found for ${id}`);
        }
        const [apps, buildings, apis] = await Promise.all([
            this.getPortofolioApps(portfolioNode),
            this.getPortofolioBuildings(portfolioNode),
            this.getPortofolioApis(portfolioNode),
        ]);
        return {
            node: portfolioNode,
            apps,
            apis,
            buildings: await Promise.all(buildings.map((el) => building_service_1.BuildingService.getInstance().getBuildingStructure(el))),
        };
    }
    /**
     * Retrieves the details of all portfolios in the context.
     *
     * @returns A promise that resolves to an array of IPortofolioDetails for each portfolio.
     */
    async getAllPortofoliosDetails() {
        const portofolios = await this.getAllPortofolio();
        const promises = portofolios.map((el) => this.getPortofolioDetails(el));
        return Promise.all(promises);
    }
    /**
     * Removes a portfolio and all its associated buildings from the system.
     *
     * This method accepts either a portfolio node or a portfolio identifier. It retrieves the corresponding
     * portfolio node, fetches all buildings linked to it, and deletes each building. After removing all
     * associated buildings, it removes the portfolio node from its parent context and cleans up any remaining
     * references to the node.
     *
     * @param portofolio - The portfolio to remove, specified as either a string identifier or a SpinalNode instance.
     * @returns A promise that resolves to `true` if the portfolio and its references were successfully removed,
     *          or `false` if an error occurred during the process.
     */
    async removePortofolio(portofolio) {
        try {
            const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
            const buildings = await this.getPortofolioBuildings(portofolioNode);
            const promises = buildings.map(building => building_service_1.BuildingService.getInstance().deleteBuildingById(building.getId().get()));
            await Promise.all(promises);
            await this.context.removeChild(portofolioNode, constant_1.CONTEXT_TO_PORTOFOLIO_RELATION_NAME, constant_1.PTR_LST_TYPE);
            await (0, authorizationUtils_1.removeNodeReferences)(portofolioNode);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    //////////////////////////////////////////////////////
    //                      APPS                        //
    //////////////////////////////////////////////////////
    /**
     * Links a single application to a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param applicationId - The ID of the application to link.
     * @returns A promise that resolves to the linked SpinalNode instance, or undefined if not found or already linked.
     */
    async linkAppToPortofolio(portofolio, applicationId) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            throw new Error(`No portofolio found for ${portofolio}`);
        const appNode = await apps_service_1.AppService.getInstance().getPortofolioAppById(applicationId);
        if (!appNode || !(appNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return;
        const appsAreadyLinked = await portofolioNode.getChildrenIds();
        const isChild = appsAreadyLinked.find((el) => el === applicationId);
        if (isChild)
            return appNode;
        return portofolioNode.addChildInContext(appNode, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
    }
    /**
     * Links multiple applications to a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param applicationIds - An array of application IDs to link to the portfolio.
     * @returns A promise that resolves to an array of linked SpinalNode instances.
     */
    async linkSeveralAppsToPortofolio(portofolio, applicationIds) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            throw new Error(`No portofolio found for ${portofolio}`);
        if (!Array.isArray(applicationIds))
            applicationIds = [applicationIds];
        const promises = applicationIds.map((appId) => this.linkAppToPortofolio(portofolioNode, appId));
        return Promise.all(promises).then(async (apps) => {
            await adminProfileInstance.syncAdminProfile();
            return apps.filter((app) => app instanceof spinal_env_viewer_graph_service_1.SpinalNode);
        });
    }
    /**
     * Retrieves the list of application nodes associated with a given portfolio.
     *
     * @param portofolio - The portfolio identifier or a SpinalNode instance representing the portfolio.
     * @returns A promise that resolves to an array of SpinalNode instances representing the applications under the specified portfolio.
     *
     * If the provided portfolio cannot be resolved to a SpinalNode, an empty array is returned.
     */
    async getPortofolioApps(portofolio) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return [];
        return portofolioNode.getChildren([constant_1.APP_RELATION_NAME]);
    }
    /**
     * Retrieves an application node from a given portfolio by its application ID.
     *
     * @param portofolio - The portfolio to search within, either as a string identifier or a `SpinalNode` instance.
     * @param appId - The unique identifier of the application to retrieve.
     * @returns A promise that resolves to the `SpinalNode` representing the application if found, or `undefined` if not found.
     */
    async getAppFromPortofolio(portofolio, appId) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return;
        const appsLinked = await portofolioNode.getChildren([constant_1.APP_RELATION_NAME]);
        return appsLinked.find((app) => app.getId().get() === appId);
    }
    /**
     * Removes a single application from a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param applicationId - The ID of the application to remove.
     * @returns A promise that resolves to the application ID if successfully removed, or undefined if not found.
     */
    async removeAppFromPortofolio(portofolio, applicationId) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            throw new Error(`No portofolio found for ${portofolio}`);
        const appNode = await this.getAppFromPortofolio(portofolioNode, applicationId);
        if (!(appNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return;
        await portofolioNode.removeChild(appNode, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
        return applicationId;
    }
    /**
     * Removes multiple applications from a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param applicationIds - An array or single application ID to remove from the portfolio.
     * @returns A promise that resolves to an array of removed application IDs.
     */
    async removeSeveralAppsFromPortofolio(portofolio, applicationIds) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            throw new Error(`No portofolio found for ${portofolio}`);
        if (!Array.isArray(applicationIds))
            applicationIds = [applicationIds];
        const promises = applicationIds.map(async (appId) => this.removeAppFromPortofolio(portofolioNode, appId));
        return Promise.all(promises).then(async (data) => {
            await adminProfileInstance.syncAdminProfile();
            return data.filter((appId) => appId !== undefined);
        });
    }
    /**
     * Checks if a given portfolio contains an application with the specified appId.
     *
     * @param portofolio - The portfolio to check, either as a string identifier or a SpinalNode instance.
     * @param appId - The unique identifier of the application to search for.
     * @returns A promise that resolves to the SpinalNode representing the application if found, or void if not found.
     */
    async portofolioHasApp(portofolio, appId) {
        const apps = await this.getPortofolioApps(portofolio);
        return apps.find((el) => el.getId().get() === appId);
    }
    //////////////////////////////////////////////////////
    //                      APIS                        //
    //////////////////////////////////////////////////////
    /**
     * Links a single API to a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param apiId - The ID of the API to link.
     * @returns A promise that resolves to the linked SpinalNode instance, or undefined if not found or already linked.
     */
    async linkApiToPortofolio(portofolio, apiId) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            throw new Error(`No portofolio found for ${portofolio}`);
        const apiNode = await apis_service_1.APIService.getInstance().getApiRouteById(apiId, constant_1.PORTOFOLIO_API_GROUP_TYPE);
        if (!(apiNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return;
        const apisAreadyLinked = await portofolioNode.getChildrenIds();
        const isChild = apisAreadyLinked.find((el) => el === apiId);
        if (isChild)
            return apiNode;
        return portofolioNode.addChildInContext(apiNode, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
    }
    /**
     * Links multiple APIs to a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param apisIds - An array or single API ID to link to the portfolio.
     * @returns A promise that resolves to an array of linked SpinalNode instances.
     */
    async linkSeveralApisToPortofolio(portofolio, apisIds) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            throw new Error(`No portofolio found for ${portofolio}`);
        if (!Array.isArray(apisIds))
            apisIds = [apisIds];
        const promises = apisIds.map((apiId) => this.linkApiToPortofolio(portofolioNode, apiId));
        return Promise.all(promises).then(async (apis) => {
            await adminProfileInstance.syncAdminProfile();
            return apis.filter((api) => api instanceof spinal_env_viewer_graph_service_1.SpinalNode);
        });
    }
    /**
     * Retrieves the list of API nodes associated with a given portfolio.
     *
     * @param portofolio - The portfolio identifier or a SpinalNode instance representing the portfolio.
     * @returns A promise that resolves to an array of SpinalNode objects representing the APIs linked to the portfolio.
     *
     * If the provided portfolio cannot be resolved to a valid SpinalNode, an empty array is returned.
     */
    async getPortofolioApis(portofolio) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return [];
        return portofolioNode.getChildren([constant_1.API_RELATION_NAME]);
    }
    /**
     * Retrieves a specific API node linked to a given portfolio by its API ID.
     *
     * @param portofolio - The portfolio identifier or a SpinalNode instance representing the portfolio.
     * @param apiId - The unique identifier of the API to retrieve.
     * @returns A promise that resolves to the SpinalNode representing the API if found, or `undefined` if not found.
     */
    async getApiFromPortofolio(portofolio, apiId) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return;
        const apisLinked = await this.getPortofolioApis(portofolioNode);
        return apisLinked.find((el) => el.getId().get() === apiId);
    }
    /**
     * Removes an API node from the specified portfolio.
     *
     * @param portofolio - The portfolio identifier or SpinalNode instance from which the API should be removed.
     * @param apiId - The unique identifier of the API to remove from the portfolio.
     * @returns A promise that resolves to the removed API's ID if successful.
     * @throws Will throw an error if the portfolio node cannot be found.
     */
    async removeApiFromPortofolio(portofolio, apiId) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return;
        const apiNode = await this.getApiFromPortofolio(portofolioNode, apiId);
        if (!(apiNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return;
        await portofolioNode.removeChild(apiNode, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE);
        return apiId;
    }
    /**
     * Removes multiple APIs from a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param apisIds - An array or single API ID to remove from the portfolio.
     * @returns A promise that resolves to an array of removed API IDs.
     */
    async removeSeveralApisFromPortofolio(portofolio, apisIds) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            throw new Error(`No portofolio found for ${portofolio}`);
        if (!Array.isArray(apisIds))
            apisIds = [apisIds];
        const promises = apisIds.map(async (apiId) => this.removeApiFromPortofolio(portofolioNode, apiId));
        return Promise.all(promises).then(async (data) => {
            await adminProfileInstance.syncAdminProfile();
            return data.filter((apiId) => apiId !== undefined);
        });
    }
    /**
     * Checks if a given portfolio contains an API with the specified ID.
     *
     * @param portofolio - The portfolio to check, either as a string identifier or a SpinalNode instance.
     * @param apiId - The unique identifier of the API to search for within the portfolio.
     * @returns A promise that resolves to the SpinalNode representing the API if found, or void if not found.
     */
    async portofolioHasApi(portofolio, apiId) {
        const apps = await this.getPortofolioApis(portofolio);
        return apps.find((el) => el.getId().get() === apiId);
    }
    async uploadSwaggerFile(buffer) {
        return apis_service_1.APIService.getInstance().createRoutesFromSwaggerFile(buffer, constant_1.PORTOFOLIO_API_GROUP_TYPE);
    }
    //////////////////////////////////////////////////////
    //                      BUILDINGS                   //
    //////////////////////////////////////////////////////
    /**
     * Links a newly created building to a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param buildingInfo - The information required to create the building.
     * @returns A promise that resolves to the details of the created building.
     * @throws Will throw an error if the portfolio node cannot be found.
     */
    async linkBuildingToPortofolio(portofolio, buildingInfo) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            throw new Error(`No portofolio found for ${portofolio}`);
        const structure = await building_service_1.BuildingService.getInstance().createBuilding(buildingInfo);
        await portofolioNode.addChildInContext(structure.node, constant_1.BUILDING_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        await adminProfileInstance.syncAdminProfile();
        return structure;
    }
    /**
     * Retrieves the list of building nodes associated with a given portfolio.
     *
     * @param portofolio - The portfolio identifier or a SpinalNode instance representing the portfolio.
     * @returns A promise that resolves to an array of SpinalNode instances representing the buildings under the specified portfolio.
     * @throws {Error} If the portfolio cannot be found.
     */
    async getPortofolioBuildings(portofolio) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            throw new Error(`No portofolio found for ${portofolio}`);
        return portofolioNode.getChildren([constant_1.BUILDING_RELATION_NAME]);
    }
    /**
     * Removes a single building from a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param buildingId - The ID of the building to remove.
     * @param syncAdmin - Whether to synchronize the admin profile after removal (default: true).
     * @returns A promise that resolves to the building ID if successfully removed, or undefined if not found.
     */
    async removeBuildingFromPortofolio(portofolio, buildingId, syncAdmin = true) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return;
        const buildingNode = await this.getBuildingFromPortofolio(portofolioNode, buildingId);
        if (!(buildingNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            return;
        await portofolioNode.removeChild(buildingNode, constant_1.BUILDING_RELATION_NAME, constant_1.PTR_LST_TYPE);
        await (0, authorizationUtils_1.removeRelationFromReference)(portofolioNode, buildingNode, constant_1.BUILDING_RELATION_NAME, constant_1.PTR_LST_TYPE);
        if (syncAdmin)
            await adminProfileInstance.syncAdminProfile();
        return buildingId;
    }
    /**
     * Removes multiple buildings from a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param buildingId - An array or single building ID to remove from the portfolio.
     * @returns A promise that resolves to an array of removed building IDs.
     */
    async removeSeveralBuildingsFromPortofolio(portofolio, buildingId) {
        const portofolioNode = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
        if (!(portofolioNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
            throw new Error(`No portofolio found for ${portofolio}`);
        if (!Array.isArray(buildingId))
            buildingId = [buildingId];
        const syncAdmin = false; // We will sync the admin profile at the end of all removals
        const promises = buildingId.map((id) => this.removeBuildingFromPortofolio(portofolioNode, id, syncAdmin));
        return Promise.all(promises).then(async (data) => {
            await adminProfileInstance.syncAdminProfile();
            return data.filter((id) => id !== undefined);
        });
    }
    /**
     * Retrieves a building node from a given portfolio by its building ID.
     *
     * @param portofolio - The portfolio to search within, either as a string identifier or a SpinalNode instance.
     * @param buildingId - The unique identifier of the building to retrieve.
     * @returns A promise that resolves to the matching SpinalNode if found, or void if not found.
     */
    async getBuildingFromPortofolio(portofolio, buildingId) {
        const buildings = await this.getPortofolioBuildings(portofolio);
        return buildings.find((building) => building.getId().get() === buildingId);
    }
    _formatDetails(data) {
        return {
            ...data.node.info.get(),
            apps: (data.apps || []).map((app) => app.info.get()),
            apis: (data.apis || []).map((api) => api.info.get()),
            buildings: (data.buildings || []).map((building) => (0, buildingUtils_1.formatBuildingStructure)(building)),
        };
    }
}
exports.PortofolioService = PortofolioService;
//# sourceMappingURL=portofolio.service.js.map