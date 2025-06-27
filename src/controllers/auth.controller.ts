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

import { AuthentificationService, TokenService } from "../services";
import * as express from "express";
import { HTTP_CODES, SECURITY_MESSAGES, SECURITY_NAME } from "../constant";
import { Body, Route, Tags, Controller, Post, Get, Put, Delete, Security, Request } from "tsoa";
import { IAdmin, IAdminCredential, IAppCredential, IApplicationToken, IOAuth2Credential, IPamCredential, IPamInfo, IUserCredential, IUserToken } from "../interfaces";
import { checkIfItIsAdmin, checkIfItIsAuthPlateform } from "../security/authentication";
import { AuthError } from "../security/AuthError";

const serviceInstance = AuthentificationService.getInstance();

@Route("/api/v1/pam")
@Tags("Auth")
export class AuthController extends Controller {

    public constructor() {
        super();
    }

    // @Security(SECURITY_NAME.all)
    @Post("/auth")
    public async authenticate(@Body() credential: IUserCredential): Promise<string | IUserToken | { message: string }> {
        try {
            const { code, data } = await serviceInstance.authenticate(credential);
            this.setStatus(code);
            return data;
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Post("/consume/code")
    public async consumeCodeUnique(@Body() data: { code: string }): Promise<string | IApplicationToken | IUserToken | { message: string }> {
        try {
            const resp = await serviceInstance.consumeCodeUnique(data.code);
            this.setStatus(HTTP_CODES.OK);
            return resp;
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }




    @Security(SECURITY_NAME.bearerAuth)
    @Post("/register_admin")
    public async registerPamInAuthPlatform(@Request() req: express.Request, @Body() data: IAdmin): Promise<IPamCredential | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const registeredData = await serviceInstance.registerPamInAuthPlatform(data.urlAdmin, data.clientId, data.clientSecret);
            await serviceInstance.sendPamInfoToAuth();
            this.setStatus(HTTP_CODES.OK)
            return registeredData;
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/update_platform_token")
    public async updatePamTokenInAuthPlatform(@Request() req: express.Request): Promise<{ token: string; code: number } | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const data = await serviceInstance.updatePamTokenInAuthPlatform();

            this.setStatus(HTTP_CODES.OK)
            return data;
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_pam_to_auth_credential")
    public async getBosToAdminCredential(@Request() req: express.Request): Promise<IPamCredential | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            const bosCredential = await serviceInstance.getPamCredentials();
            if (bosCredential) {
                this.setStatus(HTTP_CODES.OK)
                return bosCredential;
            }
            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: "No admin registered" };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message }
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Delete("/delete_admin")
    public async deleteAdmin(@Request() req: express.Request,): Promise<{ message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            const deleted = await serviceInstance.disconnectPamFromAuthPlateform();
            const status = deleted ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST;
            const message = deleted ? "deleted with success" : "something went wrong, please check your input data";
            this.setStatus(status);
            return { message };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_admin_to_pam_credential")
    public async getAdminCredential(@Request() req: express.Request): Promise<IAdminCredential | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            const adminCredential = await serviceInstance.getAuthCredentials();
            if (adminCredential) {
                this.setStatus(HTTP_CODES.OK)
                return adminCredential;
            }


            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: "No admin registered" };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Put("/update_data")
    public async syncDataToAdmin(@Request() req: express.Request): Promise<{ message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) {
                const isAuthPlatform = await checkIfItIsAuthPlateform(req);
                if (!isAuthPlatform) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
            }

            const resp = await serviceInstance.sendPamInfoToAuth(true);
            this.setStatus(HTTP_CODES.OK)
            return { message: "updated" };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message }
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Post("/getTokenData")
    public async tokenIsValid(@Body() data: { token: string }) {
        try {
            const token = await TokenService.getInstance().tokenIsValid(data.token);
            const code = token ? HTTP_CODES.OK : HTTP_CODES.UNAUTHORIZED;
            this.setStatus(code);
            return {
                code,
                data: token
            }
        } catch (error) {
            this.setStatus(HTTP_CODES.UNAUTHORIZED)
            return {
                code: HTTP_CODES.UNAUTHORIZED,
                message: "Token is expired or invalid"
            }
        }
    }

}

export default new AuthController();