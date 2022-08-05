import * as express from "express";
export declare class APIController {
    private static instance;
    private constructor();
    static getInstance(): APIController;
    createApiRoute(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    updateApiRoute(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getApiRouteById(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAllApiRoute(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    deleteApiRoute(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    uploadSwaggerFile(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
}
declare const _default: APIController;
export default _default;
