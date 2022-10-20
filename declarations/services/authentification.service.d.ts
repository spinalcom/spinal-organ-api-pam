import { IAdmin, IAdminCredential, IPamCredential, IPamInfo, IUserCredential, IAppCredential, IApplicationToken, IUserToken } from "../interfaces";
export declare class AuthentificationService {
    private static instance;
    private constructor();
    static getInstance(): AuthentificationService;
    authenticate(info: IUserCredential | IAppCredential): Promise<{
        code: number;
        data: string | IApplicationToken | IUserToken;
    }>;
    authenticateAdmin(info: IUserCredential): Promise<{
        code: number;
        message: any;
    }>;
    tokenIsValid(token: string): Promise<IUserToken | IApplicationToken>;
    registerToAdmin(pamInfo: IPamInfo, adminInfo: IAdmin): Promise<IPamCredential>;
    getPamToAdminCredential(): Promise<IPamCredential>;
    deleteCredentials(): Promise<{
        removed: boolean;
    }>;
    createAdminCredential(): Promise<IAdminCredential>;
    editAdminCredential(admin: IAdminCredential): Promise<IAdminCredential>;
    getAdminCredential(): Promise<IAdminCredential>;
    sendDataToAdmin(update?: boolean): Promise<import("axios").AxiosResponse<any, any>>;
    private _getOrCreateAdminCredential;
    private getJsonData;
    private _getRequestBody;
    private _editPamCredential;
    private _sendLoginRequest;
    private _getProfileInfo;
    private _getUserInfo;
    private _getApplicationInfo;
    private _formatUserProfiles;
    private _formatAppProfiles;
    private _getOrCreateContext;
    private _saveUserToken;
    _getTokenData(token: string): Promise<IApplicationToken | IUserToken>;
}
