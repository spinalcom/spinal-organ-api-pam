import * as express from 'express';
import { Controller } from "tsoa";
import { IApp } from "../interfaces";
export declare class AppsController extends Controller {
    constructor();
    createAdminApp(req: express.Request, appInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    createPortofolioApp(req: express.Request, appInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    createBuildingApp(req: express.Request, appInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    getAllAdminApps(req: express.Request): Promise<IApp[] | {
        message: string;
    }>;
    getAllPortofolioApps(req: express.Request): Promise<IApp[] | {
        message: string;
    }>;
    getAllBuildingApps(req: express.Request): Promise<IApp[] | {
        message: string;
    }>;
    getAdminApp(req: express.Request, appId: string): Promise<IApp | {
        message: string;
    }>;
    getPortofolioApp(req: express.Request, appId: string): Promise<IApp | {
        message: string;
    }>;
    getBuildingApp(req: express.Request, appId: string): Promise<IApp | {
        message: string;
    }>;
    updateAdminApp(req: express.Request, appId: string, newInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    updatePortofolioApp(req: express.Request, appId: string, newInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    updateBuildingApp(req: express.Request, appId: string, newInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    deleteAdminApp(req: express.Request, appId: string): Promise<{
        message: string;
    }>;
    deletePortofolioApp(req: express.Request, appId: string): Promise<{
        message: string;
    }>;
    deleteBuildingApp(req: express.Request, appId: string): Promise<{
        message: string;
    }>;
    uploadAdminApp(req: express.Request, file: any): Promise<IApp[] | {
        message: string;
    }>;
    uploadPortofolioApp(req: express.Request, file: any): Promise<IApp[] | {
        message: string;
    }>;
    uploadBuildingApp(req: express.Request, file: any): Promise<IApp[] | {
        message: string;
    }>;
}
declare const _default: AppsController;
export default _default;
