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
exports.BuildingController = void 0;
const services_1 = require("../services");
const tsoa_1 = require("tsoa");
const constant_1 = require("../constant");
const authentication_1 = require("../security/authentication");
const express = require("express");
const authorization_service_1 = require("../services/authorization.service");
const AuthError_1 = require("../security/AuthError");
const serviceInstance = services_1.BuildingService.getInstance();
let BuildingController = class BuildingController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    getBuildingByIdByPost(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield (0, authentication_1.getProfileNode)(req);
                const node = yield authorization_service_1.default.getInstance().profileHasAccess(profile, id);
                // const node = await serviceInstance.getBuildingById(id);
                if (node) {
                    const data = yield serviceInstance.formatBuilding(node.info.get());
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return data;
                }
                ;
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `no Building found for ${id}` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getBuildingById(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getBuildingByIdByPost(req, id);
        });
    }
    getAllBuildingsApps(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const nodes = (yield serviceInstance.getAllBuildingsApps()) || [];
                const promises = nodes.map(({ node, apps }) => __awaiter(this, void 0, void 0, function* () {
                    return Object.assign(Object.assign({}, (yield serviceInstance.formatBuilding(node.info.get()))), { apps: apps.map(el => el.info.get()) });
                }));
                const data = Promise.all(promises);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return data;
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    deleteBuilding(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                yield serviceInstance.deleteBuilding(id);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return { message: "building deleted" };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    editBuilding(req, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                yield serviceInstance.setLocation(data);
                const node = yield serviceInstance.updateBuilding(id, data);
                if (node) {
                    const data = yield serviceInstance.formatBuildingStructure(node);
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
        });
    }
    addAppToBuilding(req, buildingId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const apps = yield serviceInstance.addAppToBuilding(buildingId, data.applicationId);
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
        });
    }
    getAppsFromBuilding(req, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const apps = yield serviceInstance.getAppsFromBuilding(buildingId);
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
        });
    }
    getAppFromBuilding(req, buildingId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield (0, authentication_1.getProfileNode)(req);
                const app = yield authorization_service_1.default.getInstance().profileHasAccess(profile, appId);
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
        });
    }
    removeAppFromBuilding(req, buildingId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const idsDeleted = yield serviceInstance.removeAppFromBuilding(buildingId, data.applicationId);
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
        });
    }
    buildingHasApp(req, buildingId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const success = yield serviceInstance.buildingHasApp(buildingId, appId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return success;
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.admin)
    addApiToBuilding(req, buildingId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const apis = yield serviceInstance.addApiToBuilding(buildingId, data.apisIds);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    getApisFromBuilding(req, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const apis = yield serviceInstance.getApisFromBuilding(buildingId);
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
        });
    }
    // @Security(SECURITY_NAME.profile)
    getApiFromBuilding(req, buildingId, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield (0, authentication_1.getProfileNode)(req);
                const api = yield authorization_service_1.default.getInstance().profileHasAccess(profile, apiId);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    removeApisFromBuilding(req, buildingId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const idsDeleted = yield serviceInstance.removeApisFromBuilding(buildingId, data.apisIds);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    buildingHasApi(req, buildingId, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const success = yield serviceInstance.buildingHasApi(buildingId, apiId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return success;
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
    (0, tsoa_1.Post)("/get_building/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getBuildingByIdByPost", null);
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
], BuildingController.prototype, "getAllBuildingsApps", null);
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
BuildingController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam"),
    (0, tsoa_1.Tags)("Building"),
    __metadata("design:paramtypes", [])
], BuildingController);
exports.BuildingController = BuildingController;
exports.default = new BuildingController();
//# sourceMappingURL=building.controller.js.map