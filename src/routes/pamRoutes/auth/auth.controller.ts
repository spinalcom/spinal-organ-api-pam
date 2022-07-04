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

import { AuthentificationService } from "../../../services";
import * as express from "express";
import { HTTP_CODES } from "../../../constant";

const serviceInstance = AuthentificationService.getInstance();

export class AuthController {
    private static instance: AuthController;

    private constructor() { }

    public static getInstance(): AuthController {
        if (!this.instance) this.instance = new AuthController();

        return this.instance;
    }


    public async registerToAdmin(req: express.Request, res: express.Response) {
        try {
            const { pamInfo, adminInfo } = req.body;
            const registeredData = await serviceInstance.registerToAdmin(pamInfo, adminInfo);
            await serviceInstance.sendDataToAdmin();
            return res.status(HTTP_CODES.OK).send(registeredData);
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

    public async getBosToAminCredential(req: express.Request, res: express.Response) {
        try {
            const bosCredential = await serviceInstance.getBosToAminCredential();
            if (bosCredential) return res.status(HTTP_CODES.OK).send(bosCredential);
            return res.status(HTTP_CODES.NOT_FOUND).send("No admin registered");
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message)
        }
    }

    // public editBosCredential(req: express.Request, res: express.Response) {
    //     try {

    //     } catch (error) {
    //         return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message)
    //     }
    // }

    public async createAdminCredential(req: express.Request, res: express.Response) {
        try {
            const adminCredential = await serviceInstance.createAdminCredential();
            return res.status(HTTP_CODES.OK).send(adminCredential);
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message)
        }
    }

    // public editAdminCredential(req: express.Request, res: express.Response) {
    //     try {

    //     } catch (error) {
    //         return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message)
    //     }
    // }

    public async getAdminCredential(req: express.Request, res: express.Response) {
        try {
            const adminCredential = await serviceInstance.getAdminCredential();
            if (adminCredential) return res.status(HTTP_CODES.OK).send(adminCredential);
            return res.status(HTTP_CODES.NOT_FOUND).send("No admin registered");
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message);
        }
    }

    public async syncDataToAdmin(req: express.Request, res: express.Response) {
        try {
            const resp = await serviceInstance.sendDataToAdmin(true);

            return res.status(HTTP_CODES.OK).send("updated");
        } catch (error) {
            return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message)
        }
    }

}

export default AuthController.getInstance();