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

import { APIService } from "../../../services";
import * as express from "express";
import { HTTP_CODES } from "../../../constant";

const apiService = APIService.getInstance();

export class APIController {
    private static instance: APIController;

    private constructor() { }

    public static getInstance(): APIController {
        if (!this.instance) this.instance = new APIController();

        return this.instance;
    }

    public async createApiRoute(req: express.Request, res: express.Response) {
        try {
            const data = req.body;
            const node = await apiService.createApiRoute(data);
            return res.status(HTTP_CODES.CREATED).send(node.info.get());
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

    public async updateApiRoute(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            const node = await apiService.updateApiRoute(id, data);
            return res.status(HTTP_CODES.OK).send(node.info.get());
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

    public async getApiRouteById(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;

            const node = await apiService.getApiRouteById(id);
            if (node) return res.status(HTTP_CODES.OK).send(node.info.get());
            return res.status(HTTP_CODES.NOT_FOUND).send(`node api route found for ${id}`);
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }


    public async getAllApiRoute(req: express.Request, res: express.Response) {
        try {

            const routes = await apiService.getAllApiRoute();
            return res.status(HTTP_CODES.OK).send(routes.map(el => el.info.get()));
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

    public async deleteApiRoute(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;

            await apiService.deleteApiRoute(id);
            return res.status(HTTP_CODES.OK).send(`api route deleted`);
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

    public async uploadSwaggerFile(req: express.Request, res: express.Response) {
        try {
            const files = (<any>req).files;
            if (!files) return res.status(HTTP_CODES.BAD_REQUEST).send("No file uploaded");
            const firstFile = Object.keys(files)[0];
            if (firstFile) {
                const file = files[firstFile];
                if (!/.*\.json$/.test(file.name))
                    return res.status(HTTP_CODES.BAD_REQUEST).send("The selected file must be a json file");

                const apis = await apiService.uploadSwaggerFile(file.data);
                return res.status(HTTP_CODES.OK).send(apis.map(el => el.info.get()));
            }

            return res.status(HTTP_CODES.BAD_REQUEST).send("No file uploaded");
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

}

export default APIController.getInstance();