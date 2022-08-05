import * as express from "express";
export declare class AuthController {
    private static instance;
    private constructor();
    static getInstance(): AuthController;
    authenticate(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    registerToAdmin(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getBosToAdminCredential(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    createAdminCredential(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAdminCredential(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    syncDataToAdmin(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
}
declare const _default: AuthController;
export default _default;
