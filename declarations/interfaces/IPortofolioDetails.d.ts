import { SpinalNode } from "spinal-env-viewer-graph-service";
import { IBuildingDetails } from "./IBuilding";
export interface IPortofolioDetails {
    node: SpinalNode;
    apps: SpinalNode[];
    buildings: IBuildingDetails[];
    apis: SpinalNode[];
}
export interface IPortofolioInfo {
    name: string;
    appIds?: string[];
    apiIds?: string[];
}
export interface IEditProtofolio {
    name?: string;
    authorizeAppIds?: string[];
    unauthorizeAppIds?: string[];
    authorizeApiIds?: string[];
    unauthorizeApiIds?: string[];
}
