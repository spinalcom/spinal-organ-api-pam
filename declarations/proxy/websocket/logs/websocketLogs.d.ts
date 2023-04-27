import { Model } from "spinal-core-connectorjs";
export declare enum logTypes {
    Alarm = "Alarm",
    Normal = "Normal"
}
interface IBuilding {
    name: string;
    id: string;
    [key: string]: any;
}
export default class WebsocketLogs {
    private static _instance;
    private _websocket;
    private _lastSendTime;
    private _alertTime;
    private timeoutIds;
    private: any;
    private constructor();
    static getInstance(): WebsocketLogs;
    init(conn: spinal.FileSystem): Promise<WebSocketState>;
    getSocketLogs(buildingId?: string): any[] | {
        building: any;
        state: any;
        logs: any;
    };
    webSocketSendData(building: IBuilding, serverRestart?: boolean): void;
    private _startTimer;
    private _createAlert;
    private _addLogs;
    private _loadOrMakeConfigFile;
    private _createFile;
    private _getLogInfo;
}
export { WebsocketLogs };
declare class WebSocketState extends Model {
    constructor(building: IBuilding);
}
