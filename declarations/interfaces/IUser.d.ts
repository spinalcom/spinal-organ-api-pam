export interface IUser {
    id?: string;
    name: string;
    firstname?: string;
    email?: string;
    password?: string;
    userProfileId?: string;
    [key: string]: any;
}
