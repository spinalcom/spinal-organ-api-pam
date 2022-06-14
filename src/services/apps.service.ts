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
import { CANNOT_CREATE_INTERNAL_ERROR, APP_LIST_CONTEXT_NAME, APP_LIST_CONTEXT_TYPE, APP_CATEGORY_TYPE, CONTEXT_TO_APP_CATEGORY, PTR_LST_TYPE, APP_GROUP_TYPE, CATEGORY_TO_APP_GROUP_RELATION_NAME, APP_TYPE, APP_GROUP_TO_APP_RELATION_NAME, CONTEXT_TO_APP_RELATION_NAME } from "../constant";
import { IApp, IGroup } from "../interfaces";
import { configServiceInstance } from "./configFile.service";
import { GraphService } from "./graph.service";

let spinalTwinGraph = GraphService.getInstance();

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

  public async createAppCategory(categoryName: string): Promise<SpinalNode> {

    const found = await this.getAppCategory(categoryName);

    if (found) throw new Error(`${categoryName} already exist`);


    const nodeId = SpinalGraphService.createNode({ name: categoryName, type: APP_CATEGORY_TYPE }, undefined);
    const node = SpinalGraphService.getRealNode(nodeId);

    return this.context.addChildInContext(node, CONTEXT_TO_APP_CATEGORY, PTR_LST_TYPE, this.context);
  }

  public async getAppCategory(categoryIdOrName: string): Promise<SpinalNode> {
    const node = SpinalGraphService.getRealNode(categoryIdOrName);
    if (node) return node;

    return this._findChildInContext(this.context, categoryIdOrName);
  }

  public getAllCategories(): Promise<SpinalNode[]> {
    return this.context.getChildrenInContext();
  }

  public async updateAppCategory(categoryId: string, newName: string): Promise<SpinalNode> {
    const category = await this.getAppCategory(categoryId);
    if (!category) throw new Error(`no category found for ${categoryId}`);

    category.info.name.set(newName);
    return category;
  }

  public async deleteAppCategory(categoryId: string): Promise<string> {
    const category = await this.getAppCategory(categoryId);
    if (!category) throw new Error(`no category found for ${categoryId}`);

    await category.removeFromGraph();
    return categoryId;
  }

  public async createAppGroup(categoryId: string, groupName: string): Promise<SpinalNode> {
    const found = await this.getAppGroup(categoryId, groupName);

    if (found) throw new Error(`${groupName} already exist in ${categoryId}`);

    const category = await this.getAppCategory(categoryId);
    const nodeId = SpinalGraphService.createNode({ name: groupName, type: APP_GROUP_TYPE }, undefined);
    const node = SpinalGraphService.getRealNode(nodeId);

    return category.addChildInContext(node, CATEGORY_TO_APP_GROUP_RELATION_NAME, PTR_LST_TYPE, this.context);
  }

  public async getAllGroupsInCategory(categoryId: string): Promise<SpinalNode[]> {
    const category = await this.getAppCategory(categoryId)
    return category.getChildrenInContext(this.context);
  }

  public async getAppGroup(categoryIdOrName: string, groupIdOrName: string): Promise<SpinalNode> {
    const node = SpinalGraphService.getRealNode(groupIdOrName);
    if (node) return node;

    const category = await this.getAppCategory(categoryIdOrName);
    if (!category) return;

    return this._findChildInContext(category, groupIdOrName);
  }

  public async updateAppGroup(categoryId: string, groupId: string, groupNewName: string): Promise<SpinalNode | void> {
    const group = await this.getAppGroup(categoryId, groupId);
    if (group) {
      group.info.name.set(groupNewName);
      return group;
    }
  }

  public async deleteAppGroup(categoryId: string, groupId: string): Promise<void> {
    const group = await this.getAppGroup(categoryId, groupId);
    if (group) group.removeFromGraph();
  }

  public async createApp(categoryId: string, groupId: string, appInfo: IApp): Promise<SpinalNode> {
    appInfo.type = APP_TYPE;
    const group = await this.getAppGroup(categoryId, groupId);
    if (group) {
      const appId = SpinalGraphService.createNode(appInfo, undefined);
      const node = SpinalGraphService.getRealNode(appId);
      await this.context.addChild(node, CONTEXT_TO_APP_RELATION_NAME, PTR_LST_TYPE);
      return group.addChildInContext(node, APP_GROUP_TO_APP_RELATION_NAME, PTR_LST_TYPE, this.context);
    }

    throw new Error("No group found for " + groupId);
  }


  public getAllApps(): Promise<SpinalNode[]> {
    return this.context.getChildren(CONTEXT_TO_APP_RELATION_NAME);
  }

  public async getAllAppsInGroup(categoryId: string, groupId: string): Promise<SpinalNode[]> {
    const group = await this.getAppGroup(categoryId, groupId);
    if (group) {
      return group.getChildrenInContext(this.context);
    }

    return []
  }

  public async getAppById(appId: string): Promise<void | SpinalNode> {
    const node = SpinalGraphService.getRealNode(appId);
    if (node) return node;

    const children = await this.context.getChildren(CONTEXT_TO_APP_RELATION_NAME);
    return children.find(el => el.getId().get() === appId);
  }

  public async getApp(categoryId: string, groupId: string, appId: string): Promise<SpinalNode> {
    const node = SpinalGraphService.getRealNode(appId);
    if (node) return node;

    const group = await this.getAppGroup(categoryId, groupId);
    if (!group) return;

    return this._findChildInContext(group, appId);
  }

  public async updateApp(categoryId: string, groupId: string, appId: string, newInfo: IApp): Promise<SpinalNode> {
    const appNode = await this.getApp(categoryId, groupId, appId);
    if (appNode) {
      for (const key in newInfo) {
        if (Object.prototype.hasOwnProperty.call(newInfo, key) && appNode.info[key]) {
          const element = newInfo[key];
          appNode.info[key].set(element);
        }
      }

    }
    return appNode;
  }

  public async deleteApp(categoryId: string, groupId: string, appId: string): Promise<void> {
    const appNode = await this.getApp(categoryId, groupId, appId);
    if (appNode) appNode.removeFromGraph();
  }

  private async _findChildInContext(startNode: SpinalNode, nodeIdOrName: string): Promise<SpinalNode> {
    const children = await startNode.getChildrenInContext(this.context);
    return children.find(el => {
      if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
        //@ts-ignore
        SpinalGraphService._addNode(el);
        return true;
      }
      return false;
    })
  }

}