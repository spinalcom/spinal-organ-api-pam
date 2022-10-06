import { Controller } from "tsoa";
import { IAdmin, IAdminCredential, IAppCredential, IApplicationToken, IPamCredential, IPamInfo, IUserCredential, IUserToken } from "../interfaces";
export declare class AuthController extends Controller {
    constructor();
    authenticate(credential: IUserCredential | IAppCredential): Promise<string | IApplicationToken | IUserToken | {
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
}
declare const _default: AuthController;
export default _default;
