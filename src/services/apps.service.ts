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

import { SpinalContext, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { APP_LIST_CONTEXT_NAME, APP_LIST_CONTEXT_TYPE, APP_CATEGORY_TYPE, PTR_LST_TYPE, APP_GROUP_TYPE, APP_TYPE, CONTEXT_TO_APPS_GROUP, ADMIN_APPS_GROUP_NAME, ADMIN_APPS_GROUP_TYPE, APP_RELATION_NAME, ADMIN_APP_TYPE, PORTOFOLIO_APPS_GROUP_NAME, PORTOFOLIO_APPS_GROUP_TYPE, PORTOFOLIO_APP_TYPE, BUILDING_APPS_GROUP_NAME, BUILDING_APPS_GROUP_TYPE, BUILDING_APP_TYPE } from "../constant";
import { IApp, IEditApp, IGroup } from "../interfaces";
import { BuildingService } from "./building.service";
import { configServiceInstance } from "./configFile.service";
import { PortofolioService } from "./portofolio.service";
import { SpinalExcelManager } from "spinal-env-viewer-plugin-excel-manager-service";

export const AppsType = Object.freeze({
  admin: "admin",
  building: "building",
  portofolio: "portofolio"
})

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

  public async init() {
    this.context = await configServiceInstance.getContext(APP_LIST_CONTEXT_NAME);
    if (!this.context) this.context = await configServiceInstance.addContext(APP_LIST_CONTEXT_NAME, APP_LIST_CONTEXT_TYPE);
    return this.context;
  }

  //////////////////////////////////
  //              CREATE          //
  //////////////////////////////////
  public async createAdminApp(appInfo: IApp): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(ADMIN_APPS_GROUP_NAME, ADMIN_APPS_GROUP_TYPE, true);
    if (!groupNode) return;

    const children = await groupNode.getChildren([APP_RELATION_NAME]);
    const appExist = children.find(el => el.getName().get() === appInfo.name);
    if (appExist) return appExist;

    appInfo.type = ADMIN_APP_TYPE;
    const appId = SpinalGraphService.createNode(appInfo, undefined);
    const node = SpinalGraphService.getRealNode(appId);
    return groupNode.addChildInContext(node, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
  }

  public async createPortofolioApp(appInfo: IApp): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(PORTOFOLIO_APPS_GROUP_NAME, PORTOFOLIO_APPS_GROUP_TYPE, true);
    if (!groupNode) return;

    const children = await groupNode.getChildren([APP_RELATION_NAME]);
    const appExist = children.find(el => el.getName().get() === appInfo.name);
    if (appExist) return appExist;

    appInfo.type = PORTOFOLIO_APP_TYPE;
    const appId = SpinalGraphService.createNode(appInfo, undefined);
    const node = SpinalGraphService.getRealNode(appId);
    return groupNode.addChildInContext(node, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
  }

  public async createBuildingApp(appInfo: IApp): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(BUILDING_APPS_GROUP_NAME, BUILDING_APPS_GROUP_TYPE, true);
    if (!groupNode) return;

    const children = await groupNode.getChildren([APP_RELATION_NAME]);
    const appExist = children.find(el => el.getName().get() === appInfo.name);
    if (appExist) return appExist;

    appInfo.type = BUILDING_APP_TYPE;
    const appId = SpinalGraphService.createNode(appInfo, undefined);
    const node = SpinalGraphService.getRealNode(appId);
    return groupNode.addChildInContext(node, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
  }


  //////////////////////////////////
  //              GET             //
  //////////////////////////////////
  public async getAllAdminApps(): Promise<SpinalNode[]> {
    const groupNode = await this._getApplicationGroupNode(ADMIN_APPS_GROUP_NAME, ADMIN_APPS_GROUP_TYPE);
    if (!groupNode) return [];
    return groupNode.getChildren([APP_RELATION_NAME]);
  }

  public async getAllPortofolioApps(): Promise<SpinalNode[]> {
    const groupNode = await this._getApplicationGroupNode(PORTOFOLIO_APPS_GROUP_NAME, PORTOFOLIO_APPS_GROUP_TYPE);
    if (!groupNode) return [];
    return groupNode.getChildren([APP_RELATION_NAME]);
  }

  public async getAllBuildingApps(): Promise<SpinalNode[]> {
    const groupNode = await this._getApplicationGroupNode(BUILDING_APPS_GROUP_NAME, BUILDING_APPS_GROUP_TYPE);
    if (!groupNode) return [];
    return groupNode.getChildren([APP_RELATION_NAME]);
  }

  public async getAdminApp(appId: string): Promise<SpinalNode> {
    const children = await this.getAllAdminApps();
    return children.find(el => el.getId().get() === appId);
  }

  public async getPortofolioApp(appId: string): Promise<SpinalNode> {
    const children = await this.getAllPortofolioApps();
    return children.find(el => el.getId().get() === appId);
  }

  public async getBuildingApp(appId: string): Promise<SpinalNode> {
    const children = await this.getAllBuildingApps();
    return children.find(el => el.getId().get() === appId);
  }


  //////////////////////////////////
  //              UPDATES         //
  //////////////////////////////////
  public async updateAdminApp(appId: string, newInfo: IEditApp): Promise<SpinalNode> {
    const appNode = await this.getAdminApp(appId);

    if (appNode) {
      for (const key in newInfo) {
        if (Object.prototype.hasOwnProperty.call(newInfo, key) && appNode.info[key]) {
          const element = newInfo[key];
          appNode.info[key].set(element);
        }
      }

      return appNode
    }

  }

  public async updatePortofolioApp(appId: string, newInfo: IEditApp): Promise<SpinalNode> {
    const appNode = await this.getPortofolioApp(appId);

    if (appNode) {
      for (const key in newInfo) {
        if (Object.prototype.hasOwnProperty.call(newInfo, key) && appNode.info[key]) {
          const element = newInfo[key];
          appNode.info[key].set(element);
        }
      }

      return appNode;
    }
  }

  public async updateBuildingApp(appId: string, newInfo: IEditApp): Promise<SpinalNode> {
    const appNode = await this.getBuildingApp(appId);

    if (appNode) {
      for (const key in newInfo) {
        if (Object.prototype.hasOwnProperty.call(newInfo, key) && appNode.info[key]) {
          const element = newInfo[key];
          appNode.info[key].set(element);
        }
      }

      return appNode;
    }
  }


  //////////////////////////////////
  //              DELETE          //
  //////////////////////////////////

  public async deleteAdminApp(appId: string): Promise<boolean> {
    const appNode = await this.getAdminApp(appId);
    if (appNode) {
      await appNode.removeFromGraph();
      return true;
    }
    return false;
  }

  public async deletePortofolioApp(appId: string): Promise<boolean> {
    const appNode = await this.getPortofolioApp(appId);
    if (appNode) {
      await appNode.removeFromGraph();
      return true;
    }
    return false;
  }

  public async deleteBuildingApp(appId: string): Promise<boolean> {
    const appNode = await this.getBuildingApp(appId);
    if (appNode) {
      await appNode.removeFromGraph();
      return true;
    }
    return false;
  }

  //////////////////////////////////
  //              LINK            //
  //////////////////////////////////


  public async linkAppToPortofolio(portfolioId: string, appId: string): Promise<boolean> {
    const portofolio = await PortofolioService.getInstance().getPortofolio(portfolioId);
    if (!(portofolio instanceof SpinalNode)) return false;
    const app = await this.getPortofolioApp(appId);
    if (!(app instanceof SpinalNode)) return false;

    try {
      await portofolio.addChild(app, APP_RELATION_NAME, PTR_LST_TYPE);
    } catch (error) { }

    return true
  }

  public async linkAppToBuilding(buildingId: string, appId: string): Promise<boolean> {
    const building = await BuildingService.getInstance().getBuildingById(buildingId);
    if (!(building instanceof SpinalNode)) return false;
    const app = await this.getBuildingApp(appId);
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
    let data;
    if (!isExcel) data = JSON.parse(JSON.stringify(fileData.toString()));
    else data = await this._convertExcelToJson(fileData);

    const formattedApps = this._formatAppsJson(data);

    return formattedApps.reduce(async (prom, item) => {
      const liste = await prom;

      try {
        let app;

        if (appType === AppsType.admin) app = await this.createAdminApp(item);
        else if (appType === AppsType.portofolio) app = await this.createPortofolioApp(item);
        else if (appType === AppsType.building) app = await this.createBuildingApp(item);

        liste.push(app)
      } catch (error) { }

      return liste;
    }, Promise.resolve([]))

  }


  //////////////////////////////////
  //              PRIVATES        //
  //////////////////////////////////

  private async _getApplicationGroupNode(name: string, type: string, createIt: boolean = false): Promise<SpinalNode | void> {
    const children = await this.context.getChildren([CONTEXT_TO_APPS_GROUP]);

    const found = children.find(el => el.getName().get() === name && el.getType().get() === type);
    if (found || !createIt) return found;

    const node = new SpinalNode(name, type);
    return this.context.addChildInContext(node, CONTEXT_TO_APPS_GROUP, PTR_LST_TYPE, this.context);
  }


  private async _convertExcelToJson(excelData: Buffer) {
    const data = await SpinalExcelManager.convertExcelToJson(excelData);
    return Object.values(data).flat();
  }

  private _formatAppsJson(jsonData: IApp[]): IApp[] {
    return jsonData.reduce((liste, app) => {
      const requiredAttrs = ["name", "icon", "tags", "categoryName", "groupName"];

      const notValid = requiredAttrs.find(el => !app[el]);
      if (!notValid) {
        app.hasViewer = app.hasViewer || false;
        app.packageName = app.packageName || app.name;
        if (typeof app.tags === "string") app.tags = (<any>app.tags).split(",")

        liste.push(app);
      }

      return liste;
    }, [])

  }

}