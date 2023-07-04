import { SpinalNode } from "spinal-env-viewer-graph-service";
export interface IPortofolioDetails {
    node: SpinalNode;
    apps: SpinalNode[];
    buildings: SpinalNode[];
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
