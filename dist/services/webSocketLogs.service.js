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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketLogsService = exports.ALERT_EVENT = exports.RECEIVE_EVENT = exports.SEND_EVENT = void 0;
const spinal_service_pubsub_logs_1 = require("spinal-service-pubsub-logs");
Object.defineProperty(exports, "SEND_EVENT", { enumerable: true, get: function () { return spinal_service_pubsub_logs_1.SEND_EVENT; } });
Object.defineProperty(exports, "RECEIVE_EVENT", { enumerable: true, get: function () { return spinal_service_pubsub_logs_1.RECEIVE_EVENT; } });
Object.defineProperty(exports, "ALERT_EVENT", { enumerable: true, get: function () { return spinal_service_pubsub_logs_1.ALERT_EVENT; } });
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const SpinalQueue_1 = require("../utils/SpinalQueue");
const portofolio_service_1 = require("./portofolio.service");
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
    init(conn) {
        return __awaiter(this, void 0, void 0, function* () {
            // const buildings = await this._getAllBuildings();
            // for (const building of buildings) {
            //   await this.getLogModel(building);
            // }
            // // return this._loadOrMakeConfigFile(conn).then((graph: SpinalGraph) => {
            //   this._graph = graph;
            //   return graph;
            // });
        });
    }
    createLog(building, type, action, targetInfo, nodeInfo) {
        const buildingId = building.getId().get();
        this._lastSendTime = Date.now();
        clearTimeout(this.timeoutIds[buildingId]);
        this._addLogs(building, type, action, targetInfo, nodeInfo);
        this._startTimer(building);
    }
    getClientConnected(buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sockets = yield this._io
                .of(`/building/${buildingId}`)
                .fetchSockets();
            let count = (sockets === null || sockets === void 0 ? void 0 : sockets.length) || 0;
            // for (const socket of sockets) {
            //   const id = socket.auth?.building?.id;
            //   if (buildingId === id) count++;
            // }
            return { numberOfClientConnected: count };
        });
    }
    ///////////////////////////////
    // SpinalLog
    //////////////////////////////
    getLogModel(building) {
        return __awaiter(this, void 0, void 0, function* () {
            const buildingId = building.getId().get();
            if (this._logPromMap.has(buildingId))
                return this._logPromMap.get(buildingId);
            const spinalLog = yield spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getLog(building);
            if (!spinalLog)
                return;
            this._logPromMap.set(buildingId, spinalLog);
            return spinalLog;
        });
    }
    getWebsocketState(building) {
        return __awaiter(this, void 0, void 0, function* () {
            const spinalLog = yield this.getLogModel(building);
            if (!spinalLog)
                return { state: spinal_service_pubsub_logs_1.WEBSOCKET_STATE.unknow, since: 0 };
            return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getWebsocketState(spinalLog);
        });
    }
    getCurrent(building) {
        return __awaiter(this, void 0, void 0, function* () {
            const spinalLog = yield this.getLogModel(building);
            return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getCurrent(spinalLog);
        });
    }
    getDataFromLast24Hours(building) {
        return __awaiter(this, void 0, void 0, function* () {
            const spinalLog = yield this.getLogModel(building);
            if (!spinalLog)
                return [];
            return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getDataFromLast24Hours(spinalLog);
        });
    }
    getDataFromLastHours(building, numberOfHours) {
        return __awaiter(this, void 0, void 0, function* () {
            const spinalLog = yield this.getLogModel(building);
            if (!spinalLog)
                return [];
            return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getDataFromLastHours(spinalLog, numberOfHours);
        });
    }
    getDataFromYesterday(building) {
        return __awaiter(this, void 0, void 0, function* () {
            const spinalLog = yield this.getLogModel(building);
            if (!spinalLog)
                return [];
            return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getDataFromYesterday(spinalLog);
        });
    }
    getFromIntervalTime(building, start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const spinalLog = yield this.getLogModel(building);
            if (!spinalLog)
                return [];
            return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getFromIntervalTime(spinalLog, start, end);
        });
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
        //  if (this._websocket[buildingId].state.get() === logTypes.Normal) {
        //    const message = `websocket doesn't send data since ${new Date(
        //      this._lastSendTime
        //    ).toString()}`;
        //    console.log([buildingName], message);
        //    this._websocket[buildingId].state.set(logTypes.Alarm);
        //    this._addLogs(buildingId, message, logTypes.Alarm);
        //  }
        return this._addLogs(building, spinal_service_pubsub_logs_1.ALERT_EVENT, spinal_service_pubsub_logs_1.ALERT_EVENT);
    }
    _addLogs(building, logType, action, targetInfo, nodeInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = { targetInfo, type: logType, action, nodeInfo };
            this._addToQueue(building, log);
        });
    }
    _addToQueue(building, log) {
        this._spinalQueue.addToQueue({ building, log });
    }
    _createLogsInGraph() {
        return __awaiter(this, void 0, void 0, function* () {
            while (!this._spinalQueue.isEmpty()) {
                const { building, log } = this._spinalQueue.dequeue();
                const actualState = log.type.toLowerCase() === spinal_service_pubsub_logs_1.ALERT_EVENT
                    ? spinal_service_pubsub_logs_1.WEBSOCKET_STATE.alert
                    : spinal_service_pubsub_logs_1.WEBSOCKET_STATE.running;
                yield spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().pushFromNode(building, log);
                yield this._changeBuildingState(building, actualState);
            }
        });
    }
    _changeBuildingState(building, actualState) {
        return __awaiter(this, void 0, void 0, function* () {
            const spinalLog = yield this.getLogModel(building);
            return spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().changeWebsocketState(spinalLog, actualState);
        });
    }
    _loadOrMakeConfigFile(connect) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const directory = yield this._getDirectory(connect);
            let file = this._fileExistInDirectory(directory, fileName);
            let graph;
            if (file)
                graph = yield this._loadFile(file);
            if (!(graph instanceof spinal_env_viewer_graph_service_1.SpinalGraph)) {
                file.name.set(`old_${file.name.get()}`);
                graph = new spinal_env_viewer_graph_service_1.SpinalGraph();
                directory.force_add_file(fileName, graph, { model_type: 'logs' });
            }
            return resolve(graph);
        }));
    }
    _getDirectory(connect) {
        return new Promise((resolve, reject) => {
            if (this._directory)
                return resolve(this._directory);
            connect.load_or_make_dir('/etc/logs', (directory) => {
                this._directory = directory;
                resolve(directory);
            });
        });
    }
    _fileExistInDirectory(directory, fileName) {
        var _a;
        for (let i = 0; i < directory.length; i++) {
            const element = directory[i];
            if (((_a = element.name) === null || _a === void 0 ? void 0 : _a.get()) === fileName)
                return element;
        }
    }
    _loadFile(file) {
        return new Promise((resolve, reject) => {
            file.load((graph) => resolve(graph));
        });
    }
    _getAllBuildings() {
        return __awaiter(this, void 0, void 0, function* () {
            const portofolioInstance = portofolio_service_1.PortofolioService.getInstance();
            const portofolios = yield portofolioInstance.getAllPortofolio();
            return portofolios.reduce((prom, portofolio) => __awaiter(this, void 0, void 0, function* () {
                let list = yield prom;
                const buildings = yield portofolioInstance.getPortofolioBuildings(portofolio);
                list.push(...buildings);
                return list;
            }), Promise.resolve([]));
        });
    }
}
exports.default = WebsocketLogsService;
exports.WebsocketLogsService = WebsocketLogsService;
//# sourceMappingURL=webSocketLogs.service.js.map