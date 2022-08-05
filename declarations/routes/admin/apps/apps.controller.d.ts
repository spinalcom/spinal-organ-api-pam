import { SpinalContext } from "spinal-env-viewer-graph-service";
import * as express from "express";
export declare class AppsController {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): AppsController;
    createAppCategory(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAppCategory(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAllCategories(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    updateAppCategory(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    deleteAppCategory(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    createAppGroup(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAllGroupsInCategory(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAppGroup(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    updateAppGroup(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    deleteAppGroup(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    createApp(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAllAppsInGroup(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAllApps(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAppById(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getApp(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    updateApp(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    deleteApp(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
}
declare const _default: AppsController;
export default _default;
