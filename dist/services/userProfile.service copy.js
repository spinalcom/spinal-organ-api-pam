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
// /*
//  * Copyright 2022 SpinalCom - www.spinalcom.com
//  * 
//  * This file is part of SpinalCore.
//  * 
//  * Please read all of the followi../interfaces/IProfileResitions
//  * of the Free Software license Agreement ("Agreement")
//  * carefully.
//  * 
//  * This Agreement is a legally binding contract between
//  * the Licensee (as defined below) and SpinalCom that
//  * sets forth the terms and conditions that govern your
//  * use of the Program. By installing and/or using the
//  * Program, you agree to abide by all the terms and
//  * conditions stated or referenced herein.
//  * 
//  * If you do not agree to abide by these terms and
//  * conditions, do not demonstrate your acceptance and do
//  * not install or use the Program.
//  * You should have received a copy of the license along
//  * with this file. If not, see
//  * <http://resources.spinalcom.com/licenses.pdf>.
//  */
// import { SpinalGraphService, SpinalGraph, SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
// import { USER_PROFILE_TYPE, PTR_LST_TYPE, CONTEXT_TO_USER_PROFILE_RELATION_NAME, USER_PROFILE_CONTEXT_NAME, USER_PROFILE_CONTEXT_TYPE } from '../constant';
// import { IBosAuth, IPortofolioAuth, IProfile, IProfileRes, IPortofolioAuthRes, IBosAuthRes } from '../interfaces';
// import { authorizationInstance } from './authorization.service';
// import { configServiceInstance } from './configFile.service';
// import {
//   _formatAuthorizationData,
//   _filterApisList,
//   _filterPortofolioList,
//   _filterBosList,
// } from '../utils/profileUtils';
// export class UserProfileService {
//   private static instance: UserProfileService;
//   public context: SpinalContext;
//   private constructor() { }
//   public static getInstance(): UserProfileService {
//     if (!this.instance) {
//       this.instance = new UserProfileService();
//     }
//     return this.instance;
//   }
//   public async init(): Promise<SpinalContext> {
//     this.context = await configServiceInstance.getContext(USER_PROFILE_CONTEXT_NAME);
//     if (!this.context) this.context = await configServiceInstance.addContext(USER_PROFILE_CONTEXT_NAME, USER_PROFILE_CONTEXT_TYPE);
//     return this.context;
//   }
//   /// CRUD BEGIN
//   public async createUserProfile(userProfile: IProfile): Promise<IProfileRes> {
//     const node = await this._createUserProfileNode(userProfile);
//     const { authorizeApis, authorizeBos, authorizePortofolio } = _formatAuthorizationData(userProfile);
//     let authorizedPortofolio = await this.authorizeToAccessPortofolioApp(node, <any>authorizePortofolio);
//     let authorizedRoutes = await this.authorizeToAccessApis(node, authorizeApis);
//     let authorizedBos = await this.authorizeToAccessBosApp(node, <any>authorizeBos);
//     await this._addProfileToGraph(node);
//     return {
//       node,
//       authorizedPortofolio: authorizedPortofolio || [],
//       authorizedRoutes: authorizedRoutes || [],
//       authorizedBos: authorizedBos || []
//     };
//   }
//   public async getUserProfile(userProfile: string | SpinalNode): Promise<IProfileRes> {
//     const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
//     if (!node) return;
//     return Promise.all([
//       this.getAuthorizedApis(userProfile),
//       this.getPortofolioAuthStructure(userProfile),
//       this.getBosAuthStructure(userProfile)
//     ]).then(([authorizedRoutes, authorizedPortofolio, authorizedBos]) => {
//       return {
//         node,
//         authorizedPortofolio: authorizedPortofolio || [],
//         authorizedRoutes: authorizedRoutes || [],
//         authorizedBos: authorizedBos || []
//       }
//     })
//   }
//   public async updateUserProfile(userProfileId: string, userProfile: IProfile): Promise<IProfileRes> {
//     const profileNode = await this._getUserProfileNode(userProfileId);
//     if (!profileNode) return;
//     this._renameProfile(profileNode, userProfile.name);
//     const { authorizeApis, authorizeBos, authorizePortofolio, unauthorizeApis, unauthorizeBos, unauthorizePortofolio } = _formatAuthorizationData(userProfile);
//     await this._unauthorizeOnEdit(profileNode, unauthorizeApis, <any>unauthorizeBos, <any>unauthorizePortofolio);
//     const filteredPortofolio = _filterPortofolioList(<any>authorizePortofolio, <any>unauthorizePortofolio);
//     const filteredApis = _filterApisList(authorizeApis, unauthorizeApis);
//     const filteredBos = _filterBosList(<any>authorizeBos, <any>unauthorizeBos);
//     await this._authorizeOnEdit(profileNode, filteredApis, filteredBos, filteredPortofolio)
//     return this.getUserProfile(profileNode);
//   }
//   public async getAllUserProfile(): Promise<IProfileRes[]> {
//     const contexts = await this.getAllUserProfilesNodes();
//     const promises = contexts.map(node => this.getUserProfile(node));
//     return Promise.all(promises);
//   }
//   public getAllUserProfilesNodes(): Promise<SpinalNode[]> {
//     return this.context.getChildrenInContext();
//   }
//   public async deleteUserProfile(userProfileId: string): Promise<string> {
//     const node = await this._getUserProfileNode(userProfileId);
//     if (!node) throw new Error(`no user profile Found for ${userProfileId}`);
//     await node.removeFromGraph();
//     return userProfileId;
//   }
//   /// END CRUD
//   /// AUTH BEGIN
//   //////////////////////////////////////////////////////
//   //                      PORTOFOLIO                  //
//   //////////////////////////////////////////////////////
//   public async authorizePortofolio(profile: string | SpinalNode, portofolioId: string | string[]): Promise<SpinalNode[]> {
//     portofolioId = Array.isArray(portofolioId) ? portofolioId : [portofolioId];
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     const promises = portofolioId.map(async id => {
//       return authorizationInstance.authorizeProfileToAccessPortofolio(node, id)
//     })
//     return Promise.all(promises);
//   }
//   public async unauthorizeToAccessPortofolio(profile: string | SpinalNode, portofolioId: string | string[]): Promise<void[]> {
//     portofolioId = Array.isArray(portofolioId) ? portofolioId : [portofolioId];
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     const promises = portofolioId.map(async id => {
//       return authorizationInstance.unauthorizeProfileToAccessPortofolio(node, id);
//     })
//     return Promise.all(promises);
//   }
//   public async authorizeToAccessPortofolioApp(profile: string | SpinalNode, data: IPortofolioAuth | IPortofolioAuth[]): Promise<IPortofolioAuthRes[]> {
//     data = Array.isArray(data) ? data : [data];
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     return data.reduce(async (prom, { appsIds, portofolioId }) => {
//       const liste = await prom;
//       const reference = await authorizationInstance.authorizeProfileToAccessPortofolio(node, portofolioId)
//       const apps = await authorizationInstance.authorizeProfileToAccessPortofolioApp(node, portofolioId, appsIds, reference);
//       liste.push(
//         {
//           portofolio: reference,
//           apps
//         }
//       )
//       return liste;
//     }, Promise.resolve([]))
//   }
//   public async unauthorizeToAccessPortofolioApp(profile: string | SpinalNode, data: IPortofolioAuth | IPortofolioAuth[]): Promise<SpinalNode[][]> {
//     data = Array.isArray(data) ? data : [data];
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     const promises = data.map(async ({ appsIds, portofolioId }) => {
//       return authorizationInstance.unauthorizeProfileToAccessPortofolioApp(node, portofolioId, appsIds);
//     })
//     return Promise.all(promises);
//   }
//   public async getAuthorizedPortofolio(profile: string | SpinalNode): Promise<SpinalNode[]> {
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     return authorizationInstance.getAuthorizedPortofolioFromProfile(node)
//   }
//   public async getAuthorizedPortofolioApp(profile: string | SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     return authorizationInstance.getAuthorizedPortofolioAppFromProfile(node, portofolioId)
//   }
//   public async getPortofolioAuthStructure(profile: string | SpinalNode): Promise<IPortofolioAuthRes[]> {
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     const portofolios = await this.getAuthorizedPortofolio(profile);
//     const promises = portofolios.map(async portofolio => {
//       return {
//         portofolio,
//         apps: await this.getAuthorizedPortofolioApp(profile, portofolio.getId().get())
//       }
//     })
//     return Promise.all(promises);
//   }
//   //////////////////////////////////////////////////////
//   //                      APIS                        //
//   //////////////////////////////////////////////////////
//   public async authorizeToAccessApis(userProfile: string | SpinalNode, apisIds?: string | string[]): Promise<SpinalNode[]> {
//     if (!apisIds) return;
//     const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
//     if (node) return authorizationInstance.authorizeProfileToAccessApisRoutes(node, apisIds);
//   }
//   public async unauthorizeToAccessApis(userProfile: string | SpinalNode, apisIds?: string | string[]): Promise<string[]> {
//     if (!apisIds) return;
//     const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
//     if (node) return authorizationInstance.unauthorizeProfileToAccessApisRoutes(node, apisIds);
//   }
//   public async getAuthorizedApis(userProfile: string | SpinalNode): Promise<SpinalNode[]> {
//     const node = userProfile instanceof SpinalNode ? userProfile : await this._getUserProfileNode(userProfile);
//     // if (!node) throw new Error(`no user profile Found for ${userProfile}`);
//     if (!node) return;
//     return authorizationInstance.getAuthorizedApisRoutesFromProfile(node);
//   }
//   /////////////////////////////////////////////
//   //                  BOS                    //
//   /////////////////////////////////////////////
//   public async authorizeToAccessBos(profile: SpinalNode | string, BosId: string | string[]): Promise<SpinalNode[]> {
//     BosId = Array.isArray(BosId) ? BosId : [BosId];
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     const promises = BosId.map(id => authorizationInstance.authorizeProfileToAccessBos(node, id))
//     return Promise.all(promises);
//   }
//   public async unauthorizeToAccessBos(profile: SpinalNode | string, BosId: string | string[]): Promise<void[]> {
//     BosId = Array.isArray(BosId) ? BosId : [BosId];
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     const promises = BosId.map(id => authorizationInstance.unauthorizeProfileToAccessBos(node, id))
//     return Promise.all(promises);
//   }
//   public async authorizeToAccessBosApp(profile: SpinalNode | string, data: IBosAuth | IBosAuth[]): Promise<IBosAuthRes[]> {
//     data = Array.isArray(data) ? data : [data];
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     return data.reduce(async (prom, { buildingId, appsIds }) => {
//       const liste = await prom;
//       const reference = await authorizationInstance.authorizeProfileToAccessBos(node, buildingId);
//       const apps = await authorizationInstance.authorizeProfileToAccessBosApp(node, buildingId, appsIds, reference);
//       liste.push(
//         {
//           building: reference,
//           apps
//         }
//       )
//       return liste;
//     }, Promise.resolve([]))
//   }
//   public async unauthorizeToAccessBosApp(profile: SpinalNode | string, data: IBosAuth | IBosAuth[]): Promise<SpinalNode[][]> {
//     data = Array.isArray(data) ? data : [data];
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     const promises = data.map(({ buildingId, appsIds }) => {
//       return authorizationInstance.unauthorizeProfileToAccessBosApp(node, buildingId, appsIds);
//     })
//     return Promise.all(promises);
//   }
//   public async getAuthorizedBos(profile: SpinalNode | string): Promise<SpinalNode[]> {
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     return authorizationInstance.getAuthorizedBosFromProfile(node);
//   }
//   public async getAuthorizedBosApp(profile: SpinalNode | string, bosId: string): Promise<SpinalNode[]> {
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     return authorizationInstance.getAuthorizedBosAppFromProfile(node, bosId);
//   }
//   public async getBosAuthStructure(profile: string | SpinalNode): Promise<IBosAuthRes[]> {
//     const node = profile instanceof SpinalNode ? profile : await this._getUserProfileNode(profile);
//     if (!(node instanceof SpinalNode)) return;
//     const buildings = await this.getAuthorizedBos(profile);
//     const promises = buildings.map(async building => {
//       return {
//         building,
//         apps: await this.getAuthorizedBosApp(profile, building.getId().get())
//       }
//     })
//     return Promise.all(promises);
//   }
//   ///////////////////////////////////////////////////////////
//   ///                       PRIVATES                      //
//   //////////////////////////////////////////////////////////
//   public async _getUserProfileNodeGraph(profileId: string): Promise<SpinalGraph | void> {
//     const profile = await this._getUserProfileNode(profileId);
//     if (profile) return profile.getElement();
//   }
//   private async _findChildInContext(startNode: SpinalNode, nodeIdOrName: string): Promise<SpinalNode> {
//     const children = await startNode.getChildrenInContext(this.context);
//     return children.find(el => {
//       if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
//         //@ts-ignore
//         SpinalGraphService._addNode(el);
//         return true;
//       }
//       return false;
//     })
//   }
//   private _addProfileToGraph(node: SpinalNode): Promise<SpinalNode> {
//     return this.context.addChildInContext(node, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PTR_LST_TYPE, this.context);
//   }
//   private async _createUserProfileNode(userProfile: IProfile): Promise<SpinalNode> {
//     const info = {
//       name: userProfile.name,
//       type: USER_PROFILE_TYPE
//     }
//     const graph = new SpinalGraph(userProfile.name)
//     const profileId = SpinalGraphService.createNode(info, graph);
//     const node = SpinalGraphService.getRealNode(profileId);
//     return node;
//   }
//   private async _getUserProfileNode(userProfileId: string): Promise<SpinalNode> {
//     const node = SpinalGraphService.getRealNode(userProfileId);
//     if (node) return node;
//     return this._findChildInContext(this.context, userProfileId);
//   }
//   private _renameProfile(node: SpinalNode, newName: string) {
//     if (newName && newName.trim()) node.info.name.set(newName);
//   }
//   private _unauthorizeOnEdit(node: SpinalNode, unauthorizeApis: string[], unauthorizeBos: IBosAuth[], unauthorizePortofolio: IPortofolioAuth[]): Promise<any> {
//     const promises = [
//       this.unauthorizeToAccessApis(node, unauthorizeApis),
//       this.unauthorizeToAccessBosApp(node, unauthorizeBos),
//       this.unauthorizeToAccessPortofolioApp(node, unauthorizePortofolio)
//     ]
//     return Promise.all(promises)
//   }
//   private _authorizeOnEdit(node: SpinalNode, authorizeApis: string[], authorizeBos: IBosAuth[], authorizePortofolio: IPortofolioAuth[]): Promise<any> {
//     const promises = [
//       this.authorizeToAccessPortofolioApp(node, authorizePortofolio),
//       this.authorizeToAccessApis(node, authorizeApis),
//       this.authorizeToAccessBosApp(node, authorizeBos),
//     ]
//     return Promise.all(promises)
//   }
// }
//# sourceMappingURL=userProfile.service%20copy.js.map