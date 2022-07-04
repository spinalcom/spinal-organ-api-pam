/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the followi../interfaces/IUserProfileResitions
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
import { USER_PROFILE_TYPE, PTR_LST_TYPE, CONTEXT_TO_USER_PROFILE_RELATION_NAME, USER_PROFILE_CONTEXT_NAME, USER_PROFILE_CONTEXT_TYPE } from '../constant';
import { IUserProfile, IUserProfileRes } from '../interfaces';
import { authorizationInstance } from './authorization.service';
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

  /// CRUD BEGIN

  public async createUserProfile(userProfile: IUserProfile): Promise<IUserProfileRes> {
    const node = await this._createUserProfileNode(userProfile);

    let authorizedApps = await this.authorizeToAccessApps(node, userProfile.authorizeApps);
    let authorizedRoutes = await this.authorizeToAccessApis(node, userProfile.authorizeApis);
    let authorizedBos = await this.authorizeToAccessBos(node, userProfile.authorizeBos);

    return { node, authorizedApps: authorizedApps || [], authorizedRoutes: authorizedRoutes || [], authorizedBos: authorizedBos || [] };
  }

  public async getUserProfile(userProfile: string | SpinalNode): Promise<IUserProfileRes> {
    const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    if (!node) return;

    return Promise.all([
      this.getAuthorizedApis(userProfile),
      this.getAuthorizedApps(userProfile),
      this.getAuthorizedBos(userProfile)
    ]).then(([authorizedRoutes, authorizedApps, authorizedBos]) => {
      return {
        node,
        authorizedRoutes,
        authorizedApps,
        authorizedBos
      }
    })

  }

  public async updateUserProfile(userProfileId: string, userProfile: IUserProfile): Promise<IUserProfileRes> {
    const profileNode = await this._getUserProfileNode(userProfileId);
    if (!profileNode) return;

    this._renameProfile(profileNode, userProfile.name);

    const unauthorizedAppsIds = userProfile.unauthorizeApps || [];
    const unauthorizedApisIds = userProfile.unauthorizeApis || [];
    const unauthorizedBosIds = userProfile.unauthorizeBos || [];

    await this._unauthorizeOnEdit(profileNode, unauthorizedAppsIds, unauthorizedApisIds, unauthorizedBosIds);

    const filteredApps = this._filterAuthList(userProfile.authorizeApps, unauthorizedAppsIds);
    const filteredApis = this._filterAuthList(userProfile.authorizeApis, unauthorizedApisIds);
    const filteredBos = this._filterAuthList(userProfile.authorizeBos, unauthorizedBosIds);

    const [authorizedApps, authorizedApis, authorizedBos] = await this._authorizeOnEdit(profileNode, filteredApps, filteredApis, filteredBos)


    return { node: profileNode, authorizedApps: authorizedApps || [], authorizedRoutes: authorizedApis || [], authorizedBos: authorizedBos || [] };
  }

  public async getAllUserProfile(): Promise<IUserProfileRes[]> {
    const contexts = await this.getAllUserProfilesNodes();
    const promises = contexts.map(node => this.getUserProfile(node));
    return Promise.all(promises);
  }


  public getAllUserProfilesNodes(): Promise<SpinalNode[]> {
    return this.context.getChildrenInContext();
  }

  public async deleteUserProfile(userProfileId: string): Promise<string> {
    const node = await this._getUserProfileNode(userProfileId);
    if (!node) throw new Error(`no user profile Found for ${userProfileId}`);
    await node.removeFromGraph();
    return userProfileId;
  }
  /// END CRUD


  /// AUTH BEGIN

  //apps
  public async authorizeToAccessApps(userProfile: string | SpinalNode, appIds?: string | string[]): Promise<SpinalNode[]> {
    if (!appIds) return;
    const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    if (node) return authorizationInstance.authorizeProfileToAccessApp(node, appIds) || []

  }

  public async unauthorizeToAccessApps(userProfile: string | SpinalNode, appIds?: string | string[]): Promise<string[]> {
    if (!appIds) return;
    const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    if (node) return authorizationInstance.unauthorizeProfileToAccessApp(node, appIds);
  }

  public async getAuthorizedApps(userProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    if (!node) return;
    // if (!node) throw new Error(`no user profile Found for ${userProfile}`);
    return authorizationInstance.getAuthorizedAppsFromProfile(node);
  }

  //apis
  public async authorizeToAccessApis(userProfile: string | SpinalNode, apisIds?: string | string[]): Promise<SpinalNode[]> {
    if (!apisIds) return;
    const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    if (node) return authorizationInstance.authorizeProfileToAccessApisRoutes(node, apisIds);
  }

  public async unauthorizeToAccessApis(userProfile: string | SpinalNode, apisIds?: string | string[]): Promise<string[]> {
    if (!apisIds) return;
    const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    if (node) return authorizationInstance.unauthorizeProfileToAccessApisRoutes(node, apisIds);
  }

  public async getAuthorizedApis(userProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    // if (!node) throw new Error(`no user profile Found for ${userProfile}`);
    if (!node) return;

    return authorizationInstance.getAuthorizedApisRoutesFromProfile(node);
  }


  // bos
  public async authorizeToAccessBos(profile: string | SpinalNode, bosIds: string | string[]): Promise<SpinalNode[]> {
    if (!bosIds) return;
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (node) return authorizationInstance.authorizeProfileToAccessBos(node, bosIds);
  }

  public async unauthorizeToAccessBos(userProfile: string | SpinalNode, bosIds: string | string[]): Promise<string[]> {
    if (!bosIds) return;
    const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    if (node) return authorizationInstance.unauthorizeProfileToAccessBos(node, bosIds);
  }

  public async getAuthorizedBos(userProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    if (!node) return;
    // if (!node) throw new Error(`no user profile Found for ${userProfile}`);
    return authorizationInstance.getAuthorizedBosFromProfile(node);
  }

  /// END AUTH

  ///////////////////////////////////////////////////////////
  ///                       PRIVATES                      //
  //////////////////////////////////////////////////////////

  public async _getUserProfileNodeGraph(profileId: string): Promise<SpinalGraph | void> {
    const profile = await this._getUserProfileNode(profileId);
    if (profile) return profile.getElement();
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

  private _filterAuthList(authorizedIds: string[] = [], unauthorizedIds: string[] = []) {

    if (!unauthorizedIds.length) return authorizedIds;

    const unAuthObj = {};
    unauthorizedIds.map(id => unAuthObj[id] = id);

    return authorizedIds.filter(id => !unAuthObj[id]);
  }

  private async _createUserProfileNode(userProfile: IUserProfile): Promise<SpinalNode> {

    const info = {
      name: userProfile.name,
      type: USER_PROFILE_TYPE
    }
    const graph = new SpinalGraph(userProfile.name)
    const profileId = SpinalGraphService.createNode(info, graph);

    const node = SpinalGraphService.getRealNode(profileId);
    await this.context.addChildInContext(node, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PTR_LST_TYPE, this.context);
    return node;
  }

  private async _getUserProfileNode(userProfileId: string): Promise<SpinalNode> {
    const node = SpinalGraphService.getRealNode(userProfileId);
    if (node) return node;

    return this._findChildInContext(this.context, userProfileId);
  }

  private _renameProfile(node: SpinalNode, newName: string) {
    if (newName && newName.trim()) node.info.name.set(newName);
  }


  private _unauthorizeOnEdit(node: SpinalNode, unauthorizedAppsIds: string[], unauthorizedApisIds: string[], unauthorizedBosIds: string[]): Promise<string[][]> {
    const promises = [
      authorizationInstance.unauthorizeProfileToAccessApp(node, unauthorizedAppsIds),
      authorizationInstance.unauthorizeProfileToAccessApisRoutes(node, unauthorizedApisIds),
      authorizationInstance.unauthorizeProfileToAccessBos(node, unauthorizedBosIds)
    ]

    return Promise.all(promises)
  }

  private _authorizeOnEdit(node: SpinalNode, authorizedAppsIds: string[], authorizedApisIds: string[], _authorizeOnEdit: string[]): Promise<SpinalNode[][]> {
    const promises = [
      authorizationInstance.authorizeProfileToAccessApp(node, authorizedAppsIds),
      authorizationInstance.authorizeProfileToAccessApisRoutes(node, authorizedApisIds),
      authorizationInstance.authorizeProfileToAccessBos(node, _authorizeOnEdit)
    ]

    return Promise.all(promises);
  }

}
