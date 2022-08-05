import * as express from "express";
export declare class AppProfileController {
    private static instance;
    private constructor();
    static getInstance(): AppProfileController;
    createAppProfile(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAppProfile(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAllAppProfile(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    updateAppProfile(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    deleteAppProfile(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
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
declare const _default: AppProfileController;
export default _default;
