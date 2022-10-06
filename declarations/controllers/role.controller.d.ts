import * as express from "express";
export declare class RoleController {
    private static instance;
    private constructor();
    static getInstance(): RoleController;
    createRole(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAllRole(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getRole(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    updateRole(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    deleteRole(req: express.Request, res: express.Response): Promise<void>;
}
declare const _default: RoleController;
export default _default;
