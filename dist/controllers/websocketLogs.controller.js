"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketLogsController = void 0;
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
const tsoa_1 = require("tsoa");
const constant_1 = require("../constant");
const webSocketLogs_service_1 = require("../services/webSocketLogs.service");
const express = require("express");
const authentication_1 = require("../security/authentication");
const AuthError_1 = require("../security/AuthError");
const services_1 = require("../services");
const spinal_service_pubsub_logs_1 = require("spinal-service-pubsub-logs");
const buildingInstance = services_1.BuildingService.getInstance();
let WebsocketLogsController = class WebsocketLogsController extends tsoa_1.Controller {
    constructor() {
        super();
        this._websocketLogService = webSocketLogs_service_1.WebsocketLogsService.getInstance();
    }
    getWebsocketState(req, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const building = yield buildingInstance.getBuildingById(buildingId);
                if (!building) {
                    throw {
                        code: constant_1.HTTP_CODES.NOT_FOUND,
                        message: `No building found for ${buildingId}`,
                    };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                return this._websocketLogService.getWebsocketState(building);
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getNbClientConnected(req, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const building = yield buildingInstance.getBuildingById(buildingId);
                if (!building) {
                    throw {
                        code: constant_1.HTTP_CODES.NOT_FOUND,
                        message: `No building found for ${buildingId}`,
                    };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                return this._websocketLogService.getClientConnected(buildingId);
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    readWebsocketLogs(req, buildingId, begin, end) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const building = yield buildingInstance.getBuildingById(buildingId);
                if (!building) {
                    throw {
                        code: constant_1.HTTP_CODES.NOT_FOUND,
                        message: `No building found for ${buildingId}`,
                    };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                const t = yield this._websocketLogService.getFromIntervalTime(building, begin, end);
                console.log(t);
                return t;
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    readCurrentWeekLogs(req, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const building = yield buildingInstance.getBuildingById(buildingId);
                if (!building) {
                    throw {
                        code: constant_1.HTTP_CODES.NOT_FOUND,
                        message: `No building found for ${buildingId}`,
                    };
                }
                const { end, start } = spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getDateFromLastDays(7);
                return this._websocketLogService.getFromIntervalTime(building, start, end);
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    readCurrentYearLogs(req, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const building = yield buildingInstance.getBuildingById(buildingId);
                if (!building) {
                    throw {
                        code: constant_1.HTTP_CODES.NOT_FOUND,
                        message: `No building found for ${buildingId}`,
                    };
                }
                const { end, start } = spinal_service_pubsub_logs_1.SpinalServiceLog.getInstance().getDateFromLastDays(365);
                return this._websocketLogService.getFromIntervalTime(building, start, end);
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    readLast24hLogs(req, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const building = yield buildingInstance.getBuildingById(buildingId);
                if (!building) {
                    throw {
                        code: constant_1.HTTP_CODES.NOT_FOUND,
                        message: `No building found for ${buildingId}`,
                    };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                return yield this._websocketLogService.getDataFromLast24Hours(building);
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/websocket/{buildingId}/get_websocket_state'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebsocketLogsController.prototype, "getWebsocketState", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/websocket/{buildingId}/get_client_connected_count'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebsocketLogsController.prototype, "getNbClientConnected", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/websocket_log/{buildingId}/read/{begin}/{end}'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], WebsocketLogsController.prototype, "readWebsocketLogs", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/websocket_log/{buildingId}/read_current_week'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebsocketLogsController.prototype, "readCurrentWeekLogs", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/websocket_log/{buildingId}/read_current_year'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebsocketLogsController.prototype, "readCurrentYearLogs", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)('/websocket_log/{buildingId}/read_from_last_24h'),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebsocketLogsController.prototype, "readLast24hLogs", null);
WebsocketLogsController = __decorate([
    (0, tsoa_1.Route)('/api/v1/pam'),
    (0, tsoa_1.Tags)('Websocket Logs'),
    __metadata("design:paramtypes", [])
], WebsocketLogsController);
exports.WebsocketLogsController = WebsocketLogsController;
//# sourceMappingURL=websocketLogs.controller.js.map