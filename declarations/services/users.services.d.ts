import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IUserCredential, IUserInfo } from "../interfaces";
export declare class UserService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): UserService;
    init(): Promise<SpinalContext>;
    createAdminUser(userInfo?: IUserInfo): Promise<SpinalNode>;
    getAdminUser(userName: string): Promise<SpinalNode>;
    loginAdmin(user: IUserCredential): Promise<{
        code: number;
        message: any | string;
    }>;
    private _hashPassword;
    private _comparePassword;
    private _linkUserToken;
    private _generateString;
    private _deleteUserToken;
}
