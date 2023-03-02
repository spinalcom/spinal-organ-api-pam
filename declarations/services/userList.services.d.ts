import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { HTTP_CODES } from "../constant";
import { IUserCredential, IUserInfo, IUserToken } from "../interfaces";
export declare class UserListService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): UserListService;
    init(): Promise<SpinalContext>;
    authenticateUser(user: IUserCredential): Promise<{
        code: number;
        data: string | IUserToken;
    }>;
    getUser(username: string): Promise<SpinalNode>;
    getFavoriteApps(userId: string): Promise<SpinalNode[]>;
    createAdminUser(userInfo?: IUserInfo): Promise<SpinalNode>;
    getAdminUser(userName: string): Promise<SpinalNode>;
    authAdmin(user: IUserCredential): Promise<{
        code: number;
        data: any | string;
    }>;
    authUserViaAuthPlateform(user: IUserCredential): Promise<{
        code: HTTP_CODES;
        data: any;
    }>;
    private _addUserToContext;
    private _hashPassword;
    private _comparePassword;
    private _linkUserToken;
    private _generateString;
    private _deleteUserToken;
    private _getProfileInfo;
    private _getUserInfo;
    private _getAuthPlateformInfo;
}
