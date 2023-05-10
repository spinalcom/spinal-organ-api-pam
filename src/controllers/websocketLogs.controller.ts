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
import { Route, Get, Post, Delete, Body, Controller, Tags, Put, Path, UploadedFile, Security, Request } from "tsoa";
import { HTTP_CODES, SECURITY_MESSAGES, SECURITY_NAME } from "../constant";
import WebsocketLogs from "../proxy/websocket/logs/websocketLogs";
import * as express from "express";
import { checkIfItIsAdmin } from "../security/authentication";
import { AuthError } from "../security/AuthError";
@Route("/api/v1/pam")
@Tags("Websocket")
export class WebsocketLogsController extends Controller {

    public constructor() {
        super();
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/websocket/get_logs/{buildingId}")
    public async getWebsocketLogs(@Request() req: express.Request, @Path() buildingId: string): Promise<{ state: string; logs: any; } | { state: string; logs: any; }[] | { message?: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            this.setStatus(HTTP_CODES.OK);
            return WebsocketLogs.getInstance().getSocketLogs(buildingId);
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/websocket/get_logs")
    public async getAllWebsocketLogs(@Request() req: express.Request): Promise<{ state: string; logs: any; } | { state: string; logs: any; }[] | { message?: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            this.setStatus(HTTP_CODES.OK);
            return WebsocketLogs.getInstance().getSocketLogs();
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
}