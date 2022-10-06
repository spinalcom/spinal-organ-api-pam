import { Controller } from "tsoa";
import { IApp, IEditApp } from "../interfaces";
export declare class AppsController extends Controller {
    constructor();
    createAdminApp(appInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    createPortofolioApp(appInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    createBuildingApp(appInfo: IApp): Promise<IApp | {
        message: string;
    }>;
    getAllAdminApps(): Promise<IApp[] | {
        message: string;
    }>;
    getAllPortofolioApps(): Promise<IApp[] | {
        message: string;
    }>;
    getAllBuildingApps(): Promise<IApp[] | {
        message: string;
    }>;
    getAdminApp(appId: string): Promise<IApp | {
        message: string;
    }>;
    getPortofolioApp(appId: string): Promise<IApp | {
        message: string;
    }>;
    getBuildingApp(appId: string): Promise<IApp | {
        message: string;
    }>;
    updateAdminApp(appId: string, newInfo: IEditApp): Promise<IApp | {
        message: string;
    }>;
    updatePortofolioApp(appId: string, newInfo: IEditApp): Promise<IApp | {
        message: string;
    }>;
    updateBuildingApp(appId: string, newInfo: IEditApp): Promise<IApp | {
        message: string;
    }>;
    deleteAdminApp(appId: string): Promise<{
        message: string;
    }>;
    deletePortofolioApp(appId: string): Promise<{
        message: string;
    }>;
    deleteBuildingApp(appId: string): Promise<{
        message: string;
    }>;
}
declare const _default: AppsController;
export default _default;
