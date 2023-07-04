import { ProxyOptions } from "express-http-proxy";
export declare function getProfileBuildings(profileId: string, isApp: boolean): Promise<any[]>;
export declare function formatUri(argUrl: string, uri: string): string;
export declare function canAccess(buildingId: string, api: {
    method: string;
    route: string;
}, profileId: string, isAppProfile: any): Promise<boolean>;
export declare const proxyOptions: (useV1: boolean) => ProxyOptions;
export declare function profileHasAccessToBuilding(profileId: string, buildingId: string, isAppProfile: boolean): Promise<any>;
