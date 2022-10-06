import { IApiRoute, IApp } from ".";
export interface IPortofolioData {
    [key: string]: any;
    apps: IApp[];
}
export interface IBosData {
    [key: string]: any;
    apps: IApp[];
}
export interface IProfileData {
    [key: string]: any;
    authorizedPortofolio: IPortofolioData[];
    authorizedRoutes: IApiRoute[];
    authorizedBos: IBosData[];
}
