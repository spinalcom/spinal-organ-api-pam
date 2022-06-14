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

import { SpinalContext, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import * as express from "express";
import { AppService } from "../../../services";

const appServiceInstance = AppService.getInstance();

export class AppsController {
  private static instance: AppsController;
  public context: SpinalContext;

  private constructor() { }

  public static getInstance(): AppsController {
    if (!this.instance) {
      this.instance = new AppsController();
    }

    return this.instance;
  }

  public async createAppCategory(req: express.Request, res: express.Response) {
    try {
      const { name } = req.body;
      const appCategory = await appServiceInstance.createAppCategory(name);
      return res.status(200).send(appCategory.info.get());
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async getAppCategory(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const appCategory = await appServiceInstance.getAppCategory(id);
      if (appCategory) return res.status(200).send(appCategory.info.get());
      return res.status(404).send(`no category found for ${id}`);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async getAllCategories(req: express.Request, res: express.Response) {
    try {
      const categories = await appServiceInstance.getAllCategories();
      if (categories) return res.status(200).send(categories.map(el => el.info.get()));
      return res.status(200).send([]);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async updateAppCategory(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const categoryUpdated = await appServiceInstance.updateAppCategory(id, name);
      if (categoryUpdated) return res.status(200).send(categoryUpdated.info.get());
      return res.status(404).send(`no category found for ${id}`);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async deleteAppCategory(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      await appServiceInstance.deleteAppCategory(id);
      return res.status(200).send("app category deleted");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async createAppGroup(req: express.Request, res: express.Response) {
    try {
      const { categoryId } = req.params;
      const { name } = req.body;

      const appGroup = await appServiceInstance.createAppGroup(categoryId, name);
      return res.status(200).send(appGroup.info.get());

    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async getAllGroupsInCategory(req: express.Request, res: express.Response) {
    try {
      const { categoryId } = req.params;

      const groups = await appServiceInstance.getAllGroupsInCategory(categoryId);
      if (groups) return res.status(200).send(groups.map(el => el.info.get()));
      return res.status(200).send([]);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async getAppGroup(req: express.Request, res: express.Response) {
    try {
      const { categoryId, groupId } = req.params;
      const appGroup = await appServiceInstance.getAppGroup(categoryId, groupId);
      if (appGroup) return res.status(200).send(appGroup.info.get());
      return res.status(404).send(`no group found for ${groupId}`);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async updateAppGroup(req: express.Request, res: express.Response) {
    try {
      const { categoryId, groupId } = req.params;
      const { name } = req.body;

      const groupUpdated = await appServiceInstance.updateAppGroup(categoryId, groupId, name);
      if (groupUpdated) return res.status(200).send(groupUpdated.info.get());
      return res.status(404).send(`no group found for ${groupId}`);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async deleteAppGroup(req: express.Request, res: express.Response) {
    try {
      const { categoryId, groupId } = req.params;
      await appServiceInstance.deleteAppGroup(categoryId, groupId);
      return res.status(200).send("app group deleted");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async createApp(req: express.Request, res: express.Response) {
    try {
      const { categoryId, groupId } = req.params;
      const data = req.body;

      const app = await appServiceInstance.createApp(categoryId, groupId, data);
      return res.status(200).send(app.info.get());
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async getAllAppsInGroup(req: express.Request, res: express.Response) {
    try {
      try {
        const { categoryId, groupId } = req.params;

        const apps = await appServiceInstance.getAllAppsInGroup(categoryId, groupId);
        if (apps) return res.status(200).send(apps.map(el => el.info.get()));
        return res.status(200).send([]);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async getAllApps(req: express.Request, res: express.Response) {
    try {
      const apps = await appServiceInstance.getAllApps();
      return res.status(200).send(apps.map(el => el.info.get()))
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async getAppById(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params;
      const app = await appServiceInstance.getAppById(id);
      if (app) return res.status(200).send(app.info.get());
      return res.status(404).send(`no app find for ${id}`);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async getApp(req: express.Request, res: express.Response) {

    try {
      const { categoryId, groupId, appId } = req.params;
      const app = await appServiceInstance.getApp(categoryId, groupId, appId);
      if (app) return res.status(200).send(app.info.get());
      return res.status(404).send(`no App found for ${appId}`);
    } catch (error) {
      return res.status(500).send(error.message);
    }

  }

  public async updateApp(req: express.Request, res: express.Response) {
    try {
      const { categoryId, groupId, appId } = req.params;
      const data = req.body;

      const appUpdated = await appServiceInstance.updateApp(categoryId, groupId, appId, data);
      if (appUpdated) return res.status(200).send(appUpdated.info.get());
      return res.status(404).send(`no app found for ${appId}`);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  public async deleteApp(req: express.Request, res: express.Response) {
    try {
      const { categoryId, groupId, appId } = req.params;
      await appServiceInstance.deleteApp(categoryId, groupId, appId);
      return res.status(200).send("app deleted");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

}

export default AppsController.getInstance();