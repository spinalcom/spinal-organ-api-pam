/// <reference types="node" />
import { Server as HttpServer } from "http";
export default class WebSocketServer {
    private _io;
    private _clientToServer;
    private _serverToClient;
    constructor(server: HttpServer);
    init(): Promise<void>;
    private _initNameSpace;
    private _initMiddleware;
    private _getToken;
    private _getBuilding;
    private _checkIfUserHasAccess;
    private _createClient;
    private _associateClientAndServer;
    private _listenAllEvent;
    private _listenConnectionAndDisconnection;
}
export { WebSocketServer };
