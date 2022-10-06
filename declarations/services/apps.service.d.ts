import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApp, IEditApp } from "../interfaces";
export declare class AppService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): AppService;
    init(): Promise<SpinalContext<any>>;
    createAdminApp(appInfo: IApp): Promise<SpinalNode>;
    createPortofolioApp(appInfo: IApp): Promise<SpinalNode>;
    createBuildingApp(appInfo: IApp): Promise<SpinalNode>;
    getAllAdminApps(): Promise<SpinalNode[]>;
    getAllPortofolioApps(): Promise<SpinalNode[]>;
    getAllBuildingApps(): Promise<SpinalNode[]>;
    getAdminApp(appId: string): Promise<SpinalNode>;
    getPortofolioApp(appId: string): Promise<SpinalNode>;
    getBuildingApp(appId: string): Promise<SpinalNode>;
    updateAdminApp(appId: string, newInfo: IEditApp): Promise<SpinalNode>;
    updatePortofolioApp(appId: string, newInfo: IEditApp): Promise<SpinalNode>;
    updateBuildingApp(appId: string, newInfo: IEditApp): Promise<SpinalNode>;
    deleteAdminApp(appId: string): Promise<boolean>;
    deletePortofolioApp(appId: string): Promise<boolean>;
    deleteBuildingApp(appId: string): Promise<boolean>;
    linkAppToPortofolio(portfolioId: string, appId: string): Promise<boolean>;
    linkAppToBuilding(buildingId: string, appId: string): Promise<boolean>;
    private _getApplicationGroupNode;
}
