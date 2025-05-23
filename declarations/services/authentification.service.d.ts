import { IAdmin, IAdminCredential, IPamCredential, IPamInfo, IUserCredential, IAppCredential, IApplicationToken, IUserToken, IOAuth2Credential } from "../interfaces";
export declare class AuthentificationService {
    private static instance;
    private constructor();
    static getInstance(): AuthentificationService;
    consumeCodeUnique(code: string): Promise<any>;
    authenticate(info: IUserCredential | IAppCredential | IOAuth2Credential): Promise<{
        code: number;
        data: string | IApplicationToken | IUserToken;
    }>;
    registerToAdmin(pamInfo: IPamInfo, adminInfo: IAdmin): Promise<IPamCredential>;
    getPamToAdminCredential(): Promise<IPamCredential>;
    deleteCredentials(): Promise<{
        removed: boolean;
    }>;
    createAdminCredential(): Promise<IAdminCredential>;
    editAdminCredential(admin: IAdminCredential): Promise<IAdminCredential>;
    getAdminCredential(): Promise<IAdminCredential>;
    sendDataToAdmin(update?: boolean): Promise<import("axios").AxiosResponse<any, any>>;
    updatePlatformTokenData(): Promise<any>;
    private _getOrCreateAdminCredential;
    private getJsonData;
    private _getRequestBody;
    private _editPamCredential;
    private _formatUserProfiles;
    private _formatAppProfiles;
    private _getOrCreateContext;
    private _formatInfo;
}
