export declare enum logTypes {
    Alarm = "Alarm",
    Normal = "Normal"
}
export default class WebsocketLogs {
    private static _instance;
    private _websocket;
    private _lastSendTime;
    private _alertTime;
    private timeoutId;
    private constructor();
    static getInstance(): WebsocketLogs;
    init(conn: spinal.FileSystem): Promise<WebSocketState>;
    getSocketLogs(): {
        state: any;
        logs: any;
    };
    webSocketSendData(serverRestart?: boolean): void;
    private _startTimer;
    private _createAlert;
    private _addLogs;
    private _loadOrMakeConfigFile;
    private _createFile;
}
export { WebsocketLogs };
declare class WebSocketState extends spinal.Model {
    constructor();
}
