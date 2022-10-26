import { IApiRoute, IApp, IBuilding, IEditBuilding } from "../interfaces";
import { Controller } from "tsoa";
export declare class BuildingController extends Controller {
    constructor();
    getBuildingById(id: string): Promise<IBuilding | {
        message: string;
    }>;
    getAllBuildingsApps(): Promise<(IBuilding & {
        apps: IApp;
    })[] | {
        message: string;
    }>;
    deleteBuilding(id: string): Promise<any | {
        message: string;
    }>;
    editBuilding(id: string, data: IEditBuilding): Promise<IBuilding | {
        message: string;
    }>;
    addAppToBuilding(buildingId: string, data: {
        applicationId: string[];
    }): Promise<IApp[] | {
        message: string;
    }>;
    getAppsFromBuilding(buildingId: string): Promise<IApp[] | {
        message: string;
    }>;
    getAppFromBuilding(buildingId: string, appId: string): Promise<IApp | {
        message: string;
    }>;
    removeAppFromBuilding(buildingId: string, data: {
        applicationId: string[];
    }): Promise<{
        message: string;
        ids?: string[];
    }>;
    buildingHasApp(buildingId: string, appId: string): Promise<boolean | {
        message: string;
    }>;
    addApiToBuilding(buildingId: string, data: {
        apisIds: string[];
    }): Promise<IApiRoute[] | {
        message: string;
    }>;
    getApisFromBuilding(buildingId: string): Promise<IApiRoute[] | {
        message: string;
    }>;
    getApiFromBuilding(buildingId: string, apiId: string): Promise<IApiRoute | {
        message: string;
    }>;
    removeApisFromBuilding(buildingId: string, data: {
        apisIds: string[];
    }): Promise<{
        message: string;
        ids?: string[];
    }>;
    buildingHasApi(buildingId: string, apiId: string): Promise<boolean | {
        message: string;
    }>;
}
declare const _default: BuildingController;
export default _default;
