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

import { BuildingService } from "../services";

import { IApp, IBuilding, IEditBuilding } from "../interfaces";
import { Body, Controller, Path, Post, Route, Tags, Put, Get, Delete } from "tsoa";
import { HTTP_CODES } from "../constant";
import { async } from "q";

const serviceInstance = BuildingService.getInstance();


@Route("/api/v1/pam")
@Tags("Building")
export class BuildingController extends Controller {

    public constructor() {
        super();
    }

    @Post("/create_building")
    public async createBuilding(@Body() buildingInfo: IBuilding): Promise<IBuilding | { message: string }> {
        try {

            const validationResult = serviceInstance.validateBuilding(buildingInfo);
            if (!validationResult.isValid) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: validationResult.message }
            };

            await serviceInstance.setLocation(buildingInfo);

            const node = await serviceInstance.createBuilding(buildingInfo);
            const data = await serviceInstance.formatBuilding(node.info.get());
            this.setStatus(HTTP_CODES.OK);
            return data;
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Post("/get_building/{id}")
    public async getBuildingById(@Path() id: string): Promise<IBuilding | { message: string }> {
        try {

            const node = await serviceInstance.getBuildingById(id);

            if (node) {
                const data = await serviceInstance.formatBuilding(node.info.get());
                this.setStatus(HTTP_CODES.OK);
                return data
            };

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `no Building found for ${id}` };

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Get("/get_all_buildings")
    public async getAllBuildings(): Promise<IBuilding[] | { message: string }> {
        try {
            const nodes = await serviceInstance.getAllBuildings() || [];

            const promises = nodes.map(el => serviceInstance.formatBuilding(el.info.get()))

            const data = await Promise.all(promises);
            this.setStatus(HTTP_CODES.OK);
            return data;

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Get("/get_all_buildings_apps")
    public async getAllBuildingsApps(): Promise<(IBuilding & { apps: IApp })[] | { message: string }> {
        try {
            const nodes = await serviceInstance.getAllBuildingsApps() || [];

            const promises = nodes.map(async ({ node, apps }) => {

                return {
                    ...(await serviceInstance.formatBuilding(node.info.get())),
                    apps: apps.map(el => el.info.get())
                }
            })

            const data = Promise.all(promises);
            this.setStatus(HTTP_CODES.OK);
            return <any>data;

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }



    @Delete("/delete_building/{id}")
    public async deleteBuilding(@Path() id: string): Promise<any | { message: string }> {
        try {
            await serviceInstance.deleteBuilding(id);
            this.setStatus(HTTP_CODES.OK);
            return { message: "building deleted" };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }


    @Put("/edit_building/{id}")
    public async editBuilding(@Path() id: string, @Body() data: IEditBuilding): Promise<IBuilding | { message: string }> {
        try {

            await serviceInstance.setLocation(data);

            const node = await serviceInstance.updateBuilding(id, data);
            if (node) {
                const data = await serviceInstance.formatBuilding(node.info.get());
                this.setStatus(HTTP_CODES.OK)
                return data;
            };

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `no building found for ${id}` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Post("/add_app_to_building/{buildingId}")
    public async addAppToBuilding(@Path() buildingId: string, @Body() data: { applicationId: string[] }): Promise<IApp[] | { message: string }> {
        try {
            const apps = await serviceInstance.addAppToBuilding(buildingId, data.applicationId);
            if (!apps || apps.length === 0) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(HTTP_CODES.OK)
            return apps.map(el => el.info.get());
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Get("/get_apps_from_building/{buildingId}")
    public async getAppsFromBuilding(@Path() buildingId: string): Promise<IApp[] | { message: string }> {
        try {
            const apps = await serviceInstance.getAppsFromBuilding(buildingId);
            if (!apps) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(HTTP_CODES.OK);
            return apps.map(el => el.info.get());
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Get("/get_app_from_building/{buildingId}/{appId}")
    public async getAppFromBuilding(@Path() buildingId: string, @Path() appId: string): Promise<IApp | { message: string }> {
        try {
            const app = await serviceInstance.getAppFromBuilding(buildingId, appId);
            if (!app) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(HTTP_CODES.OK);
            return app.info.get();
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Delete("/remove_app_from_building/{buildingId}")
    public async removeAppFromBuilding(@Path() buildingId: string, @Body() data: { applicationId: string[] }): Promise<{ message: string; ids?: string[] }> {
        try {
            const idsDeleted = await serviceInstance.removeAppFromBuilding(buildingId, data.applicationId);

            if (!idsDeleted || idsDeleted.length === 0) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }

            this.setStatus(HTTP_CODES.OK);
            return { message: "application removed with success !", ids: idsDeleted };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Get("/building_has_app/{buildingId}/{appId}")
    public async buildingHasApp(@Path() buildingId: string, @Path() appId: string): Promise<boolean | { message: string }> {
        try {
            const success = await serviceInstance.buildingHasApp(buildingId, appId);

            this.setStatus(HTTP_CODES.OK);
            return success;
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


}

export default new BuildingController();