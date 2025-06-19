"use strict";
/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketLogsService = exports.ALERT_EVENT = exports.RECEIVE_EVENT = exports.SEND_EVENT = void 0;
const spinal_service_pubsub_logs_1 = require("spinal-service-pubsub-logs");
Object.defineProperty(exports, "SEND_EVENT", { enumerable: true, get: function () { return spinal_service_pubsub_logs_1.SEND_EVENT; } });
Object.defineProperty(exports, "RECEIVE_EVENT", { enumerable: true, get: function () { return spinal_service_pubsub_logs_1.RECEIVE_EVENT; } });
Object.defineProperty(exports, "ALERT_EVENT", { enumerable: true, get: function () { return spinal_service_pubsub_logs_1.ALERT_EVENT; } });
const SpinalQueue_1 = require("../utils/SpinalQueue");
const fileName = 'logs_websocket';
class WebsocketLogsService {
    constructor() {
        this._alertTime = parseInt(process.env.WEBSOCKET_ALERT_TIME) || 60 * 1000;
        this.timeoutIds = {};
        this._spinalQueue = new SpinalQueue_1.SpinalQueue();
        this._logPromMap = new Map();
        this._spinalQueue.on('start', () => {
            this._createLogsInGraph();
        });
    }
    static getInstance() {
        if (!this._instance)
            this._instance = new WebsocketLogsService();
        return this._instance;
    }
    setIo(io) {
        this._io = io;
    }
    async init(conn) {
        // const buildings = await this._getAllBuildings();
        // for (const building of buildings) {
        //   await this.getLogModel(building);
        // }
        // // return this._loadOrMakeConfigFile(conn).then((graph: SpinalGraph) => {
        //   this._graph = graph;
        //   return graph;
        // });
    }
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
    createLog(building, type, action, targetInfo, nodeInfo) {
        const buildingId = building.getId().get();
        this._lastSendTime = Date.now();
        clearTimeout(this.timeoutIds[buildingId]);
        this._addLogs(building, type, action, targetInfo, nodeInfo);
        this._startTimer(building);
    }
    /**
     * Returns the number of clients connected to a specific building's namespace.
     *
     * @param {string} buildingId
     * @return {*}
     * @memberof WebsocketLogsService
     */
    async getClientConnected(buildingId) {
        const sockets = await this._io
            .of(`/building/${buildingId}`)
            .fetchSockets();
        let count = sockets?.length || 0;
        return { numberOfClientConnected: count };
    }
    ///////////////////////////////
    // SpinalLog
    //////////////////////////////
    /**
     * Retrieves the SpinalLog model for a specific building.
     *
     * @param {SpinalNode} building
     * @return {*}  {Promise<SpinalLog>}
     * @memberof WebsocketLogsService
     */
    async getLogModel(building) {
        const buildingId = building.getId().get();
        if (this._logPromMap.has(buildingId))
            return this._logPromMap.get(buildingId);
        const spinalLog = await spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getLog(building);
        if (!spinalLog)
            return;
        this._logPromMap.set(buildingId, spinalLog);
        return spinalLog;
    }
    /**
     * Retrieves the current state of the websocket for a specific building.
     *
     * @param {SpinalNode} building
     * @return {*}
     * @memberof WebsocketLogsService
     */
    async getWebsocketState(building) {
        const spinalLog = await this.getLogModel(building);
        if (!spinalLog)
            return { state: spinal_service_pubsub_logs_1.WEBSOCKET_STATE.unknow, since: 0 };
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getWebsocketState(spinalLog);
    }
    /**
     * Retrieves the current log entry for a specific building.
     *
     * @param {SpinalNode} building
     * @return {*}
     * @memberof WebsocketLogsService
     */
    async getCurrent(building) {
        const spinalLog = await this.getLogModel(building);
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getCurrent(spinalLog);
    }
    /**
     * Retrieves the log data from the last 24 hours for a specific building.
     *
     * @param {SpinalNode} building
     * @return {*}
     * @memberof WebsocketLogsService
     */
    async getDataFromLast24Hours(building) {
        const spinalLog = await this.getLogModel(building);
        if (!spinalLog)
            return [];
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getDataFromLast24Hours(spinalLog);
    }
    /**
     * Retrieves the log data from the last specified number of hours for a specific building.
     *
     * @param {SpinalNode} building
     * @param {number} numberOfHours
     * @return {*}
     * @memberof WebsocketLogsService
     */
    async getDataFromLastHours(building, numberOfHours) {
        const spinalLog = await this.getLogModel(building);
        if (!spinalLog)
            return [];
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getDataFromLastHours(spinalLog, numberOfHours);
    }
    /**
     * Retrieves the log data from yesterday for a specific building.
     *
     * @param {SpinalNode} building
     * @return {*}
     * @memberof WebsocketLogsService
     */
    async getDataFromYesterday(building) {
        const spinalLog = await this.getLogModel(building);
        if (!spinalLog)
            return [];
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getDataFromYesterday(spinalLog);
    }
    /**
     * Retrieves the log data from a specified time interval for a specific building.
     *
     * @param {SpinalNode} building
     * @param {string | number | Date} start
     * @param {string | number | Date} end
     * @return {*}
     * @memberof WebsocketLogsService
     */
    async getFromIntervalTime(building, start, end) {
        const spinalLog = await this.getLogModel(building);
        if (!spinalLog)
            return [];
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getFromIntervalTime(spinalLog, start, end);
    }
    ////////////////////////////////////////////////
    //             PRIVATE                        //
    ////////////////////////////////////////////////
    _startTimer(building) {
        const buildingId = building.getId().get();
        this.timeoutIds[buildingId] = setTimeout(() => {
            this._createAlert(building);
            // this._startTimer(building);
        }, this._alertTime);
    }
    _createAlert(building) {
        return this._addLogs(building, spinal_service_pubsub_logs_1.ALERT_EVENT, spinal_service_pubsub_logs_1.ALERT_EVENT);
    }
    async _addLogs(building, logType, action, targetInfo, nodeInfo) {
        const log = { targetInfo, type: logType, action, nodeInfo };
        this._addToQueue(building, log);
    }
    _addToQueue(building, log) {
        this._spinalQueue.addToQueue({ building, log });
    }
    async _createLogsInGraph() {
        while (!this._spinalQueue.isEmpty()) {
            const { building, log } = this._spinalQueue.dequeue();
            const actualState = log.type.toLowerCase() === spinal_service_pubsub_logs_1.ALERT_EVENT
                ? spinal_service_pubsub_logs_1.WEBSOCKET_STATE.alert
                : spinal_service_pubsub_logs_1.WEBSOCKET_STATE.running;
            await spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().pushFromNode(building, log);
            await this._changeBuildingState(building, actualState);
        }
    }
    async _changeBuildingState(building, actualState) {
        const spinalLog = await this.getLogModel(building);
        return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().changeWebsocketState(spinalLog, actualState);
    }
}
exports.default = WebsocketLogsService;
exports.WebsocketLogsService = WebsocketLogsService;
//# sourceMappingURL=webSocketLogs.service.js.map