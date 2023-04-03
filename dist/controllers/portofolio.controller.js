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
exports.PortofolioController = void 0;
const services_1 = require("../services");
const tsoa_1 = require("tsoa");
const constant_1 = require("../constant");
const express = require("express");
const authentication_1 = require("../security/authentication");
const AuthError_1 = require("../security/AuthError");
const authorization_service_1 = require("../services/authorization.service");
const serviceInstance = services_1.BuildingService.getInstance();
const portofolioInstance = services_1.PortofolioService.getInstance();
let PortofolioController = class PortofolioController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    // @Security(SECURITY_NAME.admin)
    addPortofolio(req, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const { name, appIds, apiIds } = data;
                const res = yield portofolioInstance.addPortofolio(name, appIds, apiIds);
                const details = portofolioInstance._formatDetails(res);
                this.setStatus(constant_1.HTTP_CODES.CREATED);
                return details;
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.admin)
    updatePortofolio(req, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const res = yield portofolioInstance.updateProtofolio(portofolioId, data);
                const details = portofolioInstance._formatDetails(res);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return details;
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.admin)
    renamePortofolio(req, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const success = yield services_1.PortofolioService.getInstance().renamePortofolio(id, data.name);
                const status = success ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
                const message = success ? "renamed with success" : "Something went wrong, please check your input data";
                this.setStatus(status);
                return { message };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.admin)
    getAllPortofolio(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const portofolios = yield portofolioInstance.getAllPortofolio();
                this.setStatus(constant_1.HTTP_CODES.OK);
                return portofolios.map(el => el.info.get());
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.profile)
    getPortofolio(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield (0, authentication_1.getProfileNode)(req);
                const portofolio = yield authorization_service_1.default.getInstance().profileHasAccess(profile, id);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    getPortofolioDetails(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const res = yield portofolioInstance.getPortofolioDetails(id);
                const details = portofolioInstance._formatDetails(res);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return details;
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.admin)
    getAllPortofoliosDetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const portofolios = yield portofolioInstance.getAllPortofoliosDetails();
                const details = portofolios.map((res) => portofolioInstance._formatDetails(res));
                this.setStatus(constant_1.HTTP_CODES.OK);
                return details;
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.admin)
    removePortofolio(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const success = yield portofolioInstance.removePortofolio(id);
                const status = success ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
                const message = success ? "deleted with success" : "Something went wrong, please check your input data";
                this.setStatus(status);
                return { message };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.admin)
    addBuilding(req, portofolioId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield serviceInstance.addBuildingToPortofolio(portofolioId, body);
                if (!node) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "Something went wrong, please check your input data" };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                return services_1.BuildingService.getInstance().formatBuildingStructure(node);
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.profile)
    getBuilding(req, portofolioId, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield (0, authentication_1.getProfileNode)(req);
                const node = yield serviceInstance.getBuildingFromPortofolio(portofolioId, buildingId);
                if (node) {
                    const hasAccess = yield authorization_service_1.default.getInstance().profileHasAccess(profile, node);
                    if (!hasAccess)
                        throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                    const data = yield serviceInstance.formatBuilding(node.info.get());
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    getAllBuilding(req, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const nodes = (yield serviceInstance.getAllBuildingsFromPortofolio(portofolioId)) || [];
                const promises = nodes.map(el => serviceInstance.formatBuilding(el.info.get()));
                const data = yield Promise.all(promises);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return data;
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.admin)
    deleteBuildingFromPortofolio(req, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const ids = yield portofolioInstance.removeBuildingFromPortofolio(portofolioId, data.buildingIds);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    addAppToPortofolio(req, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const nodes = yield portofolioInstance.addAppToPortofolio(portofolioId, data.applicationsIds);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    getPortofolioApps(req, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield portofolioInstance.getPortofolioApps(portofolioId);
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
        });
    }
    // @Security(SECURITY_NAME.profile)
    getAppFromPortofolio(req, portofolioId, applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield (0, authentication_1.getProfileNode)(req);
                const node = yield authorization_service_1.default.getInstance().profileHasAccess(profile, applicationId);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    removeAppFromPortofolio(req, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const ids = yield portofolioInstance.removeAppFromPortofolio(portofolioId, data.applicationId);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    portofolioHasApp(req, portofolioId, applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const exist = yield portofolioInstance.portofolioHasApp(portofolioId, applicationId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return exist ? true : false;
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                ;
                return { message: error.message };
            }
        });
    }
    // @Security(SECURITY_NAME.admin)
    addApiToPortofolio(req, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const nodes = yield portofolioInstance.addApiToPortofolio(portofolioId, data.apisIds);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    getPortofolioApis(req, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield portofolioInstance.getPortofolioApis(portofolioId);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    getApiFromPortofolio(req, portofolioId, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield portofolioInstance.getApiFromPortofolio(portofolioId, apiId);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    removeApiFromPortofolio(req, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const ids = yield portofolioInstance.removeApiFromPortofolio(portofolioId, data.apisIds);
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
        });
    }
    // @Security(SECURITY_NAME.admin)
    portofolioHasApi(req, portofolioId, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const exist = yield portofolioInstance.portofolioHasApi(portofolioId, apiId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return exist ? true : false;
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                ;
                return { message: error.message };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/add_portofolio"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "addPortofolio", null);
__decorate([
    (0, tsoa_1.Put)("/update_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "updatePortofolio", null);
__decorate([
    (0, tsoa_1.Put)("/rename_portofolio/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "renamePortofolio", null);
__decorate([
    (0, tsoa_1.Get)("/get_all_portofolio"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getAllPortofolio", null);
__decorate([
    (0, tsoa_1.Get)("/get_portofolio/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getPortofolio", null);
__decorate([
    (0, tsoa_1.Get)("/get_portofolio_details/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getPortofolioDetails", null);
__decorate([
    (0, tsoa_1.Get)("/get_all_portofolios_details"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getAllPortofoliosDetails", null);
__decorate([
    (0, tsoa_1.Delete)("/remove_portofolio/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "removePortofolio", null);
__decorate([
    (0, tsoa_1.Post)("/add_building_to_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "addBuilding", null);
__decorate([
    (0, tsoa_1.Get)("/get_building_from_portofolio/{portofolioId}/{buildingId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getBuilding", null);
__decorate([
    (0, tsoa_1.Get)("/get_all_buildings_from_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getAllBuilding", null);
__decorate([
    (0, tsoa_1.Delete)("/remove_building_from_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "deleteBuildingFromPortofolio", null);
__decorate([
    (0, tsoa_1.Post)("/add_app_to_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "addAppToPortofolio", null);
__decorate([
    (0, tsoa_1.Get)("/get_apps_from_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getPortofolioApps", null);
__decorate([
    (0, tsoa_1.Get)("/get_app_from_portofolio/{portofolioId}/{applicationId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getAppFromPortofolio", null);
__decorate([
    (0, tsoa_1.Delete)("/remove_app_from_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "removeAppFromPortofolio", null);
__decorate([
    (0, tsoa_1.Get)("/portofolio_has_app/{portofolioId}//{applicationId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "portofolioHasApp", null);
__decorate([
    (0, tsoa_1.Post)("/add_apiRoute_to_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "addApiToPortofolio", null);
__decorate([
    (0, tsoa_1.Get)("/get_apisRoute_from_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getPortofolioApis", null);
__decorate([
    (0, tsoa_1.Get)("/get_apiRoute_from_portofolio/{portofolioId}/{apiId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "getApiFromPortofolio", null);
__decorate([
    (0, tsoa_1.Delete)("/remove_apiRoute_from_portofolio/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "removeApiFromPortofolio", null);
__decorate([
    (0, tsoa_1.Get)("/portofolio_has_apiRoute/{portofolioId}/{apiId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PortofolioController.prototype, "portofolioHasApi", null);
PortofolioController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam"),
    (0, tsoa_1.Tags)("Portofolio"),
    __metadata("design:paramtypes", [])
], PortofolioController);
exports.PortofolioController = PortofolioController;
exports.default = new PortofolioController();
//# sourceMappingURL=portofolio.controller.js.map