import { WEBSOCKET_STATE, SpinalLog } from 'spinal-service-pubsub-logs';
import { SpinalNode } from 'spinal-env-viewer-graph-service';
export default class WebsocketLogsService {
    private static _instance;
    private _alertTime;
    private timeoutIds;
    private _directory;
    private _spinalQueue;
    private _logPromMap;
    private _lastSendTime;
    private constructor();
    static getInstance(): WebsocketLogsService;
    init(conn: spinal.FileSystem): Promise<void>;
    createLog(building: SpinalNode, type: string, action: string, targetInfo?: {
        id: string;
        name: string;
    }, nodeInfo?: {
        id: string;
        name: string;
        [key: string]: string;
    }): void;
    getLogModel(building: SpinalNode): Promise<SpinalLog>;
    getWebsocketState(building: SpinalNode): Promise<{
        state: WEBSOCKET_STATE;
        since: number;
    }>;
    getCurrent(building: SpinalNode): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue>;
    getDataFromLast24Hours(building: SpinalNode): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[]>;
    getDataFromLastHours(building: SpinalNode, numberOfHours: number): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[]>;
    getDataFromYesterday(building: SpinalNode): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[]>;
    getFromIntervalTime(building: SpinalNode, start: string | number | Date, end: string | number | Date): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[]>;
    private _startTimer;
    private _createAlert;
    private _addLogs;
    private _addToQueue;
    private _createLogsInGraph;
    private _changeBuildingState;
    private _loadOrMakeConfigFile;
    private _getDirectory;
    private _fileExistInDirectory;
    private _loadFile;
    private _getAllBuildings;
}
export { WebsocketLogsService };
