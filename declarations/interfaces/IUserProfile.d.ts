import { SpinalNode } from 'spinal-env-viewer-graph-service';
export interface IUserProfile {
    name: string;
    authorizeApps?: string[];
    unauthorizeApps: string[];
    authorizeApis?: string[];
    unauthorizeApis?: string[];
    authorizeBos?: string[];
    unauthorizeBos?: string[];
    [key: string]: any;
}
export interface IUserProfileRes {
    node: SpinalNode;
    authorizedApps?: SpinalNode[];
    authorizedRoutes?: SpinalNode[];
    authorizedBos?: SpinalNode[];
}
