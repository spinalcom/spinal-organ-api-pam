import { SpinalNode } from "spinal-env-viewer-graph-service";
export interface ILocation {
    lat?: number;
    lng?: number;
    [key: string]: any;
}
export interface IBuilding {
    name: string;
    aliasName: string;
    bosUrl: string;
    apiUrl: string;
    clientId?: string;
    clientSecret?: string;
    address: string;
    description: string;
    location?: ILocation;
    [key: string]: any;
}
export type IBuildingCreation = IBuilding & {
    appIds?: string[];
    apiIds?: string[];
};
export interface IBuildingDetails {
    node: SpinalNode;
    apps: SpinalNode[];
    apis: SpinalNode[];
}
export type IEditBuilding = IBuilding & {
    authorizeAppIds?: string[];
    authorizeApiIds?: string[];
    unauthorizeAppIds?: string[];
    unauthorizeApiIds?: string[];
};
