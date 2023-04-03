import * as express from "express";
import { SpinalNode } from "spinal-env-viewer-graph-service";
export declare function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any>;
export declare function checkIfItIsAdmin(request: express.Request): Promise<boolean>;
export declare function getProfileId(request: express.Request): Promise<string>;
export declare function getProfileNode(req: express.Request): Promise<SpinalNode>;
export declare function checkAndGetTokenInfo(request: express.Request): Promise<any>;
