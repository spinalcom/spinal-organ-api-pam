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
import { RoleService } from "../services/role.service";

const roleService = RoleService.getInstance();

export class RoleController {

    private static instance: RoleController;

    private constructor() { }

    public static getInstance(): RoleController {
        if (!this.instance) {
            this.instance = new RoleController();
        }

        return this.instance;
    }


    public async createRole(req: express.Request, res: express.Response) {
        try {
            const { name, methods } = req.body;

            const node = await roleService.createRole({ name, methods });
            return res.status(201).send(node.info.get());
        } catch (error) {
            res.status(500).send(error.message);
        }
    }


    public async getAllRole(req: express.Request, res: express.Response) {
        try {
            const nodes = await roleService.getAllRole();
            return res.status(201).send(nodes.map(node => node.info.get()));
        } catch (error) {
            res.status(500).send(error.message);
        }
    }


    public async getRole(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;
            const node = await roleService.getRole(id);
            if (node) return res.status(200).send(node.info.get());
            return res.status(404).send(`no role found for ${id}`);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }


    public async updateRole(req: express.Request, res: express.Response) {

        try {
            const { id } = req.params;
            const data = req.body;
            const node = await roleService.updateRole(id, data.name, data.methods);
            if (node) return res.status(200).send(node.info.get());
            return res.status(404).send(`no role found for ${id}`);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }


    public async deleteRole(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;
            await roleService.deleteRole(id);

            res.status(200).send(`role deleted`);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}


export default RoleController.getInstance();