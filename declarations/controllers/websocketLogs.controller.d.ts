import { Controller } from "tsoa";
export declare class WebsocketLogsController extends Controller {
    constructor();
    getWebsocketLogs(): Promise<{
        state: string;
        logs: any;
    } | {
        message?: string;
    }>;
}
