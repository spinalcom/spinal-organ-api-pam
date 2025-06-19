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

import { SpinalServiceLog, ILog, WEBSOCKET_STATE, SpinalLog, SEND_EVENT, RECEIVE_EVENT, ALERT_EVENT } from 'spinal-service-pubsub-logs';
import { SpinalGraph, SpinalNode } from 'spinal-env-viewer-graph-service';
import { SpinalQueue } from '../utils/SpinalQueue';
import { PortofolioService } from './portofolio.service';
import { Server } from 'socket.io';

const fileName = 'logs_websocket';

export { SEND_EVENT, RECEIVE_EVENT, ALERT_EVENT };

export default class WebsocketLogsService {
  private static _instance: WebsocketLogsService;
  private _alertTime: number =
    parseInt(process.env.WEBSOCKET_ALERT_TIME) || 60 * 1000;
  private timeoutIds: { [key: string]: any } = {};
  private _directory: spinal.Directory;
  private _spinalQueue: SpinalQueue = new SpinalQueue();
  private _logPromMap: Map<string, SpinalLog> = new Map();
  private _lastSendTime: number;
  private _io: Server;

  private constructor() {
    this._spinalQueue.on('start', () => {
      this._createLogsInGraph();
    });
  }

  public static getInstance(): WebsocketLogsService {
    if (!this._instance) this._instance = new WebsocketLogsService();
    return this._instance;
  }

  public setIo(io: Server) {
    this._io = io;
  }

  public async init(conn: spinal.FileSystem) {
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
  public createLog(building: SpinalNode, type: string, action: string, targetInfo?: { id: string; name: string }, nodeInfo?: { id: string; name: string;[key: string]: string }) {
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
  public async getClientConnected(buildingId: string) {
    const sockets = await (this._io as any)
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
  public async getLogModel(building: SpinalNode): Promise<SpinalLog> {
    const buildingId = building.getId().get();
    if (this._logPromMap.has(buildingId))
      return this._logPromMap.get(buildingId);

    const spinalLog = await SpinalServiceLog.getInstance().getLog(building);
    if (!spinalLog) return;

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
  public async getWebsocketState(building: SpinalNode) {
    const spinalLog = await this.getLogModel(building);
    if (!spinalLog) return { state: WEBSOCKET_STATE.unknow, since: 0 };

    return SpinalServiceLog.getInstance().getWebsocketState(spinalLog);
  }

  /**
   * Retrieves the current log entry for a specific building.
   *
   * @param {SpinalNode} building
   * @return {*} 
   * @memberof WebsocketLogsService
   */
  public async getCurrent(building: SpinalNode) {
    const spinalLog = await this.getLogModel(building);
    return SpinalServiceLog.getInstance().getCurrent(spinalLog);
  }

  /**
   * Retrieves the log data from the last 24 hours for a specific building.
   *
   * @param {SpinalNode} building
   * @return {*} 
   * @memberof WebsocketLogsService
   */
  public async getDataFromLast24Hours(building: SpinalNode) {
    const spinalLog = await this.getLogModel(building);
    if (!spinalLog) return [];
    return SpinalServiceLog.getInstance().getDataFromLast24Hours(spinalLog);
  }

  /**
   * Retrieves the log data from the last specified number of hours for a specific building.
   *
   * @param {SpinalNode} building
   * @param {number} numberOfHours
   * @return {*} 
   * @memberof WebsocketLogsService
   */
  public async getDataFromLastHours(building: SpinalNode, numberOfHours: number) {
    const spinalLog = await this.getLogModel(building);
    if (!spinalLog) return [];
    return SpinalServiceLog.getInstance().getDataFromLastHours(
      spinalLog,
      numberOfHours
    );
  }

  /**
   * Retrieves the log data from yesterday for a specific building.
   *
   * @param {SpinalNode} building
   * @return {*} 
   * @memberof WebsocketLogsService
   */
  public async getDataFromYesterday(building: SpinalNode) {
    const spinalLog = await this.getLogModel(building);
    if (!spinalLog) return [];
    return SpinalServiceLog.getInstance().getDataFromYesterday(spinalLog);
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
  public async getFromIntervalTime(building: SpinalNode, start: string | number | Date, end: string | number | Date) {
    const spinalLog = await this.getLogModel(building);
    if (!spinalLog) return [];
    return SpinalServiceLog.getInstance().getFromIntervalTime(spinalLog, start, end);
  }

  ////////////////////////////////////////////////
  //             PRIVATE                        //
  ////////////////////////////////////////////////

  private _startTimer(building: SpinalNode) {
    const buildingId = building.getId().get();
    this.timeoutIds[buildingId] = setTimeout(() => {
      this._createAlert(building);
      // this._startTimer(building);
    }, this._alertTime);
  }

  private _createAlert(building: SpinalNode) {
    return this._addLogs(building, ALERT_EVENT, ALERT_EVENT);
  }

  private async _addLogs(
    building: SpinalNode,
    logType: string,
    action: string,
    targetInfo?: { id: string; name: string },
    nodeInfo?: { id: string; name: string;[key: string]: string }
  ) {
    const log: ILog = { targetInfo, type: logType, action, nodeInfo };
    this._addToQueue(building, log);
  }

  private _addToQueue(building, log: ILog) {
    this._spinalQueue.addToQueue({ building, log });
  }

  private async _createLogsInGraph() {
    while (!this._spinalQueue.isEmpty()) {
      const { building, log } = this._spinalQueue.dequeue();
      const actualState =
        log.type.toLowerCase() === ALERT_EVENT
          ? WEBSOCKET_STATE.alert
          : WEBSOCKET_STATE.running;

      await SpinalServiceLog.getInstance().pushFromNode(building, log);
      await this._changeBuildingState(building, actualState);
    }
  }

  private async _changeBuildingState(
    building: SpinalNode,
    actualState: WEBSOCKET_STATE
  ): Promise<void> {
    const spinalLog = await this.getLogModel(building);

    return SpinalServiceLog.getInstance().changeWebsocketState(
      spinalLog,
      actualState
    );
  }


}

export { WebsocketLogsService };
