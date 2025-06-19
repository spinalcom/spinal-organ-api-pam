import { WEBSOCKET_STATE, SpinalLog, SEND_EVENT, RECEIVE_EVENT, ALERT_EVENT } from 'spinal-service-pubsub-logs';
import { SpinalNode } from 'spinal-env-viewer-graph-service';
import { Server } from 'socket.io';
export { SEND_EVENT, RECEIVE_EVENT, ALERT_EVENT };
export default class WebsocketLogsService {
    private static _instance;
    private _alertTime;
    private timeoutIds;
    private _directory;
    private _spinalQueue;
    private _logPromMap;
    private _lastSendTime;
    private _io;
    private constructor();
    static getInstance(): WebsocketLogsService;
    setIo(io: Server): void;
    init(conn: spinal.FileSystem): Promise<void>;
    /**
     * Creates a log entry in the SpinalGraph for a specific building.
     *
     * @param {SpinalNode} building
     * @param {string} type
     * @param {string} action
     * @param {{ id: string; name: string }} [targetInfo]
     * @param {{ id: string; name: string;[key: string]: string }} [nodeInfo]
     * @memberof WebsocketLogsService
     */
    createLog(building: SpinalNode, type: string, action: string, targetInfo?: {
        id: string;
        name: string;
    }, nodeInfo?: {
        id: string;
        name: string;
        [key: string]: string;
    }): void;
    /**
     * Returns the number of clients connected to a specific building's namespace.
     *
     * @param {string} buildingId
     * @return {*}
     * @memberof WebsocketLogsService
     */
    getClientConnected(buildingId: string): Promise<{
        numberOfClientConnected: any;
    }>;
    /**
     * Retrieves the SpinalLog model for a specific building.
     *
     * @param {SpinalNode} building
     * @return {*}  {Promise<SpinalLog>}
     * @memberof WebsocketLogsService
     */
    getLogModel(building: SpinalNode): Promise<SpinalLog>;
    /**
     * Retrieves the current state of the websocket for a specific building.
     *
     * @param {SpinalNode} building
     * @return {*}
     * @memberof WebsocketLogsService
     */
    getWebsocketState(building: SpinalNode): Promise<{
        state: WEBSOCKET_STATE;
        since: number;
    }>;
    /**
     * Retrieves the current log entry for a specific building.
     *
     * @param {SpinalNode} building
     * @return {*}
     * @memberof WebsocketLogsService
     */
    getCurrent(building: SpinalNode): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue>;
    /**
     * Retrieves the log data from the last 24 hours for a specific building.
     *
     * @param {SpinalNode} building
     * @return {*}
     * @memberof WebsocketLogsService
     */
    getDataFromLast24Hours(building: SpinalNode): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[]>;
    /**
     * Retrieves the log data from the last specified number of hours for a specific building.
     *
     * @param {SpinalNode} building
     * @param {number} numberOfHours
     * @return {*}
     * @memberof WebsocketLogsService
     */
    getDataFromLastHours(building: SpinalNode, numberOfHours: number): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[]>;
    /**
     * Retrieves the log data from yesterday for a specific building.
     *
     * @param {SpinalNode} building
     * @return {*}
     * @memberof WebsocketLogsService
     */
    getDataFromYesterday(building: SpinalNode): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[]>;
    /**
     * Retrieves the log data from a specified time interval for a specific building.
     *
     * @param {SpinalNode} building
     * @param {string | number | Date} start
     * @param {string | number | Date} end
     * @return {*}
     * @memberof WebsocketLogsService
     */
    getFromIntervalTime(building: SpinalNode, start: string | number | Date, end: string | number | Date): Promise<import("spinal-service-pubsub-logs").ISpinalDateValue[]>;
    private _startTimer;
    private _createAlert;
    private _addLogs;
    private _addToQueue;
    private _createLogsInGraph;
    private _changeBuildingState;
}
export { WebsocketLogsService };
