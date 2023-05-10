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

import { Route, Get, Post, Delete, Body, Controller, Tags, Put, Path, UploadedFile, Security, Request } from "tsoa";
import { APIService, AppProfileService, BuildingService, PortofolioService, UserProfileService } from "../services";
import { BUILDING_API_GROUP_TYPE, HTTP_CODES, PORTOFOLIO_API_GROUP_TYPE, SECURITY_MESSAGES, SECURITY_NAME } from "../constant";
import { IApiRoute } from "../interfaces";
import { checkAndGetTokenInfo, checkIfItIsAdmin, getProfileId, getProfileNode } from "../security/authentication";
import { AuthError } from "../security/AuthError";

import * as express from "express";
import AuthorizationService from "../services/authorization.service";

const apiService = APIService.getInstance();


@Route("/api/v1/pam/")
@Tags("Apis")
export class APIController extends Controller {

    public constructor() {
        super();
    }

    //////////////////////////////////////////
    //              PORTOFOLIO              //
    //////////////////////////////////////////

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/create_portofolio_api_route")
    public async createPortofolioApiRoute(@Request() req: express.Request, @Body() data: IApiRoute): Promise<IApiRoute | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            // const data = req.body;
            const node = await apiService.createApiRoute(data, PORTOFOLIO_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.CREATED);
            return node.info.get();
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Put("/update_portofolio_api_route/{id}")
    public async updatePortofolioApiRoute(@Request() req: express.Request, @Body() data: IApiRoute, @Path() id: string): Promise<IApiRoute | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await apiService.updateApiRoute(id, data, PORTOFOLIO_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.ACCEPTED)
            return node.info.get();
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_portofolio_api_route/{id}")
    public async getPortofolioApiRouteById(@Request() req: express.Request, @Path() id: string): Promise<IApiRoute | { message: string }> {
        try {
            const profile = await getProfileNode(req);

            const node = await AuthorizationService.getInstance().profileHasAccess(profile, id);
            if (node) {
                this.setStatus(HTTP_CODES.OK)
                return node.info.get();
            }

            this.setStatus(HTTP_CODES.UNAUTHORIZED)
            return { message: SECURITY_MESSAGES.UNAUTHORIZED };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_all_portofolio_api_route")
    public async getAllPortofolioApiRoute(@Request() req: express.Request,): Promise<IApiRoute[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const routes = await apiService.getAllApiRoute(PORTOFOLIO_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.OK)
            return routes.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Delete("/delete_portofolio_api_route/{id}")
    public async deletePortofolioApiRoute(@Request() req: express.Request, @Path() id): Promise<{ message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            await apiService.deleteApiRoute(id, PORTOFOLIO_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.OK)
            return { message: `${id} api route has been deleted` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/upload_portofolio_apis_routes")
    public async uploadPortofolioSwaggerFile(@Request() req: express.Request, @UploadedFile() file): Promise<IApiRoute[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            if (!file) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "No file uploaded" }
            }

            // const firstFile = Object.keys(files)[0];
            if (file) {
                // const file = files[firstFile];
                if (!/.*\.json$/.test(file.originalname)) {
                    this.setStatus(HTTP_CODES.BAD_REQUEST);
                    return { message: "The selected file must be a json file" }
                }

                const apis = await PortofolioService.getInstance().uploadSwaggerFile(file.buffer);
                this.setStatus(HTTP_CODES.OK)
                return apis.map(el => el.info.get());
            }

            this.setStatus(HTTP_CODES.BAD_REQUEST)
            return { message: "No file uploaded" };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    //////////////////////////////////////////
    //              BUILDING                //
    //////////////////////////////////////////


    @Security(SECURITY_NAME.bearerAuth)
    @Post("/create_bos_api_route")
    public async createBosApiRoute(@Request() req: express.Request, @Body() data: IApiRoute): Promise<IApiRoute | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            // const data = req.body;
            const node = await apiService.createApiRoute(data, BUILDING_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.CREATED);
            return node.info.get();
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Put("/update_bos_api_route/{id}")
    public async updateBosApiRoute(@Request() req: express.Request, @Body() data: IApiRoute, @Path() id: string): Promise<IApiRoute | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await apiService.updateApiRoute(id, data, BUILDING_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.ACCEPTED)
            return node.info.get();
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_bos_api_route/{id}")
    public async getBosApiRouteById(@Request() req: express.Request, @Path() id: string): Promise<IApiRoute | { message: string }> {
        try {
            const tokenInfo = await checkAndGetTokenInfo(req);
            const profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
            const isApp = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId ? false : true;

            let profile = await (isApp ? AppProfileService.getInstance()._getAppProfileNode(profileId) : UserProfileService.getInstance()._getUserProfileNode(profileId))

            const node = await AuthorizationService.getInstance().profileHasAccess(profile, id);

            if (node) {
                this.setStatus(HTTP_CODES.OK)
                return node.info.get();
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `No api route found for ${id}` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_all_bos_api_route")
    public async getAllBosApiRoute(@Request() req: express.Request,): Promise<IApiRoute[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const routes = await apiService.getAllApiRoute(BUILDING_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.OK)
            return routes.map(el => el.info.get());
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Delete("/delete_bos_api_route/{id}")
    public async deleteBosApiRoute(@Request() req: express.Request, @Path() id): Promise<{ message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            await apiService.deleteApiRoute(id, BUILDING_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.OK)
            return { message: `${id} api route has been deleted` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/upload_bos_apis_routes")
    public async uploadBosSwaggerFile(@Request() req: express.Request, @UploadedFile() file): Promise<IApiRoute[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            if (!file) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "No file uploaded" }
            }

            // const firstFile = Object.keys(files)[0];
            if (file) {
                // const file = files[firstFile];
                if (!/.*\.json$/.test(file.originalname)) {
                    this.setStatus(HTTP_CODES.BAD_REQUEST);
                    return { message: "The selected file must be a json file" }
                }

                const apis = await BuildingService.getInstance().uploadSwaggerFile(file.buffer);
                this.setStatus(HTTP_CODES.OK)
                return apis.map(el => el.info.get());
            }

            this.setStatus(HTTP_CODES.BAD_REQUEST)
            return { message: "No file uploaded" };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

}

export default new APIController();