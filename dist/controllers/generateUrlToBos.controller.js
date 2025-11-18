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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateUrlToBosController = void 0;
const tsoa_1 = require("tsoa");
const constant_1 = require("../constant");
const express = require("express");
const authentication_1 = require("../security/authentication");
const authorization_service_1 = require("../services/authorization.service");
const services_1 = require("../services");
const utils_1 = require("../security/utils");
let GenerateUrlToBosController = class GenerateUrlToBosController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    async generateUrlToBos(req, buildingId) {
        try {
            const profile = await (0, authentication_1.getProfileNode)(req);
            const buildingNode = await authorization_service_1.default.getInstance().profileHasAccessToNode(profile, buildingId);
            if (!buildingNode) {
                this.setStatus(constant_1.HTTP_CODES.UNAUTHORIZED);
                return { message: "You don't have access to this building" };
            }
            const token = (0, utils_1.getToken)(req);
            const url = await services_1.AuthentificationService.getInstance().createRedirectLinkToBosConfig(buildingNode.info.get(), token);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return { url };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
};
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/generate_url_to_bos/{buildingId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], GenerateUrlToBosController.prototype, "generateUrlToBos", null);
GenerateUrlToBosController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam"),
    (0, tsoa_1.Tags)("Auth"),
    __metadata("design:paramtypes", [])
], GenerateUrlToBosController);
exports.GenerateUrlToBosController = GenerateUrlToBosController;
//# sourceMappingURL=generateUrlToBos.controller.js.map