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
import { DigitalTwinService } from "../../../services";
import { HTTP_CODES } from "../../../constant";

const serviceInstance = DigitalTwinService.getInstance();

export class DigitaltwinController {

    private static instance: DigitaltwinController;

    private constructor() { }

    public static getInstance(): DigitaltwinController {
        if (!this.instance) {
            this.instance = new DigitaltwinController();
        }

        return this.instance;
    }

    public async createDigitalTwin(req: express.Request, res: express.Response) {
        try {
            const { name, folderPath } = req.body;
            if (!name || !name.trim()) return res.status(HTTP_CODES.BAD_REQUEST).send("The file name is mandatory");

            const node = await serviceInstance.createDigitalTwin(name, folderPath);
            return res.status(HTTP_CODES.CREATED).send(node.info.get());
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

    public async getAllDigitalTwins(req: express.Request, res: express.Response) {
        try {
            const nodes = await serviceInstance.getAllDigitalTwins();
            return res.status(HTTP_CODES.OK).send(nodes.map(el => el.info.get()));
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }


    public async getDigitalTwin(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;
            const node = await serviceInstance.getDigitalTwinById(id);
            if (node) return res.status(HTTP_CODES.OK).send(node.info.get());
            return res.status(HTTP_CODES.NOT_FOUND).send(`No digitaltwin found for ${id}`);
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

    public async renameDigitalTwin(req: express.Request, res: express.Response) {
        try {
            const { newName } = req.body;
            const { id } = req.params;

            const node = await serviceInstance.renameDigitalTwin(id, newName);
            if (node) return res.status(HTTP_CODES.OK).send(node.info.get());

            return res.status(HTTP_CODES.NOT_FOUND).send(`No digitaltwin found for ${id}`);

        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

    public async removeDigitalTwin(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;
            const deleted = await serviceInstance.removeDigitalTwin(id);
            if (deleted) return res.status(HTTP_CODES.OK).send(`digitalTwin deleted`);

        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

    public async setActualDigitalTwin(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;
            const node = await serviceInstance.setActualDigitalTwin(id);
            if (node) return res.status(HTTP_CODES.OK).send(node.info.get());
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

    public async getActualDigitalTwin(req: express.Request, res: express.Response) {
        try {
            const node = await serviceInstance.getActualDigitalTwin();
            if (node) return res.status(HTTP_CODES.OK).send(node.info.get());
            return res.status(HTTP_CODES.NOT_FOUND).send(`No default digitaltwin set`);
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

    public async removeActualDigitaTwin(req: express.Request, res: express.Response) {
        try {
            await serviceInstance.removeActualDigitaTwin();
            return res.status(HTTP_CODES.OK).send(`actual digitalTwin deleted`);
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }
}


export default DigitaltwinController.getInstance();