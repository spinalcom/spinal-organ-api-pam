import { IApiRoute, IApp, IBuilding, IEditBuilding } from "../interfaces";
import { Controller } from "tsoa";
import * as express from 'express';
export declare class BuildingController extends Controller {
    constructor();
    getBuildingById(req: express.Request, id: string): Promise<IBuilding | {
        message: string;
    }>;
    getAllBuildingsApps(req: express.Request): Promise<(IBuilding & {
        apps: IApp;
    })[] | {
        message: string;
    }>;
    deleteBuilding(req: express.Request, id: string): Promise<any | {
        message: string;
    }>;
    editBuilding(req: express.Request, id: string, data: IEditBuilding): Promise<IBuilding | {
        message: string;
    }>;
    addAppToBuilding(req: express.Request, buildingId: string, data: {
        applicationId: string[];
    }): Promise<IApp[] | {
        message: string;
    }>;
    getAppsFromBuilding(req: express.Request, buildingId: string): Promise<IApp[] | {
        message: string;
    }>;
    getAppFromBuilding(req: express.Request, buildingId: string, appId: string): Promise<IApp | {
        message: string;
    }>;
    removeAppFromBuilding(req: express.Request, buildingId: string, data: {
        applicationId: string[];
    }): Promise<{
        message: string;
        ids?: string[];
    }>;
    buildingHasApp(req: express.Request, buildingId: string, appId: string): Promise<boolean | {
        message: string;
    }>;
    addApiToBuilding(req: express.Request, buildingId: string, data: {
        apisIds: string[];
    }): Promise<IApiRoute[] | {
        message: string;
    }>;
    getApisFromBuilding(req: express.Request, buildingId: string): Promise<IApiRoute[] | {
        message: string;
    }>;
    getApiFromBuilding(req: express.Request, buildingId: string, apiId: string): Promise<IApiRoute | {
        message: string;
    }>;
    removeApisFromBuilding(req: express.Request, buildingId: string, data: {
        apisIds: string[];
    }): Promise<{
        message: string;
        ids?: string[];
    }>;
    buildingHasApi(req: express.Request, buildingId: string, apiId: string): Promise<boolean | {
        message: string;
    }>;
}
declare const _default: BuildingController;
export default _default;
