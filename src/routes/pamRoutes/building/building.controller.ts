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

import { BuildingService } from "../../../services";
import * as express from "express";
import { IBuilding } from "interfaces";

const serviceInstance = BuildingService.getInstance();

export class BuildingController {
    private static instance: BuildingController;

    private constructor() { }

    public static getInstance(): BuildingController {
        if (!this.instance) this.instance = new BuildingController();

        return this.instance;
    }

    public async addBuilding(req: express.Request, res: express.Response) {
        try {
            const buildingInfo: IBuilding = req.body;
            const validationResult = serviceInstance.validateBuilding(buildingInfo);
            if (!validationResult.isValid) return res.status(400).send(validationResult.message);
            await serviceInstance.setLocation(buildingInfo);

            const node = await serviceInstance.addBuilding(buildingInfo);
            const data = await serviceInstance.formatBuilding(node.info.get());
            return res.status(200).send(data);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    public async getBuilding(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;

            const node = await serviceInstance.getBuilding(id);

            if (node) {
                const data = await serviceInstance.formatBuilding(node.info.get());
                return res.status(200).send(data)
            };
            return res.status(404).send(`no Building found for ${id}`);

        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    public async getAllBuilding(req: express.Request, res: express.Response) {
        try {
            const nodes = await serviceInstance.getAllBuilding();
            if (nodes) {
                const promises = nodes.map(el => serviceInstance.formatBuilding(el.info.get()))

                const data = await Promise.all(promises);
                return res.status(200).send(data);
            }

            return res.status(200).send([]);

        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    public async editBuilding(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            await serviceInstance.setLocation(data);

            const node = await serviceInstance.updateBuilding(id, data);
            if (node) {
                const data = await serviceInstance.formatBuilding(node.info.get());
                return res.status(200).send(data)
            };
            return res.status(404).send(`no building found for ${id}`);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    public async deleteBuilding(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;

            await serviceInstance.deleteBuilding(id);

            return res.status(200).send("building deleted");
        } catch (error) {
            res.status(500).send(error.message);
        }
    }


    //////////////////////////////////////////////////////////////////////////
    //                                  PRIVATES                           //
    /////////////////////////////////////////////////////////////////////////



}

export default BuildingController.getInstance();