import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IBuilding, ILocation } from "../interfaces";
export declare class BuildingService {
    private static instance;
    private constructor();
    static getInstance(): BuildingService;
    getContext(): Promise<SpinalContext>;
    addBuilding(buildingInfo: IBuilding): Promise<SpinalNode>;
    getBuilding(buildingId: string): Promise<void | SpinalNode>;
    getAllBuilding(): Promise<SpinalNode[]>;
    updateBuilding(buildingId: string, newData: IBuilding): Promise<SpinalNode>;
    deleteBuilding(buildingId: string): Promise<string>;
    validateBuilding(buildingInfo: IBuilding): {
        isValid: boolean;
        message?: string;
    };
    setLocation(buildingInfo: IBuilding): Promise<IBuilding>;
    getLatLngViaAddress(address: string): Promise<ILocation>;
    getBuildingDetails(buildingId: string): Promise<{
        [key: string]: number;
    }>;
    formatBuilding(data: IBuilding): Promise<IBuilding>;
    private _findChildInContext;
    private _getBuildingTypeCount;
    private _getBuildingArea;
    private _countTypeHelper;
    private _getDigitalTwinGraph;
}
