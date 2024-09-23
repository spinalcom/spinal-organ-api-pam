import * as express from "express";
import { HTTP_CODES } from "../constant";
import { Controller } from "tsoa";
import { IAdminCredential, IAppCredential, IApplicationToken, IOAuth2Credential, IPamCredential, IUserCredential, IUserToken } from "../interfaces";
export declare class AuthController extends Controller {
    constructor();
    authenticate(credential: IUserCredential | IAppCredential | IOAuth2Credential): Promise<string | IApplicationToken | IUserToken | {
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
