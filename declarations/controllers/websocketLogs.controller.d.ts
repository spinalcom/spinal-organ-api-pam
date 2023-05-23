import { Controller } from 'tsoa';
import * as express from 'express';
import { ISpinalDateValue } from 'spinal-service-pubsub-logs';
export declare class WebsocketLogsController extends Controller {
    private _websocketLogService;
    constructor();
    getWebsocketState(req: express.Request, buildingId: string): Promise<{
        state: import("spinal-service-pubsub-logs").WEBSOCKET_STATE;
        since: number;
    } | {
        message: any;
    }>;
    readWebsocketLogs(req: express.Request, buildingId: string, begin: string | number, end: string | number): Promise<ISpinalDateValue[] | {
        message: any;
    }>;
    readCurrentWeekLogs(req: express.Request, buildingId: string): Promise<ISpinalDateValue[] | {
        message: any;
    }>;
    readCurrentYearLogs(req: express.Request, buildingId: string): Promise<ISpinalDateValue[] | {
        message: any;
    }>;
    readLast24hLogs(req: express.Request, buildingId: string): Promise<ISpinalDateValue[] | {
        message: any;
    }>;
}
