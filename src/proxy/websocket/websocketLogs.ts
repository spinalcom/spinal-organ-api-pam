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

import { Lst, Choice, spinalCore } from "spinal-core-connectorjs";
import * as path from "path";

const fileName = "logs_websocket"

export enum logTypes {
    Alarm = "Alarm",
    Normal = "Normal"
}

export default class WebsocketLogs {
    private static _instance: WebsocketLogs;
    private _websocket: WebSocketState;
    private _lastSendTime: number = Date.now();
    private _alertTime: number = 60 * 1000;
    private timeoutId: any;

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


    public getSocketLogs() {
        return {
            state: this._websocket.state.get(),
            logs: this._websocket.logs?.get() || []
        }
    }


    public webSocketSendData(serverRestart: boolean = false) {
        this._lastSendTime = Date.now();
        clearTimeout(this.timeoutId);
        if (this._websocket.state.get() === logTypes.Alarm) {
            const message = `websocket is now online [${serverRestart ? "restart server" : "websocket send data"}]`;
            console.log(message)
            this._websocket.state.set(logTypes.Normal);
            this._addLogs(message, logTypes.Normal);
        }
        this._startTimer();
    }


    private _startTimer() {
        this.timeoutId = setTimeout(() => {
            this._createAlert();
            this._startTimer();
        }, this._alertTime);
    }

    private _createAlert() {

        if (this._websocket.state.get() === logTypes.Normal) {
            const message = `websocket don't send data since ${new Date(this._lastSendTime).toString()}`
            console.log(message)
            this._websocket.state.set(logTypes.Alarm);
            this._addLogs(message, logTypes.Alarm);
        }
    }


    private _addLogs(message: string, logType: logTypes) {
        const newLog = new LogModel(message, logType);
        this._websocket.logs.push(newLog);
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

    private _createFile(directory: spinal.Directory, fileName: string): WebSocketState {
        const data = new WebSocketState();
        directory.force_add_file(fileName, data, { model_type: "logs" });
        return data;
    }


}

export { WebsocketLogs }


class WebSocketState extends spinal.Model {
    constructor() {
        super();
        this.add_attr({
            id: Date.now(),
            state: new Choice(0, [logTypes.Normal, logTypes.Alarm]),
            logs: new Lst()
        })
    }
}


class LogModel extends spinal.Model {
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