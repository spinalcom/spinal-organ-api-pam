import { SpinalNode } from 'spinal-env-viewer-graph-service';
export interface IPortofolioAuth {
    portofolioId: string;
    appsIds?: string | string[];
}
export interface IBosAuth {
    buildingId: string;
    appsIds?: string | string[];
}
export interface IProfile {
    name?: string;
    autorize?: IPortofolioAuth[];
}
export interface IPortofolioAuthRes {
    portofolio: SpinalNode;
    apps: SpinalNode[];
}
export interface IBosAuthRes {
    building: SpinalNode;
    apps: SpinalNode[];
}
export interface IAuthRes {
    authorizedPortofolio?: IPortofolioAuthRes[];
    authorizedRoutes?: SpinalNode[];
    authorizedBos?: IBosAuthRes[];
}
export interface IProfileRes extends IAuthRes {
    node: SpinalNode;
}
