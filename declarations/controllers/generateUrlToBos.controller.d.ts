import { Controller } from "tsoa";
import * as express from "express";
export declare class GenerateUrlToBosController extends Controller {
    constructor();
    generateUrlToBos(req: express.Request, buildingId: string): Promise<{
        url: string;
    } | {
        message: string;
    }>;
}
