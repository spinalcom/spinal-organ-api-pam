import { IBosAuth, IBosData, IPortofolioData, IProfile, IProfileData, IProfileEdit } from "../interfaces";
import { Controller } from "tsoa";
export declare class UserProfileController extends Controller {
    constructor();
    createUserProfile(data: IProfile): Promise<IProfileData | {
        message: string;
    }>;
    getUserProfile(id: string): Promise<IProfileData | {
        message: string;
    }>;
    getAllUserProfile(): Promise<IProfileData[] | {
        message: string;
    }>;
    updateUserProfile(id: string, data: IProfileEdit): Promise<IProfileData | {
        message: string;
    }>;
    deleteUserProfile(id: string): Promise<{
        message: string;
    }>;
    getAuthorizedPortofolioApps(profileId: string): Promise<IPortofolioData[] | {
        message: string;
    }>;
    authorizeToAccessPortofolioApps(profileId: string, data: {
        appsIds: string[];
        portofolioId: string;
    }[]): Promise<IPortofolioData[] | {
        message: string;
    }>;
    getAuthorizedPortofolioApis(profileId: string, portofolioId: string): Promise<any | {
        message: string;
    }>;
    unauthorizeToAccessPortofolioApps(profileId: string, data: {
        appsIds: string[];
        portofolioId: string;
    }[]): Promise<any | {
        message: string;
    }>;
    getAuthorizedBos(profileId: string, portofolioId: string): Promise<any | {
        message: string;
    }>;
    authorizeToAccessBosApps(profileId: string, portofolioId: string, data: IBosAuth[]): Promise<IBosData[] | {
        message: string;
    }>;
    getAuthorizedBosApis(profileId: string, portofolioId: string, bosId: string): Promise<any | {
        message: string;
    }>;
    unauthorizeToAccessBosApp(profileId: string, portofolioId: string, data: {
        appsIds: string[];
        buildingId: string;
    }[]): Promise<any | {
        message: string;
    }>;
}
declare const _default: UserProfileController;
export default _default;
