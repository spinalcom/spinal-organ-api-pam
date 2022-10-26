/// <reference types="node" />
import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IBuilding, IEditBuilding, ILocation, IBuildingCreation, IBuildingDetails } from "../interfaces";
export declare class BuildingService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): BuildingService;
    init(): Promise<SpinalContext>;
    createBuilding(buildingInfo: IBuildingCreation): Promise<IBuildingDetails>;
    getAllBuildings(): Promise<SpinalNode[]>;
    getAllBuildingsApps(): Promise<{
        node: SpinalNode;
        apps: SpinalNode[];
    }[]>;
    getBuildingById(id: string): Promise<SpinalNode>;
    deleteBuilding(id: string): Promise<boolean>;
    addBuildingToPortofolio(portfolioId: string, building: IBuildingCreation): Promise<IBuildingDetails>;
    getBuildingFromPortofolio(portofolioId: string, buildingId: string): Promise<void | SpinalNode>;
    getAllBuildingsFromPortofolio(portfolioId: string): Promise<SpinalNode[]>;
    updateBuilding(buildingId: string, newData: IEditBuilding): Promise<IBuildingDetails>;
    getBuildingStructure(building: string | SpinalNode): Promise<IBuildingDetails>;
    formatBuildingStructure(building: IBuildingDetails): any;
    validateBuilding(buildingInfo: IBuilding): {
        isValid: boolean;
        message?: string;
    };
    setLocation(buildingInfo: IBuildingCreation): Promise<IBuildingCreation>;
    getLatLngViaAddress(address: string): Promise<ILocation>;
    getBuildingDetails(batimentUrl: string): Promise<{
        [key: string]: number;
    }>;
    formatBuilding(data: IBuilding): Promise<IBuilding>;
    addAppToBuilding(building: string | SpinalNode, applicationId: string | string[]): Promise<SpinalNode[]>;
    getAppsFromBuilding(building: string | SpinalNode): Promise<SpinalNode[]>;
    getAppFromBuilding(building: string | SpinalNode, appId: string): Promise<SpinalNode>;
    removeAppFromBuilding(building: string | SpinalNode, applicationId: string | string[]): Promise<string[]>;
    buildingHasApp(building: string | SpinalNode, appId: string): Promise<boolean>;
    addApiToBuilding(building: string | SpinalNode, apisIds: string | string[]): Promise<SpinalNode[]>;
    getApisFromBuilding(building: string | SpinalNode): Promise<SpinalNode[]>;
    getApiFromBuilding(building: string | SpinalNode, apiId: string): Promise<SpinalNode>;
    removeApisFromBuilding(building: string | SpinalNode, apisIds: string | string[]): Promise<string[]>;
    buildingHasApi(building: string | SpinalNode, apiId: string): Promise<boolean>;
    uploadSwaggerFile(buffer: Buffer): Promise<any[]>;
    private _findChildInContext;
    private _getBuildingTypeCount;
    private _getBuildingArea;
    private _countTypeHelper;
}
