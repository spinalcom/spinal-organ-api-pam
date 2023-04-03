import * as express from "express";
import { SpinalNode } from 'spinal-env-viewer-graph-service';
export declare function getToken(request: express.Request): string;
export declare function profileHasAccessToApi(profile: SpinalNode, apiUrl: string, method: string): Promise<SpinalNode>;
