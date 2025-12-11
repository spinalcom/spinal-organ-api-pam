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
exports.PortofolioController = void 0;
const services_1 = require("../services");
const tsoa_1 = require("tsoa");
const constant_1 = require("../constant");
const express = require("express");
const authentication_1 = require("../security/authentication");
const AuthError_1 = require("../security/AuthError");
const authorization_service_1 = require("../services/authorization.service");
const buildingUtils_1 = require("../utils/buildingUtils");
const buildingServiceInstance = services_1.BuildingService.getInstance();
const portofolioInstance = services_1.PortofolioService.getInstance();
let PortofolioController = class PortofolioController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    async addPortofolio(req, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const { name, appIds, apiIds } = data;
            const res = await portofolioInstance.createPortofolio(name, appIds, apiIds);
            const details = portofolioInstance._formatDetails(res);
            this.setStatus(constant_1.HTTP_CODES.CREATED);
            return details;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async updatePortofolio(req, portofolioId, data, isCompatibleWithBosC) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const res = await portofolioInstance.updatePortofolio(portofolioId, data, isCompatibleWithBosC);
            const details = portofolioInstance._formatDetails(res);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return details;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async renamePortofolio(req, id, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const success = await services_1.PortofolioService.getInstance().renamePortofolio(id, data.name);
            const status = success ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
            const message = success ? "renamed with success" : "Something went wrong, please check your input data";
            this.setStatus(status);
            return { message };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAllPortofolio(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const portofolios = await portofolioInstance.getAllPortofolio();
            this.setStatus(constant_1.HTTP_CODES.OK);
            return portofolios.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getPortofolio(req, id) {
        try {
            const profile = await (0, authentication_1.getProfileNode)(req);
            const portofolio = await authorization_service_1.default.getInstance().profileHasAccessToNode(profile, id);
            if (!portofolio)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            // const portofolio = await portofolioInstance.getPortofolio(id);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return portofolio.info.get();
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getPortofolioDetails(req, id) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const res = await portofolioInstance.getPortofolioDetails(id);
            const details = portofolioInstance._formatDetails(res);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return details;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAllPortofoliosDetails(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const portofolios = await portofolioInstance.getAllPortofoliosDetails();
            const details = portofolios.map((res) => portofolioInstance._formatDetails(res));
            this.setStatus(constant_1.HTTP_CODES.OK);
            return details;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async removePortofolio(req, id) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const success = await portofolioInstance.removePortofolio(id);
            const status = success ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
            const message = success ? "deleted with success" : "Something went wrong, please check your input data";
            this.setStatus(status);
            return { message };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async addBuilding(req, portofolioId, body) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await buildingServiceInstance.linkBuildingToPortofolio(portofolioId, body);
            if (!node) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return (0, buildingUtils_1.formatBuildingStructure)(node);
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getBuilding(req, portofolioId, buildingId) {
        try {
            const profile = await (0, authentication_1.getProfileNode)(req);
            const node = await buildingServiceInstance.getBuildingFromPortofolio(portofolioId, buildingId);
            if (node) {
                const hasAccess = await authorization_service_1.default.getInstance().profileHasAccessToNode(profile, node);
                if (!hasAccess)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const data = await (0, buildingUtils_1.formatBuildingNode)(node);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return data;
            }
            ;
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no Building found for ${buildingId}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAllBuilding(req, portofolioId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await buildingServiceInstance.getAllBuildingsFromPortofolio(portofolioId) || [];
            const promises = nodes.map(el => (0, buildingUtils_1.formatBuildingNode)(el));
            const data = await Promise.all(promises);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return data;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async deleteBuildingFromPortofolio(req, portofolioId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const ids = await portofolioInstance.removeSeveralBuildingsFromPortofolio(portofolioId, data.buildingIds);
            if (!ids || ids.length === 0) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return { message: "building deleted", ids };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async addAppToPortofolio(req, portofolioId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await portofolioInstance.linkSeveralAppsToPortofolio(portofolioId, data.applicationsIds);
            if (!nodes || nodes.length === 0) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something wen wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }
    async getPortofolioApps(req, portofolioId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await portofolioInstance.getPortofolioApps(portofolioId);
            if (!node) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something wen wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return node.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }
    async getAppFromPortofolio(req, portofolioId, applicationId) {
        try {
            const profile = await (0, authentication_1.getProfileNode)(req);
            const node = await authorization_service_1.default.getInstance().profileHasAccessToNode(profile, applicationId);
            // const node = await portofolioInstance.getAppFromPortofolio(portofolioId, applicationId);
            if (!node) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something wen wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return node.info.get();
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }
    async removeAppFromPortofolio(req, portofolioId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const ids = await portofolioInstance.removeSeveralAppsFromPortofolio(portofolioId, data.applicationId);
            if (!ids || ids.length === 0) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return { message: "application removed from portofolio !", ids };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }
    async portofolioHasApp(req, portofolioId, applicationId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const exist = await portofolioInstance.portofolioHasApp(portofolioId, applicationId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return exist ? true : false;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }
    async addApiToPortofolio(req, portofolioId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await portofolioInstance.linkSeveralApisToPortofolio(portofolioId, data.apisIds);
            if (!nodes || nodes.length === 0) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something wen wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }
    async getPortofolioApis(req, portofolioId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await portofolioInstance.getPortofolioApis(portofolioId);
            if (!node) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something wen wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return node.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }
    async getApiFromPortofolio(req, portofolioId, apiId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await portofolioInstance.getApiFromPortofolio(portofolioId, apiId);
            if (!node) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something wen wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return node.info.get();
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }
    async removeApiFromPortofolio(req, portofolioId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const ids = await portofolioInstance.removeSeveralApisFromPortofolio(portofolioId, data.apisIds);
            if (!ids || ids.length === 0) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "Something went wrong, please check your input data" };
            }
            this.setStatus(constant_1.HTTP_CODES.OK);
            return { message: "route removed from portofolio !", ids };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }
    async portofolioHasApi(req, portofolioId, apiId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const exist = await portofolioInstance.portofolioHasApi(portofolioId, apiId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return exist ? true : false;
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            ;
            return { message: error.message };
        }
    }
};
exports.PortofolioController = PortofolioController;
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/add_portofolio"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "addPortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)("/update_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Boolean]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "updatePortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)("/rename_portofolio/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "renamePortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_all_portofolio"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getAllPortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_portofolio/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getPortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_portofolio_details/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getPortofolioDetails", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_all_portofolios_details"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getAllPortofoliosDetails", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/remove_portofolio/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "removePortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/add_building_to_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "addBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_building_from_portofolio/{portofolioId}/{buildingId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_all_buildings_from_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getAllBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/remove_building_from_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "deleteBuildingFromPortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/add_app_to_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "addAppToPortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_apps_from_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getPortofolioApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_app_from_portofolio/{portofolioId}/{applicationId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getAppFromPortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/remove_app_from_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "removeAppFromPortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/portofolio_has_app/{portofolioId}//{applicationId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "portofolioHasApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/add_apiRoute_to_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "addApiToPortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_apisRoute_from_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getPortofolioApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_apiRoute_from_portofolio/{portofolioId}/{apiId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getApiFromPortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/remove_apiRoute_from_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "removeApiFromPortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/portofolio_has_apiRoute/{portofolioId}/{apiId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "portofolioHasApi", null);
exports.PortofolioController = PortofolioController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam"),
    (0, tsoa_1.Tags)("Portofolio"),
    __metadata("design:paramtypes", [])
], PortofolioController);
exports.default = new PortofolioController();
//# sourceMappingURL=portofolio.controller.js.map