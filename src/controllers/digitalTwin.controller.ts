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
import { DigitalTwinService } from "../services";
import { HTTP_CODES, SECURITY_NAME } from "../constant";
import { Body, Controller, Post, Route, Security, Tags } from "tsoa";

const serviceInstance = DigitalTwinService.getInstance();

@Route("/api/v1/pam")
@Tags("DigitalTwin")
export class DigitaltwinController extends Controller {

    public constructor() {
        super();
    }

    @Security(SECURITY_NAME.admin)
    @Post("/create_digitaltwin")
    public async createDigitalTwin(@Body() data: { name: string; folderPath: string }) {
        try {

            if (!data.name || !data.name.trim()) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: "The file name is mandatory" };
            }

            const graph = await serviceInstance.createDigitalTwin(data.name, data.folderPath);
            this.setStatus(HTTP_CODES.CREATED);
            return graph.getId().get();
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    // public async getAllDigitalTwins(req: express.Request, res: express.Response) {
    //     try {
    //         const nodes = await serviceInstance.getAllDigitalTwins();
    //         return res.status(HTTP_CODES.OK).send(nodes.map(el => el.info.get()));
    //     } catch (error) {
    //         return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    //     }
    // }


    // public async getDigitalTwin(req: express.Request, res: express.Response) {
    //     try {
    //         const { id } = req.params;
    //         const node = await serviceInstance.getDigitalTwinById(id);
    //         if (node) return res.status(HTTP_CODES.OK).send(node.info.get());
    //         return res.status(HTTP_CODES.NOT_FOUND).send(`No digitaltwin found for ${id}`);
    //     } catch (error) {
    //         return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    //     }
    // }

    // public async renameDigitalTwin(req: express.Request, res: express.Response) {
    //     try {
    //         const { newName } = req.body;
    //         const { id } = req.params;

    //         const node = await serviceInstance.renameDigitalTwin(id, newName);
    //         if (node) return res.status(HTTP_CODES.OK).send(node.info.get());

    //         return res.status(HTTP_CODES.NOT_FOUND).send(`No digitaltwin found for ${id}`);

    //     } catch (error) {
    //         return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    //     }
    // }

    // public async removeDigitalTwin(req: express.Request, res: express.Response) {
    //     try {
    //         const { id } = req.params;
    //         const deleted = await serviceInstance.removeDigitalTwin(id);
    //         if (deleted) return res.status(HTTP_CODES.OK).send(`digitalTwin deleted`);

    //     } catch (error) {
    //         return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    //     }
    // }

    // public async setActualDigitalTwin(req: express.Request, res: express.Response) {
    //     try {
    //         const { id } = req.params;
    //         const node = await serviceInstance.setActualDigitalTwin(id);
    //         if (node) return res.status(HTTP_CODES.OK).send(node.info.get());
    //     } catch (error) {
    //         return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    //     }
    // }

    // public async getActualDigitalTwin(req: express.Request, res: express.Response) {
    //     try {
    //         const node = await serviceInstance.getActualDigitalTwin();
    //         if (node) return res.status(HTTP_CODES.OK).send(node.info.get());
    //         return res.status(HTTP_CODES.NOT_FOUND).send(`No default digitaltwin set`);
    //     } catch (error) {
    //         return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    //     }
    // }

    // public async removeActualDigitaTwin(req: express.Request, res: express.Response) {
    //     try {
    //         await serviceInstance.removeActualDigitaTwin();
    //         return res.status(HTTP_CODES.OK).send(`actual digitalTwin deleted`);
    //     } catch (error) {
    //         return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
    //     }
    // }
}


export default new DigitaltwinController();