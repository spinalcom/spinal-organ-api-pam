export interface IUserToken {
    name?: string;
    type?: string;
    token?: string;
    createdToken?: number;
    expieredToken?: number;
    userId?: string;
    userType: string;
    userProfileList?: string[];
    serverId?: string;
}
export interface IApplicationToken {
    name?: string;
    type?: string;
    token?: string;
    createdToken?: number;
    expieredToken?: number;
    applicationId?: string;
    applicationProfileList?: string[];
}
