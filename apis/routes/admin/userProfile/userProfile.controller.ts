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

import { HTTP_CODES } from "../../../constant";
import * as express from "express";
import { IUserProfile, IUserProfileRes } from "../../../interfaces";
import { SpinalNode } from "spinal-env-viewer-graph-service";
import { UserProfileService } from "../../../services";

const serviceInstance = UserProfileService.getInstance();

export class UserProfileController {
  private static instance: UserProfileController;

  private constructor() { }

  public static getInstance(): UserProfileController {
    if (!this.instance) {
      this.instance = new UserProfileController();
    }

    return this.instance;
  }

  public async createUserProfile(req: express.Request, res: express.Response) {
    try {
      const data = req.body;

      if (!data.name) return res.status(HTTP_CODES.BAD_REQUEST).send("The profile name is required");
      const profile = await serviceInstance.createUserProfile(data);
      return res.status(HTTP_CODES.CREATED).send(_formatUserProfile(profile));

    } catch (error) {
      res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }

  public async getUserProfile(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const data = await serviceInstance.getUserProfile(id);
      if (data) return res.status(HTTP_CODES.OK).send(_formatUserProfile(data));
      return res.status(HTTP_CODES.NOT_FOUND).send(`no profile found for ${id}`);
    } catch (error) {
      res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }

  public async getAllUserProfile(req: express.Request, res: express.Response) {
    try {
      const nodes = await serviceInstance.getAllUserProfile();
      if (nodes) return res.status(HTTP_CODES.OK).send(nodes.map(el => _formatUserProfile(el)));
      return res.status(HTTP_CODES.OK).send([]);
    } catch (error) {
      res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }

  public async updateUserProfile(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const node = await serviceInstance.updateUserProfile(id, data);
      if (node) return res.status(HTTP_CODES.OK).send(_formatUserProfile(node));
      return res.status(HTTP_CODES.NOT_FOUND).send(`no profile found for ${id}`);
    } catch (error) {
      res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }

  public async deleteUserProfile(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;

      await serviceInstance.deleteUserProfile(id);
      return res.status(HTTP_CODES.OK).send("user profile deleted");

    } catch (error) {
      res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }

  public async authorizeToAccessApps(req: express.Request, res: express.Response) {
    try {
      const { profileId } = req.params;
      const { authorizeApps } = req.body;

      const nodes = await serviceInstance.authorizeToAccessApps(profileId, authorizeApps);
      if (nodes) return res.status(HTTP_CODES.OK).send(_getNodeListInfo(nodes));

      return res.status(HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);

    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }

  public async unauthorizeToAccessApps(req: express.Request, res: express.Response) {
    try {
      const { profileId } = req.params;
      const { unauthorizeApps } = req.body;

      const nodes = await serviceInstance.unauthorizeToAccessApps(profileId, unauthorizeApps);
      if (nodes) return res.status(HTTP_CODES.OK).send(nodes.filter(el => el));

      return res.status(HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }

  public async getAuthorizedApps(req: express.Request, res: express.Response) {
    try {
      const { profileId } = req.params;

      const nodes = await serviceInstance.getAuthorizedApps(profileId);
      if (nodes) return res.status(HTTP_CODES.OK).send(_getNodeListInfo(nodes));

      return res.status(HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }

  public async authorizeToAccessApis(req: express.Request, res: express.Response) {
    try {
      const { profileId } = req.params;
      const { authorizeApis } = req.body;

      const nodes = await serviceInstance.authorizeToAccessApis(profileId, authorizeApis);
      if (nodes) return res.status(HTTP_CODES.OK).send(_getNodeListInfo(nodes));

      return res.status(HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }

  public async unauthorizeToAccessApis(req: express.Request, res: express.Response) {
    try {
      const { profileId } = req.params;
      const { unauthorizeApis } = req.body;

      const nodes = await serviceInstance.unauthorizeToAccessApis(profileId, unauthorizeApis);
      if (nodes) return res.status(HTTP_CODES.OK).send(nodes.filter(el => el));

      return res.status(HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }

  public async getAuthorizedApis(req: express.Request, res: express.Response) {
    try {
      const { profileId } = req.params;

      const nodes = await serviceInstance.getAuthorizedApis(profileId);
      if (nodes) return res.status(HTTP_CODES.OK).send(_getNodeListInfo(nodes));

      return res.status(HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }


  public async authorizeProfileToAccessBos(req: express.Request, res: express.Response) {
    try {
      const { profileId } = req.params;
      const { authorizeBos } = req.body;

      const nodes = await serviceInstance.authorizeToAccessBos(profileId, authorizeBos);
      if (nodes) return res.status(HTTP_CODES.OK).send(_getNodeListInfo(nodes));

      return res.status(HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);

    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }

  public async unauthorizeProfileToAccessBos(req: express.Request, res: express.Response) {
    try {
      const { profileId } = req.params;
      const { unauthorizeBos } = req.body;

      const nodes = await serviceInstance.unauthorizeToAccessBos(profileId, unauthorizeBos);
      if (nodes) return res.status(HTTP_CODES.OK).send(nodes.filter(el => el));

      return res.status(HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }

  public async getAuthorizedBos(req: express.Request, res: express.Response) {
    try {
      const { profileId } = req.params;

      const nodes = await serviceInstance.getAuthorizedBos(profileId);
      if (nodes) return res.status(HTTP_CODES.OK).send(_getNodeListInfo(nodes));

      return res.status(HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
    } catch (error) {
      return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    }
  }


  ////////////////////////////////////////////////
  //                    PRIVATES                //
  ////////////////////////////////////////////////




}


function _formatUserProfile(data: IUserProfileRes) {
  return {
    ...data.node.info.get(),
    authorizedApps: _getNodeListInfo(data.authorizedApps),
    authorizedRoutes: _getNodeListInfo(data.authorizedRoutes),
    authorizedBos: _getNodeListInfo(data.authorizedBos)
  }
}

function _getNodeListInfo(nodes: SpinalNode[]): any[] {
  return nodes.map(el => el.info.get());
}

function _formatUserProfileKeys(userProfile: IUserProfile): IUserProfile {
  const res: any = {};

  for (const key in userProfile) {
    if (Object.prototype.hasOwnProperty.call(userProfile, key)) {
      const element = userProfile[key];
      res[key] = typeof element === "string" && element.trim()[0] === "[" ? JSON.parse(element.trim()) : element;
    }
  }

  return res;
}

export default UserProfileController.getInstance();