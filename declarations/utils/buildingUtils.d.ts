import { IBuilding, IBuildingCreation, IBuildingDetails, ILocation } from "../interfaces";
import { SpinalNode } from "spinal-model-graph";
export declare function getBuildingGeoPosition(buildingAddress: string): Promise<ILocation>;
export declare function createBuildingNode(buildingInfo: IBuildingCreation): Promise<SpinalNode>;
export declare function formatBuildingNode(buildingNode: SpinalNode): Promise<IBuilding>;
export declare function getBuildingDetail(buildingInfo: IBuilding): Promise<any>;
export declare function formatBuildingStructure(building: IBuildingDetails): any;
export declare function validateBuildingInfo(buildingInfo: IBuilding): {
    isValid: boolean;
    message?: string;
};
