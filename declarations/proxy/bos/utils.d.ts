import { ProxyOptions } from "express-http-proxy";
import { IBosAuthRes, IBuilding } from "../../interfaces";
export declare function tryToDownloadSvf(req: any): boolean;
export declare function _formatBuildingRes(building: IBuilding): {
    name: string;
    _id: any;
    id: any;
    address: string;
    description: string;
    urlBos: string;
    type: any;
    localisation: import("../../interfaces").ILocation;
};
export declare function getProfileBuildings(profileId: string, isApp: boolean): Promise<any[]>;
export declare function formatUri(argUrl: string, uri: string): string;
export declare function canAccess(buildingId: string, api: {
    method: string;
    route: string;
}, profileId: string, isAppProfile: boolean): Promise<boolean>;
export declare function tryToAccessBuildingInfo(api: {
    method: string;
    route: string;
}): boolean;
export declare const proxyOptions: (useV1: boolean) => ProxyOptions;
export declare function profileHasAccessToBuilding(profileId: string, buildingId: string, isAppProfile: boolean): Promise<IBosAuthRes>;
export declare function _get_method(method: string, statusCode: number): "READ" | "ADD" | "DEL" | "ERROR";
