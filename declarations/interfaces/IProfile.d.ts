import { SpinalNode } from 'spinal-env-viewer-graph-service';
export interface IProfile {
    name: string;
    authorize: IPortofolioAuth[];
}
export interface IProfileRes {
    node: SpinalNode;
    authorized: IPortofolioAuthRes[];
}
export interface IPortofolioAuthRes {
    portofolio: SpinalNode;
    apps?: SpinalNode[];
    apis?: SpinalNode[];
    buildings?: SpinalNode[];
}
export interface IPortofolioAuth {
    portofolioId: string;
    appsIds?: string[];
    apisIds?: string[];
    buildingIds?: string[];
}
export interface IProfileEdit {
    name?: string;
    authorize?: IPortofolioAuthEdit[];
}
export interface IPortofolioAuthEdit extends IPortofolioAuth {
    unauthorizeAppsIds?: string[];
    unauthorizeApisIds?: string[];
    unauthorizeBuildingIds?: string[];
}
