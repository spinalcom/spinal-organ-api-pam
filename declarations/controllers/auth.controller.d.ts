import * as express from "express";
import { HTTP_CODES } from "../constant";
import { Controller } from "tsoa";
import { IAdmin, IAdminCredential, IApplicationToken, IPamCredential, IUserCredential, IUserToken } from "../interfaces";
export declare class AuthController extends Controller {
    constructor();
    authenticate(credential: IUserCredential): Promise<string | IUserToken | {
        message: string;
    }>;
    registerPamInAuthPlatform(req: express.Request, data: IAdmin): Promise<IPamCredential | {
        message: string;
    }>;
    updatePamTokenInAuthPlatform(req: express.Request): Promise<{
        token: string;
        code: number;
    } | {
        message: string;
    }>;
    getBosToAdminCredential(req: express.Request): Promise<IPamCredential | {
        message: string;
    }>;
    deleteAdmin(req: express.Request): Promise<{
        message: string;
    }>;
    getAdminCredential(req: express.Request): Promise<IAdminCredential | {
        message: string;
    }>;
    syncDataToAdmin(req: express.Request): Promise<{
        message: string;
    }>;
    tokenIsValid(data: {
        token: string;
    }): Promise<{
        code: HTTP_CODES;
        data: IUserToken | IApplicationToken;
        message?: undefined;
    } | {
        code: HTTP_CODES;
        message: string;
        data?: undefined;
    }>;
}
declare const _default: AuthController;
export default _default;
