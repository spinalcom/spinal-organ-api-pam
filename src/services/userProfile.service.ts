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

import { SpinalGraphService, SpinalGraph, SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
import { USER_PROFILE_TYPE, PTR_LST_TYPE, CONTEXT_TO_USER_PROFILE_RELATION_NAME, USER_PROFILE_CONTEXT_NAME, USER_LIST_CONTEXT_TYPE, USER_PROFILE_CONTEXT_TYPE } from '../constant';
import { IUserProfile } from '../interfaces';
import { configServiceInstance } from './configFile.service';


export class UserProfileService {
  private static instance: UserProfileService;
  public context: SpinalContext;
  private constructor() { }

  public static getInstance(): UserProfileService {
    if (!this.instance) {
      this.instance = new UserProfileService();
    }

    return this.instance;
  }


  public async init(): Promise<SpinalContext> {
    this.context = await configServiceInstance.getContext(USER_PROFILE_CONTEXT_NAME);
    if (!this.context) this.context = await configServiceInstance.addContext(USER_PROFILE_CONTEXT_NAME, USER_PROFILE_CONTEXT_TYPE);
    return this.context;
  }


  public async createUserProfile(userProfile: IUserProfile): Promise<SpinalNode> {
    userProfile.type = USER_PROFILE_TYPE;

    const profileId = SpinalGraphService.createNode(userProfile, new SpinalGraph(userProfile.name));
    const node = SpinalGraphService.getRealNode(profileId);

    return this.context.addChildInContext(node, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PTR_LST_TYPE, this.context);
  }


  public async getUserProfile(userProfileId: string): Promise<void | SpinalNode> {
    const node = SpinalGraphService.getRealNode(userProfileId);
    if (node) return node;

    return this._findChildInContext(this.context, userProfileId)
  }

  public async getAllUserProfile(): Promise<SpinalNode[]> {
    return this.context.getChildrenInContext();
  }

  public async updateUserProfile(userProfileId: string, userProfile: IUserProfile): Promise<SpinalNode> {
    if (typeof userProfileId === 'undefined' || typeof userProfile === 'undefined') {
      return;
    }
    const node = await this.getUserProfile(userProfileId);
    if (!node) throw new Error(`no user profile Found for ${userProfileId}`);

    for (const key in userProfile) {
      if (Object.prototype.hasOwnProperty.call(userProfile, key) && node.info[key]) {
        const element = userProfile[key];
        node.info[key].set(element);
      }
    }

    return node;
  }

  public async deleteUserProfile(userProfileId: string): Promise<string> {
    const node = await this.getUserProfile(userProfileId);
    if (!node) throw new Error(`no user profile Found for ${userProfileId}`);
    await node.removeFromGraph();
    return userProfileId;
  }

  public removeRoleToUserProfile(userProfileId: string, roleId: string) { }


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
