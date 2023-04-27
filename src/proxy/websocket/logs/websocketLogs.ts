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

import { Lst, Choice, spinalCore, Model } from "spinal-core-connectorjs";
import * as path from "path";

const fileName = "logs_websocket"

export enum logTypes {
    Alarm = "Alarm",
    Normal = "Normal"
}

interface IBuilding {
    name: string;
    id: string;
    [key: string]: any;
}

export default class WebsocketLogs {
    private static _instance: WebsocketLogs;
    private _websocket: WebSocketState;
    private _lastSendTime: number = Date.now();
    private _alertTime: number = 60 * 1000;
    private timeoutIds: { [key: string]: any } = {};
    private

    private constructor() { }

    public static getInstance(): WebsocketLogs {
        if (!this._instance) this._instance = new WebsocketLogs();
        return this._instance;
    }

    public init(conn: spinal.FileSystem) {
        return this._loadOrMakeConfigFile(conn).then((data) => {
            this._websocket = data;
            return this._websocket;
        })
    }


    public getSocketLogs(buildingId?: string) {
        if (buildingId) return this._getLogInfo(this._websocket[buildingId])

        const res = [];

        for (const key in this._websocket) {
            const element = this._websocket[key];
            res.push(this._getLogInfo(element));
        }

        return res;
    }


    public webSocketSendData(building: IBuilding, serverRestart: boolean = false) {
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


    private _startTimer(buildingId: string, buildingName: string) {
        this.timeoutIds[buildingId] = setTimeout(() => {
            this._createAlert(buildingId, buildingName);
            this._startTimer(buildingId, buildingName);
        }, this._alertTime);
    }

    private _createAlert(buildingId: string, buildingName: string) {

        if (this._websocket[buildingId].state.get() === logTypes.Normal) {
            const message = `websocket doesn't send data since ${new Date(this._lastSendTime).toString()}`
            console.log([buildingName], message)
            this._websocket[buildingId].state.set(logTypes.Alarm);
            this._addLogs(buildingId, message, logTypes.Alarm);
        }
    }


    private _addLogs(buildingId: string, message: string, logType: logTypes) {
        const newLog = new LogModel(message, logType);
        this._websocket[buildingId].logs.push(newLog);
    }


    private _loadOrMakeConfigFile(connect: spinal.FileSystem): Promise<WebSocketState> {
        return new Promise((resolve, reject) => {
            spinalCore.load(connect, path.resolve(`/etc/logs/${fileName}`),
                (store: spinal.Lst) => resolve(store),
                () => connect.load_or_make_dir("/etc/logs", (directory: spinal.Directory) => {
                    resolve(this._createFile(directory, fileName));
                })
            )
        });
    }

    private _createFile(directory: spinal.Directory, fileName: string): spinal.Model {
        const data = new Model();
        directory.force_add_file(fileName, data, { model_type: "logs" });
        return data;
    }

    private _getLogInfo(websocketState: WebSocketState) {
        return {
            building: websocketState.building?.get(),
            state: websocketState.state?.get(),
            logs: websocketState.logs?.get() || []
        }
    }


}

export { WebsocketLogs }




class WebSocketState extends Model {
    constructor(building: IBuilding) {
        super();
        this.add_attr({
            id: Date.now(),
            building: building,
            state: new Choice(0, [logTypes.Normal, logTypes.Alarm]),
            logs: new Lst()
        })
    }
}


class LogModel extends Model {
    constructor(message: string, type: string = logTypes.Alarm) {
        super();
        this.add_attr({
            date: Date.now(),
            type,
            message
        })
    }
}

spinalCore.register_models([WebSocketState])
spinalCore.register_models([LogModel]);