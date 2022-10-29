import { SpinalNode } from 'spinal-env-viewer-graph-service';
export interface IProfile {
    name: string;
    authorize: IPortofolioAuth[];
}
export interface IPortofolioAuth {
    portofolioId: string;
    appsIds?: string[];
    apisIds?: string[];
    building?: IBosAuth[];
}
export interface IBosAuth {
    buildingId: string;
    appsIds?: string[];
    apisIds?: string[];
}
export interface IProfileRes {
    node: SpinalNode;
    authorized: IPortofolioAuthRes[];
}
export interface IPortofolioAuthRes {
    portofolio: SpinalNode;
    apps?: SpinalNode[];
    apis?: SpinalNode[];
    buildings?: IBosAuthRes[];
}
export interface IBosAuthRes {
    building: SpinalNode;
    apps?: SpinalNode[];
    apis?: SpinalNode[];
}
export interface IPortofolioAuthEdit {
    portofolioId: string;
    appsIds?: string[];
    apisIds?: string[];
    unauthorizeAppsIds?: string[];
    unauthorizeApisIds?: string[];
    building?: IBosAuthEdit[];
}
export interface IBosAuthEdit {
    buildingId: string;
    appsIds?: string[];
    apisIds?: string[];
    unauthorizeAppsIds?: string[];
    unauthorizeApisIds?: string[];
}
export interface IProfileEdit {
    name?: string;
    authorize?: IPortofolioAuthEdit[];
}
