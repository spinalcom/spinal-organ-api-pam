import { Controller } from "tsoa";
import { IApiRoute } from "../interfaces";
import * as express from "express";
export declare class APIController extends Controller {
    constructor();
    createPortofolioApiRoute(req: express.Request, data: IApiRoute): Promise<IApiRoute | {
        message: string;
    }>;
    updatePortofolioApiRoute(req: express.Request, data: IApiRoute, id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getPortofolioApiRouteById(req: express.Request, id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getAllPortofolioApiRoute(req: express.Request): Promise<IApiRoute[] | {
        message: string;
    }>;
    deletePortofolioApiRoute(req: express.Request, id: any): Promise<{
        message: string;
    }>;
    uploadPortofolioSwaggerFile(req: express.Request, file: any): Promise<IApiRoute[] | {
        message: string;
    }>;
    createBosApiRoute(req: express.Request, data: IApiRoute): Promise<IApiRoute | {
        message: string;
    }>;
    updateBosApiRoute(req: express.Request, data: IApiRoute, id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getBosApiRouteById(req: express.Request, id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getAllBosApiRoute(req: express.Request): Promise<IApiRoute[] | {
        message: string;
    }>;
    deleteBosApiRoute(req: express.Request, id: any): Promise<{
        message: string;
    }>;
    uploadBosSwaggerFile(req: express.Request, file: any): Promise<IApiRoute[] | {
        message: string;
    }>;
}
declare const _default: APIController;
export default _default;
