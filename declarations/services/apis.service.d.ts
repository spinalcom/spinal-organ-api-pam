/// <reference types="node" />
import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApiRoute } from "../interfaces";
export declare class APIService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): APIService;
    init(): Promise<SpinalContext>;
    createApiRoute(route: IApiRoute): Promise<SpinalNode>;
    updateApiRoute(routeId: string, newValue: IApiRoute): Promise<SpinalNode<any>>;
    getApiRouteById(routeId: string): Promise<void | SpinalNode>;
    getApiRouteByRoute(apiRoute: IApiRoute): Promise<void | SpinalNode>;
    getAllApiRoute(): Promise<SpinalNode[]>;
    deleteApiRoute(routeId: string): Promise<string>;
    uploadSwaggerFile(buffer: Buffer): Promise<any[]>;
    private _formatSwaggerFile;
    private _getMethod;
    private _getTags;
    private _getScope;
    private _readBuffer;
}
