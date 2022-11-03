import { HTTP_CODES } from "../constant";
import { Controller } from "tsoa";
import { IAdmin, IAdminCredential, IAppCredential, IApplicationToken, IOAuth2Credential, IPamCredential, IPamInfo, IUserCredential, IUserToken } from "../interfaces";
export declare class AuthController extends Controller {
    constructor();
    authenticate(credential: IUserCredential | IAppCredential | IOAuth2Credential): Promise<string | IApplicationToken | IUserToken | {
        message: string;
    }>;
    registerToAdmin(data: {
        pamInfo: IPamInfo;
        adminInfo: IAdmin;
    }): Promise<IPamCredential | {
        message: string;
    }>;
    getBosToAdminCredential(): Promise<IPamCredential | {
        message: string;
    }>;
    deleteAdmin(): Promise<{
        message: string;
    }>;
    getAdminCredential(): Promise<IAdminCredential | {
        message: string;
    }>;
    syncDataToAdmin(): Promise<{
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
