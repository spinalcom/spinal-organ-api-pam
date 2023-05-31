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

import {NextFunction} from 'express';
import {Server as HttpServer} from 'http';
import {SpinalNode} from 'spinal-env-viewer-graph-service';
import {SECURITY_MESSAGES} from '../../constant';
import {
  WebsocketLogsService,
  AuthentificationService,
  BuildingService,
  TokenService,
  SEND_EVENT,
  RECEIVE_EVENT,
} from '../../services';
import {profileHasAccessToBuilding} from '../bos/utils';
import {Server, Socket} from 'socket.io';
const SocketClient = require('socket.io-client');

const logInstance = WebsocketLogsService.getInstance();

export default class WebSocketServer {
  private _io: Server;
  private _clientToServer: Map<string, Socket> = new Map();
  private _serverToClient: Map<string, Socket> = new Map();
  private _buildingMap: Map<string, SpinalNode> = new Map();
  private _sessionToUserInfo: Map<string, any> = new Map();

  //   private _reInitLogData = lodash.debounce(
  //     (building: SpinalNode, receiverId?: string, restart?) =>
  //       logInstance.webSocketSendData(building, receiverId, restart),
  //     2000
  //   );

  constructor(server: HttpServer) {
    this._io = new Server(server);
    logInstance.setIo(this._io);
  }

  public async init(): Promise<void> {
    this._initNameSpace();
    this._initMiddleware();
  }

  private _initNameSpace() {
    -this._io.of(/.*/).use(async (socket: Socket, next: NextFunction) => {
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
      } catch (error) {
        err = error;
      }

      next(err);
    });
  }

  private _initMiddleware() {
    this._io.use((socket: Socket, next: NextFunction) => {
      next();
    });
  }

  private async _getToken(socket: Socket) {
    const {header, auth, query} = <any>socket.handshake;
    const token = auth?.token || header?.token || query?.token;
    if (!token) throw new Error(SECURITY_MESSAGES.INVALID_TOKEN);

    const tokenInfo: any = await TokenService.getInstance().tokenIsValid(token);
    if (!tokenInfo) throw new Error(SECURITY_MESSAGES.INVALID_TOKEN);
    return tokenInfo;
  }

  private async _getBuilding(socket: Socket): Promise<SpinalNode> {
    const _url = socket.nsp.name;
    const index = _url
      .split('/')
      .findIndex((el) => el.toLowerCase() === 'building');
    const buildingId = index !== -1 ? _url.split('/')[index + 1] : undefined;

    if (!buildingId) throw new Error('Invalid building id');

    const building = await BuildingService.getInstance().getBuildingById(
      buildingId
    );
    if (!building) throw new Error(`No building found for ${buildingId}`);

    this._buildingMap.set(buildingId, building);
    return building;
  }

  private async _checkIfUserHasAccess(tokenInfo: any, building: SpinalNode) {
    const isAppProfile = tokenInfo.profile.appProfileBosConfigId ? true : false;
    const profileId =
      tokenInfo.profile.appProfileBosConfigId ||
      tokenInfo.profile.userProfileBosConfigId ||
      tokenInfo.profile.profileId;
    const access = await profileHasAccessToBuilding(
      profileId,
      building.getId().get(),
      isAppProfile
    );
    if (!access) throw new Error(SECURITY_MESSAGES.UNAUTHORIZED);

    return access;
  }

  private _createClient(
    building: SpinalNode,
    socket: Socket,
    tokenInfo: any
  ): Promise<Socket> {
    const sessionId = tokenInfo.userInfo?.id;
    const token = tokenInfo.token;

    if (sessionId) this._sessionToUserInfo.set(sessionId, tokenInfo.userInfo);

    return new Promise((resolve, reject) => {
      const api_url = building.info.apiUrl.get();
      const client = SocketClient(api_url, {
        auth: {token, sessionId, building: building?.info?.get()},
        transports: ['websocket'],
      });
      client.on('session_created', (id) => {
        socket.emit('session_created', id);
        client['sessionId'] = id;
        socket['sessionId'] = id;
        resolve(client);
      });

      client.on('connect_error', (err) => reject(err));
    });
  }

  private _associateClientAndServer(
    pamToBosSocket: Socket,
    clientToPamSocket: Socket
  ) {
    this._serverToClient.set(
      (<any>clientToPamSocket).sessionId || clientToPamSocket.id,
      pamToBosSocket
    );
    this._clientToServer.set(
      (<any>pamToBosSocket).sessionId || pamToBosSocket.id,
      clientToPamSocket
    );

    this._listenConnectionAndDisconnection(pamToBosSocket, clientToPamSocket);
    this._listenAllEvent(pamToBosSocket, clientToPamSocket);
  }

  private _listenAllEvent(pamToBosSocket: Socket, clientToPamSocket: Socket) {
    pamToBosSocket.onAny(async (eventName, ...data) => {
      const emitter: any = this._clientToServer.get(
        (<any>pamToBosSocket).sessionId || pamToBosSocket.id
      );
      if (emitter) {
        const emitterInfo = this._sessionToUserInfo.get(emitter.sessionId);

        emitter.emit(eventName, ...data);

        const name = emitterInfo.userName || emitter.sessionId;
        console.log(
          `receive "${eventName}" request from bos and send it to client [${name}]`,
          data
        );

        await this._createWebsocketLog(
          pamToBosSocket,
          eventName,
          data[0],
          emitterInfo,
          true
        );
      }
    });

    clientToPamSocket.onAny(async (eventName, ...data) => {
      const emitter: any = this._serverToClient.get(
        (<any>clientToPamSocket).sessionId || clientToPamSocket.id
      );

      if (emitter) {
        const emitterInfo = this._sessionToUserInfo.get(emitter.sessionId);
        emitter.emit(eventName, ...data);

        const name = emitterInfo.userName || emitter.sessionId;
        console.log(`receive request from client [${name}] and send it to bos`);

        await this._createWebsocketLog(
          emitter,
          eventName,
          data[0],
          emitterInfo,
          false
        );
      }
    });
  }

  private _listenConnectionAndDisconnection(
    pamToBosSocket: Socket,
    clientToPamSocket: Socket
  ) {
    pamToBosSocket.on('connect', () => {
      console.log((<any>pamToBosSocket).sessionId, 'is connected');

      // const emitter = this._clientToServer.get((<any>client).sessionID || client.id);
      // if (emitter) emitter.emit(eventName, ...data);
    });

    pamToBosSocket.on('disconnect', (reason) => {
      // console.log((<any>pamToBosSocket).sessionId || pamToBosSocket.id, "is disconnected")
      const emitter = this._clientToServer.get(
        (<any>pamToBosSocket).sessionId || pamToBosSocket.id
      );
      if (emitter) emitter.disconnect();
    });

    clientToPamSocket.on('connect', () => {
      console.log((<any>clientToPamSocket).sessionId, 'is connected');
      // const emitter = this._serverToClient.get((<any>server).sessionId || server.id);
      // if (emitter) emitter.emit(eventName, ...data);
    });

    clientToPamSocket.on('disconnect', (reson) => {
      const emitter = this._serverToClient.get(
        (<any>clientToPamSocket).sessionId || clientToPamSocket.id
      );
      if (emitter) emitter.disconnect();
    });
  }

  private _createWebsocketLog(
    socket: Socket,
    eventName: string,
    dataSent: any,
    userInfo: any,
    sendItToClient: boolean = false
  ) {
    const buildingId = (socket as any).auth.building.id;
    const building = this._buildingMap.get(buildingId);
    const targetInfo = {id: userInfo.id, name: userInfo.userName};
    let type, action;

    type = sendItToClient ? SEND_EVENT : RECEIVE_EVENT;

    const nodeInfo = dataSent?.data?.node;
    const event = dataSent?.data?.event?.name || eventName;

    action = `${type}_${event}_event`;

    return logInstance.createLog(building, type, action, targetInfo, nodeInfo);
    // return logInstance.createLog(building, type, status, targetInfo);
  }
}

export {WebSocketServer};
