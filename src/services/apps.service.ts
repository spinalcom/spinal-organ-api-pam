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

import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { APP_LIST_CONTEXT_NAME, APP_LIST_CONTEXT_TYPE, PTR_LST_TYPE, CONTEXT_TO_APPS_GROUP, ADMIN_APPS_GROUP_NAME, ADMIN_APPS_GROUP_TYPE, APP_RELATION_NAME, ADMIN_APP_TYPE, PORTOFOLIO_APPS_GROUP_NAME, PORTOFOLIO_APPS_GROUP_TYPE, PORTOFOLIO_APP_TYPE, BUILDING_APPS_GROUP_NAME, BUILDING_APPS_GROUP_TYPE, BUILDING_APP_TYPE } from "../constant";
import { IApp } from "../interfaces";
import { BuildingService } from "./building.service";
import { PortofolioService } from "./portofolio.service";
import { AdminProfileService } from "./adminProfile.service";
import { convertAndFormatFileUploaded } from "../utils/applicationUtils";
import { removeNodeReferences } from "../utils/authorizationUtils";

export const AppsType = {
  admin: "admin",
  building: "building",
  portofolio: "portofolio"
} as const;


export class AppService {
  private static instance: AppService;
  public context: SpinalContext;

  private constructor() { }

  public static getInstance(): AppService {
    if (!this.instance) {
      this.instance = new AppService();
    }

    return this.instance;
  }

  public async init(graph: SpinalGraph) {
    this.context = await graph.getContext(APP_LIST_CONTEXT_NAME);
    if (!this.context) {
      const spinalContext = new SpinalContext(APP_LIST_CONTEXT_NAME, APP_LIST_CONTEXT_TYPE);
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
  public async createAdminApp(appInfo: IApp): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(ADMIN_APPS_GROUP_NAME, ADMIN_APPS_GROUP_TYPE, true);
    if (!groupNode) return;

    const applications = await groupNode.getChildren([APP_RELATION_NAME]);
    const appExist = applications.find(app => app.getName().get().toLowerCase() === appInfo.name.toLowerCase());
    if (appExist) return appExist;

    appInfo = Object.assign({}, appInfo, { type: ADMIN_APP_TYPE });

    const appId = SpinalGraphService.createNode(appInfo, undefined); // Create the app node with the provided info
    const appNode = SpinalGraphService.getRealNode(appId);
    await AdminProfileService.getInstance().addAppToAdminProfil(appNode);
    return groupNode.addChildInContext(appNode, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
  }

  /**
   * Creates a new Portofolio App node if it does not already exist.
   * @param appInfo - The information for the Portofolio App.
   * @returns The created or existing SpinalNode.
   */
  public async createPortofolioApp(appInfo: IApp): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(PORTOFOLIO_APPS_GROUP_NAME, PORTOFOLIO_APPS_GROUP_TYPE, true);
    if (!groupNode) return;

    const children = await groupNode.getChildren([APP_RELATION_NAME]);
    const appExist = children.find(el => el.getName().get().toLowerCase() === appInfo.name.toLowerCase());
    if (appExist) return appExist;

    appInfo = Object.assign({}, appInfo, { type: PORTOFOLIO_APP_TYPE });

    const appId = SpinalGraphService.createNode(appInfo, undefined);
    const node = SpinalGraphService.getRealNode(appId);
    return groupNode.addChildInContext(node, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
  }

  /**
   * Creates a new Building App node if it does not already exist.
   * @param appInfo - The information for the Building App.
   * @returns The created or existing SpinalNode.
   */
  public async createBuildingApp(appInfo: IApp): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(BUILDING_APPS_GROUP_NAME, BUILDING_APPS_GROUP_TYPE, true);
    if (!groupNode) return;

    const children = await groupNode.getChildren([APP_RELATION_NAME]);
    const appExist = children.find(el => el.getName().get().toLowerCase() === appInfo.name.toLowerCase());
    if (appExist) return appExist;

    appInfo = Object.assign({}, appInfo, { type: BUILDING_APP_TYPE });

    const appId = SpinalGraphService.createNode(appInfo, undefined);
    const node = SpinalGraphService.getRealNode(appId);
    return groupNode.addChildInContext(node, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
  }



  //////////////////////////////////
  //              GET             //
  //////////////////////////////////


  /**
   * Retrieves all Admin App nodes.
   * @returns Promise resolving to an array of SpinalNode representing admin apps.
   */
  public async getAllAdminApps(): Promise<SpinalNode[]> {
    const groupNode = await this._getApplicationGroupNode(ADMIN_APPS_GROUP_NAME, ADMIN_APPS_GROUP_TYPE);
    if (!groupNode) return [];
    return groupNode.getChildren([APP_RELATION_NAME]);
  }

  /**
   * Retrieves all Portofolio App nodes.
   * @returns Promise resolving to an array of SpinalNode representing portofolio apps.
   */
  public async getAllPortofolioApps(): Promise<SpinalNode[]> {
    const groupNode = await this._getApplicationGroupNode(PORTOFOLIO_APPS_GROUP_NAME, PORTOFOLIO_APPS_GROUP_TYPE);
    if (!groupNode) return [];
    return groupNode.getChildren([APP_RELATION_NAME]);
  }

  /**
   * Retrieves all Building App nodes.
   * @returns Promise resolving to an array of SpinalNode representing building apps.
   */
  public async getAllBuildingApps(): Promise<SpinalNode[]> {
    const groupNode = await this._getApplicationGroupNode(BUILDING_APPS_GROUP_NAME, BUILDING_APPS_GROUP_TYPE);
    if (!groupNode) return [];
    return groupNode.getChildren([APP_RELATION_NAME]);
  }

  /**
   * Retrieves a specific Admin App node by its ID.
   * @param appId - The ID of the Admin App.
   * @returns Promise resolving to the SpinalNode or undefined if not found.
   */
  public async getAdminAppById(appId: string): Promise<SpinalNode> {
    const children = await this.getAllAdminApps();
    return children.find(el => el.getId().get() === appId);
  }

  /**
   * Retrieves a specific Portofolio App node by its ID.
   * @param appId - The ID of the Portofolio App.
   * @returns Promise resolving to the SpinalNode or undefined if not found.
   */
  public async getPortofolioAppById(appId: string): Promise<SpinalNode> {
    const children = await this.getAllPortofolioApps();
    return children.find(el => el.getId().get() === appId);
  }

  /**
   * Retrieves a specific Building App node by its ID.
   * @param appId - The ID of the Building App.
   * @returns Promise resolving to the SpinalNode or undefined if not found.
   */
  public async getBuildingAppById(appId: string): Promise<SpinalNode> {
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
  public async updateAdminApp(appId: string, newInfo: IApp): Promise<SpinalNode> {
    const appNode = await this.getAdminAppById(appId);
    if (!appNode) return;

    const { id, ...appInfo } = newInfo; // Exclude the id from the appInfo to avoid overwriting it

    for (const key in appInfo) {
      if (Object.prototype.hasOwnProperty.call(appInfo, key)) {
        const element = appInfo[key];
        if (typeof appNode.info[key] === "undefined") appNode.info.add_attr({ [key]: element });
        if (appNode.info[key]) appNode.info[key].set(element);
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
  public async updatePortofolioApp(appId: string, newInfo: IApp): Promise<SpinalNode> {
    const appNode = await this.getPortofolioAppById(appId);
    if (!appNode) return;

    const { id, ...appInfo } = newInfo; // Exclude the id from the appInfo to avoid overwriting it

    for (const key in appInfo) {
      if (Object.prototype.hasOwnProperty.call(appInfo, key)) {
        const element = appInfo[key];
        if (typeof appNode.info[key] === "undefined") appNode.info.add_attr({ [key]: element });
        if (appNode.info[key]) appNode.info[key].set(element);
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
  public async updateBuildingApp(appId: string, newInfo: IApp): Promise<SpinalNode> {
    const appNode = await this.getBuildingAppById(appId);
    if (!appNode) return;

    const { id, ...appInfo } = newInfo; // Exclude the id from the appInfo to avoid overwriting it

    for (const key in appInfo) {
      if (Object.prototype.hasOwnProperty.call(appInfo, key)) {
        const element = appInfo[key];
        if (typeof appNode.info[key] === "undefined") appNode.info.add_attr({ [key]: element });
        if (appNode.info[key]) appNode.info[key].set(element);
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
  public async deleteAdminApp(appId: string): Promise<boolean> {
    const appNode = await this.getAdminAppById(appId);
    if (!appNode) return false;

    await appNode.removeFromGraph();
    await removeNodeReferences(appNode);
    return true;
  }

  /**
   * Deletes a Portofolio App node by its ID.
   * If the app does not exist, it returns false.
   * @param {string} appId
   * @return {*}  {Promise<boolean>}
   * @memberof AppService
   */
  public async deletePortofolioApp(appId: string): Promise<boolean> {
    const appNode = await this.getPortofolioAppById(appId);
    if (!appNode) return false;

    await appNode.removeFromGraph();
    await removeNodeReferences(appNode);
    return true;
  }

  /**
   * Deletes a Building App node by its ID.
   * If the app does not exist, it returns false.
   * @param {string} appId
   * @return {*}  {Promise<boolean>}
   * @memberof AppService
   */
  public async deleteBuildingApp(appId: string): Promise<boolean> {
    const appNode = await this.getBuildingAppById(appId);
    if (!appNode) return false;

    await appNode.removeFromGraph();
    await removeNodeReferences(appNode);
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
  public async linkAppToPortofolio(portfolioId: string, appId: string): Promise<SpinalNode> {
    return PortofolioService.getInstance().linkAppToPortofolio(portfolioId, appId);

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
  public async linkAppToBuilding(buildingId: string, appId: string): Promise<boolean> {
    const building = await BuildingService.getInstance().getBuildingById(buildingId);
    if (!(building instanceof SpinalNode)) return false;
    const app = await this.getBuildingAppById(appId);
    if (!(app instanceof SpinalNode)) return false;

    try {
      await building.addChild(app, APP_RELATION_NAME, PTR_LST_TYPE);
    } catch (error) { }

    return true
  }

  //////////////////////////////////
  //         EXCEl / JSON         //
  //////////////////////////////////


  public async uploadApps(appType: string, fileData: Buffer, isExcel: boolean = false): Promise<SpinalNode[]> {
    const apps: IApp[] = await convertAndFormatFileUploaded(fileData, isExcel);

    // Map each app type to its corresponding creation method
    const appTypeToMethod = {
      [AppsType.admin]: this.createAdminApp.bind(this),
      [AppsType.portofolio]: this.createPortofolioApp.bind(this),
      [AppsType.building]: this.createBuildingApp.bind(this)
    } as const;

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

    })

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

  private async _getApplicationGroupNode(appGroupName: string, appGroupType: string, createGroupIfNotExist: boolean = false): Promise<SpinalNode | void> {
    const appsGroups = await this.context.getChildren([CONTEXT_TO_APPS_GROUP]);

    const found = appsGroups.find(appsGroup => appsGroup.getName().get() === appGroupName && appsGroup.getType().get() === appGroupType);
    if (found || !createGroupIfNotExist) return found;

    const node = new SpinalNode(appGroupName, appGroupType);
    return this.context.addChildInContext(node, CONTEXT_TO_APPS_GROUP, PTR_LST_TYPE, this.context);
  }


}