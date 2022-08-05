import { IAdmin, IAdminCredential, IBosCredential, IPamInfo, IUserCredential, IAppCredential } from "../interfaces";
import { HTTP_CODES } from "../constant";
export declare class AuthentificationService {
    private static instance;
    private constructor();
    static getInstance(): AuthentificationService;
    authenticate(info: IUserCredential | IAppCredential): Promise<{
        code: HTTP_CODES;
        data: any;
    } | {
        code: HTTP_CODES;
        data: string;
    }>;
    tokenIsValid(token: string): boolean;
    getTokenData(token: string): boolean;
    registerToAdmin(pamInfo: IPamInfo, adminInfo: IAdmin): Promise<IBosCredential>;
    getBosToAdminCredential(): Promise<IBosCredential>;
    editBosCredential(bosCredential: any): Promise<IBosCredential>;
    createAdminCredential(): Promise<IAdminCredential>;
    editAdminCredential(admin: IAdminCredential): Promise<IAdminCredential>;
    getAdminCredential(): Promise<IAdminCredential>;
    sendDataToAdmin(update?: boolean): Promise<import("axios").AxiosResponse<any, any>>;
    private _getOrCreateAdminCredential;
    private getJsonData;
    private _getRequestBody;
    private _sendLoginRequest;
    private _getProfileInfo;
    private _getUserInfo;
    private _formatUserProfiles;
    private _formatAppProfiles;
    private _formatAppList;
    private _formatOrganList;
    private _getOrCreateContext;
}
