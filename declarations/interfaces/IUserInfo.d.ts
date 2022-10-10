import { IUserCredential } from "./IAdmin";
export interface IUserInfo extends IUserCredential {
    name: string;
    telephone?: string;
    email?: string;
    userType?: string;
    [key: string]: string;
}
