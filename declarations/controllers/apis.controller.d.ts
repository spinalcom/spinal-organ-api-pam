import { Controller } from "tsoa";
import { IApiRoute } from "../interfaces";
export declare class APIController extends Controller {
    constructor();
    /**
     * Adds a route to the list of available routes
     */
    createApiRoute(data: IApiRoute): Promise<IApiRoute | {
        message: string;
    }>;
    updateApiRoute(data: IApiRoute, id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getApiRouteById(id: string): Promise<IApiRoute | {
        message: string;
    }>;
    getAllApiRoute(): Promise<IApiRoute[] | {
        message: string;
    }>;
    deleteApiRoute(id: any): Promise<{
        message: string;
    }>;
    uploadSwaggerFile(file: any): Promise<IApiRoute[] | {
        message: string;
    }>;
}
declare const _default: APIController;
export default _default;
