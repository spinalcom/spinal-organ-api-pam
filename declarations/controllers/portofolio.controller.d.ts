import { IApiRoute, IApp, IBuilding, IBuildingCreation, IEditProtofolio, IPortofolioData, IPortofolioInfo } from "../interfaces";
import { Controller } from "tsoa";
export declare class PortofolioController extends Controller {
    constructor();
    addPortofolio(data: IPortofolioInfo): Promise<IPortofolioData | {
        message: string;
    }>;
    updatePortofolio(portofolioId: string, data: IEditProtofolio): Promise<IPortofolioData | {
        message: string;
    }>;
    renamePortofolio(id: string, data: {
        name: string;
    }): Promise<{
        message?: string;
    }>;
    getAllPortofolio(): Promise<any[] | {
        message: string;
    }>;
    getPortofolio(id: string): Promise<any | {
        message: string;
    }>;
    getPortofolioDetails(id: string): Promise<IPortofolioData | {
        message: string;
    }>;
    getAllPortofoliosDetails(): Promise<any[] | {
        message: string;
    }>;
    removePortofolio(id: string): Promise<{
        message: string;
    }>;
    addBuilding(portofolioId: string, body: IBuildingCreation): Promise<IBuilding[] | {
        message: string;
    }>;
    getBuilding(portofolioId: string, buildingId: string): Promise<IBuilding | {
        message: string;
    }>;
    getAllBuilding(portofolioId: string): Promise<IBuilding[] | {
        message: string;
    }>;
    deleteBuildingFromPortofolio(portofolioId: string, data: {
        buildingIds: string[];
    }): Promise<{
        message: string;
        ids?: string[];
    }>;
    addAppToPortofolio(portofolioId: string, data: {
        applicationsIds: string[];
    }): Promise<IApp[] | {
        message: string;
    }>;
    getPortofolioApps(portofolioId: string): Promise<IApp[] | {
        message: string;
    }>;
    getAppFromPortofolio(portofolioId: string, applicationId: string): Promise<IApp | {
        message: string;
    }>;
    removeAppFromPortofolio(portofolioId: string, data: {
        applicationId: string[];
    }): Promise<{
        message: string;
        ids?: string[];
    }>;
    portofolioHasApp(portofolioId: string, applicationId: string): Promise<boolean | {
        message: string;
    }>;
    addApiToPortofolio(portofolioId: string, data: {
        apisIds: string[];
    }): Promise<IApiRoute[] | {
        message: string;
    }>;
    getPortofolioApis(portofolioId: string): Promise<IApiRoute[] | {
        message: string;
    }>;
    getApiFromPortofolio(portofolioId: string, apiId: string): Promise<IApiRoute | {
        message: string;
    }>;
    removeApiFromPortofolio(portofolioId: string, data: {
        apisIds: string[];
    }): Promise<{
        message: string;
        ids?: string[];
    }>;
    portofolioHasApi(portofolioId: string, apiId: string): Promise<boolean | {
        message: string;
    }>;
}
declare const _default: PortofolioController;
export default _default;
