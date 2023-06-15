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

import axios from 'axios';
import {
  SpinalContext,
  SpinalGraphService,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import {
  USER_LIST_CONTEXT_TYPE,
  USER_LIST_CONTEXT_NAME,
  ADMIN_USERNAME,
  ADMIN_USER_TYPE,
  PTR_LST_TYPE,
  CONTEXT_TO_ADMIN_USER_RELATION,
  HTTP_CODES,
  TOKEN_TYPE,
  TOKEN_RELATION_NAME,
  CONTEXT_TO_USER_RELATION_NAME,
  USER_TYPES,
  USER_TO_FAVORITE_APP_RELATION,
} from '../constant';
import {
  IPamCredential,
  IUserCredential,
  IUserInfo,
  IUserToken,
} from '../interfaces';
import {configServiceInstance} from './configFile.service';
import {Model} from 'spinal-core-connectorjs_type';
import * as bcrypt from 'bcrypt';
import * as fileLog from 'log-to-file';
import * as path from 'path';
import {TokenService} from './token.service';
import {AuthentificationService} from './authentification.service';
import {UserProfileService} from './userProfile.service';
import {AppService} from './apps.service';
import {authorizationInstance} from './authorization.service';

export class UserListService {
  private static instance: UserListService;
  public context: SpinalContext;

  private constructor() {}

  public static getInstance(): UserListService {
    if (!this.instance) this.instance = new UserListService();
    return this.instance;
  }

  public async init(): Promise<SpinalContext> {
    this.context = await configServiceInstance.getContext(
      USER_LIST_CONTEXT_NAME
    );
    if (!this.context) {
      this.context = await configServiceInstance.addContext(
        USER_LIST_CONTEXT_NAME,
        USER_LIST_CONTEXT_TYPE
      );
    }

    const info = {
      name: 'admin',
      userName: 'admin',
      password: this._generateString(15),
    };

    await this.createAdminUser(info);

    return this.context;
  }

  public async authenticateUser(
    user: IUserCredential
  ): Promise<{code: number; data: string | IUserToken}> {
    let data: any = await this.authAdmin(user);
    let isAdmin = true;
    if (data.code === HTTP_CODES.INTERNAL_ERROR) {
      data = await this.authUserViaAuthPlateform(user);
      isAdmin = false;
    }

    if (data.code === HTTP_CODES.OK) {
      const type = isAdmin ? USER_TYPES.ADMIN : USER_TYPES.USER;
      const info = {
        name: user.userName,
        userName: user.userName,
        type,
        userType: type,
        userId: data.data.userId,
      };
      const playload = data.data;
      const token = data.data.token;
      const node = await this._addUserToContext(info);
      delete data.data.userInfo.password;
      await TokenService.getInstance().addUserToken(node, token, playload);
    }

    return data;
  }

  public async getUser(username: string): Promise<SpinalNode> {
    const users = await this.context.getChildren([
      CONTEXT_TO_ADMIN_USER_RELATION,
      CONTEXT_TO_USER_RELATION_NAME,
    ]);
    return users.find(
      (el) =>
        el.info.userName?.get() === username ||
        el.info.userId?.get() === username
    );
  }

  ///////////////////////////////////////////////
  //              Favorite Apps                //
  ///////////////////////////////////////////////

  public async addFavoriteApp(
    userId: string,
    userProfileId: string,
    appIds: string | string[],
    portofolioId: string,
    buildingId?: string
  ): Promise<SpinalNode[]> {
    const user = await this.getUser(userId);

    if (!Array.isArray(appIds)) appIds = [appIds];
    const authorizedApps = await this._getAuthorizedApps(
      userProfileId,
      portofolioId,
      buildingId
    );
    const favoriteApp = await this.getFavoriteApps(
      userId,
      portofolioId,
      buildingId
    );

    const authorizedAppsObj = this._convertListToObj(authorizedApps);
    const favoriteAppsObj = this._convertListToObj(favoriteApp);

    return appIds.reduce(async (prom, appId) => {
      const list = await prom;
      const app = authorizedAppsObj[appId];
      if (!app || favoriteAppsObj[appId]) return list;

      const reference = await (
        authorizationInstance as any
      )._createNodeReference(app);
      reference.info.add_attr({appId, portofolioId});
      if (buildingId) reference.info.add_attr({buildingId});

      await user.addChild(
        reference,
        USER_TO_FAVORITE_APP_RELATION,
        PTR_LST_TYPE
      );
      list.push(app);

      return list;
    }, Promise.resolve([]));
  }

  public async removeFavoriteApp(
    userId: string,
    userProfileId: string,
    appIds: string | string[],
    portofolioId: string,
    buildingId?: string
  ): Promise<SpinalNode[]> {
    if (!Array.isArray(appIds)) appIds = [appIds];

    const user = await this.getUser(userId);
    const favoriteApps = await user.getChildren(USER_TO_FAVORITE_APP_RELATION);
    const favoriteAppObj = this._convertListToObj(favoriteApps, 'appId');

    return appIds.reduce(async (prom, appId) => {
      const list = await prom;

      try {
        const app = favoriteAppObj[appId];
        const element = await app.getElement();
        await app.removeFromGraph();

        list.push(element);
      } catch (error) {}

      return list;
    }, Promise.resolve([]));
  }

  public async getFavoriteApps(
    userId: string,
    portofolioId: string,
    buildingId?: string
  ): Promise<SpinalNode[]> {
    const user = await this.getUser(userId);
    if (!user) return [];
    const children = await user.getChildren(USER_TO_FAVORITE_APP_RELATION);
    return children.reduce(async (prom, el) => {
      const list = await prom;
      const portId = el.info.portofolioId
        ? el.info.portofolioId.get()
        : undefined;
      const buildId = el.info.buildingId ? el.info.buildingId.get() : undefined;
      if (portofolioId === portId && buildId == buildingId) {
        const element = await el.getElement(true);
        if (element) list.push(element);
      }
      return list;
    }, Promise.resolve([]));
  }

  /////////////////////////////////////////////
  //                  ADMIN                  //
  /////////////////////////////////////////////

  public async createAdminUser(userInfo?: IUserInfo): Promise<SpinalNode> {
    const userName = (userInfo && userInfo.userName) || ADMIN_USERNAME;

    const userExist = await this.getAdminUser(userName);
    if (userExist) return;

    const password =
      (userInfo && userInfo.password) || this._generateString(16);
    fileLog(
      JSON.stringify({userName, password}),
      path.resolve(__dirname, '../../.admin.log')
    );

    return this._addUserToContext(
      {
        name: userName,
        userName,
        type: USER_TYPES.ADMIN,
        userType: USER_TYPES.ADMIN,
      },
      new Model({userName, password: await this._hashPassword(password)}),
      true
    );
  }

  public async getAdminUser(userName: string): Promise<SpinalNode> {
    const children = await this.context.getChildren(
      CONTEXT_TO_ADMIN_USER_RELATION
    );
    return children.find((el) => el.info.userName.get() === userName);
  }

  public async authAdmin(
    user: IUserCredential
  ): Promise<{code: number; data: any | string}> {
    const node = await this.getAdminUser(user.userName);
    if (!node)
      return {
        code: HTTP_CODES.INTERNAL_ERROR,
        data: 'bad username and/or password',
      };

    const element = await node.getElement(true);
    const success = await this._comparePassword(
      user.password,
      element.password.get()
    );
    if (!success)
      return {
        code: HTTP_CODES.UNAUTHORIZED,
        data: 'bad username and/or password',
      };

    // await this._deleteUserToken(node);
    const res = await TokenService.getInstance().getAdminPlayLoad(node);

    return {code: HTTP_CODES.OK, data: res};
  }

  public async authUserViaAuthPlateform(
    user: IUserCredential
  ): Promise<{code: HTTP_CODES; data: any}> {
    const adminCredential = await this._getAuthPlateformInfo();

    const url = `${adminCredential.urlAdmin}/users/login`;
    return axios
      .post(url, user)
      .then(async (result) => {
        const data = result.data;
        data.profile = await this._getProfileInfo(data.token, adminCredential);
        data.userInfo = await this._getUserInfo(
          data.userId,
          adminCredential,
          data.token
        );

        return {
          code: HTTP_CODES.OK,
          data,
        };
      })
      .catch((err) => {
        // console.error(err)
        return {
          code: HTTP_CODES.UNAUTHORIZED,
          data: 'bad credential',
        };
      });
  }

  //////////////////////////////////////////////////
  //                    PRIVATE                   //
  //////////////////////////////////////////////////

  private async _addUserToContext(
    info: {[key: string]: any},
    element?: spinal.Model,
    isAdmin: boolean = false
  ): Promise<SpinalNode> {
    const users = await this.context.getChildrenInContext();

    const found = users.find((el) => el.info.userName?.get() === info.userName);
    if (found) return found;

    const nodeId = SpinalGraphService.createNode(info, element);
    const node = SpinalGraphService.getRealNode(nodeId);
    const relationName = isAdmin
      ? CONTEXT_TO_ADMIN_USER_RELATION
      : CONTEXT_TO_USER_RELATION_NAME;
    return this.context.addChildInContext(
      node,
      relationName,
      PTR_LST_TYPE,
      this.context
    );
  }

  private _hashPassword(
    password: string,
    saltRounds: number = 10
  ): Promise<string> {
    return bcrypt.hashSync(password, saltRounds);
  }

  private _comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private _generateString(length = 10): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*/-_@#&';
    let text = '';
    for (var i = 0, n = charset.length; i < length; ++i) {
      text += charset.charAt(Math.floor(Math.random() * n));
    }
    return text;
  }

  private async _deleteUserToken(userNode: SpinalNode) {
    const tokens = await userNode.getChildren(TOKEN_RELATION_NAME);
    const promises = tokens.map((token) =>
      TokenService.getInstance().deleteToken(token)
    );
    return Promise.all(promises);
  }

  private _getAuthorizedApps(
    userProfileId: string,
    portofolioId: string,
    buildingId: string
  ): Promise<SpinalNode[]> {
    const userProfileInstance = UserProfileService.getInstance();

    return buildingId
      ? userProfileInstance.getAuthorizedBosApp(
          userProfileId,
          portofolioId,
          buildingId
        )
      : userProfileInstance.getAuthorizedPortofolioApp(
          userProfileId,
          portofolioId
        );
  }

  private _getProfileInfo(
    userToken: string,
    adminCredential: IPamCredential,
    isUser: boolean = true
  ) {
    let urlAdmin = adminCredential.urlAdmin;
    let endpoint = '/tokens/getUserProfileByToken';
    return axios
      .post(urlAdmin + endpoint, {
        platformId: adminCredential.idPlateform,
        token: userToken,
      })
      .then((result) => {
        if (!result.data) return;
        const data = result.data;
        delete data.password;
        return data;
      })
      .catch((err) => {
        return {};
      });
  }

  private _getUserInfo(
    userId: string,
    adminCredential: IPamCredential,
    userToken: string
  ) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // "x-access-token": adminCredential.tokenBosAdmin
        'x-access-token': userToken,
      },
    };
    return axios
      .get(`${adminCredential.urlAdmin}/users/${userId}`, config)
      .then((result) => {
        return result.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  private async _getAuthPlateformInfo() {
    const adminCredential =
      await AuthentificationService.getInstance().getPamToAdminCredential();
    if (!adminCredential)
      throw new Error('No authentication platform is registered');
    return adminCredential;
  }

  private _convertListToObj(
    liste: SpinalNode[],
    key: string = 'id'
  ): {[key: string]: SpinalNode} {
    return liste.reduce((obj, item) => {
      const id = item.info[key]?.get();
      if (id) obj[id] = item;
      return obj;
    }, {});
  }
}
