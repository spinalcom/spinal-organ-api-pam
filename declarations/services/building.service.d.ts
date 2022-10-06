import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IBuilding, IEditBuilding, ILocation } from "../interfaces";
export declare class BuildingService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): BuildingService;
    init(): Promise<SpinalContext>;
    createBuilding(buildingInfo: IBuilding): Promise<SpinalNode>;
    getAllBuildings(): Promise<SpinalNode[]>;
    getAllBuildingsApps(): Promise<{
        node: SpinalNode;
        apps: SpinalNode[];
    }[]>;
    getBuildingById(id: string): Promise<SpinalNode>;
    deleteBuilding(id: string): Promise<boolean>;
    addBuildingToPortofolio(portfolioId: string, buildingId: string | string[]): Promise<SpinalNode[]>;
    getBuildingFromPortofolio(portofolioId: string, buildingId: string): Promise<void | SpinalNode>;
    getAllBuildingsFromPortofolio(portfolioId: string): Promise<SpinalNode[]>;
    updateBuilding(buildingId: string, newData: IEditBuilding): Promise<SpinalNode>;
    validateBuilding(buildingInfo: IBuilding): {
        isValid: boolean;
        message?: string;
    };
    setLocation(buildingInfo: IEditBuilding): Promise<IEditBuilding>;
    getLatLngViaAddress(address: string): Promise<ILocation>;
    getBuildingDetails(buildingId: string): Promise<{
        [key: string]: number;
    }>;
    formatBuilding(data: IBuilding): Promise<IBuilding>;
    addAppToBuilding(building: string | SpinalNode, applicationId: string | string[]): Promise<SpinalNode[]>;
    getAppsFromBuilding(building: string | SpinalNode): Promise<SpinalNode[]>;
    getAppFromBuilding(building: string | SpinalNode, appId: string): Promise<SpinalNode>;
    removeAppFromBuilding(building: string | SpinalNode, applicationId: string | string[]): Promise<string[]>;
    buildingHasApp(building: string | SpinalNode, appId: string): Promise<boolean>;
    private _findChildInContext;
    private _getBuildingTypeCount;
    private _getBuildingArea;
    private _countTypeHelper;
}
