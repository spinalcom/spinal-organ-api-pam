import { SpinalNode } from 'spinal-env-viewer-graph-service';
export interface IProfile {
    name: string;
    authorize: IPortofolioAuth[];
}
export interface ItemsIds {
    appsIds?: string[];
    apisIds?: string[];
    unauthorizeAppsIds?: string[];
    unauthorizeApisIds?: string[];
}
export interface IPortofolioAuth extends ItemsIds {
    portofolioId: string;
    building?: IBosAuth[];
}
export interface IBosAuth extends ItemsIds {
    buildingId: string;
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
export type IPortofolioAuthEdit = IPortofolioAuth;
export type IBosAuthEdit = IBosAuth;
export interface IProfileEdit {
    name?: string;
    authorize?: IPortofolioAuthEdit[];
}
