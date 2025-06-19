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
// import { APP_PROFILE_TYPE, PTR_LST_TYPE, CONTEXT_TO_APP_PROFILE_RELATION_NAME, APP_PROFILE_CONTEXT_NAME, APP_PROFILE_CONTEXT_TYPE } from '../constant';
// import { IProfile, IBosAuth, IPortofolioAuth, IPortofolioAuthRes, IBosAuthRes, IProfileRes, IProfileEdit, IPortofolioAuthEdit, IBosAuthEdit } from '../interfaces';
// import { authorizationInstance } from './authorization.service';

// import { formatAndMergePortofolioAuthorization, formatAndMergeBosAuthorization, _createAppProfileNode, _getAppProfileNode, _renameProfile } from '../utils/profileUtils';

// export class AppProfileService {
//   private static instance: AppProfileService;
//   public context: SpinalContext;
//   private constructor() { }

//   public static getInstance(): AppProfileService {
//     if (!this.instance) {
//       this.instance = new AppProfileService();
//     }

//     return this.instance;
//   }

//   public async init(graph: SpinalGraph): Promise<SpinalContext> {
//     this.context = await graph.getContext(APP_PROFILE_CONTEXT_NAME);
//     if (!this.context) {
//       const spinalContext = new SpinalContext(APP_PROFILE_CONTEXT_NAME, APP_PROFILE_CONTEXT_TYPE);
//       this.context = await graph.addContext(spinalContext);
//     }

//     return this.context;
//   }

//   /// CRUD BEGIN


//   /**
//    * Creates a new application profile node and authorizes it to access specified portofolios.
//    * Throws an error if no portofolio is provided.
//    * @param appProfile The profile data to create.
//    * @returns The created profile node and its authorized portofolios.
//    */
//   public async createAppProfile(appProfile: IProfile): Promise<IProfileRes> {

//     const authorizationDataFormatted = formatAndMergePortofolioAuthorization(appProfile.authorize);

//     if (authorizationDataFormatted.length === 0) throw new Error("At least one portofolio must be authorized in the profile");

//     const profileNode = await _createAppProfileNode(appProfile);
//     const promises = [];

//     for (const portofolio of authorizationDataFormatted) {
//       promises.push(this._authorizeProfileToAccessPortofolio(profileNode, portofolio));
//     }

//     return Promise.all(promises).then(async (itemsAuthorized) => {
//       await this.context.addChildInContext(profileNode, CONTEXT_TO_APP_PROFILE_RELATION_NAME, PTR_LST_TYPE, this.context);
//       return { node: profileNode, authorized: itemsAuthorized };
//     });

//   }

//   /**
//    * Retrieves the application profile node and its associated authorization structure.
//    *
//    * @param appProfile - The application profile identifier or a SpinalNode instance.
//    * @returns A promise that resolves to an object containing the application profile node and its authorization structure,
//    *          or `undefined` if the profile node could not be found.
//    */
//   public async getAppProfileAndAuthorizedPortofolio(appProfile: string | SpinalNode): Promise<IProfileRes> {
//     const appProfileNode = appProfile instanceof SpinalNode ? appProfile : await _getAppProfileNode(appProfile, this.context);
//     if (!appProfileNode) return;

//     return {
//       node: appProfileNode,
//       authorized: await this.getPortofolioAuthStructure(appProfileNode)
//     };

//   }

//   /**
//    * Updates an existing application profile node and its authorizations.
//    * Renames the profile if the name has changed, and updates the authorized portofolios.
//    * @param appProfileId The ID of the profile to update.
//    * @param newData The new profile data.
//    * @returns The updated profile node and its authorized portofolios.
//    */
//   public async updateAppProfile(appProfileId: string, newData: IProfileEdit): Promise<IProfileRes> {
//     const profileNode = await _getAppProfileNode(appProfileId, this.context);
//     if (!profileNode) return;

//     if (newData.name && newData.name.trim() !== profileNode.info.name.get()) {
//       _renameProfile(profileNode, newData.name);
//     }

//     const newAuthorizationFormatted = formatAndMergePortofolioAuthorization(newData.authorize);
//     const promises = [];

//     for (const portofolio of newAuthorizationFormatted) {
//       promises.push(this._authorizeProfileToAccessPortofolio(profileNode, portofolio));
//       promises.push(this._unauthorizeProfileToAccessPortofolio(profileNode, portofolio));
//     }

//     return Promise.all(promises).then(() => this.getAppProfileAndAuthorizedPortofolio(profileNode));
//   }

//   /**
//    * Retrieves all application profile nodes and their associated authorization structures.
//    * @returns A promise that resolves to an array of profile objects, each containing the profile node and its authorization structure.
//    */
//   public async getAllAppProfilesAndAuthorizedPortfolios(): Promise<IProfileRes[]> {
//     const appProfiles = await this.getAllAppProfilesNodes();

//     const promises = appProfiles.map(appProfile => this.getAppProfileAndAuthorizedPortofolio(appProfile));
//     return Promise.all(promises);
//   }

//   /**
//    * Retrieves all application profile nodes.
//    * @returns A promise that resolves to an array of SpinalNode instances representing the application profiles.
//    */
//   public async getAllAppProfilesNodes(): Promise<SpinalNode[]> {
//     const appProfileNodes = await this.context.getChildren(CONTEXT_TO_APP_PROFILE_RELATION_NAME);
//     return appProfileNodes;
//   }

//   /**
//    * Retrieves an application profile node by its ID.
//    * @param appProfileId The ID of the application profile.
//    * @returns A promise that resolves to the SpinalNode instance representing the application profile, or `undefined` if not found.
//    */
//   public async deleteAppProfile(appProfileId: string): Promise<string> {
//     const appProfile = await _getAppProfileNode(appProfileId, this.context);
//     if (!appProfile) throw new Error(`no profile Found for ${appProfileId}`);

//     await appProfile.removeFromGraph();
//     return appProfileId;
//   }

//   /// END CRUD


//   /// AUTH BEGIN

//   //////////////////////////////////////////////////////
//   //                      PORTOFOLIO                  //
//   //////////////////////////////////////////////////////

//   /**
//    * Authorizes a profile to access one or more portofolios by their IDs.
//    * @param profile - The profile node or its ID.
//    * @param portofolioIds - A single portofolio ID or an array of portofolio IDs.
//    * @returns A promise that resolves to an array of authorized portofolio nodes.
//    */
//   public async authorizeProfileToAccessPortofolioById(profile: string | SpinalNode, portofolioIds: string | string[]): Promise<SpinalNode[]> {
//     portofolioIds = Array.isArray(portofolioIds) ? portofolioIds : [portofolioIds];
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;

//     const promises = portofolioIds.map(portofolioId => authorizationInstance.authorizeProfileToAccessPortofolio(profileNode, portofolioId))

//     return Promise.all(promises);
//   }


//   /**
//    * Revokes a profile's authorization to access one or more portfolios by their IDs.
//    *
//    * @param profile - The profile identifier or a SpinalNode instance representing the profile.
//    * @param portofolioIds - A single portfolio ID or an array of portfolio IDs to unauthorize access from.
//    * @returns A promise that resolves to an array of booleans indicating the success of the unauthorization for each portfolio ID.
//    */
//   public async unauthorizeProfileToAccessPortofolioById(profile: string | SpinalNode, portofolioIds: string | string[]): Promise<boolean[]> {
//     portofolioIds = Array.isArray(portofolioIds) ? portofolioIds : [portofolioIds];

//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;

//     const promises = portofolioIds.map(portofolioId => authorizationInstance.unauthorizeProfileToAccessPortofolio(profileNode, portofolioId));

//     return Promise.all(promises);
//   }


//   /**
//    * Authorizes a profile to access specific applications within one or more portfolios.
//    * @param profile - The profile node or its ID.
//    * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and app IDs.
//    * @returns A promise resolving to an array of authorized portfolio-app structures.
//    */
//   public async authorizeToAccessPortofolioApp(profile: string | SpinalNode, portofolioAuth: IPortofolioAuth | IPortofolioAuth[]): Promise<IPortofolioAuthRes[]> {
//     portofolioAuth = Array.isArray(portofolioAuth) ? portofolioAuth : [portofolioAuth];
//     const node = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(node instanceof SpinalNode)) return;

//     const itemsFormatted = formatAndMergePortofolioAuthorization(portofolioAuth);

//     const promises = itemsFormatted.map(async ({ appsIds, portofolioId }) => {
//       if (appsIds && appsIds.length === 0) return null;

//       const portofolio = await authorizationInstance.authorizeProfileToAccessPortofolio(node, portofolioId);
//       const apps = await authorizationInstance.authorizeProfileToAccessPortofolioApp(node, portofolioId, appsIds);
//       return { portofolio, apps }
//     })

//     return Promise.all(promises).then((result) => result.filter(Boolean));
//   }

//   /**
//    * Revokes a profile's authorization to access specific applications within one or more portfolios.
//    * @param profile - The profile node or its ID.
//    * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and app IDs to unauthorize.
//    * @returns A promise resolving to an array of SpinalNode instances representing the unauthorizations.
//    */
//   public async unauthorizeToAccessPortofolioApp(profile: string | SpinalNode, portofolioAuth: IPortofolioAuth | IPortofolioAuth[]): Promise<SpinalNode[]> {
//     portofolioAuth = Array.isArray(portofolioAuth) ? portofolioAuth : [portofolioAuth];
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;

//     const formattedData = formatAndMergePortofolioAuthorization(portofolioAuth);
//     const promises = [];

//     for (const data of formattedData) {
//       if (!data.appsIds || data.appsIds.length === 0) continue;
//       promises.push(authorizationInstance.unauthorizeProfileToAccessPortofolioApp(profileNode, data.portofolioId, data.unauthorizeAppsIds));
//     }

//     return Promise.all(promises).then((result) => {
//       return result.flat();
//     })
//   }


//   /**
//    * Authorizes a profile to access specific API routes within one or more portfolios.
//    * @param profile - The profile node or its ID.
//    * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and API IDs.
//    * @returns A promise resolving to an array of authorized portfolio-API structures.
//    */
//   public async authorizeProfileToAccessPortofolioApisRoute(profile: string | SpinalNode, portofolioAuth: IPortofolioAuth | IPortofolioAuth[]): Promise<IPortofolioAuthRes[]> {
//     portofolioAuth = Array.isArray(portofolioAuth) ? portofolioAuth : [portofolioAuth];
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;

//     const itemsFormatted = formatAndMergePortofolioAuthorization(portofolioAuth);

//     const promises = itemsFormatted.map(async ({ apisIds, portofolioId }) => {
//       if (apisIds && apisIds.length === 0) return null;

//       const portofolio = await authorizationInstance.authorizeProfileToAccessPortofolio(profileNode, portofolioId);
//       const apis = await authorizationInstance.authorizeProfileToAccessPortofolioApisRoutes(profileNode, portofolioId, apisIds);
//       return { portofolio, apis }
//     })

//     return Promise.all(promises).then((result) => result.filter(Boolean));
//   }



//   /**
//    * Revokes a profile's authorization to access specific API routes within one or more portfolios.
//    * @param profile - The profile node or its ID.
//    * @param portofolioAuth - A single or array of IPortofolioAuth objects specifying portfolio and API IDs to unauthorize.
//    * @returns A promise resolving to an array of IDs of the unauthorized API routes.
//    */
//   public async unauthorizeProfileToAccessPortofolioApisRoute(profile: string | SpinalNode, portofolioAuth: IPortofolioAuth | IPortofolioAuth[]): Promise<string[]> {
//     portofolioAuth = Array.isArray(portofolioAuth) ? portofolioAuth : [portofolioAuth];
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;

//     const itemsFormatted = formatAndMergePortofolioAuthorization(portofolioAuth);

//     const promises = itemsFormatted.map(async ({ unauthorizeApisIds, portofolioId }) => {
//       if (!unauthorizeApisIds || unauthorizeApisIds.length === 0) return null;
//       return authorizationInstance.unauthorizeProfileToAccessPortofolioApisRoutes(profileNode, portofolioId, unauthorizeApisIds);
//     });

//     return Promise.all(promises).then((result) => {
//       const res = result.flat();
//       return res.map(el => el?.getId().get()).filter(Boolean);
//     });

//   }

//   /**
//    * Retrieves the authorized portfolios for a given profile.
//    *
//    * @param {(string | SpinalNode)} profile
//    * @return {*}  {Promise<SpinalNode[]>}
//    * @memberof AppProfileService
//    */
//   public async getAuthorizedPortofolio(profile: string | SpinalNode): Promise<SpinalNode[]> {
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;
//     return authorizationInstance.getAuthorizedPortofolioFromProfile(profileNode);
//   }

//   /**
//    * Retrieves the authorized applications for a given profile and portfolio.
//    *
//    * @param {(string | SpinalNode)} profile
//    * @param {string} portofolioId
//    * @return {*}  {Promise<SpinalNode[]>}
//    * @memberof AppProfileService
//    */
//   public async getAuthorizedPortofolioApp(profile: string | SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;
//     return authorizationInstance.getAuthorizedPortofolioAppFromProfile(profileNode, portofolioId)
//   }

//   /**
//    * Retrieves the authorized API routes for a given profile and portfolio.
//    *
//    * @param {(string | SpinalNode)} profile
//    * @param {string} portofolioId
//    * @return {*}  {Promise<SpinalNode[]>}
//    * @memberof AppProfileService
//    */
//   public async getAuthorizedPortofolioApis(profile: string | SpinalNode, portofolioId: string): Promise<SpinalNode[]> {
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;
//     return authorizationInstance.getAuthorizedApisRoutesFromProfile(profileNode, portofolioId);
//   }

//   /**
//    * Retrieves the authorization structure for a given profile, including portfolios, applications, and buildings.
//    *
//    * @param {(string | SpinalNode)} profile - The profile identifier or a SpinalNode instance.
//    * @return {*}  {Promise<IPortofolioAuthRes[]>} - A promise that resolves to an array of authorization structures.
//    * @memberof AppProfileService
//    */
//   public async getPortofolioAuthStructure(profile: string | SpinalNode): Promise<IPortofolioAuthRes[]> {
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;

//     const portofolios = await this.getAuthorizedPortofolio(profile);
//     const promises = portofolios.map(async portofolio => {
//       const portofolioId = portofolio.getId().get();
//       return {
//         portofolio,
//         apps: await this.getAuthorizedPortofolioApp(profile, portofolioId),
//         apis: await this.getAuthorizedPortofolioApis(profile, portofolioId),
//         buildings: await this.getBosAuthStructure(profile, portofolioId)
//       }
//     })

//     return Promise.all(promises);
//   }


//   /////////////////////////////////////////////
//   //                  BOS                    //
//   /////////////////////////////////////////////

//   /**
//    * Authorizes a profile to access one or more BOS (Building Operating System) nodes.
//    *
//    * @param {(SpinalNode | string)} profile
//    * @param {string} portofolioId
//    * @param {(string | string[])} BosId
//    * @return {*}  {Promise<SpinalNode[]>}
//    * @memberof AppProfileService
//    */
//   public async authorizeProfileToAccessBos(profile: SpinalNode | string, portofolioId: string, BosId: string | string[]): Promise<SpinalNode[]> {
//     BosId = Array.isArray(BosId) ? BosId : [BosId];
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;

//     const promises = BosId.map(id => authorizationInstance.authorizeProfileToAccessBos(profileNode, portofolioId, id))
//     return Promise.all(promises);
//   }

//   /**
//    * Revokes a profile's authorization to access one or more BOS (Building Operating System) nodes.
//    *
//    * @param {(SpinalNode | string)} profile
//    * @param {string} portofolioId
//    * @param {(string | string[])} BosId
//    * @return {*}  {Promise<boolean[]>}
//    * @memberof AppProfileService
//    */
//   public async unauthorizeProfileToAccessBos(profile: SpinalNode | string, portofolioId: string, BosId: string | string[]): Promise<boolean[]> {
//     BosId = Array.isArray(BosId) ? BosId : [BosId];
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;

//     const promises = BosId.map(id => authorizationInstance.unauthorizeProfileToAccessBos(profileNode, portofolioId, id))
//     return Promise.all(promises);
//   }

//   /**
//    * Authorizes a profile to access specific applications within one or more BOS (Building Operating System) nodes.
//    *
//    * @param {SpinalNode | string} profile - The profile node or its ID.
//    * @param {string} portofolioId - The portfolio ID.
//    * @param {IBosAuth | IBosAuth[]} data - A single or array of IBosAuth objects specifying building and app IDs.
//    * @returns A promise resolving to an array of authorized building-app structures.
//    */
//   public async authorizeProfileToAccessBosApp(profile: SpinalNode | string, portofolioId: string, bosAuth: IBosAuth | IBosAuth[]): Promise<IBosAuthRes[]> {
//     bosAuth = Array.isArray(bosAuth) ? bosAuth : [bosAuth];

//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;

//     const itemsFormatted = formatAndMergeBosAuthorization(bosAuth);

//     const promises = itemsFormatted.map(async ({ appsIds, buildingId }) => {
//       if (appsIds && appsIds.length === 0) return null;

//       const bos = await authorizationInstance.authorizeProfileToAccessBos(profileNode, portofolioId, buildingId);
//       const apps = await authorizationInstance.authorizeProfileToAccessBosApp(profileNode, portofolioId, buildingId, appsIds);

//       return { building: bos, apps };

//     });

//     return Promise.all(promises).then((result) => result.filter(Boolean));
//   }


//   /**
//    * Revokes a profile's authorization to access specific applications within one or more BOS (Building Operating System) nodes.
//    *
//    * @param {(SpinalNode | string)} profile
//    * @param {string} portofolioId
//    * @param {(IBosAuth | IBosAuth[])} bosAuth
//    * @return {*}  {Promise<SpinalNode[]>}
//    * @memberof AppProfileService
//    */
//   public async unauthorizeProfileToAccessBosApp(profile: SpinalNode | string, portofolioId: string, bosAuth: IBosAuth | IBosAuth[]): Promise<SpinalNode[]> {
//     bosAuth = Array.isArray(bosAuth) ? bosAuth : [bosAuth];

//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;

//     const itemsFormatted = formatAndMergeBosAuthorization(bosAuth);


//     const promises = itemsFormatted.map(({ buildingId, unauthorizeAppsIds }) => {
//       return authorizationInstance.unauthorizeProfileToAccessBosApp(profileNode, portofolioId, buildingId, unauthorizeAppsIds);
//     });

//     return Promise.all(promises).then((result) => result.flat());
//   }



//   /**
//    * Authorizes a profile to access specific API routes within one or more BOS (Building Operating System) nodes.
//    *
//    * @param {SpinalNode | string} profile - The profile node or its ID.
//    * @param {string} portofolioId - The portfolio ID.
//    * @param {IBosAuth | IBosAuth[]} bosAuth - A single or array of IBosAuth objects specifying building and API IDs.
//    * @returns A promise resolving to an array of authorized building-API structures.
//    */
//   public async authorizeProfileToAccessBosApiRoute(profile: SpinalNode | string, portofolioId: string, bosAuth: IBosAuth | IBosAuth[]): Promise<IBosAuthRes[]> {
//     bosAuth = Array.isArray(bosAuth) ? bosAuth : [bosAuth];

//     const node = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(node instanceof SpinalNode)) return;

//     const itemsFormatted = formatAndMergeBosAuthorization(bosAuth);
//     const promises = itemsFormatted.map(async ({ apisIds, buildingId }) => {
//       if (apisIds && apisIds.length === 0) return null;

//       const bos = await authorizationInstance.authorizeProfileToAccessBos(node, portofolioId, buildingId);
//       const apis = await authorizationInstance.authorizeProfileToAccessBosApisRoutes(node, portofolioId, buildingId, apisIds);

//       return { building: bos, apis };
//     })

//     return Promise.all(promises).then((result) => result.filter(Boolean));

//   }

//   /**
//    * Revokes a profile's authorization to access specific API routes within one or more BOS (Building Operating System) nodes.
//    *
//    * @param {(SpinalNode | string)} profile
//    * @param {string} portofolioId
//    * @param {(IBosAuth | IBosAuth[])} bosAuth
//    * @return {*}  {Promise<string[]>}
//    * @memberof AppProfileService
//    */
//   public async unauthorizeProfileToAccessBosApiRoute(profile: SpinalNode | string, portofolioId: string, bosAuth: IBosAuth | IBosAuth[]): Promise<string[]> {
//     bosAuth = Array.isArray(bosAuth) ? bosAuth : [bosAuth];

//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;

//     const itemsFormatted = formatAndMergeBosAuthorization(bosAuth);

//     const promises = itemsFormatted.map(({ buildingId, unauthorizeApisIds }) => {
//       return authorizationInstance.unauthorizeProfileToAccessBosApisRoutes(profileNode, portofolioId, buildingId, unauthorizeApisIds);
//     })

//     return Promise.all(promises).then((result) => {
//       const res = result.flat();
//       return res.map(el => el?.getId().get());
//     })
//   }


//   /**
//    * Retrieves the authorized BOS (Building Operating System) nodes for a given profile and portfolio.
//    *
//    * @param {(SpinalNode | string)} profile - The profile node or its ID.
//    * @param {string} portofolioId - The portfolio ID.
//    * @return {*}  {Promise<SpinalNode[]>} - A promise that resolves to an array of authorized BOS nodes.
//    */
//   public async getAuthorizedBos(profile: SpinalNode | string, portofolioId: string,): Promise<SpinalNode[]> {
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;
//     return authorizationInstance.getAuthorizedBosFromProfile(profileNode, portofolioId);
//   }

//   /**
//    * Retrieves the authorized applications for a given profile and portfolio within a specific BOS (Building Operating System).
//    *
//    * @param {(SpinalNode | string)} profile
//    * @param {string} portofolioId
//    * @param {string} bosId
//    * @return {*}  {Promise<SpinalNode[]>}
//    * @memberof AppProfileService
//    */
//   public async getAuthorizedBosApp(profile: SpinalNode | string, portofolioId: string, bosId: string): Promise<SpinalNode[]> {
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;
//     return authorizationInstance.getAuthorizedBosAppFromProfile(profileNode, portofolioId, bosId);
//   }

//   /**
//    * Retrieves the authorized API routes for a given profile and portfolio within a specific BOS (Building Operating System).
//    *
//    * @param {(SpinalNode | string)} profile
//    * @param {string} portofolioId
//    * @param {string} bosId
//    * @return {*}  {Promise<SpinalNode[]>}
//    * @memberof AppProfileService
//    */
//   public async getAuthorizedBosApis(profile: SpinalNode | string, portofolioId: string, bosId: string): Promise<SpinalNode[]> {
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;
//     return authorizationInstance.getAuthorizedBosApisRoutesFromProfile(profileNode, portofolioId, bosId);
//   }

//   /**
//    * Retrieves the authorization structure for a given profile, including buildings, applications, and APIs.
//    *
//    * @param {(string | SpinalNode)} profile
//    * @param {string} portofolioId
//    * @return {*}  {Promise<IBosAuthRes[]>}
//    * @memberof AppProfileService
//    */
//   public async getBosAuthStructure(profile: string | SpinalNode, portofolioId: string): Promise<IBosAuthRes[]> {
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     if (!(profileNode instanceof SpinalNode)) return;

//     const buildings = await this.getAuthorizedBos(profile, portofolioId);

//     const promises = buildings.map(async building => {
//       const bosId = building.getId().get()
//       return {
//         building,
//         apps: await this.getAuthorizedBosApp(profile, portofolioId, bosId),
//         apis: await this.getAuthorizedBosApis(profile, portofolioId, bosId)
//       }
//     })

//     return Promise.all(promises);
//   }

//   /**
//    * Retrieves all authorized BOS (Building Operating System) nodes for a given profile.
//    *
//    * @param {(string | SpinalNode)} profile - The profile node or its ID.
//    * @return {*}  {Promise<SpinalNode[]>} - A promise that resolves to an array of authorized BOS nodes.
//    */
//   public async getAllAuthorizedBos(profile: string | SpinalNode): Promise<SpinalNode[]> {
//     const profileNode = profile instanceof SpinalNode ? profile : await _getAppProfileNode(profile, this.context);
//     const portofolios = await this.getAuthorizedPortofolio(profileNode);

//     const promises = portofolios.map(el => this.getAuthorizedBos(profileNode, el.getId().get()));
//     return Promise.all(promises).then((result) => result.flat());
//   }

//   /**
//    * Checks if a given application profile has access to a specific API.
//    *
//    * @param {(string | SpinalNode)} appProfile
//    * @param {SpinalNode} apiId
//    * @return {*}  {Promise<SpinalNode>}
//    * @memberof AppProfileService
//    */
//   public async profileHasAccessToApi(appProfile: string | SpinalNode, apiId: SpinalNode): Promise<SpinalNode> {
//     const profile = appProfile instanceof SpinalNode ? appProfile : await _getAppProfileNode(appProfile, this.context);
//     return authorizationInstance.profileHasAccess(profile, apiId);
//   }


//   private async _authorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioAuth: IPortofolioAuth): Promise<IPortofolioAuthRes> {
//     const [portofolio] = await this.authorizeProfileToAccessPortofolioById(profile, portofolioAuth.portofolioId);
//     const apisData = await this.authorizeProfileToAccessPortofolioApisRoute(profile, portofolioAuth);
//     const buildingProm = portofolioAuth.building.map(bos => this._authorizeIBosAuth(profile, bos, portofolioAuth.portofolioId))
//     return {
//       portofolio,
//       apis: apisData[0]?.apis,
//       buildings: await Promise.all(buildingProm)
//     }

//   }

//   /////////////////// private methods ///////////////////

//   private async _unauthorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioAuth: IPortofolioAuthEdit): Promise<any> {
//     await this.unauthorizeProfileToAccessPortofolioApisRoute(profile, { portofolioId: portofolioAuth.portofolioId, apisIds: portofolioAuth.unauthorizeApisIds });
//     const buildingProm = portofolioAuth.building.map(bos => this._unauthorizeIBosAuth(profile, bos, portofolioAuth.portofolioId))
//     await Promise.all(buildingProm);
//   }


//   private async _authorizeIBosAuth(profile: SpinalNode, bosAuth: IBosAuth, portofolioId: string): Promise<IBosAuthRes> {
//     const [building] = await this.authorizeProfileToAccessBos(profile, portofolioId, bosAuth.buildingId);
//     const apisData = await this.authorizeProfileToAccessBosApiRoute(profile, portofolioId, bosAuth);

//     return {
//       building,
//       apis: apisData[0]?.apis
//     }
//   }

//   private async _unauthorizeIBosAuth(profile: SpinalNode, bosAuth: IBosAuthEdit, portofolioId: string): Promise<any> {
//     const apisData = await this.unauthorizeProfileToAccessBosApiRoute(profile, portofolioId, { buildingId: bosAuth.buildingId, apisIds: bosAuth.unauthorizeApisIds });
//     return apisData;
//   }

// }
