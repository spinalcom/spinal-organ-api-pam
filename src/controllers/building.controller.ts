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
import { IApiRoute, IApp, IBuilding, IEditBuilding } from "../interfaces";
import { Body, Controller, Path, Post, Route, Tags, Put, Get, Delete, UploadedFile, Security, Request } from "tsoa";
import { HTTP_CODES, SECURITY_MESSAGES, SECURITY_NAME } from "../constant";
import { checkIfItIsAdmin, getProfileNode } from "../security/authentication";
import * as express from 'express';
import AuthorizationService from "../services/authorization.service";
import { AuthError } from "../security/AuthError";
import { formatBuildingNode, formatBuildingStructure } from "../utils/buildingUtils";

const serviceInstance = BuildingService.getInstance();


@Route("/api/v1/pam")
@Tags("Building")
export class BuildingController extends Controller {

    public constructor() {
        super();
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/get_building/{id}")
    public async getBuildingByIdUsingPostMethod(@Request() req: express.Request, @Path() id: string): Promise<IBuilding | { message: string }> {
        try {
            const profile = await getProfileNode(req);
            const buildingNode = await AuthorizationService.getInstance().profileHasAccessToNode(profile, id);

            if (!buildingNode) {
                this.setStatus(HTTP_CODES.NOT_FOUND);
                return { message: `no Building found for ${id}` };
            }

            this.setStatus(HTTP_CODES.OK);
            return formatBuildingNode(buildingNode);

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_building/{id}")
    public async getBuildingById(@Request() req: express.Request, @Path() id: string): Promise<IBuilding | { message: string }> {
        return this.getBuildingByIdUsingPostMethod(req, id);
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_all_buildings_apps")
    public async getAllBuildingsAndTheirApps(@Request() req: express.Request,): Promise<(IBuilding & { apps: IApp })[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.getAllBuildingsAndTheirApps() || [];

            const promises = nodes.map(async ({ buildingNode, apps }) => {
                const buildingFormatted = formatBuildingNode(buildingNode);
                return {
                    ...buildingFormatted,
                    apps: apps.map(el => el.info.get())
                }
            })

            this.setStatus(HTTP_CODES.OK);
            return Promise.all(promises) as any;

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Delete("/delete_building/{id}")
    public async deleteBuilding(@Request() req: express.Request, @Path() id: string): Promise<any | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            await serviceInstance.deleteBuildingById(id);
            this.setStatus(HTTP_CODES.OK);
            return { message: "building deleted" };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Put("/edit_building/{id}")
    public async editBuilding(@Request() req: express.Request, @Path() id: string, @Body() data: IEditBuilding): Promise<IBuilding | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            // await serviceInstance.set(data);

            const node = await serviceInstance.updateBuilding(id, data);
            if (node) {
                const data = await formatBuildingStructure(node);
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

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/add_app_to_building/{buildingId}")
    public async addAppToBuilding(@Request() req: express.Request, @Path() buildingId: string, @Body() data: { applicationId: string[] }): Promise<IApp[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const apps = await serviceInstance.linkApplicationToBuilding(buildingId, data.applicationId);
            if (!apps || apps.length === 0) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(HTTP_CODES.OK)
            return apps.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_apps_from_building/{buildingId}")
    public async getAppsFromBuilding(@Request() req: express.Request, @Path() buildingId: string): Promise<IApp[] | { message: string }> {
        try {

            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const apps = await serviceInstance.getAppsLinkedToBuilding(buildingId);
            if (!apps) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(HTTP_CODES.OK);
            return apps.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_app_from_building/{buildingId}/{appId}")
    public async getAppFromBuilding(@Request() req: express.Request, @Path() buildingId: string, @Path() appId: string): Promise<IApp | { message: string }> {
        try {
            const profile = await getProfileNode(req);
            const app = await AuthorizationService.getInstance().profileHasAccessToNode(profile, appId);

            // const app = await serviceInstance.getAppFromBuilding(buildingId, appId);
            if (!app) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(HTTP_CODES.OK);
            return app.info.get();
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Delete("/remove_app_from_building/{buildingId}")
    public async removeAppFromBuilding(@Request() req: express.Request, @Path() buildingId: string, @Body() data: { applicationId: string[] }): Promise<{ message: string; ids?: string[] }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const idsDeleted = await serviceInstance.removeAppFromBuilding(buildingId, data.applicationId);

            if (!idsDeleted || idsDeleted.length === 0) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }

            this.setStatus(HTTP_CODES.OK);
            return { message: "application removed with success !", ids: idsDeleted };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/building_has_app/{buildingId}/{appId}")
    public async buildingHasApp(@Request() req: express.Request, @Path() buildingId: string, @Path() appId: string): Promise<boolean | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const success = await serviceInstance.buildingHasApp(buildingId, appId);

            this.setStatus(HTTP_CODES.OK);
            return success;
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }






    // @Security(SECURITY_NAME.admin)
    @Post("/add_apiRoute_to_building/{buildingId}")
    public async addApiToBuilding(@Request() req: express.Request, @Path() buildingId: string, @Body() data: { apisIds: string[] }): Promise<IApiRoute[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const apis = await serviceInstance.linkApiToBuilding(buildingId, data.apisIds);
            if (!apis || apis.length === 0) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(HTTP_CODES.OK)
            return apis.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Get("/get_apisRoute_from_building/{buildingId}")
    public async getApisFromBuilding(@Request() req: express.Request, @Path() buildingId: string): Promise<IApiRoute[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const apis = await serviceInstance.getApisFromBuilding(buildingId);
            if (!apis) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(HTTP_CODES.OK);
            return apis.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.profile)
    @Get("/get_apiRoute_from_building/{buildingId}/{apiId}")
    public async getApiFromBuilding(@Request() req: express.Request, @Path() buildingId: string, @Path() apiId: string): Promise<IApiRoute | { message: string }> {
        try {
            const profile = await getProfileNode(req);
            const api = await AuthorizationService.getInstance().profileHasAccessToNode(profile, apiId);

            // const api = await serviceInstance.getApiFromBuilding(buildingId, apiId);
            if (!api) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(HTTP_CODES.OK);
            return api.info.get();
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Delete("/remove_apiRoute_from_building/{buildingId}")
    public async removeApisFromBuilding(@Request() req: express.Request, @Path() buildingId: string, @Body() data: { apisIds: string[] }): Promise<{ message: string; ids?: string[] }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const idsDeleted = await serviceInstance.removeApisFromBuilding(buildingId, data.apisIds);

            if (!idsDeleted || idsDeleted.length === 0) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }

            this.setStatus(HTTP_CODES.OK);
            return { message: "application removed with success !", ids: idsDeleted };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // @Security(SECURITY_NAME.admin)
    @Get("/building_has_apiRoute/{buildingId}/{apiId}")
    public async buildingHasApi(@Request() req: express.Request, @Path() buildingId: string, @Path() apiId: string): Promise<boolean | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const success = await serviceInstance.buildingHasApi(buildingId, apiId);

            this.setStatus(HTTP_CODES.OK);
            return success;
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }




}

export default new BuildingController();