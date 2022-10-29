import { IApiRoute, IBosAuth, IBosData, IPortofolioAuth, IPortofolioData, IProfile, IProfileData, IProfileEdit } from "../interfaces";
import { Controller } from 'tsoa';
export declare class AppProfileController extends Controller {
    constructor();
    createAppProfile(data: IProfile): Promise<IProfileData | {
        message: string;
    }>;
    getAppProfile(id: string): Promise<IProfileData | {
        message: string;
    }>;
    getAllAppProfile(): Promise<IProfileData[] | {
        message: string;
    }>;
    updateAppProfile(id: string, data: IProfileEdit): Promise<IProfileData | {
        message: string;
    }>;
    deleteAppProfile(id: string): Promise<{
        message: string;
    }>;
    getAuthorizedPortofolio(profileId: string): Promise<IPortofolioData[] | {
        message: string;
    }>;
    authorizeToAccessPortofolioApis(profileId: string, data: IPortofolioAuth): Promise<IApiRoute[] | {
        message: string;
    }>;
    getAuthorizedPortofolioApis(profileId: string, portofolioId: string): Promise<IApiRoute[] | {
        message: string;
    }>;
    unauthorizeToAccessPortofolioApis(profileId: string, data: {
        apisIds: string[];
        portofolioId: string;
    }[]): Promise<string[] | {
        message: string;
    }>;
    getAuthorizedBos(profileId: string, portofolioId: string): Promise<IBosData | {
        message: string;
    }>;
    authorizeToAccessBosApis(profileId: string, portofolioId: string, data: IBosAuth): Promise<IApiRoute[] | {
        message: string;
    }>;
    getAuthorizedBosApis(profileId: string, portofolioId: string, bosId: string): Promise<IApiRoute[] | {
        message: string;
    }>;
    unauthorizeToAccessBosApis(profileId: string, portofolioId: string, data: {
        apisIds: string[];
        buildingId: string;
    }[]): Promise<string[] | {
        message: string;
    }>;
}
declare const _default: AppProfileController;
export default _default;
