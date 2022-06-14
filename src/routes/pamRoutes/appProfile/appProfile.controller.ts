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
import { AppProfileService } from "../../../services";

const serviceInstance = AppProfileService.getInstance();

export class AppProfileController {

  private static instance: AppProfileController;

  private constructor() { }

  public static getInstance(): AppProfileController {
    if (!this.instance) {
      this.instance = new AppProfileController();
    }

    return this.instance;
  }

  public async createAppProfile(req: express.Request, res: express.Response) {
    try {
      const data = req.body;
      const node = await serviceInstance.createAppProfile(data);
      return res.status(200).send(node.info.get());
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  public async getAppProfile(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const node = await serviceInstance.getAppProfile(id);
      if (node) return res.status(200).send(node.info.get());
      return res.status(404).send(`no profile found for ${id}`);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  public async getAllAppProfile(req: express.Request, res: express.Response) {
    try {
      const nodes = await serviceInstance.getAllAppProfile();
      if (nodes) return res.status(200).send(nodes.map(el => el.info.get()));
      return res.status(200).send([]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  public async updateAppProfile(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const node = await serviceInstance.updateAppProfile(id, data);
      if (node) return res.status(200).send(node.info.get());
      return res.status(404).send(`no profile found for ${id}`);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  public async deleteAppProfile(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;

      await serviceInstance.deleteAppProfile(id);
      return res.status(200).send("app profile deleted");

    } catch (error) {
      res.status(500).send(error.message);
    }
  }

}


export default AppProfileController.getInstance();