import * as express from "express";
export declare class BuildingController {
    private static instance;
    private constructor();
    static getInstance(): BuildingController;
    addBuilding(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getBuilding(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAllBuilding(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    editBuilding(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    deleteBuilding(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
}
declare const _default: BuildingController;
export default _default;
