import { Controller } from "tsoa";
import * as express from "express";
export declare class WebsocketLogsController extends Controller {
    constructor();
    getWebsocketLogs(req: express.Request, buildingId: string): Promise<{
        state: string;
        logs: any;
    } | {
        state: string;
        logs: any;
    }[] | {
        message?: string;
    }>;
    getAllWebsocketLogs(req: express.Request): Promise<{
        state: string;
        logs: any;
    } | {
        state: string;
        logs: any;
    }[] | {
        message?: string;
    }>;
}
