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
import { Route, Get, Post, Delete, Body, Controller, Tags, Put, Path, UploadedFile, Security } from "tsoa";
import { HTTP_CODES, SECURITY_NAME } from "../constant";
import WebsocketLogs from "../proxy/websocket/websocketLogs";

@Route("/api/v1/pam")
@Tags("Websocket")
export class WebsocketLogsController extends Controller {

    public constructor() {
        super();
    }

    @Security(SECURITY_NAME.admin)
    @Get("/websocket/get_logs")
    public async getWebsocketLogs(): Promise<{ state: string; logs: any; } | { message?: string }> {
        try {
            this.setStatus(HTTP_CODES.OK);
            return WebsocketLogs.getInstance().getSocketLogs();
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
}