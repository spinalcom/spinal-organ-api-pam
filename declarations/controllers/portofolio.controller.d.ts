import { IApiRoute, IApp, IBuilding, IBuildingCreation, IEditPortofolio, IPortofolioData, IPortofolioInfo } from "../interfaces";
import { Controller } from "tsoa";
import * as express from 'express';
export declare class PortofolioController extends Controller {
    constructor();
    addPortofolio(req: express.Request, data: IPortofolioInfo): Promise<IPortofolioData | {
        message: string;
    }>;
    updatePortofolio(req: express.Request, portofolioId: string, data: IEditPortofolio, isCompatibleWithBosC?: boolean): Promise<IPortofolioData | {
        message: string;
    }>;
    renamePortofolio(req: express.Request, id: string, data: {
        name: string;
    }): Promise<{
        message?: string;
    }>;
    getAllPortofolio(req: express.Request): Promise<any[] | {
        message: string;
    }>;
    getPortofolio(req: express.Request, id: string): Promise<any | {
        message: string;
    }>;
    getPortofolioDetails(req: express.Request, id: string): Promise<IPortofolioData | {
        message: string;
    }>;
    getAllPortofoliosDetails(req: express.Request): Promise<any[] | {
        message: string;
    }>;
    removePortofolio(req: express.Request, id: string): Promise<{
        message: string;
    }>;
    addBuilding(req: express.Request, portofolioId: string, body: IBuildingCreation): Promise<IBuilding[] | {
        message: string;
    }>;
    getBuilding(req: express.Request, portofolioId: string, buildingId: string): Promise<IBuilding | {
        message: string;
    }>;
    getAllBuilding(req: express.Request, portofolioId: string): Promise<IBuilding[] | {
        message: string;
    }>;
    deleteBuildingFromPortofolio(req: express.Request, portofolioId: string, data: {
        buildingIds: string[];
    }): Promise<{
        message: string;
        ids?: string[];
    }>;
    addAppToPortofolio(req: express.Request, portofolioId: string, data: {
        applicationsIds: string[];
    }): Promise<IApp[] | {
        message: string;
    }>;
    getPortofolioApps(req: express.Request, portofolioId: string): Promise<IApp[] | {
        message: string;
    }>;
    getAppFromPortofolio(req: express.Request, portofolioId: string, applicationId: string): Promise<IApp | {
        message: string;
    }>;
    removeAppFromPortofolio(req: express.Request, portofolioId: string, data: {
        applicationId: string[];
    }): Promise<{
        message: string;
        ids?: string[];
    }>;
    portofolioHasApp(req: express.Request, portofolioId: string, applicationId: string): Promise<boolean | {
        message: string;
    }>;
    addApiToPortofolio(req: express.Request, portofolioId: string, data: {
        apisIds: string[];
    }): Promise<IApiRoute[] | {
        message: string;
    }>;
    getPortofolioApis(req: express.Request, portofolioId: string): Promise<IApiRoute[] | {
        message: string;
    }>;
    getApiFromPortofolio(req: express.Request, portofolioId: string, apiId: string): Promise<IApiRoute | {
        message: string;
    }>;
    removeApiFromPortofolio(req: express.Request, portofolioId: string, data: {
        apisIds: string[];
    }): Promise<{
        message: string;
        ids?: string[];
    }>;
    portofolioHasApi(req: express.Request, portofolioId: string, apiId: string): Promise<boolean | {
        message: string;
    }>;
}
declare const _default: PortofolioController;
export default _default;
