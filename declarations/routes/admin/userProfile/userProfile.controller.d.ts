import * as express from "express";
export declare class UserProfileController {
    private static instance;
    private constructor();
    static getInstance(): UserProfileController;
    createUserProfile(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getUserProfile(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAllUserProfile(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    updateUserProfile(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    deleteUserProfile(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    authorizeToAccessApps(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    unauthorizeToAccessApps(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAuthorizedApps(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    authorizeToAccessApis(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    unauthorizeToAccessApis(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAuthorizedApis(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    authorizeProfileToAccessBos(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    unauthorizeProfileToAccessBos(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAuthorizedBos(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
}
declare const _default: UserProfileController;
export default _default;
