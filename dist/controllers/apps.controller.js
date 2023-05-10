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
exports.AppsController = void 0;
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
const express = require("express");
const services_1 = require("../services");
const tsoa_1 = require("tsoa");
const constant_1 = require("../constant");
const authentication_1 = require("../security/authentication");
const AuthError_1 = require("../security/AuthError");
const authorization_service_1 = require("../services/authorization.service");
const appServiceInstance = services_1.AppService.getInstance();
let AppsController = class AppsController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    createAdminApp(req, appInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield appServiceInstance.createAdminApp(appInfo);
                if (node) {
                    this.setStatus(constant_1.HTTP_CODES.CREATED);
                    return node.info.get();
                }
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "oops, something went wrong, please check your input data" };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    createPortofolioApp(req, appInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield appServiceInstance.createPortofolioApp(appInfo);
                if (node) {
                    this.setStatus(constant_1.HTTP_CODES.CREATED);
                    return node.info.get();
                }
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "oops, something went wrong, please check your input data" };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    createBuildingApp(req, appInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield appServiceInstance.createBuildingApp(appInfo);
                if (node) {
                    this.setStatus(constant_1.HTTP_CODES.CREATED);
                    return node.info.get();
                }
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "oops, something went wrong, please check your input data" };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAllAdminApps(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const nodes = yield appServiceInstance.getAllAdminApps();
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(el => el.info.get());
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAllPortofolioApps(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const nodes = yield appServiceInstance.getAllPortofolioApps();
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(el => el.info.get());
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAllBuildingApps(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const nodes = yield appServiceInstance.getAllBuildingApps();
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(el => el.info.get());
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAdminApp(req, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield appServiceInstance.getAdminApp(appId);
                if (node) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return node.info.get();
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `No application found for this id (${appId})` };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getPortofolioApp(req, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield (0, authentication_1.getProfileNode)(req);
                const node = yield authorization_service_1.default.getInstance().profileHasAccess(profile, appId);
                if (node) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return node.info.get();
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `No application found for this id (${appId})` };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getBuildingApp(req, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield (0, authentication_1.getProfileNode)(req);
                const node = yield authorization_service_1.default.getInstance().profileHasAccess(profile, appId);
                // const node = await appServiceInstance.getBuildingApp(appId);
                if (node) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return node.info.get();
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `No application found for this id (${appId})` };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    updateAdminApp(req, appId, newInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield appServiceInstance.updateAdminApp(appId, newInfo);
                if (node) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return node.info.get();
                }
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: `Something went wrong, please check your input data.` };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    updatePortofolioApp(req, appId, newInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield appServiceInstance.updatePortofolioApp(appId, newInfo);
                if (node) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return node.info.get();
                }
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: `Something went wrong, please check your input data.` };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    updateBuildingApp(req, appId, newInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const node = yield appServiceInstance.updateBuildingApp(appId, newInfo);
                if (node) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return node.info.get();
                }
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: `Something went wrong, please check your input data.` };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    deleteAdminApp(req, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const isDeleted = yield appServiceInstance.deleteAdminApp(appId);
                const status = isDeleted ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
                const message = isDeleted ? `${appId} is deleted with success` : "something went wrong, please check your input data";
                this.setStatus(status);
                return { message };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    deletePortofolioApp(req, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const isDeleted = yield appServiceInstance.deletePortofolioApp(appId);
                const status = isDeleted ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
                const message = isDeleted ? `${appId} is deleted with success` : "something went wrong, please check your input data";
                this.setStatus(status);
                return { message };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    deleteBuildingApp(req, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                const isDeleted = yield appServiceInstance.deleteBuildingApp(appId);
                const status = isDeleted ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
                const message = isDeleted ? `${appId} is deleted with success` : "something went wrong, please check your input data";
                this.setStatus(status);
                return { message };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    uploadAdminApp(req, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                if (!file) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "No file uploaded" };
                }
                // if (file && !(/.*\.json$/.test(file.originalname) || /.*\.xlsx$/.test(file.originalname))) {
                if (file && !(/.*\.xlsx$/.test(file.originalname))) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "The selected file must be a json or excel file" };
                }
                const isExcel = /.*\.xlsx$/.test(file.originalname);
                const apps = yield appServiceInstance.uploadApps(services_1.AppsType.admin, file.buffer, isExcel);
                if (apps && apps.length > 0) {
                    this.setStatus(constant_1.HTTP_CODES.CREATED);
                    return apps.map(node => node.info.get());
                }
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "oops, something went wrong, please check your input data" };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    uploadPortofolioApp(req, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                if (!file) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "No file uploaded" };
                }
                if (file && !(/.*\.json$/.test(file.originalname) || /.*\.xlsx$/.test(file.originalname))) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "The selected file must be a json or excel file" };
                }
                const isExcel = /.*\.xlsx$/.test(file.originalname);
                const apps = yield appServiceInstance.uploadApps(services_1.AppsType.portofolio, file.buffer, isExcel);
                if (apps && apps.length > 0) {
                    this.setStatus(constant_1.HTTP_CODES.CREATED);
                    return apps.map(node => node.info.get());
                }
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "oops, something went wrong, please check your input data" };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    uploadBuildingApp(req, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdmin = yield (0, authentication_1.checkIfItIsAdmin)(req);
                if (!isAdmin)
                    throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
                if (!file) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "No file uploaded" };
                }
                if (file && !(/.*\.json$/.test(file.originalname) || /.*\.xlsx$/.test(file.originalname))) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "The selected file must be a json or excel file" };
                }
                const isExcel = /.*\.xlsx$/.test(file.originalname);
                const apps = yield appServiceInstance.uploadApps(services_1.AppsType.building, file.buffer, isExcel);
                if (apps && apps.length > 0) {
                    this.setStatus(constant_1.HTTP_CODES.CREATED);
                    return apps.map(node => node.info.get());
                }
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "oops, something went wrong, please check your input data" };
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    /////////////////////////////////////////////////////////
    //                      FAVORIS                        //
    /////////////////////////////////////////////////////////
    addPortofolioAppToFavoris(request, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenInfo = yield (0, authentication_1.checkAndGetTokenInfo)(request);
                let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
                let userName = tokenInfo.userInfo.userName;
                const nodes = yield services_1.UserListService.getInstance().addFavoriteApp(userName, profileId, data.appIds, portofolioId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(node => node.info.get());
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    addBuildingAppToFavoris(request, portofolioId, bosId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenInfo = yield (0, authentication_1.checkAndGetTokenInfo)(request);
                let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
                let userName = tokenInfo.userInfo.userName;
                const nodes = yield services_1.UserListService.getInstance().addFavoriteApp(userName, profileId, data.appIds, portofolioId, bosId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(node => node.info.get());
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    removePortofolioAppFromFavoris(request, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenInfo = yield (0, authentication_1.checkAndGetTokenInfo)(request);
                let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
                let userName = tokenInfo.userInfo.userName;
                const nodes = yield services_1.UserListService.getInstance().removeFavoriteApp(userName, profileId, data.appIds, portofolioId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(node => node.info.get());
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    removeBuildingAppFromFavoris(request, portofolioId, bosId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenInfo = yield (0, authentication_1.checkAndGetTokenInfo)(request);
                let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
                let userName = tokenInfo.userInfo.userName;
                const nodes = yield services_1.UserListService.getInstance().removeFavoriteApp(userName, profileId, data.appIds, portofolioId, bosId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(node => node.info.get());
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getPortofolioFavoriteApps(request, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenInfo = yield (0, authentication_1.checkAndGetTokenInfo)(request);
                let userName = tokenInfo.userInfo.userName;
                const nodes = yield services_1.UserListService.getInstance().getFavoriteApps(userName, portofolioId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(node => node.info.get());
            }
            catch (error) {
                this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getBuildingFavoriteApps(request, portofolioId, bosId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenInfo = yield (0, authentication_1.checkAndGetTokenInfo)(request);
                let userName = tokenInfo.userInfo.userName;
                const nodes = yield services_1.UserListService.getInstance().getFavoriteApps(userName, portofolioId, bosId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(node => node.info.get());
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
    (0, tsoa_1.Post)("/create_admin_app"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "createAdminApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/create_portofolio_app"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "createPortofolioApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/create_building_app"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "createBuildingApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_all_admin_apps"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getAllAdminApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_all_portofolio_apps"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getAllPortofolioApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_all_building_apps"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getAllBuildingApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_admin_app/{appId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getAdminApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_portofolio_app/{appId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getPortofolioApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_building_app/{appId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getBuildingApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)("/update_admin_app/{appId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "updateAdminApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)("/update_portofolio_app/{appId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "updatePortofolioApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)("/update_building_app/{appId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "updateBuildingApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/delete_admin_app/{appId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "deleteAdminApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/delete_portofolio_app/{appId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "deletePortofolioApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/delete_building_app/{appId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "deleteBuildingApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/upload_admin_apps"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "uploadAdminApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/upload_portofolio_apps"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "uploadPortofolioApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/upload_building_apps"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "uploadBuildingApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/add_app_to_favoris/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "addPortofolioAppToFavoris", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/add_app_to_favoris/{portofolioId}/{bosId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "addBuildingAppToFavoris", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/remove_app_from_favoris/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "removePortofolioAppFromFavoris", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/remove_app_from_favoris/{portofolioId}/{bosId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "removeBuildingAppFromFavoris", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_favorite_apps/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getPortofolioFavoriteApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_favorite_apps/{portofolioId}/{bosId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AppsController.prototype, "getBuildingFavoriteApps", null);
AppsController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam"),
    (0, tsoa_1.Tags)("Applications"),
    __metadata("design:paramtypes", [])
], AppsController);
exports.AppsController = AppsController;
exports.default = new AppsController();
//# sourceMappingURL=apps.controller.js.map