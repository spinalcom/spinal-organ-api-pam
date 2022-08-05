import { SpinalNode } from 'spinal-env-viewer-graph-service';
export interface IAppProfile {
    name: string;
    authorizeApps?: string[];
    unauthorizeApps: string[];
    authorizeApis?: string[];
    unauthorizeApis?: string[];
    authorizeBos?: string[];
    unauthorizeBos?: string[];
    [key: string]: any;
}
export interface IAppProfileRes {
    node: SpinalNode;
    authorizedApps?: SpinalNode[];
    authorizedRoutes?: SpinalNode[];
    authorizedBos?: SpinalNode[];
}
