import { SpinalNode } from "spinal-env-viewer-graph-service";
import { IBuildingDetails } from "./IBuilding";
import { IPortofolioAuth } from "./IProfile";
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
export interface IEditPortofolio {
    name?: string;
    authorizeAppIds?: string[];
    unauthorizeAppIds?: string[];
    authorizeApiIds?: string[];
    unauthorizeApiIds?: string[];
}
export declare function convertIEditPortofolio(portofolioId: string, editData: IEditPortofolio): IPortofolioAuth;
