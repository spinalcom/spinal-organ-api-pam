import { ProxyOptions } from "express-http-proxy";
import { SpinalNode } from "spinal-env-viewer-graph-service";
import { IBuilding } from "../../interfaces";
export declare function isTryingToDownloadSvf(req: any): boolean;
export declare function _formatBuildingResponse(building: IBuilding): {
    name: string;
    _id: any;
    id: any;
    address: string;
    description: string;
    urlBos: string;
    type: any;
    localisation: import("../../interfaces").ILocation;
};
export declare function getBuildingsAuthorizedToProfile(tokenInfo: any): Promise<any[]>;
export declare function getAppProfileBuildings(tokenInfo: any): Promise<any[]>;
export declare function getUserProfileBuildings(tokenInfo: any): Promise<any[]>;
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
export declare function profileHasAccessToBuilding(profileId: string, buildingId: string, isAppProfile: boolean): Promise<SpinalNode<any>>;
export declare function profileHasAccessToApi(profileId: string, buildingId: string, isAppProfile: boolean): Promise<SpinalNode<any>>;
export declare function _get_method(method: string, statusCode: number): "READ" | "ADD" | "DEL" | "ERROR";
export declare function getProfileIdInTokenInfo(tokenInfo: any): string;
