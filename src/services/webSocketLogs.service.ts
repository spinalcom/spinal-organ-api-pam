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

import {
  SpinalServiceLog,
  ILog,
  WEBSOCKET_STATE,
  SpinalLog,
} from 'spinal-service-pubsub-logs';

import {SpinalGraph, SpinalNode} from 'spinal-env-viewer-graph-service';
import {SpinalQueue} from '../utils/SpinalQueue';
import {PortofolioService} from './portofolio.service';
import {Server} from 'socket.io';

const fileName = 'logs_websocket';

export default class WebsocketLogsService {
  private static _instance: WebsocketLogsService;
  private _alertTime: number =
    parseInt(process.env.WEBSOCKET_ALERT_TIME) || 60 * 1000;
  private timeoutIds: {[key: string]: any} = {};
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

  public createLog(
    building: SpinalNode,
    type: string,
    action: string,
    targetInfo?: {id: string; name: string},
    nodeInfo?: {id: string; name: string; [key: string]: string}
  ) {
    const buildingId = building.getId().get();
    this._lastSendTime = Date.now();

    clearTimeout(this.timeoutIds[buildingId]);

    this._addLogs(building, type, action, targetInfo, nodeInfo);

    this._startTimer(building);
  }

  public async getClientConnected(buildingId: string) {
    const sockets = await (this._io as any)
      .of(`/building/${buildingId}`)
      .fetchSockets();

    let count = sockets?.length || 0;

    // for (const socket of sockets) {
    //   const id = socket.auth?.building?.id;
    //   if (buildingId === id) count++;
    // }

    return {numberOfClientConnected: count};
  }

  ///////////////////////////////
  // SpinalLog
  //////////////////////////////

  public async getLogModel(building: SpinalNode): Promise<SpinalLog> {
    const buildingId = building.getId().get();
    if (this._logPromMap.has(buildingId))
      return this._logPromMap.get(buildingId);

    const spinalLog = await SpinalServiceLog.getInstance().getLog(building);
    if (!spinalLog) return;

    this._logPromMap.set(buildingId, spinalLog);
    return spinalLog;
  }

  public async getWebsocketState(building: SpinalNode) {
    const spinalLog = await this.getLogModel(building);
    if (!spinalLog) return {state: WEBSOCKET_STATE.unknow, since: 0};

    return SpinalServiceLog.getInstance().getWebsocketState(spinalLog);
  }

  public async getCurrent(building: SpinalNode) {
    const spinalLog = await this.getLogModel(building);
    return SpinalServiceLog.getInstance().getCurrent(spinalLog);
  }

  public async getDataFromLast24Hours(building: SpinalNode) {
    const spinalLog = await this.getLogModel(building);
    if (!spinalLog) return [];
    return SpinalServiceLog.getInstance().getDataFromLast24Hours(spinalLog);
  }

  public async getDataFromLastHours(
    building: SpinalNode,
    numberOfHours: number
  ) {
    const spinalLog = await this.getLogModel(building);
    if (!spinalLog) return [];
    return SpinalServiceLog.getInstance().getDataFromLastHours(
      spinalLog,
      numberOfHours
    );
  }

  public async getDataFromYesterday(building: SpinalNode) {
    const spinalLog = await this.getLogModel(building);
    if (!spinalLog) return [];
    return SpinalServiceLog.getInstance().getDataFromYesterday(spinalLog);
  }

  public async getFromIntervalTime(
    building: SpinalNode,
    start: string | number | Date,
    end: string | number | Date
  ) {
    const spinalLog = await this.getLogModel(building);
    if (!spinalLog) return [];
    return SpinalServiceLog.getInstance().getFromIntervalTime(
      spinalLog,
      start,
      end
    );
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
    //  if (this._websocket[buildingId].state.get() === logTypes.Normal) {
    //    const message = `websocket doesn't send data since ${new Date(
    //      this._lastSendTime
    //    ).toString()}`;
    //    console.log([buildingName], message);
    //    this._websocket[buildingId].state.set(logTypes.Alarm);
    //    this._addLogs(buildingId, message, logTypes.Alarm);
    //  }
    return this._addLogs(building, 'Alert', 'alert');
  }

  private async _addLogs(
    building: SpinalNode,
    logType: string,
    action: string,
    targetInfo?: {id: string; name: string},
    nodeInfo?: {id: string; name: string; [key: string]: string}
  ) {
    const log: ILog = {targetInfo, type: logType, action, nodeInfo};
    console.log('log', log);
    this._addToQueue(building, log);
  }

  private _addToQueue(building, log: ILog) {
    this._spinalQueue.addToQueue({building, log});
  }

  private async _createLogsInGraph() {
    while (!this._spinalQueue.isEmpty()) {
      const {building, log} = this._spinalQueue.dequeue();
      const actualState =
        log.type.toLowerCase() === 'alert'
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

  private _loadOrMakeConfigFile(
    connect: spinal.FileSystem
  ): Promise<SpinalGraph> {
    return new Promise(async (resolve, reject) => {
      const directory = await this._getDirectory(connect);
      let file = this._fileExistInDirectory(directory, fileName);
      let graph;

      if (file) graph = await this._loadFile(file);

      if (!(graph instanceof SpinalGraph)) {
        file.name.set(`old_${file.name.get()}`);
        graph = new SpinalGraph();
        directory.force_add_file(fileName, graph, {model_type: 'logs'});
      }

      return resolve(graph);
    });
  }

  private _getDirectory(connect: spinal.FileSystem): Promise<spinal.Directory> {
    return new Promise((resolve, reject) => {
      if (this._directory) return resolve(this._directory);

      connect.load_or_make_dir('/etc/logs', (directory: spinal.Directory) => {
        this._directory = directory;
        resolve(directory);
      });
    });
  }

  private _fileExistInDirectory(
    directory: spinal.Directory,
    fileName: string
  ): spinal.File {
    for (let i = 0; i < directory.length; i++) {
      const element = directory[i];
      if (element.name?.get() === fileName) return element;
    }
  }

  private _loadFile(file: spinal.File): Promise<SpinalGraph> {
    return new Promise((resolve, reject) => {
      file.load((graph) => resolve(graph));
    });
  }

  private async _getAllBuildings(): Promise<SpinalNode[]> {
    const portofolioInstance = PortofolioService.getInstance();
    const portofolios = await portofolioInstance.getAllPortofolio();

    return portofolios.reduce(
      async (prom: Promise<SpinalNode[]>, portofolio: SpinalNode) => {
        let list = await prom;
        const buildings = await portofolioInstance.getPortofolioBuildings(
          portofolio
        );
        list.push(...buildings);
        return list;
      },
      Promise.resolve([])
    );
  }
}

export {WebsocketLogsService};
