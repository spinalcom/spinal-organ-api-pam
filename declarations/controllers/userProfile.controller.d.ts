import * as express from 'express';
import { IPortofolioData, IProfile, IProfileData, IProfileEdit } from "../interfaces";
import { Controller } from "tsoa";
export declare class UserProfileController extends Controller {
    constructor();
    createUserProfile(req: express.Request, data: IProfile): Promise<IProfileData | {
        message: string;
    }>;
    getUserProfile(req: express.Request, id: string): Promise<IProfileData | {
        message: string;
    }>;
    getAllUserProfile(req: express.Request): Promise<IProfileData[] | {
        message: string;
    }>;
    updateUserProfile(req: express.Request, id: string, data: IProfileEdit): Promise<IProfileData | {
        message: string;
    }>;
    deleteUserProfile(req: express.Request, id: string): Promise<{
        message: string;
    }>;
    getAuthorizedPortofolioApps(req: express.Request, profileId: string): Promise<IPortofolioData[] | {
        message: string;
    }>;
    authorizeToAccessPortofolioApps(req: express.Request, profileId: string, data: {
        appsIds: string[];
        portofolioId: string;
    }[]): Promise<IPortofolioData[] | {
        message: string;
    }>;
    getAuthorizedPortofolioApis(req: express.Request, profileId: string, portofolioId: string): Promise<any | {
        message: string;
    }>;
    unauthorizeToAccessPortofolioApps(req: express.Request, profileId: string, data: {
        appsIds: string[];
        portofolioId: string;
    }[]): Promise<any | {
        message: string;
    }>;
    getAuthorizedBos(req: express.Request, profileId: string, portofolioId: string): Promise<any | {
        message: string;
    }>;
}
declare const _default: UserProfileController;
export default _default;
