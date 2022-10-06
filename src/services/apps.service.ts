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

    appInfo.type = ADMIN_APP_TYPE;
    const appId = SpinalGraphService.createNode(appInfo, undefined);
    const node = SpinalGraphService.getRealNode(appId);
    return groupNode.addChildInContext(node, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
  }

  public async createPortofolioApp(appInfo: IApp): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(PORTOFOLIO_APPS_GROUP_NAME, PORTOFOLIO_APPS_GROUP_TYPE, true);
    if (!groupNode) return;

    appInfo.type = PORTOFOLIO_APP_TYPE;
    const appId = SpinalGraphService.createNode(appInfo, undefined);
    const node = SpinalGraphService.getRealNode(appId);
    return groupNode.addChildInContext(node, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
  }

  public async createBuildingApp(appInfo: IApp): Promise<SpinalNode> {
    const groupNode = await this._getApplicationGroupNode(BUILDING_APPS_GROUP_NAME, BUILDING_APPS_GROUP_TYPE, true);
    if (!groupNode) return;

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

  // public async createAppCategory(categoryName: string): Promise<SpinalNode> {

  //   const found = await this.getAppCategory(categoryName);

  //   if (found) throw new Error(`${categoryName} already exist`);


  //   const nodeId = SpinalGraphService.createNode({ name: categoryName, type: APP_CATEGORY_TYPE }, undefined);
  //   const node = SpinalGraphService.getRealNode(nodeId);

  //   return this.context.addChildInContext(node, CONTEXT_TO_APP_CATEGORY_RELATION_NAME, PTR_LST_TYPE, this.context);
  // }

  // public async getAppCategory(categoryIdOrName: string): Promise<SpinalNode> {
  //   const node = SpinalGraphService.getRealNode(categoryIdOrName);
  //   if (node) return node;

  //   return this._findChildInContext(this.context, categoryIdOrName);
  // }

  // public getAllCategories(): Promise<SpinalNode[]> {
  //   return this.context.getChildrenInContext();
  // }

  // public async updateAppCategory(categoryId: string, newName: string): Promise<SpinalNode> {
  //   const category = await this.getAppCategory(categoryId);
  //   if (!category) throw new Error(`no category found for ${categoryId}`);

  //   category.info.name.set(newName);
  //   return category;
  // }

  // public async deleteAppCategory(categoryId: string): Promise<string> {
  //   const category = await this.getAppCategory(categoryId);
  //   if (!category) throw new Error(`no category found for ${categoryId}`);

  //   await category.removeFromGraph();
  //   return categoryId;
  // }

  // public async createAppGroup(categoryId: string, groupName: string): Promise<SpinalNode> {
  //   const found = await this.getAppGroup(categoryId, groupName);

  //   if (found) throw new Error(`${groupName} already exist in ${categoryId}`);

  //   const category = await this.getAppCategory(categoryId);
  //   const nodeId = SpinalGraphService.createNode({ name: groupName, type: APP_GROUP_TYPE }, undefined);
  //   const node = SpinalGraphService.getRealNode(nodeId);

  //   return category.addChildInContext(node, CATEGORY_TO_APP_GROUP_RELATION_NAME, PTR_LST_TYPE, this.context);
  // }

  // public async getAllGroupsInCategory(categoryId: string): Promise<SpinalNode[]> {
  //   const category = await this.getAppCategory(categoryId)
  //   return category.getChildrenInContext(this.context);
  // }

  // public async getAppGroup(categoryIdOrName: string, groupIdOrName: string): Promise<SpinalNode> {
  //   const node = SpinalGraphService.getRealNode(groupIdOrName);
  //   if (node) return node;

  //   const category = await this.getAppCategory(categoryIdOrName);
  //   if (!category) return;

  //   return this._findChildInContext(category, groupIdOrName);
  // }

  // public async updateAppGroup(categoryId: string, groupId: string, groupNewName: string): Promise<SpinalNode | void> {
  //   const group = await this.getAppGroup(categoryId, groupId);
  //   if (group) {
  //     group.info.name.set(groupNewName);
  //     return group;
  //   }
  // }

  // public async deleteAppGroup(categoryId: string, groupId: string): Promise<void> {
  //   const group = await this.getAppGroup(categoryId, groupId);
  //   if (group) group.removeFromGraph();
  // }

  // public async createApp(categoryId: string, groupId: string, appInfo: IApp): Promise<SpinalNode> {
  //   const category = await this.getAppCategory(categoryId);
  //   const group = await this.getAppGroup(categoryId, groupId);
  //   if (category && group) {
  //     appInfo.categoryId = categoryId;
  //     appInfo.categoryName = category.getName();
  //     appInfo.groupId = groupId;
  //     appInfo.groupName = group.getName();
  //     appInfo.type = APP_TYPE;

  //     const appId = SpinalGraphService.createNode(appInfo, undefined);
  //     const node = SpinalGraphService.getRealNode(appId);
  //     await this.context.addChild(node, CONTEXT_TO_APP_RELATION_NAME, PTR_LST_TYPE);
  //     return group.addChildInContext(node, APP_GROUP_TO_APP_RELATION_NAME, PTR_LST_TYPE, this.context);
  //   }

  //   throw new Error("No group found for " + groupId);
  // }


  // public getAllApps(): Promise<SpinalNode[]> {
  //   return this.context.getChildren(CONTEXT_TO_APP_RELATION_NAME);
  // }

  // public async getAllAppsInGroup(categoryId: string, groupId: string): Promise<SpinalNode[]> {
  //   const group = await this.getAppGroup(categoryId, groupId);
  //   if (group) {
  //     return group.getChildrenInContext(this.context);
  //   }

  //   return []
  // }

  // public async getAppById(appId: string): Promise<void | SpinalNode> {
  //   const node = SpinalGraphService.getRealNode(appId);
  //   if (node) return node;

  //   const children = await this.context.getChildren(CONTEXT_TO_APP_RELATION_NAME);
  //   return children.find(el => el.getId().get() === appId);
  // }

  // public async getApp(categoryId: string, groupId: string, appId: string): Promise<SpinalNode> {
  //   const node = SpinalGraphService.getRealNode(appId);
  //   if (node) return node;

  //   const group = await this.getAppGroup(categoryId, groupId);
  //   if (!group) return;

  //   return this._findChildInContext(group, appId);
  // }

  // public async updateApp(categoryId: string, groupId: string, appId: string, newInfo: IApp): Promise<SpinalNode> {
  //   const appNode = await this.getApp(categoryId, groupId, appId);
  //   if (appNode) {
  //     for (const key in newInfo) {
  //       if (Object.prototype.hasOwnProperty.call(newInfo, key) && appNode.info[key]) {
  //         const element = newInfo[key];
  //         appNode.info[key].set(element);
  //       }
  //     }

  //   }
  //   return appNode;
  // }

  // public async deleteApp(categoryId: string, groupId: string, appId: string): Promise<void> {
  //   const appNode = await this.getApp(categoryId, groupId, appId);
  //   if (appNode) appNode.removeFromGraph();
  // }

  // private async _findChildInContext(startNode: SpinalNode, nodeIdOrName: string): Promise<SpinalNode> {
  //   const children = await startNode.getChildrenInContext(this.context);
  //   return children.find(el => {
  //     if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
  //       //@ts-ignore
  //       SpinalGraphService._addNode(el);
  //       return true;
  //     }
  //     return false;
  //   })
  // }

}