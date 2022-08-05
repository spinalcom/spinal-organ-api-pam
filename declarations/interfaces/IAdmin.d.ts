export interface IAdmin {
    name: string;
    urlAdmin: string;
    registerKey: string;
}
export interface IPamInfo {
    name: string;
    url: string;
    address?: string;
    statusPlatform?: string;
}
export interface IBosCredential {
    id: string;
    type: string;
    name: string;
    statusPlatform: string;
    address: string;
    tokenBosAdmin: string;
    bosName?: string;
    idPlateform?: string;
    urlAdmin?: string;
}
export interface IAdminCredential {
    TokenAdminBos: string;
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
