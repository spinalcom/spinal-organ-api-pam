import { SpinalNode } from "spinal-env-viewer-graph-service";
export interface IPortofolioDetails {
    node: SpinalNode;
    apps: SpinalNode[];
    buildings: SpinalNode[];
}
export interface IPortofolioInfo {
    name: string;
    buildingIds?: string[];
    appIds?: string[];
}
