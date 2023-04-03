import * as express from 'express';
import { IApiRoute, IBosAuth, IBosData, IPortofolioAuth, IPortofolioData, IProfile, IProfileData, IProfileEdit } from "../interfaces";
import { Controller } from 'tsoa';
export declare class AppProfileController extends Controller {
    constructor();
    createAppProfile(req: express.Request, data: IProfile): Promise<IProfileData | {
        message: string;
    }>;
    getAppProfile(req: express.Request, id: string): Promise<IProfileData | {
        message: string;
    }>;
    getAllAppProfile(req: express.Request): Promise<IProfileData[] | {
        message: string;
    }>;
    updateAppProfile(req: express.Request, id: string, data: IProfileEdit): Promise<IProfileData | {
        message: string;
    }>;
    deleteAppProfile(req: express.Request, id: string): Promise<{
        message: string;
    }>;
    getAuthorizedPortofolio(req: express.Request, profileId: string): Promise<IPortofolioData[] | {
        message: string;
    }>;
    authorizeToAccessPortofolioApis(req: express.Request, profileId: string, data: IPortofolioAuth): Promise<IApiRoute[] | {
        message: string;
    }>;
    getAuthorizedPortofolioApis(req: express.Request, profileId: string, portofolioId: string): Promise<IApiRoute[] | {
        message: string;
    }>;
    unauthorizeToAccessPortofolioApis(req: express.Request, profileId: string, data: {
        apisIds: string[];
        portofolioId: string;
    }[]): Promise<string[] | {
        message: string;
    }>;
    getAuthorizedBos(req: express.Request, profileId: string, portofolioId: string): Promise<IBosData | {
        message: string;
    }>;
    authorizeToAccessBosApis(req: express.Request, profileId: string, portofolioId: string, data: IBosAuth): Promise<IApiRoute[] | {
        message: string;
    }>;
    getAuthorizedBosApis(req: express.Request, profileId: string, portofolioId: string, bosId: string): Promise<IApiRoute[] | {
        message: string;
    }>;
    unauthorizeToAccessBosApis(req: express.Request, profileId: string, portofolioId: string, data: {
        apisIds: string[];
        buildingId: string;
    }[]): Promise<string[] | {
        message: string;
    }>;
}
declare const _default: AppProfileController;
export default _default;
