export interface IAdmin {
    name: string;
    urlAdmin: string;
    registerKey: string;
}
export interface IPamInfo {
    name: string;
    url: string;
    address?: string;
    statusPlatform?: "online" | "fail" | 'stop';
}
export interface IPamCredential {
    id: string;
    type: string;
    name: string;
    statusPlatform: string;
    address: string;
    tokenPamToAdmin: string;
    pamName?: string;
    idPlateform?: string;
    urlAdmin?: string;
}
export interface IAdminCredential {
    TokenAdminToPam: string;
    idPlatformOfAdmin: string;
}
export interface IAdminUserProfile {
    userProfileId: string;
    label: string;
}
export interface IAdminAppProfile {
    appProfileId: string;
    label: string;
}
export interface IAdminOrgan {
    label: string;
    type: string;
}
export interface IJsonData {
    userProfileList?: IAdminUserProfile[];
    appProfileList?: IAdminAppProfile[];
    organList?: IAdminOrgan[];
    appList?: any[];
}
export interface IUserCredential {
    userName: string;
    password: string;
}
export interface IAppCredential {
    clientId: string;
    clientSecret: string;
}
export interface IOAuth2Credential {
    client_id: string;
    client_secret: string;
    [key: string]: string;
}
