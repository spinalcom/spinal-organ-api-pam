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
import { ADMIN_PROFILE_NAME, ADMIN_PROFILE_TYPE, APP_RELATION_NAME, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, PTR_LST_TYPE } from '../constant';
import { IPortofolioAuth, IPortofolioAuthEdit, IPortofolioAuthRes } from '../interfaces';
import { PortofolioService } from './portofolio.service';
import { UserProfileService } from './userProfile.service';
import { _getAuthorizedPortofolioContext, createNodeReference } from '../utils/authorizationUtils';

export class AdminProfileService {
  private static instance: AdminProfileService;
  private _adminNode: SpinalNode;

  private constructor() { }

  public static getInstance(): AdminProfileService {
    if (!this.instance) this.instance = new AdminProfileService();

    return this.instance;
  }

  public get adminNode() {
    return this._adminNode;
  }

  public async init(context: SpinalContext): Promise<SpinalNode> {
    let existingAdminProfile = await this.getAdminProfile(context);

    //  If no admin profile exists, create one
    if (!existingAdminProfile) {
      existingAdminProfile = this._createAdminProfileNode();
      await context.addChildInContext(existingAdminProfile, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PTR_LST_TYPE, context);
    }

    this._adminNode = existingAdminProfile;

    await this.syncAdminProfile(); // Synchronize the admin profile with existing portofolios
    return existingAdminProfile;
  }

  /**
   * Adds an application node to the admin profile's "Administration" portofolio.
   * If the admin portofolio does not exist, it is created.
   * @param app The application SpinalNode to add.
   * @returns The reference node added as a child.
   */
  async addAppToAdminProfil(app: SpinalNode): Promise<SpinalNode> {
    const { context, portofolio } = await this._createOrGetAdminPortofolio();

    const appReference = await createNodeReference(app);

    return portofolio.addChildInContext(appReference, APP_RELATION_NAME, PTR_LST_TYPE, context);
  }


  /**
   * Authorizes an admin profile to access a specified portfolio.
   *
   * This method delegates the authorization logic to the `UserProfileService`,
   * passing the current admin node and the provided portfolio authorization data.
   *
   * @param data - The portfolio authorization data containing the necessary information
   *               to determine access rights.
   * @returns A promise that resolves with the result of the authorization operation.
   */
  public async authorizeAdminProfileToAccessPortofolio(data: IPortofolioAuth) {
    return UserProfileService.getInstance().authorizeProfileToAccessPortofolio(this._adminNode, data);
  }


  /**
   * Removes authorization for a profile to access a portfolio from the admin profile.
   *
   * @param profileInfo - The profile information containing authorization details to be removed.
   * @returns A promise that resolves when the profile has been unauthorized from accessing the portfolio.
   */
  public async removeFromAdminProfile(profileInfo: IPortofolioAuthEdit) {
    return UserProfileService.getInstance().unauthorizeProfileToAccessPortofolio(this._adminNode, profileInfo);
  }


  /**
   * Synchronizes the admin profile's access to all existing portofolios.
   * For each portofolio, ensures the admin profile is authorized to access it.
   * @returns A promise resolving to an array of authorization results for each portofolio.
   */
  public async syncAdminProfile(): Promise<IPortofolioAuthRes[]> {
    const data = await this._getPortofoliosStructure();

    const promises = data.map(async (el: IPortofolioAuth) => UserProfileService.getInstance().authorizeProfileToAccessPortofolio(this._adminNode, el));

    return Promise.all(promises);
  }


  /**
   * Retrieves the admin profile node from the specified context or from the default user profile context.
   *
   * If the admin profile node has already been retrieved and cached, it returns the cached node.
   * Otherwise, it fetches the children of the provided context (or the default context if none is provided),
   * and searches for a node matching the admin profile name and type.
   *
   * @param argContext - (Optional) The context from which to retrieve the admin profile node.
   * @returns A promise that resolves to the admin profile node if found, otherwise `undefined`.
   */
  public async getAdminProfile(argContext?: SpinalContext): Promise<SpinalNode> {
    if (this._adminNode) return this._adminNode;

    const context = argContext || UserProfileService.getInstance().context;
    if (!context) return;

    const contexts = await context.getChildren();

    return contexts.find((el) => (el.getName().get() === ADMIN_PROFILE_NAME && el.getType().get() === ADMIN_PROFILE_TYPE));
  }


  /**
   * Determines whether the given profile ID corresponds to the admin profile.
   *
   * @param profileId - The ID of the profile to check.
   * @returns `true` if the provided profile ID matches the admin profile's ID; otherwise, `false`.
   */
  public isAdmin(profileId: string): boolean {
    return this._adminNode.getId().get() === profileId;
  }


  /////////////////////////////////////
  //        Private methods          //
  /////////////////////////////////////

  private _createAdminProfileNode(): SpinalNode {
    const info = { name: ADMIN_PROFILE_NAME, type: ADMIN_PROFILE_TYPE };
    const graph = new SpinalGraph(ADMIN_PROFILE_NAME);
    const profileId = SpinalGraphService.createNode(info, graph);

    const node = SpinalGraphService.getRealNode(profileId);
    return node;
  }

  private async _getPortofoliosStructure(): Promise<IPortofolioAuth[]> {
    const portofolioDetails = await PortofolioService.getInstance().getAllPortofoliosDetails();

    return portofolioDetails.map(({ node, apps, apis, buildings }: any) => {
      return {
        portofolioId: node.getId().get(),
        appsIds: apps.map((el) => el.getId().get()),
        apisIds: apis.map((el) => el.getId().get()),
        building: buildings.map((building) => {
          return {
            buildingId: building.node.getId().get(),
            appsIds: building.apps.map((el) => el.getId().get()),
            apisIds: building.apis.map((el) => el.getId().get()),
          };
        }),
      };
    });
  }

  private async _createOrGetAdminPortofolio() {
    const adminPortofolio = 'Administration';
    const createIfNotExist = true;
    const context = await _getAuthorizedPortofolioContext(this._adminNode, createIfNotExist);
    const portfolioContexts = await context.getChildren();

    let portofolio = portfolioContexts.find((el) => el.getName().get() === adminPortofolio);

    if (portofolio) return { context, portofolio };

    const node = new SpinalNode(adminPortofolio, adminPortofolio);
    const refNode = await createNodeReference(node);

    await context.addChildInContext(refNode, PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, PTR_LST_TYPE, context);
    return { context, portofolio: refNode };
  }
}
