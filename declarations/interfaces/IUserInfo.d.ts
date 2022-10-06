import { IUserCredential } from "./IAdmin";
export interface IUserInfo extends IUserCredential {
    firstName?: string;
    lastName?: string;
    email?: string;
    [key: string]: string;
}
