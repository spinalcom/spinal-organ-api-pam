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

import { BuildingService, PortofolioService } from "../services";

import { IApiRoute, IApp, IBuilding, IBuildingCreation, IEditProtofolio, IPortofolioData, IPortofolioInfo } from "../interfaces";
import { Body, Controller, Path, Post, Route, Tags, Put, Get, Delete, UploadedFile, Security, Request } from "tsoa";
import { HTTP_CODES, SECURITY_MESSAGES, SECURITY_NAME } from "../constant";
import * as express from 'express';
import { checkIfItIsAdmin, getProfileNode } from "../security/authentication";
import { AuthError } from "../security/AuthError";
import AuthorizationService from "../services/authorization.service";
import { getAllPortofolioApiIds, getAllPortofolioAppIds } from "../utils/utils";


const serviceInstance = BuildingService.getInstance();
const portofolioInstance = PortofolioService.getInstance();



@Route("/api/v1/pam")
@Tags("Portofolio")
export class PortofolioController extends Controller {

    public constructor() {
        super();
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/add_portofolio")
    public async addPortofolio(@Request() req: express.Request, @Body() data: IPortofolioInfo): Promise<IPortofolioData | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            let { name, appIds, apiIds } = data;
            // appIds = await getAllPortofolioAppIds();
            // apiIds = await getAllPortofolioApiIds();

            const res = await portofolioInstance.addPortofolio(name, appIds, apiIds);
            const details = portofolioInstance._formatDetails(res);

            this.setStatus(HTTP_CODES.CREATED);
            return details;
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Put("/update_portofolio/{portofolioId}")
    public async updatePortofolio(@Request() req: express.Request, @Path() portofolioId: string, @Body() data: IEditProtofolio): Promise<IPortofolioData | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const res = await portofolioInstance.updateProtofolio(portofolioId, data);
            const details = portofolioInstance._formatDetails(res);
            this.setStatus(HTTP_CODES.OK)
            return details;
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Put("/rename_portofolio/{id}")
    public async renamePortofolio(@Request() req: express.Request, @Path() id: string, @Body() data: { name: string }): Promise<{ message?: string }> {
        try {

            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const success = await PortofolioService.getInstance().renamePortofolio(id, data.name);
            const status = success ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
            const message = success ? "renamed with success" : "Something went wrong, please check your input data";
            this.setStatus(status);

            return { message };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_all_portofolio")
    public async getAllPortofolio(@Request() req: express.Request,): Promise<any[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const portofolios = await portofolioInstance.getAllPortofolio();
            this.setStatus(HTTP_CODES.OK)
            return portofolios.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_portofolio/{id}")
    public async getPortofolio(@Request() req: express.Request, @Path() id: string): Promise<any | { message: string }> {
        try {
            const profile = await getProfileNode(req);
            const portofolio = await AuthorizationService.getInstance().profileHasAccess(profile, id);
            if (!portofolio) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            // const portofolio = await portofolioInstance.getPortofolio(id);
            this.setStatus(HTTP_CODES.OK);
            return portofolio.info.get();
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_portofolio_details/{id}")
    public async getPortofolioDetails(@Request() req: express.Request, @Path() id: string): Promise<IPortofolioData | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const res = await portofolioInstance.getPortofolioDetails(id);
            const details = portofolioInstance._formatDetails(res);
            this.setStatus(HTTP_CODES.OK)
            return details;
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_all_portofolios_details")
    public async getAllPortofoliosDetails(@Request() req: express.Request,): Promise<any[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            const portofolios = await portofolioInstance.getAllPortofoliosDetails();
            const details = portofolios.map((res) => portofolioInstance._formatDetails(res))
            this.setStatus(HTTP_CODES.OK);
            return details;
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Delete("/remove_portofolio/{id}")
    public async removePortofolio(@Request() req: express.Request, @Path() id: string): Promise<{ message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            const success = await portofolioInstance.removePortofolio(id);
            const status = success ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
            const message = success ? "deleted with success" : "Something went wrong, please check your input data";
            this.setStatus(status);
            return { message }
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/add_building_to_portofolio/{portofolioId}")
    public async addBuilding(@Request() req: express.Request, @Path() portofolioId: string, @Body() body: IBuildingCreation): Promise<IBuilding[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await serviceInstance.addBuildingToPortofolio(portofolioId, body);
            if (!node) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(HTTP_CODES.OK);
            return BuildingService.getInstance().formatBuildingStructure(node);
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_building_from_portofolio/{portofolioId}/{buildingId}")
    public async getBuilding(@Request() req: express.Request, @Path() portofolioId: string, @Path() buildingId: string): Promise<IBuilding | { message: string }> {
        try {
            const profile = await getProfileNode(req);
            const node = await serviceInstance.getBuildingFromPortofolio(portofolioId, buildingId);


            if (node) {
                const hasAccess = await AuthorizationService.getInstance().profileHasAccess(profile, node);
                if (!hasAccess) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

                const data = await serviceInstance.formatBuilding(node.info.get());
                this.setStatus(HTTP_CODES.OK);
                return data
            };

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `no Building found for ${buildingId}` };

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_all_buildings_from_portofolio/{portofolioId}")
    public async getAllBuilding(@Request() req: express.Request, @Path() portofolioId: string): Promise<IBuilding[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.getAllBuildingsFromPortofolio(portofolioId) || [];

            const promises = nodes.map(el => serviceInstance.formatBuilding(el.info.get()))

            const data = await Promise.all(promises);
            this.setStatus(HTTP_CODES.OK);
            return data;

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Delete("/remove_building_from_portofolio/{portofolioId}")
    public async deleteBuildingFromPortofolio(@Request() req: express.Request, @Path() portofolioId: string, @Body() data: { buildingIds: string[] }): Promise<{ message: string, ids?: string[] }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const ids = await portofolioInstance.removeBuildingFromPortofolio(portofolioId, data.buildingIds);
            if (!ids || ids.length === 0) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }

            this.setStatus(HTTP_CODES.OK);
            return { message: "building deleted", ids };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/add_app_to_portofolio/{portofolioId}")
    public async addAppToPortofolio(@Request() req: express.Request, @Path() portofolioId: string, @Body() data: { applicationsIds: string[] }): Promise<IApp[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await portofolioInstance.addAppToPortofolio(portofolioId, data.applicationsIds);
            if (!nodes || nodes.length === 0) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something wen wrong, please check your input data" };
            }

            this.setStatus(HTTP_CODES.OK);
            return nodes.map(el => el.info.get())
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_apps_from_portofolio/{portofolioId}")
    public async getPortofolioApps(@Request() req: express.Request, @Path() portofolioId: string): Promise<IApp[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            const node = await portofolioInstance.getPortofolioApps(portofolioId);
            if (!node) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something wen wrong, please check your input data" };
            }

            this.setStatus(HTTP_CODES.OK);
            return node.map(el => el.info.get())
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_app_from_portofolio/{portofolioId}/{applicationId}")
    public async getAppFromPortofolio(@Request() req: express.Request, @Path() portofolioId: string, @Path() applicationId: string): Promise<IApp | { message: string }> {
        try {
            const profile = await getProfileNode(req);
            const node = await AuthorizationService.getInstance().profileHasAccess(profile, applicationId);

            // const node = await portofolioInstance.getAppFromPortofolio(portofolioId, applicationId);
            if (!node) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something wen wrong, please check your input data" };
            }

            this.setStatus(HTTP_CODES.OK);
            return node.info.get();
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Delete("/remove_app_from_portofolio/{portofolioId}")
    public async removeAppFromPortofolio(@Request() req: express.Request, @Path() portofolioId: string, @Body() data: { applicationId: string[] }): Promise<{ message: string, ids?: string[] }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const ids = await portofolioInstance.removeAppFromPortofolio(portofolioId, data.applicationId);
            if (!ids || ids.length === 0) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(HTTP_CODES.OK);
            return { message: "application removed from portofolio !", ids }
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Get("/portofolio_has_app/{portofolioId}//{applicationId}")
    public async portofolioHasApp(@Request() req: express.Request, @Path() portofolioId: string, @Path() applicationId: string): Promise<boolean | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const exist = await portofolioInstance.portofolioHasApp(portofolioId, applicationId);
            this.setStatus(HTTP_CODES.OK);
            return exist ? true : false;
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Post("/add_apiRoute_to_portofolio/{portofolioId}")
    public async addApiToPortofolio(@Request() req: express.Request, @Path() portofolioId: string, @Body() data: { apisIds: string[] }): Promise<IApiRoute[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await portofolioInstance.addApiToPortofolio(portofolioId, data.apisIds);
            if (!nodes || nodes.length === 0) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something wen wrong, please check your input data" };
            }

            this.setStatus(HTTP_CODES.OK);
            return nodes.map(el => el.info.get())
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_apisRoute_from_portofolio/{portofolioId}")
    public async getPortofolioApis(@Request() req: express.Request, @Path() portofolioId: string): Promise<IApiRoute[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await portofolioInstance.getPortofolioApis(portofolioId);
            if (!node) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something wen wrong, please check your input data" };
            }

            this.setStatus(HTTP_CODES.OK);
            return node.map(el => el.info.get())
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_apiRoute_from_portofolio/{portofolioId}/{apiId}")
    public async getApiFromPortofolio(@Request() req: express.Request, @Path() portofolioId: string, @Path() apiId: string): Promise<IApiRoute | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await portofolioInstance.getApiFromPortofolio(portofolioId, apiId);
            if (!node) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something wen wrong, please check your input data" };
            }

            this.setStatus(HTTP_CODES.OK);
            return node.info.get();
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Delete("/remove_apiRoute_from_portofolio/{portofolioId}")
    public async removeApiFromPortofolio(@Request() req: express.Request, @Path() portofolioId: string, @Body() data: { apisIds: string[] }): Promise<{ message: string, ids?: string[] }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const ids = await portofolioInstance.removeApiFromPortofolio(portofolioId, data.apisIds);
            if (!ids || ids.length === 0) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(HTTP_CODES.OK);
            return { message: "route removed from portofolio !", ids }
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Get("/portofolio_has_apiRoute/{portofolioId}/{apiId}")
    public async portofolioHasApi(@Request() req: express.Request, @Path() portofolioId: string, @Path() apiId: string): Promise<boolean | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const exist = await portofolioInstance.portofolioHasApi(portofolioId, apiId);
            this.setStatus(HTTP_CODES.OK);
            return exist ? true : false;
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }




}

export default new PortofolioController();