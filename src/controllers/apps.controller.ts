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

import { AppService } from "../services";
import { Body, Controller, Delete, Get, Path, Post, Put, Route, Tags } from "tsoa";
import { HTTP_CODES } from "../constant";
import { IApp, IEditApp } from "../interfaces";

const appServiceInstance = AppService.getInstance();

@Route("/api/v1/pam")
@Tags("Applications")
export class AppsController extends Controller {

  public constructor() {
    super();
  }



  @Post("/create_admin_app")
  public async createAdminApp(@Body() appInfo: IApp): Promise<IApp | { message: string }> {
    try {
      const node = await appServiceInstance.createAdminApp(appInfo);
      if (node) {
        this.setStatus(HTTP_CODES.CREATED);
        return node.info.get();
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: "oops, something went wrong, please check your input data" };
    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Post("/create_portofolio_app")
  public async createPortofolioApp(@Body() appInfo: IApp): Promise<IApp | { message: string }> {
    try {
      const node = await appServiceInstance.createPortofolioApp(appInfo);
      if (node) {
        this.setStatus(HTTP_CODES.CREATED);
        return node.info.get();
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: "oops, something went wrong, please check your input data" };
    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Post("/create_building_app")
  public async createBuildingApp(@Body() appInfo: IApp): Promise<IApp | { message: string }> {
    try {
      const node = await appServiceInstance.createBuildingApp(appInfo);
      if (node) {
        this.setStatus(HTTP_CODES.CREATED);
        return node.info.get();
      }
      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: "oops, something went wrong, please check your input data" };
    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }


  @Get("/get_all_admin_apps")
  public async getAllAdminApps(): Promise<IApp[] | { message: string }> {
    try {
      const nodes = await appServiceInstance.getAllAdminApps();
      this.setStatus(HTTP_CODES.OK);
      return nodes.map(el => el.info.get());
    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Get("/get_all_portofolio_apps")
  public async getAllPortofolioApps(): Promise<IApp[] | { message: string }> {
    try {
      const nodes = await appServiceInstance.getAllPortofolioApps();
      this.setStatus(HTTP_CODES.OK);
      return nodes.map(el => el.info.get());
    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Get("/get_all_building_apps")
  public async getAllBuildingApps(): Promise<IApp[] | { message: string }> {
    try {
      const nodes = await appServiceInstance.getAllBuildingApps();
      this.setStatus(HTTP_CODES.OK);
      return nodes.map(el => el.info.get());
    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }


  @Get("/get_admin_app/{appId}")
  public async getAdminApp(@Path() appId: string): Promise<IApp | { message: string }> {
    try {
      const node = await appServiceInstance.getAdminApp(appId);
      if (node) {
        this.setStatus(HTTP_CODES.OK);
        return node.info.get();
      }

      this.setStatus(HTTP_CODES.NOT_FOUND);
      return { message: `No application found for this id (${appId})` };

    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Get("/get_portofolio_app/{appId}")
  public async getPortofolioApp(@Path() appId: string): Promise<IApp | { message: string }> {
    try {
      const node = await appServiceInstance.getPortofolioApp(appId);
      if (node) {
        this.setStatus(HTTP_CODES.OK);
        return node.info.get();
      }

      this.setStatus(HTTP_CODES.NOT_FOUND);
      return { message: `No application found for this id (${appId})` };

    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Get("/get_building_app/{appId}")
  public async getBuildingApp(@Path() appId: string): Promise<IApp | { message: string }> {
    try {
      const node = await appServiceInstance.getBuildingApp(appId);
      if (node) {
        this.setStatus(HTTP_CODES.OK);
        return node.info.get();
      }

      this.setStatus(HTTP_CODES.NOT_FOUND);
      return { message: `No application found for this id (${appId})` };

    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }


  @Put("/update_admin_app/{appId}")
  public async updateAdminApp(@Path() appId: string, @Body() newInfo: IEditApp): Promise<IApp | { message: string }> {
    try {
      const node = await appServiceInstance.updateAdminApp(appId, newInfo);
      if (node) {
        this.setStatus(HTTP_CODES.OK);
        return node.info.get();
      }

      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: `Something went wrong, please check your input data.` }

    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Put("/update_portofolio_app/{appId}")
  public async updatePortofolioApp(@Path() appId: string, @Body() newInfo: IEditApp): Promise<IApp | { message: string }> {
    try {
      const node = await appServiceInstance.updatePortofolioApp(appId, newInfo);
      if (node) {
        this.setStatus(HTTP_CODES.OK);
        return node.info.get();
      }

      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: `Something went wrong, please check your input data.` }

    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Put("/update_building_app/{appId}")
  public async updateBuildingApp(@Path() appId: string, @Body() newInfo: IEditApp): Promise<IApp | { message: string }> {
    try {
      const node = await appServiceInstance.updateBuildingApp(appId, newInfo);
      if (node) {
        this.setStatus(HTTP_CODES.OK);
        return node.info.get();
      }

      this.setStatus(HTTP_CODES.BAD_REQUEST);
      return { message: `Something went wrong, please check your input data.` }

    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }


  @Delete("/delete_admin_app/{appId}")
  public async deleteAdminApp(@Path() appId: string): Promise<{ message: string }> {
    try {
      const isDeleted = await appServiceInstance.deleteAdminApp(appId);
      const status = isDeleted ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
      const message = isDeleted ? `${appId} is deleted with success` : "something went wrong, please check your input data";
      this.setStatus(status);
      return { message };
    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Delete("/delete_portofolio_app/{appId}")
  public async deletePortofolioApp(@Path() appId: string): Promise<{ message: string }> {
    try {
      const isDeleted = await appServiceInstance.deletePortofolioApp(appId);
      const status = isDeleted ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
      const message = isDeleted ? `${appId} is deleted with success` : "something went wrong, please check your input data";
      this.setStatus(status);
      return { message };
    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  @Delete("/delete_building_app/{appId}")
  public async deleteBuildingApp(@Path() appId: string): Promise<{ message: string }> {
    try {
      const isDeleted = await appServiceInstance.deleteBuildingApp(appId);
      const status = isDeleted ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
      const message = isDeleted ? `${appId} is deleted with success` : "something went wrong, please check your input data";
      this.setStatus(status);
      return { message };
    } catch (error) {
      this.setStatus(HTTP_CODES.INTERNAL_ERROR);
      return { message: error.message };
    }
  }

  // @Post("link_app_to_portofolio")
  // public async linkAppToPortofolio(@Body() data: { portofolioId: string, appId: string }): Promise<{ message: string }> {
  //   try {
  //     const success = await appServiceInstance.linkAppToPortofolio(data.portofolioId, data.appId);
  //     const status = success ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
  //     const message = success ? "application added with success" : "Something went wrong, please check your input data";
  //     this.setStatus(status)
  //     return { message };
  //   } catch (error) {
  //     this.setStatus(HTTP_CODES.INTERNAL_ERROR);
  //     return { message: error.message };
  //   }
  // }

  // @Post("/link_app_to_building")
  // public async linkAppToBuilding(@Body() data: { buildingId: string, appId: string }): Promise<{ message: string }> {
  //   try {
  //     const success = await appServiceInstance.linkAppToBuilding(data.buildingId, data.appId);
  //     const status = success ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
  //     const message = success ? "application added with success" : "Something went wrong, please check your input data";
  //     this.setStatus(status);
  //     return { message };
  //   } catch (error) {
  //     this.setStatus(HTTP_CODES.INTERNAL_ERROR);
  //     return { message: error.message };
  //   }
  // }


}

export default new AppsController();