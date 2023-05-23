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
  Route,
  Get,
  Post,
  Delete,
  Body,
  Controller,
  Tags,
  Put,
  Path,
  UploadedFile,
  Security,
  Request,
} from 'tsoa';
import {HTTP_CODES, SECURITY_MESSAGES, SECURITY_NAME} from '../constant';
import {WebsocketLogsService} from '../services/webSocketLogs.service';
import * as express from 'express';
import {checkIfItIsAdmin} from '../security/authentication';
import {AuthError} from '../security/AuthError';
import {BuildingService} from '../services';
import {ISpinalDateValue, SpinalServiceLog} from 'spinal-service-pubsub-logs';
const buildingInstance = BuildingService.getInstance();

@Route('/api/v1/pam')
@Tags('Websocket Logs')
export class WebsocketLogsController extends Controller {
  private _websocketLogService: WebsocketLogsService =
    WebsocketLogsService.getInstance();

  public constructor() {
    super();
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/websocket/{buildingId}/get_websocket_state')
  public async getWebsocketState(
    @Request() req: express.Request,
    @Path() buildingId: string
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
      const building = await buildingInstance.getBuildingById(buildingId);
      if (!building) {
        throw {
          code: HTTP_CODES.NOT_FOUND,
          message: `No building foudn for ${buildingId}`,
        };
      }

      this.setStatus(HTTP_CODES.OK);
      return this._websocketLogService.getWebsocketState(building);
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return {message: error.message};
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/websocket_log/{buildingId}/read/{begin}/{end}')
  public async readWebsocketLogs(
    @Request() req: express.Request,
    @Path() buildingId: string,
    @Path() begin: string | number,
    @Path() end: string | number
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

      const building = await buildingInstance.getBuildingById(buildingId);
      if (!building) {
        throw {
          code: HTTP_CODES.NOT_FOUND,
          message: `No building found for ${buildingId}`,
        };
      }

      this.setStatus(HTTP_CODES.OK);
      const t = await this._websocketLogService.getFromIntervalTime(
        building,
        begin,
        end
      );
      console.log(t);
      return t;
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return {message: error.message};
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/websocket_log/{buildingId}/read_current_week')
  public async readCurrentWeekLogs(
    @Request() req: express.Request,
    @Path() buildingId: string
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
      const building = await buildingInstance.getBuildingById(buildingId);
      if (!building) {
        throw {
          code: HTTP_CODES.NOT_FOUND,
          message: `No building found for ${buildingId}`,
        };
      }
      const {end, start} =
        SpinalServiceLog.getInstance().getDateFromLastDays(7);
      return this._websocketLogService.getFromIntervalTime(
        building,
        start,
        end
      );
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return {message: error.message};
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/websocket_log/{buildingId}/read_current_year')
  public async readCurrentYearLogs(
    @Request() req: express.Request,
    @Path() buildingId: string
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
      const building = await buildingInstance.getBuildingById(buildingId);
      if (!building) {
        throw {
          code: HTTP_CODES.NOT_FOUND,
          message: `No building found for ${buildingId}`,
        };
      }

      const {end, start} =
        SpinalServiceLog.getInstance().getDateFromLastDays(365);
      return this._websocketLogService.getFromIntervalTime(
        building,
        start,
        end
      );
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return {message: error.message};
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/websocket_log/{buildingId}/read_from_last_24h')
  public async readLast24hLogs(
    @Request() req: express.Request,
    @Path() buildingId: string
  ) {
    try {
      const isAdmin = await checkIfItIsAdmin(req);
      if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
      const building = await buildingInstance.getBuildingById(buildingId);
      if (!building) {
        throw {
          code: HTTP_CODES.NOT_FOUND,
          message: `No building found for ${buildingId}`,
        };
      }
      this.setStatus(HTTP_CODES.OK);
      return await this._websocketLogService.getDataFromLast24Hours(building);
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return {message: error.message};
    }
  }

  /*
  @Security(SECURITY_NAME.bearerAuth)
  @Get('/websocket/get_logs/{buildingId}')
  public async getWebsocketLogs(
    @Request() req: express.Request,
    @Path() buildingId: string
  ): Promise<
    | {state: string; logs: any}
    | {state: string; logs: any}[]
    | {message?: string}
  > {
    try {
      //   const isAdmin = await checkIfItIsAdmin(req);
      //   if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
      //   this.setStatus(HTTP_CODES.OK);
      //   return WebsocketLogsService.getInstance().getSocketLogs(buildingId);
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return {message: error.message};
    }
  }

  @Security(SECURITY_NAME.bearerAuth)
  @Get('/websocket/get_logs')
  public async getAllWebsocketLogs(
    @Request() req: express.Request
  ): Promise<
    | {state: string; logs: any}
    | {state: string; logs: any}[]
    | {message?: string}
  > {
    try {
      //   const isAdmin = await checkIfItIsAdmin(req);
      //   if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
      //   this.setStatus(HTTP_CODES.OK);
      //   return WebsocketLogs.getInstance().getSocketLogs();
    } catch (error) {
      this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
      return {message: error.message};
    }
  }
  */
}
