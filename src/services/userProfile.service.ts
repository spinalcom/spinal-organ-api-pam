/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the followi../interfaces/IProfileResitions
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
import {  IPortofolioAuth, IProfile, IProfileRes, IPortofolioAuthRes, IProfileEdit, IPortofolioAuthEdit } from '../interfaces';
import { authorizationInstance } from './authorization.service';
import { configServiceInstance } from './configFile.service';
import {
  _formatAuthorizationData,
  _filterApisList,
  _filterPortofolioList
} from '../utils/profileUtils';
import { AdminProfileService } from './adminProfile.service';




export class UserProfileService {
  private static instance: UserProfileService;
  public context: SpinalContext;
  private adminProfile: SpinalNode;

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

    await AdminProfileService.getInstance().init(this.context);
    return this.context;
  }

  /// CRUD BEGIN

  public async createUserProfile(userProfile: IProfile): Promise<IProfileRes> {
    const node = await this._createUserProfileNode(userProfile);

    const data = _formatAuthorizationData(userProfile);
    const obj = {
      node,
      authorized: []
    }

    obj.authorized = await data.reduce(async (prom, item: IPortofolioAuth) => {
      const liste = await prom;

      const portofolioAuth = await this._authorizeIPortofolioAuth(node, item)
      liste.push(portofolioAuth);

      return liste;
    }, Promise.resolve([]))

    await this.context.addChildInContext(node, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PTR_LST_TYPE, this.context)

    return obj;
  }

  public async getUserProfile(userProfile: string | SpinalNode): Promise<IProfileRes> {
    const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
    if (!node) return;

    return {
      node,
      authorized: await this.getPortofolioAuthStructure(node)
    };
  }

  public async updateUserProfile(userProfileId: string, userProfile: IProfileEdit): Promise<IProfileRes> {
    const profileNode = await this._getUserProfileNode(userProfileId);
    if (!profileNode) return;

    this._renameProfile(profileNode, userProfile.name);

    if (userProfile.authorize) {
      await userProfile.authorize.reduce(async (prom, item) => {
        const liste = await prom;
        await this._authorizeIPortofolioAuth(profileNode, item);
        await this._unauthorizeIPortofolioAuth(profileNode, item);

        return liste;
      }, Promise.resolve([]))
    }

    return this.getUserProfile(profileNode);
  }

  public async getAllUserProfile(): Promise<IProfileRes[]> {
    const contexts = await this.getAllUserProfileNodes();
    const promises = contexts.map(node => this.getUserProfile(node));
    return Promise.all(promises);
  }

  public getAllUserProfileNodes() {
    return this.context.getChildrenInContext();
  }

  public async deleteUserProfile(userProfileId: string): Promise<string> {
    const node = await this._getUserProfileNode(userProfileId);
    if (!node) throw new Error(`no profile Found for ${userProfileId}`);
    await node.removeFromGraph();
    return userProfileId;
  }

  /// END CRUD


  /// AUTH BEGIN

  //////////////////////////////////////////////////////
  //                      PORTOFOLIO                  //
  //////////////////////////////////////////////////////

  public async authorizePortofolio(profile: string | SpinalNode, portofolioId: string | string[]): Promise<SpinalNode[]> {
    portofolioId = Array.isArray(portofolioId) ? portofolioId : [portofolioId];
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;

    const promises = portofolioId.map(id => {
      return authorizationInstance.authorizeProfileToAccessPortofolio(node, id)
    })

    return Promise.all(promises);
  }

  public async unauthorizeToAccessPortofolio(profile: string | SpinalNode, portofolioId: string | string[]): Promise<boolean[]> {
    portofolioId = Array.isArray(portofolioId) ? portofolioId : [portofolioId];
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;

    const promises = portofolioId.map(async id => {
      return authorizationInstance.unauthorizeProfileToAccessPortofolio(node, id);
    })

    return Promise.all(promises);
  }

  public async authorizeToAccessPortofolioApp(profile: string | SpinalNode, data: IPortofolioAuth | IPortofolioAuth[]): Promise<IPortofolioAuthRes[]> {
    data = Array.isArray(data) ? data : [data];
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;

    return data.reduce(async (prom, { appsIds, portofolioId }) => {
      const liste = await prom;
      if (!appsIds || appsIds.length === 0) return liste;
      const portofolio = await authorizationInstance.authorizeProfileToAccessPortofolio(node, portofolioId)
      const apps = await authorizationInstance.authorizeProfileToAccessPortofolioApp(node, portofolioId, appsIds);

      liste.push(
        {
          portofolio,
          apps
        }
      )

      return liste;

    }, Promise.resolve([]))
  }

  public async unauthorizeToAccessPortofolioApp(profile: string | SpinalNode, data: IPortofolioAuth | IPortofolioAuth[]): Promise<SpinalNode[]> {
    data = Array.isArray(data) ? data : [data];
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;

    const promises = data.map(async ({ appsIds, portofolioId }) => {
      return authorizationInstance.unauthorizeProfileToAccessPortofolioApp(node, portofolioId, appsIds);
    })

    return Promise.all(promises).then((result) => {
      return result.flat();
    })
  }

  public async authorizeToAccessPortofolioApisRoute(profile: string | SpinalNode, data: IPortofolioAuth | IPortofolioAuth[]): Promise<IPortofolioAuthRes[]> {
    data = Array.isArray(data) ? data : [data];
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;

    return data.reduce(async (prom, { apisIds, portofolioId }) => {
      const liste = await prom;
      const portofolio = await authorizationInstance.authorizeProfileToAccessPortofolio(node, portofolioId)
      const apis = await authorizationInstance.authorizeProfileToAccessPortofolioApisRoutes(node, portofolioId, apisIds);

      liste.push(
        {
          portofolio,
          apis
        }
      )

      return liste;

    }, Promise.resolve([]))
  }

  public async unauthorizeToAccessPortofolioApisRoute(profile: string | SpinalNode, data: IPortofolioAuth | IPortofolioAuth[]): Promise<string[]> {
    data = Array.isArray(data) ? data : [data];
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;

    const promises = data.map(async ({ apisIds, portofolioId }) => {
      return authorizationInstance.unauthorizeProfileToAccessPortofolioApisRoutes(node, portofolioId, apisIds);
    })

    return Promise.all(promises).then((result) => {
      const res = result.flat()
      return res.map(el => el?.getId().get());
    })
  }

  public async getAuthorizedPortofolio(profile: string | SpinalNode): Promise<SpinalNode[]> {
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;
    return authorizationInstance.getAuthorizedPortofolioFromProfile(node)
  }

  public async getAuthorizedPortofolioApp(profile: string | SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;
    return authorizationInstance.getAuthorizedPortofolioAppFromProfile(node, portofolioId)
  }

  public async getAuthorizedPortofolioApis(profile: string | SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;
    return authorizationInstance.getAuthorizedApisRoutesFromProfile(node, portofolioId)
  }

  public async getPortofolioAuthStructure(profile: string | SpinalNode): Promise<IPortofolioAuthRes[]> {
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;

    const portofolios = await this.getAuthorizedPortofolio(profile);
    const promises = portofolios.map(async portofolio => {
      const portofolioId = portofolio.getId().get();
      return {
        portofolio,
        apps: await this.getAuthorizedPortofolioApp(profile, portofolioId),
        apis: await this.getAuthorizedPortofolioApis(profile, portofolioId),
        buildings: await this.getAuthorizedBos(profile, portofolioId)
      }
    })

    return Promise.all(promises);
  }

  /////////////////////////////////////////////
  //                  BOS                    //
  /////////////////////////////////////////////

  public async authorizeToAccessBos(profile: SpinalNode | string, portofolioId: string, BosId: string | string[]): Promise<SpinalNode[]> {
    BosId = Array.isArray(BosId) ? BosId : [BosId];
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;

    return BosId.reduce(async (prom, id) => {
      const liste = await prom;
      try {
        const n = await authorizationInstance.authorizeProfileToAccessBos(node, portofolioId, id);
        liste.push(n);
      } catch (error) { }
      
      return liste;
    }, Promise.resolve([]))
  }

  public async unauthorizeToAccessBos(profile: SpinalNode | string, portofolioId: string, BosId: string | string[]): Promise<boolean[]> {
    BosId = Array.isArray(BosId) ? BosId : [BosId];
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;

    const promises = BosId.map(id => authorizationInstance.unauthorizeProfileToAccessBos(node, portofolioId, id))
    return Promise.all(promises);
  }

  public async getAuthorizedBos(profile: SpinalNode | string, portofolioId: string,): Promise<SpinalNode[]> {
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    if (!(node instanceof SpinalNode)) return;
    return authorizationInstance.getAuthorizedBosFromProfile(node, portofolioId);
  }


  public async getAllAuthorizedBos(profile: string | SpinalNode): Promise<SpinalNode[]> {
    const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
    const portofolios = await this.getAuthorizedPortofolio(node);
    const promises = portofolios.map(el => this.getAuthorizedBos(node, el.getId().get()));
    return Promise.all(promises).then((result) => {
      return result.flat();
    })
  }

  ///////////////////////////////////////////////////////////
  ///                       PRIVATES                      //
  //////////////////////////////////////////////////////////


  public async _authorizeIPortofolioAuth(profile: SpinalNode, portofolioAuth: IPortofolioAuth): Promise<IPortofolioAuthRes> {

    const portofolio = await this.authorizePortofolio(profile, portofolioAuth.portofolioId);
    const appsData = await this.authorizeToAccessPortofolioApp(profile, portofolioAuth);
    const buildings = await this.authorizeToAccessBos(profile,  portofolioAuth.portofolioId,portofolioAuth.buildingIds)
    return {
      portofolio: portofolio[0],
      apps: appsData[0]?.apps,
      buildings
    }

  }

  public async _unauthorizeIPortofolioAuth(profile: SpinalNode, portofolioAuth: IPortofolioAuthEdit): Promise<any> {
    let prom1 = this.unauthorizeToAccessPortofolioApp(profile, { portofolioId: portofolioAuth.portofolioId, appsIds: portofolioAuth.unauthorizeAppsIds });
    let prom2 = this.unauthorizeToAccessBos(profile, portofolioAuth.portofolioId, portofolioAuth.unauthorizeBuildingIds);
      // portofolioAuth.buildingIds.map(bos => this._unauthorizeIBosAuth(profile, bos, portofolioAuth.portofolioId))
    // await Promise.all(buildingProm);
    return Promise.all([prom1, prom2]);
  }

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

  private async _createUserProfileNode(userProfile: IProfile): Promise<SpinalNode> {

    const info = {
      name: userProfile.name,
      type: USER_PROFILE_TYPE
    }
    const graph = new SpinalGraph(userProfile.name)
    const profileId = SpinalGraphService.createNode(info, graph);

    const node = SpinalGraphService.getRealNode(profileId);
    return node;
  }

  public async _getUserProfileNode(userProfileId: string): Promise<SpinalNode> {
    const node = SpinalGraphService.getRealNode(userProfileId);
    if (node) return node;

    return this._findChildInContext(this.context, userProfileId);
  }

  private _renameProfile(node: SpinalNode, newName: string) {
    if (newName && newName.trim()) node.info.name.set(newName);
  }

}
