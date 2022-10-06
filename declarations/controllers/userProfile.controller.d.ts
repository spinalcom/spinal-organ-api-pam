import { IBosAuth, IBosData, IPortofolioAuth, IPortofolioData, IProfile, IProfileData } from "../interfaces";
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
    updateUserProfile(id: string, data: IProfile): Promise<IProfileData | {
        message: string;
    }>;
    deleteUserProfile(id: string): Promise<{
        message: string;
    }>;
    authorizeToAccessPortofolioApps(profileId: string, data: IPortofolioAuth[]): Promise<IPortofolioData[] | {
        message: string;
    }>;
    unauthorizeToAccessPortofolioApps(profileId: string, data: IPortofolioAuth[]): Promise<any | {
        message: string;
    }>;
    getAuthorizedPortofolioApps(profileId: string): Promise<IPortofolioData[] | {
        message: string;
    }>;
    authorizeToAccessApis(profileId: string, data: {
        authorizeApis: string[];
    }): Promise<any | {
        message: string;
    }>;
    unauthorizeToAccessApis(profileId: string, data: {
        unauthorizeApis: string[];
    }): Promise<any | {
        message: string;
    }>;
    getAuthorizedApis(profileId: string): Promise<any | {
        message: string;
    }>;
    authorizeProfileToAccessBos(profileId: string, data: IBosAuth[]): Promise<IBosData[] | {
        message: string;
    }>;
    unauthorizeProfileToAccessBos(profileId: string, data: IBosAuth[]): Promise<any | {
        message: string;
    }>;
    getAuthorizedBos(profileId: string): Promise<any | {
        message: string;
    }>;
}
declare const _default: UserProfileController;
export default _default;
