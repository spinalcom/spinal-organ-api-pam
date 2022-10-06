export interface ILocation {
    lat: number;
    lng: number;
    [key: string]: any;
}
export interface IBuilding {
    name: string;
    aliasName: string;
    bosUrl: string;
    apiUrl: string;
    clientId: string;
    clientSecret: string;
    address: string;
    description: string;
    location?: ILocation;
    [key: string]: any;
}
export interface IEditBuilding {
    name?: string;
    aliasName?: string;
    bosUrl?: string;
    apiUrl?: string;
    clientId?: string;
    clientSecret?: string;
    address?: string;
    description?: string;
    location?: ILocation;
}
