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
exports.BuildingController = void 0;
const services_1 = require("../services");
const tsoa_1 = require("tsoa");
const constant_1 = require("../constant");
const authentication_1 = require("../security/authentication");
const express = require("express");
const authorization_service_1 = require("../services/authorization.service");
const AuthError_1 = require("../security/AuthError");
const buildingUtils_1 = require("../utils/buildingUtils");
const serviceInstance = services_1.BuildingService.getInstance();
let BuildingController = class BuildingController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    async getBuildingByIdUsingPostMethod(req, id) {
        try {
            const profile = await (0, authentication_1.getProfileNode)(req);
            const buildingNode = await authorization_service_1.default.getInstance().profileHasAccessToNode(profile, id);
            if (!buildingNode) {
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `no Building found for ${id}` };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return (0, buildingUtils_1.formatBuildingNode)(buildingNode);
        }
        catch (error) {
            this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getBuildingById(req, id) {
        return this.getBuildingByIdUsingPostMethod(req, id);
    }
    async getAllBuildingsAndTheirApps(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.getAllBuildingsAndTheirApps() || [];
            const promises = nodes.map(async ({ buildingNode, apps }) => {
                const buildingFormatted = (0, buildingUtils_1.formatBuildingNode)(buildingNode);
                return {
                    ...buildingFormatted,
                    apps: apps.map(el => el.info.get())
                };
            });
            this.setStatus(constant_1.HTTP_CODES.OK);
            return Promise.all(promises);
        }
        catch (error) {
            this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async deleteBuilding(req, id) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            await serviceInstance.deleteBuildingById(id);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return { message: "building deleted" };
        }
        catch (error) {
            this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async editBuilding(req, id, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            // await serviceInstance.set(data);
            const node = await serviceInstance.updateBuilding(id, data);
            if (node) {
                const data = await (0, buildingUtils_1.formatBuildingStructure)(node);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return data;
            }
            ;
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no building found for ${id}` };
        }
        catch (error) {
            this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async addAppToBuilding(req, buildingId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const apps = await serviceInstance.linkApplicationToBuilding(buildingId, data.applicationId);
            if (!apps || apps.length === 0) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return apps.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAppsFromBuilding(req, buildingId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const apps = await serviceInstance.getAppsLinkedToBuilding(buildingId);
            if (!apps) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return apps.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAppFromBuilding(req, buildingId, appId) {
        try {
            const profile = await (0, authentication_1.getProfileNode)(req);
            const app = await authorization_service_1.default.getInstance().profileHasAccessToNode(profile, appId);
            // const app = await serviceInstance.getAppFromBuilding(buildingId, appId);
            if (!app) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return app.info.get();
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async removeAppFromBuilding(req, buildingId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const idsDeleted = await serviceInstance.removeAppFromBuilding(buildingId, data.applicationId);
            if (!idsDeleted || idsDeleted.length === 0) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return { message: "application removed with success !", ids: idsDeleted };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async buildingHasApp(req, buildingId, appId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const success = await serviceInstance.buildingHasApp(buildingId, appId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return success;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    // @Security(SECURITY_NAME.admin)
    async addApiToBuilding(req, buildingId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const apis = await serviceInstance.linkApiToBuilding(buildingId, data.apisIds);
            if (!apis || apis.length === 0) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return apis.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    // @Security(SECURITY_NAME.admin)
    async getApisFromBuilding(req, buildingId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const apis = await serviceInstance.getApisFromBuilding(buildingId);
            if (!apis) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return apis.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    // @Security(SECURITY_NAME.profile)
    async getApiFromBuilding(req, buildingId, apiId) {
        try {
            const profile = await (0, authentication_1.getProfileNode)(req);
            const api = await authorization_service_1.default.getInstance().profileHasAccessToNode(profile, apiId);
            // const api = await serviceInstance.getApiFromBuilding(buildingId, apiId);
            if (!api) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return api.info.get();
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    // @Security(SECURITY_NAME.admin)
    async removeApisFromBuilding(req, buildingId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const idsDeleted = await serviceInstance.removeApisFromBuilding(buildingId, data.apisIds);
            if (!idsDeleted || idsDeleted.length === 0) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return { message: "application removed with success !", ids: idsDeleted };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    // @Security(SECURITY_NAME.admin)
    async buildingHasApi(req, buildingId, apiId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const success = await serviceInstance.buildingHasApi(buildingId, apiId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return success;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
};
exports.BuildingController = BuildingController;
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/get_building/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getBuildingByIdUsingPostMethod", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_building/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getBuildingById", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_all_buildings_apps"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getAllBuildingsAndTheirApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/delete_building/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "deleteBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)("/edit_building/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "editBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/add_app_to_building/{buildingId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "addAppToBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_apps_from_building/{buildingId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getAppsFromBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_app_from_building/{buildingId}/{appId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getAppFromBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/remove_app_from_building/{buildingId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "removeAppFromBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/building_has_app/{buildingId}/{appId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "buildingHasApp", null);
__decorate([
    (0, tsoa_1.Post)("/add_apiRoute_to_building/{buildingId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "addApiToBuilding", null);
__decorate([
    (0, tsoa_1.Get)("/get_apisRoute_from_building/{buildingId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getApisFromBuilding", null);
__decorate([
    (0, tsoa_1.Get)("/get_apiRoute_from_building/{buildingId}/{apiId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getApiFromBuilding", null);
__decorate([
    (0, tsoa_1.Delete)("/remove_apiRoute_from_building/{buildingId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "removeApisFromBuilding", null);
__decorate([
    (0, tsoa_1.Get)("/building_has_apiRoute/{buildingId}/{apiId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "buildingHasApi", null);
exports.BuildingController = BuildingController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam"),
    (0, tsoa_1.Tags)("Building"),
    __metadata("design:paramtypes", [])
], BuildingController);
exports.default = new BuildingController();
//# sourceMappingURL=building.controller.js.map