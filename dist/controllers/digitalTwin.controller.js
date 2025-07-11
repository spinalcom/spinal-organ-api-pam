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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitaltwinController = void 0;
const express = require("express");
const services_1 = require("../services");
const constant_1 = require("../constant");
const tsoa_1 = require("tsoa");
const authentication_1 = require("../security/authentication");
const AuthError_1 = require("../security/AuthError");
const serviceInstance = services_1.DigitalTwinService.getInstance();
let DigitaltwinController = class DigitaltwinController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    async createDigitalTwin(req, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            if (!data.name || !data.name.trim()) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "The file name is mandatory" };
            }
            const graph = await serviceInstance.initDigitalTwin(data.name, data.folderPath);
            this.setStatus(constant_1.HTTP_CODES.CREATED);
            return graph.getId().get();
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
};
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/create_digitaltwin"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DigitaltwinController.prototype, "createDigitalTwin", null);
DigitaltwinController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam"),
    (0, tsoa_1.Tags)("DigitalTwin"),
    __metadata("design:paramtypes", [])
], DigitaltwinController);
exports.DigitaltwinController = DigitaltwinController;
exports.default = new DigitaltwinController();
//# sourceMappingURL=digitalTwin.controller.js.map