/// <reference types="node" />
import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApiRoute } from "../interfaces";
export declare class APIService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): APIService;
    init(): Promise<SpinalContext>;
    createApiRoute(routeInfo: IApiRoute, parentType: string): Promise<SpinalNode>;
    updateApiRoute(routeId: string, newValue: IApiRoute, parentType: any): Promise<SpinalNode<any>>;
    getApiRouteById(routeId: string, parentType: string): Promise<void | SpinalNode>;
    getApiRouteByRoute(apiRoute: IApiRoute, parentType: string): Promise<void | SpinalNode>;
    getAllApiRoute(parentType: string): Promise<SpinalNode[]>;
    deleteApiRoute(routeId: string, parentType: any): Promise<string>;
    uploadSwaggerFile(buffer: Buffer, parentType: any): Promise<any[]>;
    private _getOrGetRoutesGroup;
    private _formatSwaggerFile;
    private _getMethod;
    private _getTags;
    private _getScope;
    private _readBuffer;
    private _formatRoute;
}
