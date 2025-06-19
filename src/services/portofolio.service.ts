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

import { SpinalContext, SpinalGraph, SpinalNode } from 'spinal-env-viewer-graph-service';

import {
  PORTOFOLIO_CONTEXT_NAME, PORTOFOLIO_CONTEXT_TYPE, PORTOFOLIO_TYPE,
  CONTEXT_TO_PORTOFOLIO_RELATION_NAME, APP_RELATION_NAME, PTR_LST_TYPE,
  BUILDING_RELATION_NAME, PORTOFOLIO_API_GROUP_TYPE, API_RELATION_NAME
} from '../constant';

import { AppService } from './apps.service';
import { IEditPortofolio, IPortofolioData, IPortofolioDetails, IBuildingCreation, IBuildingDetails, convertIEditPortofolio } from '../interfaces';
import { BuildingService } from './building.service';
import { APIService } from './apis.service';
import { AdminProfileService } from './adminProfile.service';
import { removeNodeReferences, removeRelationFromReference } from '../utils/authorizationUtils';
import { formatBuildingStructure } from '../utils/buildingUtils';
import { formatAndMergePortofolioAuthorization } from '../utils/profileUtils';

const adminProfileInstance = AdminProfileService.getInstance();

export class PortofolioService {
  private static instance: PortofolioService;
  public context: SpinalContext;
  constructor() { }

  public static getInstance(): PortofolioService {
    if (!this.instance) this.instance = new PortofolioService();

    return this.instance;
  }

  public async init(graph: SpinalGraph): Promise<SpinalContext> {
    this.context = await graph.getContext(PORTOFOLIO_CONTEXT_NAME);
    if (!this.context) {
      const spinalContext = new SpinalContext(PORTOFOLIO_CONTEXT_NAME, PORTOFOLIO_CONTEXT_TYPE);
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
  public async createPortofolio(portofolioName: string, appsIds: string[] = [], apisIds = []): Promise<IPortofolioDetails> {
    const node = new SpinalNode(portofolioName, PORTOFOLIO_TYPE);

    const apps = await this.linkSeveralAppsToPortofolio(node, appsIds);
    const apis = await this.linkSeveralApisToPortofolio(node, apisIds);

    await this.context.addChildInContext(node, CONTEXT_TO_PORTOFOLIO_RELATION_NAME, PTR_LST_TYPE, this.context);
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
  public async renamePortofolio(portfolioId: string, newName: string): Promise<boolean> {
    if (newName.trim() === '') return false;

    const portofolioNode = await this.getPortofolioNode(portfolioId);
    if (!portofolioNode) return false;

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
  public async updatePortofolio(portofolioId: string, newData: IEditPortofolio): Promise<IPortofolioDetails> {

    const portofolioNode = await this.getPortofolioNode(portofolioId);
    if (!portofolioNode) return;

    const convertedData = convertIEditPortofolio(portofolioId, newData);
    const [dataFormatted] = formatAndMergePortofolioAuthorization([convertedData]);

    if (dataFormatted) return;

    if (newData.name?.trim()) await this.renamePortofolio(portofolioId, newData.name.trim());

    if (dataFormatted.appsIds) await this.linkSeveralAppsToPortofolio(portofolioNode, dataFormatted.appsIds);
    if (dataFormatted.apisIds) await this.linkSeveralApisToPortofolio(portofolioNode, dataFormatted.apisIds);

    if (dataFormatted.unauthorizeAppsIds) await this.removeSeveralAppsFromPortofolio(portofolioNode, dataFormatted.unauthorizeAppsIds);
    if (dataFormatted.unauthorizeApisIds) await this.removeSeveralApisFromPortofolio(portofolioNode, dataFormatted.unauthorizeApisIds);

    return this.getPortofolioDetails(portofolioNode);
  }

  /**
   * Retrieves all portfolio nodes from the context.
   *
   * @returns A promise that resolves to an array of SpinalNode instances representing all portfolios.
   */
  public getAllPortofolio(): Promise<SpinalNode[]> {
    return this.context.getChildren([CONTEXT_TO_PORTOFOLIO_RELATION_NAME]);
  }

  /**
   * Retrieves a portfolio node by its ID.
   *
   * @param {string} portofolioId
   * @return {*}  {Promise<SpinalNode>}
   * @memberof PortofolioService
   */
  public async getPortofolioNode(portofolioId: string): Promise<SpinalNode> {
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
  public async getPortofolioDetails(portofolio: string | SpinalNode): Promise<IPortofolioDetails> {
    const portfolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);

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
      buildings: await Promise.all(buildings.map((el) => BuildingService.getInstance().getBuildingStructure(el))),
    };
  }


  /**
   * Retrieves the details of all portfolios in the context.
   *
   * @returns A promise that resolves to an array of IPortofolioDetails for each portfolio.
   */
  public async getAllPortofoliosDetails(): Promise<IPortofolioDetails[]> {
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
  public async removePortofolio(portofolio: string | SpinalNode): Promise<boolean> {
    try {
      const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
      const buildings = await this.getPortofolioBuildings(portofolioNode);
      const promises = buildings.map(building => BuildingService.getInstance().deleteBuildingById(building.getId().get()));
      await Promise.all(promises);

      await this.context.removeChild(portofolioNode, CONTEXT_TO_PORTOFOLIO_RELATION_NAME, PTR_LST_TYPE);
      await removeNodeReferences(portofolioNode);
      return true;
    } catch (error) {
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
  public async linkAppToPortofolio(portofolio: string | SpinalNode, applicationId: string): Promise<SpinalNode> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
    if (!(portofolioNode instanceof SpinalNode)) throw new Error(`No portofolio found for ${portofolio}`);

    const appNode = await AppService.getInstance().getPortofolioAppById(applicationId);
    if (!appNode || !(appNode instanceof SpinalNode)) return;

    const appsAreadyLinked = await portofolioNode.getChildrenIds();
    const isChild = appsAreadyLinked.find((el) => el === applicationId);

    if (isChild) return appNode;

    return portofolioNode.addChildInContext(appNode, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
  }


  /**
   * Links multiple applications to a portfolio node.
   *
   * @param portofolio - The portfolio node or its ID.
   * @param applicationIds - An array of application IDs to link to the portfolio.
   * @returns A promise that resolves to an array of linked SpinalNode instances.
   */
  public async linkSeveralAppsToPortofolio(portofolio: string | SpinalNode, applicationIds: string[]): Promise<SpinalNode[]> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);

    if (!(portofolioNode instanceof SpinalNode)) throw new Error(`No portofolio found for ${portofolio}`);

    if (!Array.isArray(applicationIds)) applicationIds = [applicationIds];
    const promises = applicationIds.map((appId) => this.linkAppToPortofolio(portofolioNode, appId));

    return Promise.all(promises).then(async (apps) => {
      await adminProfileInstance.syncAdminProfile();
      return apps.filter((app) => app instanceof SpinalNode);
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
  public async getPortofolioApps(portofolio: string | SpinalNode): Promise<SpinalNode[]> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);

    if (!(portofolioNode instanceof SpinalNode)) return [];

    return portofolioNode.getChildren([APP_RELATION_NAME]);
  }

  /**
   * Retrieves an application node from a given portfolio by its application ID.
   *
   * @param portofolio - The portfolio to search within, either as a string identifier or a `SpinalNode` instance.
   * @param appId - The unique identifier of the application to retrieve.
   * @returns A promise that resolves to the `SpinalNode` representing the application if found, or `undefined` if not found.
   */
  public async getAppFromPortofolio(portofolio: string | SpinalNode, appId: string): Promise<SpinalNode> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);

    if (!(portofolioNode instanceof SpinalNode)) return;

    const appsLinked = await portofolioNode.getChildren([APP_RELATION_NAME]);
    return appsLinked.find((app) => app.getId().get() === appId);
  }

  /**
   * Removes a single application from a portfolio node.
   *
   * @param portofolio - The portfolio node or its ID.
   * @param applicationId - The ID of the application to remove.
   * @returns A promise that resolves to the application ID if successfully removed, or undefined if not found.
   */
  public async removeAppFromPortofolio(portofolio: string | SpinalNode, applicationId: string): Promise<string> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);

    if (!(portofolioNode instanceof SpinalNode)) throw new Error(`No portofolio found for ${portofolio}`);

    const appNode = await this.getAppFromPortofolio(portofolioNode, applicationId);
    if (!(appNode instanceof SpinalNode)) return;

    await portofolioNode.removeChild(appNode, APP_RELATION_NAME, PTR_LST_TYPE);
    return applicationId;
  }

  /**
   * Removes multiple applications from a portfolio node.
   *
   * @param portofolio - The portfolio node or its ID.
   * @param applicationIds - An array or single application ID to remove from the portfolio.
   * @returns A promise that resolves to an array of removed application IDs.
   */
  public async removeSeveralAppsFromPortofolio(portofolio: string | SpinalNode, applicationIds: string | string[]): Promise<string[]> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);

    if (!(portofolioNode instanceof SpinalNode)) throw new Error(`No portofolio found for ${portofolio}`);

    if (!Array.isArray(applicationIds)) applicationIds = [applicationIds];

    const promises = applicationIds.map(async (appId: string) => this.removeAppFromPortofolio(portofolioNode, appId))

    return Promise.all(promises).then(async (data) => {
      await adminProfileInstance.syncAdminProfile();
      return data.filter((appId) => appId !== undefined);
    })
  }

  /**
   * Checks if a given portfolio contains an application with the specified appId.
   *
   * @param portofolio - The portfolio to check, either as a string identifier or a SpinalNode instance.
   * @param appId - The unique identifier of the application to search for.
   * @returns A promise that resolves to the SpinalNode representing the application if found, or void if not found.
   */
  public async portofolioHasApp(portofolio: string | SpinalNode, appId: string): Promise<SpinalNode | void> {
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
  public async linkApiToPortofolio(portofolio: string | SpinalNode, apiId: string): Promise<SpinalNode> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
    if (!(portofolioNode instanceof SpinalNode)) throw new Error(`No portofolio found for ${portofolio}`);

    const apiNode = await APIService.getInstance().getApiRouteById(apiId, PORTOFOLIO_API_GROUP_TYPE);
    if (!(apiNode instanceof SpinalNode)) return;

    const apisAreadyLinked = await portofolioNode.getChildrenIds();
    const isChild = apisAreadyLinked.find((el) => el === apiId);
    if (isChild) return apiNode;

    return portofolioNode.addChildInContext(apiNode, API_RELATION_NAME, PTR_LST_TYPE, this.context);
  }


  /**
   * Links multiple APIs to a portfolio node.
   *
   * @param portofolio - The portfolio node or its ID.
   * @param apisIds - An array or single API ID to link to the portfolio.
   * @returns A promise that resolves to an array of linked SpinalNode instances.
   */
  public async linkSeveralApisToPortofolio(portofolio: string | SpinalNode, apisIds: string | string[]): Promise<SpinalNode[]> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);

    if (!(portofolioNode instanceof SpinalNode)) throw new Error(`No portofolio found for ${portofolio}`);

    if (!Array.isArray(apisIds)) apisIds = [apisIds];

    const promises = apisIds.map((apiId) => this.linkApiToPortofolio(portofolioNode, apiId));

    return Promise.all(promises).then(async (apis) => {
      await adminProfileInstance.syncAdminProfile();
      return apis.filter((api) => api instanceof SpinalNode);
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
  public async getPortofolioApis(portofolio: string | SpinalNode): Promise<SpinalNode[]> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);

    if (!(portofolioNode instanceof SpinalNode)) return [];
    return portofolioNode.getChildren([API_RELATION_NAME]);
  }

  /**
   * Retrieves a specific API node linked to a given portfolio by its API ID.
   *
   * @param portofolio - The portfolio identifier or a SpinalNode instance representing the portfolio.
   * @param apiId - The unique identifier of the API to retrieve.
   * @returns A promise that resolves to the SpinalNode representing the API if found, or `undefined` if not found.
   */
  public async getApiFromPortofolio(portofolio: string | SpinalNode, apiId: string): Promise<SpinalNode> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);

    if (!(portofolioNode instanceof SpinalNode)) return;

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
  public async removeApiFromPortofolio(portofolio: string | SpinalNode, apiId: string): Promise<string> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);

    if (!(portofolioNode instanceof SpinalNode)) return;

    const apiNode = await this.getApiFromPortofolio(portofolioNode, apiId);
    if (!(apiNode instanceof SpinalNode)) return;

    await portofolioNode.removeChild(apiNode, API_RELATION_NAME, PTR_LST_TYPE);
    return apiId;
  }


  /**
   * Removes multiple APIs from a portfolio node.
   *
   * @param portofolio - The portfolio node or its ID.
   * @param apisIds - An array or single API ID to remove from the portfolio.
   * @returns A promise that resolves to an array of removed API IDs.
   */
  public async removeSeveralApisFromPortofolio(portofolio: string | SpinalNode, apisIds: string | string[]): Promise<string[]> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);

    if (!(portofolioNode instanceof SpinalNode)) throw new Error(`No portofolio found for ${portofolio}`);

    if (!Array.isArray(apisIds)) apisIds = [apisIds];

    const promises = apisIds.map(async (apiId: string) => this.removeApiFromPortofolio(portofolioNode, apiId));

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
  public async portofolioHasApi(portofolio: string | SpinalNode, apiId: string): Promise<SpinalNode | void> {
    const apps = await this.getPortofolioApis(portofolio);
    return apps.find((el) => el.getId().get() === apiId);
  }

  public async uploadSwaggerFile(buffer: Buffer): Promise<any[]> {
    return APIService.getInstance().createRoutesFromSwaggerFile(buffer, PORTOFOLIO_API_GROUP_TYPE);
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
  public async linkBuildingToPortofolio(portofolio: string | SpinalNode, buildingInfo: IBuildingCreation): Promise<IBuildingDetails> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
    if (!(portofolioNode instanceof SpinalNode))
      throw new Error(`No portofolio found for ${portofolio}`);

    const structure = await BuildingService.getInstance().createBuilding(buildingInfo);

    await portofolioNode.addChildInContext(structure.node, BUILDING_RELATION_NAME, PTR_LST_TYPE, this.context);
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
  public async getPortofolioBuildings(portofolio: string | SpinalNode): Promise<SpinalNode[]> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
    if (!(portofolioNode instanceof SpinalNode))
      throw new Error(`No portofolio found for ${portofolio}`);

    return portofolioNode.getChildren([BUILDING_RELATION_NAME]);
  }

  /**
   * Removes a single building from a portfolio node.
   *
   * @param portofolio - The portfolio node or its ID.
   * @param buildingId - The ID of the building to remove.
   * @param syncAdmin - Whether to synchronize the admin profile after removal (default: true).
   * @returns A promise that resolves to the building ID if successfully removed, or undefined if not found.
   */
  public async removeBuildingFromPortofolio(portofolio: string | SpinalNode, buildingId: string, syncAdmin: boolean = true): Promise<string> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
    if (!(portofolioNode instanceof SpinalNode)) return;

    const buildingNode = await this.getBuildingFromPortofolio(portofolioNode, buildingId);
    if (!(buildingNode instanceof SpinalNode)) return;
    await portofolioNode.removeChild(buildingNode, BUILDING_RELATION_NAME, PTR_LST_TYPE);
    await removeRelationFromReference(portofolioNode, buildingNode, BUILDING_RELATION_NAME, PTR_LST_TYPE);
    if (syncAdmin) await adminProfileInstance.syncAdminProfile();

    return buildingId;
  }

  /**
   * Removes multiple buildings from a portfolio node.
   *
   * @param portofolio - The portfolio node or its ID.
   * @param buildingId - An array or single building ID to remove from the portfolio.
   * @returns A promise that resolves to an array of removed building IDs.
   */
  public async removeSeveralBuildingsFromPortofolio(portofolio: string | SpinalNode, buildingId: string | string[]): Promise<string[]> {
    const portofolioNode = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolioNode(portofolio);
    if (!(portofolioNode instanceof SpinalNode))
      throw new Error(`No portofolio found for ${portofolio}`);

    if (!Array.isArray(buildingId)) buildingId = [buildingId];

    const syncAdmin = false; // We will sync the admin profile at the end of all removals
    const promises = buildingId.map((id: string) => this.removeBuildingFromPortofolio(portofolioNode, id, syncAdmin));

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
  public async getBuildingFromPortofolio(portofolio: string | SpinalNode, buildingId: string): Promise<SpinalNode | void> {
    const buildings = await this.getPortofolioBuildings(portofolio);
    return buildings.find((building) => building.getId().get() === buildingId);
  }

  public _formatDetails(data: IPortofolioDetails): IPortofolioData {
    return {
      ...data.node.info.get(),
      apps: (data.apps || []).map((app) => app.info.get()),
      apis: (data.apis || []).map((api) => api.info.get()),
      buildings: (data.buildings || []).map((building) => formatBuildingStructure(building)),
    };
  }
}
