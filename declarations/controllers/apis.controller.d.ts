import { Controller } from "tsoa";
import { IApiRoute } from "../interfaces";
export declare class APIController extends Controller {
    constructor();
    createPortofolioApiRoute(data: IApiRoute): Promise<IApiRoute | {
        message: string;
    }>;
    updatePortofolioApiRoute(data: IApiRoute, id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getPortofolioApiRouteById(id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getAllPortofolioApiRoute(): Promise<IApiRoute[] | {
        message: string;
    }>;
    deletePortofolioApiRoute(id: any): Promise<{
        message: string;
    }>;
    uploadPortofolioSwaggerFile(file: any): Promise<IApiRoute[] | {
        message: string;
    }>;
    createBosApiRoute(data: IApiRoute): Promise<IApiRoute | {
        message: string;
    }>;
    updateBosApiRoute(data: IApiRoute, id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getBosApiRouteById(id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getAllBosApiRoute(): Promise<IApiRoute[] | {
        message: string;
    }>;
    deleteBosApiRoute(id: any): Promise<{
        message: string;
    }>;
    uploadBosSwaggerFile(file: any): Promise<IApiRoute[] | {
        message: string;
    }>;
}
declare const _default: APIController;
export default _default;
