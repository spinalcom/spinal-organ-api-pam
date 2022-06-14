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

import * as express from "express";
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
      const node = await serviceInstance.createUserProfile(data);
      return res.status(200).send(node.info.get());
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  public async getUserProfile(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const node = await serviceInstance.getUserProfile(id);
      if (node) return res.status(200).send(node.info.get());
      return res.status(404).send(`no profile found for ${id}`);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  public async getAllUserProfile(req: express.Request, res: express.Response) {
    try {
      const nodes = await serviceInstance.getAllUserProfile();
      if (nodes) return res.status(200).send(nodes.map(el => el.info.get()));
      return res.status(200).send([]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  public async updateUserProfile(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const node = await serviceInstance.updateUserProfile(id, data);
      if (node) return res.status(200).send(node.info.get());
      return res.status(404).send(`no profile found for ${id}`);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  public async deleteUserProfile(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;

      await serviceInstance.deleteUserProfile(id);
      return res.status(200).send("user profile deleted");

    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  public removeRoleToUserProfile(req: express.Request, res: express.Response) { }
}


export default UserProfileController.getInstance();