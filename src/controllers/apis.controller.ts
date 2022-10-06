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

import { Request, Route, Get, Post, Delete, Body, Controller, Tags, Put, Path, UploadedFile } from "tsoa";
import * as express from "express";
import { APIService } from "../services";
import { HTTP_CODES } from "../constant";
import { IApiRoute } from "../interfaces";
import * as multer from "multer";


const apiService = APIService.getInstance();


@Route("/api/v1/pam/")
@Tags("Apis")
export class APIController extends Controller {

    public constructor() {
        super();
    }

    /**
     * Adds a route to the list of available routes
     */
    @Post("/create_api_route")
    public async createApiRoute(@Body() data: IApiRoute): Promise<IApiRoute | { message: string }> {
        try {
            // const data = req.body;
            const node = await apiService.createApiRoute(data);
            this.setStatus(HTTP_CODES.CREATED);
            return node.info.get();
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    @Put("/update_api_route/{id}")
    public async updateApiRoute(@Body() data: IApiRoute, @Path() id: string): Promise<IApiRoute | { message: string }> {
        try {

            const node = await apiService.updateApiRoute(id, data);
            this.setStatus(HTTP_CODES.ACCEPTED)
            return node.info.get();
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Get("/get_api_route/{id}")
    public async getApiRouteById(@Path() id: string): Promise<IApiRoute | { message: string }> {
        try {
            const node = await apiService.getApiRouteById(id);
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

    @Get("/get_all_api_route")
    public async getAllApiRoute(): Promise<IApiRoute[] | { message: string }> {
        try {
            const routes = await apiService.getAllApiRoute();
            this.setStatus(HTTP_CODES.OK)
            return routes.map(el => el.info.get());
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Delete("/delete_api_route/{id}")
    public async deleteApiRoute(@Path() id): Promise<{ message: string }> {
        try {

            await apiService.deleteApiRoute(id);
            this.setStatus(HTTP_CODES.OK)
            return { message: `${id} api route has been deleted` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Post("/upload_apis_routes")
    public async uploadSwaggerFile(@UploadedFile() file): Promise<IApiRoute[] | { message: string }> {
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

                const apis = await apiService.uploadSwaggerFile(file.buffer);
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

    // private _handleFile(request: express.Request): Promise<any> {
    //     const multerSingle = multer().single("file");
    //     return new Promise((resolve, reject) => {
    //         multerSingle(request, undefined, async (error) => {
    //             if (error) {
    //                 reject(error);
    //             }
    //             resolve(true);
    //         });
    //     });
    // }

}

export default new APIController();