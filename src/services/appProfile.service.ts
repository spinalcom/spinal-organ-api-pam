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

import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from 'spinal-env-viewer-graph-service';
import { PTR_LST_TYPE, APP_PROFILE_CONTEXT_NAME, APP_PROFILE_CONTEXT_TYPE, APP_PROFILE_TYPE, CONTEXT_TO_APP_CATEGORY, CONTEXT_TO_APP_PROFILE_RELATION_NAME } from '../constant';

import { IAppProfile } from '../interfaces';
import { configServiceInstance } from './configFile.service';



export class AppProfileService {

  private static instance: AppProfileService;
  public context: SpinalContext;

  private constructor() { }

  public static getInstance(): AppProfileService {
    if (!this.instance) {
      this.instance = new AppProfileService();
    }

    return this.instance;
  }

  public async init(): Promise<SpinalContext> {
    this.context = await configServiceInstance.getContext(APP_PROFILE_CONTEXT_NAME);
    if (!this.context) this.context = await configServiceInstance.addContext(APP_PROFILE_CONTEXT_NAME, APP_PROFILE_CONTEXT_TYPE);
    return this.context;
  }

  public async createAppProfile(appProfile: IAppProfile): Promise<SpinalNode> {
    appProfile.type = APP_PROFILE_TYPE;

    const profileId = SpinalGraphService.createNode(appProfile, new SpinalGraph(appProfile.name));
    const node = SpinalGraphService.getRealNode(profileId);

    return this.context.addChildInContext(node, CONTEXT_TO_APP_PROFILE_RELATION_NAME, PTR_LST_TYPE, this.context);
  }

  public async getAppProfile(appProfileId: string): Promise<void | SpinalNode> {
    const node = SpinalGraphService.getRealNode(appProfileId);
    if (node) return node;

    return this._findChildInContext(this.context, appProfileId)
  }

  public async getAllAppProfile(): Promise<SpinalNode[]> {
    return this.context.getChildrenInContext();
  }

  public async updateAppProfile(appProfileId: string, newData: IAppProfile): Promise<SpinalNode> {
    delete newData.id;
    delete newData.type;

    const node = await this.getAppProfile(appProfileId);
    if (!node) throw new Error(`no app profile Found for ${appProfileId}`);

    for (const key in newData) {
      if (Object.prototype.hasOwnProperty.call(newData, key) && node.info[key]) {
        const element = newData[key];
        node.info[key].set(element);
      }
    }

    return node;
  }

  public async deleteAppProfile(appProfileId: string): Promise<string> {
    const node = await this.getAppProfile(appProfileId);
    if (!node) throw new Error(`no app profile Found for ${appProfileId}`);
    await node.removeFromGraph();
    return appProfileId;
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
