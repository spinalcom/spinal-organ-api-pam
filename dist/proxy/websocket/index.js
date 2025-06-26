"use strict";
/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
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
exports.WebSocketServer = void 0;
const constant_1 = require("../../constant");
const services_1 = require("../../services");
const utils_1 = require("../bos/utils");
const socket_io_1 = require("socket.io");
const spinal_service_pubsub_logs_1 = require("spinal-service-pubsub-logs");
const uuid_1 = require("uuid");
const SocketClient = require("socket.io-client");
const logInstance = services_1.WebsocketLogsService.getInstance();
class WebSocketServer {
    //   private _reInitLogData = lodash.debounce(
    //     (building: SpinalNode, receiverId?: string, restart?) =>
    //       logInstance.webSocketSendData(building, receiverId, restart),
    //     2000
    //   );
    constructor(server) {
        this._clientToServer = new Map();
        this._serverToClient = new Map();
        this._buildingMap = new Map();
        this._sessionToUserInfo = new Map();
        this._io = new socket_io_1.Server(server);
        logInstance.setIo(this._io);
    }
    async initialize() {
        this._initNameSpace();
        this._initMiddleware();
    }
    _initNameSpace() {
        this._io.on("connection", (socket) => {
            console.log(socket.id, "is connected");
        });
        this._io.of(/.*/).use(async (socket, next) => {
            let err;
            try {
                // let client = this._serverToClient.get((<any>socket).sessionID || socket.id);
                // if (client && client.connected) {
                //     this._associateClientAndServer(client, socket);
                // } else {
                const tokenInfo = await this._getToken(socket);
                const building = await this._getBuilding(socket);
                const access = await this._checkIfUserHasAccess(tokenInfo, building);
                const client = await this._createClient(building, socket, tokenInfo);
                this._associateClientAndServer(client, socket);
                // }
            }
            catch (error) {
                err = error;
            }
            next(err);
        });
    }
    _initMiddleware() {
        this._io.use((socket, next) => {
            next();
        });
    }
    async _getToken(socket) {
        const { header, auth, query } = socket.handshake;
        const token = auth?.token || header?.token || query?.token;
        if (!token)
            throw new Error(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
        const tokenInfo = await services_1.TokenService.getInstance().tokenIsValid(token);
        if (!tokenInfo)
            throw new Error(constant_1.SECURITY_MESSAGES.INVALID_TOKEN);
        return tokenInfo;
    }
    async _getBuilding(socket) {
        const _url = socket.nsp.name;
        const index = _url.split("/").findIndex((el) => el.toLowerCase() === "building");
        const buildingId = index !== -1 ? _url.split("/")[index + 1] : undefined;
        if (!buildingId)
            throw new Error("Invalid building id");
        const building = await services_1.BuildingService.getInstance().getBuildingById(buildingId);
        if (!building)
            throw new Error(`No building found for ${buildingId}`);
        this._buildingMap.set(buildingId, building);
        return building;
    }
    async _checkIfUserHasAccess(tokenInfo, building) {
        const isAppProfile = tokenInfo.profile.appProfileBosConfigId ? true : false;
        const profileId = tokenInfo.profile.appProfileBosConfigId || tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId;
        const access = await (0, utils_1.profileHasAccessToBuilding)(profileId, building.getId().get(), isAppProfile);
        if (!access)
            throw new Error(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
        return access;
    }
    _createClient(building, socket, tokenInfo) {
        // const sessionId = tokenInfo.userInfo?.id;
        const sessionId = (0, uuid_1.v4)();
        const token = tokenInfo.token;
        if (sessionId)
            this._sessionToUserInfo.set(sessionId, tokenInfo.userInfo);
        return new Promise((resolve, reject) => {
            const api_url = building.info.apiUrl.get();
            const client = SocketClient(api_url, {
                auth: { token, sessionId, building: building?.info?.get() },
                transports: ["websocket"],
                reconnection: false,
            });
            client.on("connect", () => {
                console.log(tokenInfo?.userInfo?.name || tokenInfo?.userInfo?.id, "is connected");
            });
            client.on("session_created", async (id) => {
                this._sessionToUserInfo.set(id, tokenInfo.userInfo);
                socket.emit("session_created", id);
                client["sessionId"] = id;
                socket["sessionId"] = id;
                await this._saveConnectionLog(client);
                resolve(client);
            });
            client.on("connect_error", (err) => reject(err));
        });
    }
    _associateClientAndServer(pamToBosSocket, clientToPamSocket) {
        this._serverToClient.set(clientToPamSocket.sessionId || clientToPamSocket.id, pamToBosSocket);
        this._clientToServer.set(pamToBosSocket.sessionId || pamToBosSocket.id, clientToPamSocket);
        this._listenConnectionAndDisconnection(pamToBosSocket, clientToPamSocket);
        this._listenAllEvent(pamToBosSocket, clientToPamSocket);
    }
    _listenAllEvent(pamToBosSocket, clientToPamSocket) {
        pamToBosSocket.onAny(async (eventName, ...data) => {
            const emitter = this._clientToServer.get(pamToBosSocket.sessionId || pamToBosSocket.id);
            if (emitter) {
                const emitterInfo = this._sessionToUserInfo.get(emitter.sessionId);
                await this._createWebsocketLog(pamToBosSocket, eventName, data[0], emitterInfo, services_1.SEND_EVENT);
                emitter.emit(eventName, ...data);
                const name = emitterInfo.userName || emitter.sessionId;
                console.log(`receive "${eventName}" request from bos and send it to client [${name}]`, data);
            }
        });
        clientToPamSocket.onAny(async (eventName, ...data) => {
            const emitter = this._serverToClient.get(clientToPamSocket.sessionId || clientToPamSocket.id);
            if (emitter) {
                const emitterInfo = this._sessionToUserInfo.get(emitter.sessionId);
                await this._createWebsocketLog(emitter, eventName, data[0], emitterInfo, services_1.RECEIVE_EVENT);
                emitter.emit(eventName, ...data);
                const name = emitterInfo.userName || emitter.sessionId;
                console.log(`receive request from client [${name}] and send it to bos`);
            }
        });
    }
    _listenConnectionAndDisconnection(pamToBosSocket, clientToPamSocket) {
        // pamToBosSocket.on('connect', async () => {
        //   const emitter: any = this._clientToServer.get(
        //     (<any>pamToBosSocket).sessionId || pamToBosSocket.id
        //   );
        //   // if (emitter) {
        //   //   const emitterInfo = this._sessionToUserInfo.get(emitter.sessionId);
        //   //   // console.log('save connection log');
        //   //   // await this._createWebsocketLog(
        //   //   //   pamToBosSocket,
        //   //   //   CONNECTION_EVENT,
        //   //   //   undefined,
        //   //   //   emitterInfo,
        //   //   //   CONNECTION_EVENT
        //   //   // );
        //   // }
        //   // // const emitter = this._clientToServer.get((<any>client).sessionID || client.id);
        //   // // if (emitter) emitter.emit(eventName, ...data);
        // });
        pamToBosSocket.on("disconnect", async (reason) => {
            const emitter = this._clientToServer.get(pamToBosSocket.sessionId || pamToBosSocket.id);
            if (emitter) {
                const emitterInfo = this._sessionToUserInfo.get(emitter.sessionId);
                console.log(emitterInfo.userName || emitter.sessionId, "is disconnected", reason);
                emitter.disconnect();
            }
        });
        // clientToPamSocket.on('connect', async () => {
        //   const emitterInfo = this._sessionToUserInfo.get(
        //     (<any>clientToPamSocket).sessionId
        //   );
        //   console.log(emitterInfo.userName, 'is connected');
        //   await this._createWebsocketLog(
        //     pamToBosSocket,
        //     CONNECTION_EVENT,
        //     undefined,
        //     emitterInfo,
        //     CONNECTION_EVENT
        //   );
        //   // const emitter = this._serverToClient.get((<any>server).sessionId || server.id);
        //   // if (emitter) emitter.emit(eventName, ...data);
        // });
        clientToPamSocket.on("disconnect", async (reason) => {
            const emitter = this._serverToClient.get(clientToPamSocket.sessionId || clientToPamSocket.id);
            if (emitter) {
                const emitterInfo = this._sessionToUserInfo.get(emitter.sessionId);
                console.log(emitterInfo.userName || emitter.sessionId, "is disconnected", reason);
                emitter.disconnect();
                await this._createWebsocketLog(emitter, spinal_service_pubsub_logs_1.DISCONNECTION_EVENT, undefined, emitterInfo, spinal_service_pubsub_logs_1.DISCONNECTION_EVENT);
            }
        });
    }
    _createWebsocketLog(socket, eventName, dataSent, userInfo, type) {
        const buildingId = socket.auth.building.id;
        const building = this._buildingMap.get(buildingId);
        const targetInfo = { id: userInfo.id, name: userInfo.userName };
        // let type, action;
        // type = sendItToClient ? SEND_EVENT : RECEIVE_EVENT;
        let action;
        const nodeInfo = dataSent?.data?.node;
        const event = dataSent?.data?.event?.type || eventName;
        if (type === services_1.RECEIVE_EVENT || type === services_1.SEND_EVENT)
            action = `${type}_${event}_event`;
        else
            action = type;
        return logInstance.createLog(building, type, action, targetInfo, nodeInfo);
        // return logInstance.createLog(building, type, status, targetInfo);
    }
    async _saveConnectionLog(socket) {
        const emitterInfo = this._sessionToUserInfo.get(socket.sessionId);
        //   // console.log('save connection log');
        await this._createWebsocketLog(socket, spinal_service_pubsub_logs_1.CONNECTION_EVENT, undefined, emitterInfo, spinal_service_pubsub_logs_1.CONNECTION_EVENT);
    }
}
exports.default = WebSocketServer;
exports.WebSocketServer = WebSocketServer;
//# sourceMappingURL=index.js.map