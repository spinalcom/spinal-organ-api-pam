import { IApiRoute, IApp } from ".";
export interface IPortofolioData {
    [key: string]: any;
    apps?: IApp[];
    apis?: IApiRoute[];
    building?: IBosData[];
}
export interface IBosData {
    [key: string]: any;
    apps?: IApp[];
    apis?: IApiRoute[];
}
export interface IProfileData {
    [key: string]: any;
    authorized?: IPortofolioData[];
}
