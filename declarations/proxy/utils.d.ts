import { ProxyOptions } from "express-http-proxy";
export declare function formatUri(argUrl: string, uri: string): string;
export declare function canAccess(buildingId: string, api: {
    method: string;
    route: string;
}, profileId: string, isAppProfile: any): Promise<boolean>;
export declare const proxyOptions: (useV1: boolean) => ProxyOptions;
