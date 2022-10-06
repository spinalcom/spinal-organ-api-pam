
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

import { AuthentificationService } from "../services";
import * as express from "express";
import { HTTP_CODES } from "../constant";
import { Body, Route, Tags, Controller, Post, Get, Put, Delete } from "tsoa";
import { IAdmin, IAdminCredential, IAppCredential, IApplicationToken, IPamCredential, IPamInfo, IUserCredential, IUserToken } from "../interfaces";

const serviceInstance = AuthentificationService.getInstance();

@Route("/api/v1/pam")
@Tags("Auth")
export class AuthController extends Controller {

    public constructor() {
        super();
    }

    @Post("/auth")
    public async authenticate(@Body() credential: IUserCredential | IAppCredential): Promise<string | IApplicationToken | IUserToken | { message: string }> {
        try {
            const { code, data } = await serviceInstance.authenticate(credential);
            this.setStatus(code);
            return data;
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Post("/register_admin")
    public async registerToAdmin(@Body() data: { pamInfo: IPamInfo, adminInfo: IAdmin }): Promise<IPamCredential | { message: string }> {
        try {
            const registeredData = await serviceInstance.registerToAdmin(data.pamInfo, data.adminInfo);
            await serviceInstance.sendDataToAdmin();
            this.setStatus(HTTP_CODES.OK)
            return registeredData;
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Get("/get_pam_to_auth_credential")
    public async getBosToAdminCredential(): Promise<IPamCredential | { message: string }> {
        try {
            const bosCredential = await serviceInstance.getPamToAdminCredential();
            if (bosCredential) {
                this.setStatus(HTTP_CODES.OK)
                return bosCredential;
            }
            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: "No admin registered" };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message }
        }
    }

    // @Post("/create_auth_to_pam_credential")
    // public async createAdminCredential(): Promise<IAdminCredential | { message: string }> {
    //     try {
    //         const adminCredential = await serviceInstance.createAdminCredential();
    //         this.setStatus(HTTP_CODES.OK)
    //         return adminCredential;
    //     } catch (error) {
    //         this.setStatus(HTTP_CODES.INTERNAL_ERROR)
    //         return { message: error.message }
    //     }
    // }

    @Delete("/delete_admin")
    public async deleteAdmin(): Promise<{ message: string }> {
        try {
            const deleted = await serviceInstance.deleteCredentials();
            const status = deleted ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
            const message = deleted ? "deleted with success" : "something went wrong, please check your input data";
            this.setStatus(status);
            return { message };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Get("/get_admin_to_pam_credential")
    public async getAdminCredential(): Promise<IAdminCredential | { message: string }> {
        try {
            const adminCredential = await serviceInstance.getAdminCredential();
            if (adminCredential) {
                this.setStatus(HTTP_CODES.OK)
                return adminCredential;
            }


            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: "No admin registered" };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }

    @Put("/update_data")
    public async syncDataToAdmin(): Promise<{ message: string }> {
        try {
            const resp = await serviceInstance.sendDataToAdmin(true);
            this.setStatus(HTTP_CODES.OK)
            return { message: "updated" };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message }
        }
    }

}

export default new AuthController();