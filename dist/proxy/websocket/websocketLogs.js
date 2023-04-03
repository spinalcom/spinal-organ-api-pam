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
exports.WebsocketLogs = exports.logTypes = void 0;
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
const path = require("path");
const fileName = "logs_websocket";
var logTypes;
(function (logTypes) {
    logTypes["Alarm"] = "Alarm";
    logTypes["Normal"] = "Normal";
})(logTypes = exports.logTypes || (exports.logTypes = {}));
class WebsocketLogs {
    constructor() {
        this._lastSendTime = Date.now();
        this._alertTime = 60 * 1000;
        this.timeoutIds = {};
    }
    static getInstance() {
        if (!this._instance)
            this._instance = new WebsocketLogs();
        return this._instance;
    }
    init(conn) {
        return this._loadOrMakeConfigFile(conn).then((data) => {
            this._websocket = data;
            return this._websocket;
        });
    }
    getSocketLogs(buildingId) {
        if (buildingId)
            return this._getLogInfo(this._websocket[buildingId]);
        const res = [];
        for (const key in this._websocket) {
            const element = this._websocket[key];
            res.push(this._getLogInfo(element));
        }
        return res;
    }
    webSocketSendData(building, serverRestart = false) {
        this._lastSendTime = Date.now();
        clearTimeout(this.timeoutIds[building.id]);
        if (!this._websocket[building.id]) {
            this._websocket.add_attr({ [building.id]: new WebSocketState(building) });
        }
        const data = this._websocket[building.id];
        if (this._websocket[building.id].state.get() === logTypes.Alarm) {
            const message = `websocket is now online [${serverRestart ? "restart server" : "websocket sends data"}]`;
            console.log([building.name], message);
            data.state.set(logTypes.Normal);
            this._addLogs(building.id, message, logTypes.Normal);
        }
        this._startTimer(building.id, building.name);
    }
    _startTimer(buildingId, buildingName) {
        this.timeoutIds[buildingId] = setTimeout(() => {
            this._createAlert(buildingId, buildingName);
            this._startTimer(buildingId, buildingName);
        }, this._alertTime);
    }
    _createAlert(buildingId, buildingName) {
        if (this._websocket[buildingId].state.get() === logTypes.Normal) {
            const message = `websocket doesn't send data since ${new Date(this._lastSendTime).toString()}`;
            console.log([buildingName], message);
            this._websocket[buildingId].state.set(logTypes.Alarm);
            this._addLogs(buildingId, message, logTypes.Alarm);
        }
    }
    _addLogs(buildingId, message, logType) {
        const newLog = new LogModel(message, logType);
        this._websocket[buildingId].logs.push(newLog);
    }
    _loadOrMakeConfigFile(connect) {
        return new Promise((resolve, reject) => {
            spinal_core_connectorjs_1.spinalCore.load(connect, path.resolve(`/etc/logs/${fileName}`), (store) => resolve(store), () => connect.load_or_make_dir("/etc/logs", (directory) => {
                resolve(this._createFile(directory, fileName));
            }));
        });
    }
    _createFile(directory, fileName) {
        const data = new spinal_core_connectorjs_1.Model();
        directory.force_add_file(fileName, data, { model_type: "logs" });
        return data;
    }
    _getLogInfo(websocketState) {
        var _a, _b, _c;
        return {
            building: (_a = websocketState.building) === null || _a === void 0 ? void 0 : _a.get(),
            state: (_b = websocketState.state) === null || _b === void 0 ? void 0 : _b.get(),
            logs: ((_c = websocketState.logs) === null || _c === void 0 ? void 0 : _c.get()) || []
        };
    }
}
exports.default = WebsocketLogs;
exports.WebsocketLogs = WebsocketLogs;
class WebSocketState extends spinal_core_connectorjs_1.Model {
    constructor(building) {
        super();
        this.add_attr({
            id: Date.now(),
            building: building,
            state: new spinal_core_connectorjs_1.Choice(0, [logTypes.Normal, logTypes.Alarm]),
            logs: new spinal_core_connectorjs_1.Lst()
        });
    }
}
class LogModel extends spinal_core_connectorjs_1.Model {
    constructor(message, type = logTypes.Alarm) {
        super();
        this.add_attr({
            date: Date.now(),
            type,
            message
        });
    }
}
spinal_core_connectorjs_1.spinalCore.register_models([WebSocketState]);
spinal_core_connectorjs_1.spinalCore.register_models([LogModel]);
//# sourceMappingURL=websocketLogs.js.map