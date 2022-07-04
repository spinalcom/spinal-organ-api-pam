/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the followi../interfaces/IAppProfileResitions
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
import { APP_PROFILE_TYPE, PTR_LST_TYPE, CONTEXT_TO_APP_PROFILE_RELATION_NAME, APP_PROFILE_CONTEXT_NAME, APP_PROFILE_CONTEXT_TYPE } from '../constant';
import { IAppProfile, IAppProfileRes } from '../interfaces';
import { authorizationInstance } from './authorization.service';
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

  /// CRUD BEGIN

  public async createAppProfile(appProfile: IAppProfile): Promise<IAppProfileRes> {
    const node = await this._createAppProfileNode(appProfile);

    let authorizedApps = await this.authorizeToAccessApps(node, appProfile.authorizeApps);
    let authorizedRoutes = await this.authorizeToAccessApis(node, appProfile.authorizeApis);
    let authorizedBos = await this.authorizeToAccessBos(node, appProfile.authorizeBos);

    return { node, authorizedApps: authorizedApps || [], authorizedRoutes: authorizedRoutes || [], authorizedBos: authorizedBos || [] };
  }

  public async getAppProfile(appProfile: string | SpinalNode): Promise<IAppProfileRes> {
    const node = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    if (!node) return;

    return Promise.all([
      this.getAuthorizedApis(appProfile),
      this.getAuthorizedApps(appProfile),
      this.getAuthorizedBos(appProfile)
    ]).then(([authorizedRoutes, authorizedApps, authorizedBos]) => {
      return {
        node,
        authorizedRoutes,
        authorizedApps,
        authorizedBos
      }
    })

  }

  public async updateAppProfile(appProfileId: string, appProfile: IAppProfile): Promise<IAppProfileRes> {
    const profileNode = await this._getAppProfileNode(appProfileId);
    if (!profileNode) return;

    this._renameProfile(profileNode, appProfile.name);

    const unauthorizedAppsIds = appProfile.unauthorizeApps || [];
    const unauthorizedApisIds = appProfile.unauthorizeApis || [];
    const unauthorizedBosIds = appProfile.unauthorizeBos || [];

    await this._unauthorizeOnEdit(profileNode, unauthorizedAppsIds, unauthorizedApisIds, unauthorizedBosIds);

    const filteredApps = this._filterAuthList(appProfile.authorizeApps, unauthorizedAppsIds);
    const filteredApis = this._filterAuthList(appProfile.authorizeApis, unauthorizedApisIds);
    const filteredBos = this._filterAuthList(appProfile.authorizeBos, unauthorizedBosIds);

    const [authorizedApps, authorizedApis, authorizedBos] = await this._authorizeOnEdit(profileNode, filteredApps, filteredApis, filteredBos)


    return { node: profileNode, authorizedApps: authorizedApps || [], authorizedRoutes: authorizedApis || [], authorizedBos: authorizedBos || [] };
  }

  public async getAllAppProfile(): Promise<IAppProfileRes[]> {
    const contexts = await this.getAllAppProfileNodes();
    const promises = contexts.map(node => this.getAppProfile(node));
    return Promise.all(promises);
  }


  public getAllAppProfileNodes() {
    return this.context.getChildrenInContext();
  }

  public async deleteAppProfile(appProfileId: string): Promise<string> {
    const node = await this._getAppProfileNode(appProfileId);
    if (!node) throw new Error(`no profile Found for ${appProfileId}`);
    await node.removeFromGraph();
    return appProfileId;
  }
  /// END CRUD


  /// AUTH BEGIN

  //apps
  public async authorizeToAccessApps(appProfile: string | SpinalNode, appIds?: string | string[]): Promise<SpinalNode[]> {
    if (!appIds) return;
    const node = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    if (node) return authorizationInstance.authorizeProfileToAccessApp(node, appIds) || []
  }

  public async unauthorizeToAccessApps(appProfile: string | SpinalNode, appIds?: string | string[]): Promise<string[]> {
    if (!appIds) return;
    const node = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    if (node) return authorizationInstance.unauthorizeProfileToAccessApp(node, appIds);
  }

  public async getAuthorizedApps(appProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const node = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    if (!node) return;
    // if (!node) throw new Error(`no user profile Found for ${userProfile}`);
    return authorizationInstance.getAuthorizedAppsFromProfile(node);
  }

  //apis
  public async authorizeToAccessApis(appProfile: string | SpinalNode, apisIds?: string | string[]): Promise<SpinalNode[]> {
    if (!apisIds) return;
    const node = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    if (node) return authorizationInstance.authorizeProfileToAccessApisRoutes(node, apisIds);
  }

  public async unauthorizeToAccessApis(appProfile: string | SpinalNode, apisIds?: string | string[]): Promise<string[]> {
    if (!apisIds) return;
    const node = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    if (node) return authorizationInstance.unauthorizeProfileToAccessApisRoutes(node, apisIds);
  }

  public async getAuthorizedApis(appProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const node = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    // if (!node) throw new Error(`no user profile Found for ${appProfile}`);
    if (!node) return;

    return authorizationInstance.getAuthorizedApisRoutesFromProfile(node);
  }


  // bos
  public async authorizeToAccessBos(profile: string | SpinalNode, bosIds: string | string[]): Promise<SpinalNode[]> {
    if (!bosIds) return;
    const node = profile instanceof SpinalNode ? profile : await this._getAppProfileNode(profile);
    if (node) return authorizationInstance.authorizeProfileToAccessBos(node, bosIds);
  }

  public async unauthorizeToAccessBos(appProfile: string | SpinalNode, bosIds: string | string[]): Promise<string[]> {
    if (!bosIds) return;
    const node = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    if (node) return authorizationInstance.unauthorizeProfileToAccessBos(node, bosIds);
  }

  public async getAuthorizedBos(appProfile: string | SpinalNode): Promise<SpinalNode[]> {
    const node = appProfile instanceof SpinalNode ? appProfile : await this._getAppProfileNode(appProfile);
    if (!node) return;
    // if (!node) throw new Error(`no user profile Found for ${userProfile}`);
    return authorizationInstance.getAuthorizedBosFromProfile(node);
  }

  /// END AUTH

  ///////////////////////////////////////////////////////////
  ///                       PRIVATES                      //
  //////////////////////////////////////////////////////////

  public async _getAppProfileNodeGraph(profileId: string): Promise<SpinalGraph | void> {
    const profile = await this._getAppProfileNode(profileId);
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

  private async _createAppProfileNode(appProfile: IAppProfile): Promise<SpinalNode> {

    const info = {
      name: appProfile.name,
      type: APP_PROFILE_TYPE
    }
    const graph = new SpinalGraph(appProfile.name)
    const profileId = SpinalGraphService.createNode(info, graph);

    const node = SpinalGraphService.getRealNode(profileId);
    await this.context.addChildInContext(node, CONTEXT_TO_APP_PROFILE_RELATION_NAME, PTR_LST_TYPE, this.context);
    return node;
  }

  private async _getAppProfileNode(appProfileId: string): Promise<SpinalNode> {
    const node = SpinalGraphService.getRealNode(appProfileId);
    if (node) return node;

    return this._findChildInContext(this.context, appProfileId);
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
