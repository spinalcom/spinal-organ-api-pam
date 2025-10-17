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
exports.AuthController = void 0;
const services_1 = require("../services");
const express = require("express");
const constant_1 = require("../constant");
const tsoa_1 = require("tsoa");
const authentication_1 = require("../security/authentication");
const AuthError_1 = require("../security/AuthError");
const serviceInstance = services_1.AuthentificationService.getInstance();
let AuthController = class AuthController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    // @Security(SECURITY_NAME.all)
    async authenticate(credential) {
        try {
            const { code, data } = await serviceInstance.authenticate(credential);
            this.setStatus(code);
            return data;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async consumeCodeUnique(data) {
        try {
            const resp = await serviceInstance.consumeCodeUnique(data.code);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return resp;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async registerPamInAuthPlatform(req, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const registeredData = await serviceInstance.registerPamInAuthPlatform(data.urlAdmin, data.clientId, data.clientSecret);
            await serviceInstance.sendPamInfoToAuth();
            this.setStatus(constant_1.HTTP_CODES.OK);
            return registeredData;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async updatePamTokenInAuthPlatform(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const data = await serviceInstance.updatePamTokenInAuthPlatform();
            this.setStatus(constant_1.HTTP_CODES.OK);
            return data;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getBosToAdminCredential(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const bosCredential = await serviceInstance.getPamCredentials();
            if (bosCredential) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return bosCredential;
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: "No admin registered" };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async deleteAdmin(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const deleted = await serviceInstance.disconnectPamFromAuthPlateform();
            const status = deleted ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
            const message = deleted ? "deleted with success" : "something went wrong, please check your input data";
            this.setStatus(status);
            return { message };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAdminCredential(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const adminCredential = await serviceInstance.getAuthCredentials();
            if (adminCredential) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return adminCredential;
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: "No admin registered" };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async syncDataToAdmin(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin) {
                const isAuthPlatform = await (0, authentication_1.checkIfItIsAuthPlateform)(req);
                if (!isAuthPlatform)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            }
            const resp = await serviceInstance.sendPamInfoToAuth(true);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return { message: "updated" };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async tokenIsValid(data) {
        try {
            const token = await services_1.TokenService.getInstance().tokenIsValid(data.token);
            const code = token ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.UNAUTHORIZED;
            this.setStatus(code);
            return {
                code,
                data: token
            };
        }
        catch (error) {
            this.setStatus(constant_1.HTTP_CODES.UNAUTHORIZED);
            return {
                code: constant_1.HTTP_CODES.UNAUTHORIZED,
                message: "Token is expired or invalid"
            };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, tsoa_1.Post)("/auth"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticate", null);
__decorate([
    (0, tsoa_1.Post)("/consume/code"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "consumeCodeUnique", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/register_admin"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerPamInAuthPlatform", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/update_platform_token"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updatePamTokenInAuthPlatform", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_pam_to_auth_credential"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getBosToAdminCredential", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/delete_admin"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteAdmin", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_admin_to_pam_credential"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAdminCredential", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)("/update_data"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "syncDataToAdmin", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/getTokenData"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "tokenIsValid", null);
exports.AuthController = AuthController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam"),
    (0, tsoa_1.Tags)("Auth"),
    __metadata("design:paramtypes", [])
], AuthController);
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map