import { Request } from 'express';
import * as express from "express";
export declare function getToken(request: express.Request): string;
export declare function checkIfProfileHasAccess(req: Request, profileId: string): Promise<boolean>;
