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

import { Route, Get, Post, Delete, Body, Controller, Tags, Put, Path, UploadedFile, Security } from "tsoa";
import { APIService, BuildingService, PortofolioService } from "../services";
import { BUILDING_API_GROUP_TYPE, HTTP_CODES, PORTOFOLIO_API_GROUP_TYPE, SECURITY_NAME } from "../constant";
import { IApiRoute } from "../interfaces";

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

    @Security(SECURITY_NAME.admin)
    @Post("/create_portofolio_api_route")
    public async createPortofolioApiRoute(@Body() data: IApiRoute): Promise<IApiRoute | { message: string }> {
        try {
            // const data = req.body;
            const node = await apiService.createApiRoute(data, PORTOFOLIO_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.CREATED);
            return node.info.get();
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Put("/update_portofolio_api_route/{id}")
    public async updatePortofolioApiRoute(@Body() data: IApiRoute, @Path() id: string): Promise<IApiRoute | { message: string }> {
        try {

            const node = await apiService.updateApiRoute(id, data, PORTOFOLIO_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.ACCEPTED)
            return node.info.get();
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.admin)
    @Get("/get_portofolio_api_route/{id}")
    public async getPortofolioApiRouteById(@Path() id: string): Promise<IApiRoute | { message: string }> {
        try {
            const node = await apiService.getApiRouteById(id, PORTOFOLIO_API_GROUP_TYPE);
            if (node) {
                this.setStatus(HTTP_CODES.OK)
                return node.info.get();
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `No api route found for ${id}` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/get_all_portofolio_api_route")
    public async getAllPortofolioApiRoute(): Promise<IApiRoute[] | { message: string }> {
        try {
            const routes = await apiService.getAllApiRoute(PORTOFOLIO_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.OK)
            return routes.map(el => el.info.get());
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Delete("/delete_portofolio_api_route/{id}")
    public async deletePortofolioApiRoute(@Path() id): Promise<{ message: string }> {
        try {

            await apiService.deleteApiRoute(id, PORTOFOLIO_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.OK)
            return { message: `${id} api route has been deleted` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Post("/upload_portofolio_apis_routes")
    public async uploadPortofolioSwaggerFile(@UploadedFile() file): Promise<IApiRoute[] | { message: string }> {
        try {
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
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }


    //////////////////////////////////////////
    //              BUILDING                //
    //////////////////////////////////////////


    @Security(SECURITY_NAME.admin)
    @Post("/create_bos_api_route")
    public async createBosApiRoute(@Body() data: IApiRoute): Promise<IApiRoute | { message: string }> {
        try {
            // const data = req.body;
            const node = await apiService.createApiRoute(data, BUILDING_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.CREATED);
            return node.info.get();
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Put("/update_bos_api_route/{id}")
    public async updateBosApiRoute(@Body() data: IApiRoute, @Path() id: string): Promise<IApiRoute | { message: string }> {
        try {

            const node = await apiService.updateApiRoute(id, data, BUILDING_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.ACCEPTED)
            return node.info.get();
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/get_bos_api_route/{id}")
    public async getBosApiRouteById(@Path() id: string): Promise<IApiRoute | { message: string }> {
        try {
            const node = await apiService.getApiRouteById(id, BUILDING_API_GROUP_TYPE);
            if (node) {
                this.setStatus(HTTP_CODES.OK)
                return node.info.get();
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `No api route found for ${id}` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/get_all_bos_api_route")
    public async getAllBosApiRoute(): Promise<IApiRoute[] | { message: string }> {
        try {
            const routes = await apiService.getAllApiRoute(BUILDING_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.OK)
            return routes.map(el => el.info.get());
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Delete("/delete_bos_api_route/{id}")
    public async deleteBosApiRoute(@Path() id): Promise<{ message: string }> {
        try {

            await apiService.deleteApiRoute(id, BUILDING_API_GROUP_TYPE);
            this.setStatus(HTTP_CODES.OK)
            return { message: `${id} api route has been deleted` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Post("/upload_bos_apis_routes")
    public async uploadBosSwaggerFile(@UploadedFile() file): Promise<IApiRoute[] | { message: string }> {
        try {
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
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

}

export default new APIController();