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
    async createAdminApp(req, appInfo) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.createAdminApp(appInfo);
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
    }
    async createPortofolioApp(req, appInfo) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.createPortofolioApp(appInfo);
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
    }
    async createBuildingApp(req, appInfo) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.createBuildingApp(appInfo);
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
    }
    async getAllAdminApps(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await appServiceInstance.getAllAdminApps();
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAllPortofolioApps(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await appServiceInstance.getAllPortofolioApps();
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAllBuildingApps(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await appServiceInstance.getAllBuildingApps();
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map(el => el.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAdminApp(req, appId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.getAdminAppById(appId);
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
    }
    async getPortofolioApp(req, appId) {
        try {
            const profile = await (0, authentication_1.getProfileNode)(req);
            const node = await authorization_service_1.default.getInstance().profileHasAccessToNode(profile, appId);
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
    }
    async getBuildingApp(req, appId) {
        try {
            const profile = await (0, authentication_1.getProfileNode)(req);
            const node = await authorization_service_1.default.getInstance().profileHasAccessToNode(profile, appId);
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
    }
    async updateAdminApp(req, appId, newInfo) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.updateAdminApp(appId, newInfo);
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
    }
    async updatePortofolioApp(req, appId, newInfo) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.updatePortofolioApp(appId, newInfo);
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
    }
    async updateBuildingApp(req, appId, newInfo) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await appServiceInstance.updateBuildingApp(appId, newInfo);
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
    }
    async deleteAdminApp(req, appId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const isDeleted = await appServiceInstance.deleteAdminApp(appId);
            const status = isDeleted ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
            const message = isDeleted ? `${appId} is deleted with success` : "something went wrong, please check your input data";
            this.setStatus(status);
            return { message };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async deletePortofolioApp(req, appId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const isDeleted = await appServiceInstance.deletePortofolioApp(appId);
            const status = isDeleted ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
            const message = isDeleted ? `${appId} is deleted with success` : "something went wrong, please check your input data";
            this.setStatus(status);
            return { message };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async deleteBuildingApp(req, appId) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const isDeleted = await appServiceInstance.deleteBuildingApp(appId);
            const status = isDeleted ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
            const message = isDeleted ? `${appId} is deleted with success` : "something went wrong, please check your input data";
            this.setStatus(status);
            return { message };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async uploadAdminApp(req, file) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
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
            const apps = await appServiceInstance.uploadApps(services_1.AppsType.admin, file.buffer, isExcel);
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
    }
    async uploadPortofolioApp(req, file) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
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
            const apps = await appServiceInstance.uploadApps(services_1.AppsType.portofolio, file.buffer, isExcel);
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
    }
    async uploadBuildingApp(req, file) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
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
            const apps = await appServiceInstance.uploadApps(services_1.AppsType.building, file.buffer, isExcel);
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
    }
    /////////////////////////////////////////////////////////
    //                      FAVORIS                        //
    /////////////////////////////////////////////////////////
    async addPortofolioAppToFavoris(request, portofolioId, data) {
        try {
            const tokenInfo = await (0, authentication_1.checkAndGetTokenInfo)(request);
            let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
            let userName = tokenInfo.userInfo.userName;
            const nodes = await services_1.UserListService.getInstance().addAppToUserFavorite(userName, profileId, data.appIds, portofolioId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map(node => node.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async addBuildingAppToFavoris(request, portofolioId, bosId, data) {
        try {
            const tokenInfo = await (0, authentication_1.checkAndGetTokenInfo)(request);
            let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
            let userName = tokenInfo.userInfo.userName;
            const nodes = await services_1.UserListService.getInstance().addAppToUserFavorite(userName, profileId, data.appIds, portofolioId, bosId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map(node => node.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async removePortofolioAppFromFavoris(request, portofolioId, data) {
        try {
            const tokenInfo = await (0, authentication_1.checkAndGetTokenInfo)(request);
            let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
            let userName = tokenInfo.userInfo.userName;
            const nodes = await services_1.UserListService.getInstance().removeFavoriteApp(userName, profileId, data.appIds, portofolioId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map(node => node.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async removeBuildingAppFromFavoris(request, portofolioId, bosId, data) {
        try {
            const tokenInfo = await (0, authentication_1.checkAndGetTokenInfo)(request);
            let profileId = tokenInfo.profile.profileId || tokenInfo.profile.userProfileBosConfigId;
            let userName = tokenInfo.userInfo.userName;
            const nodes = await services_1.UserListService.getInstance().removeFavoriteApp(userName, profileId, data.appIds, portofolioId, bosId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map(node => node.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getPortofolioFavoriteApps(request, portofolioId) {
        try {
            const tokenInfo = await (0, authentication_1.checkAndGetTokenInfo)(request);
            let userName = tokenInfo.userInfo.userName;
            const nodes = await services_1.UserListService.getInstance().getFavoriteApps(userName, portofolioId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map(node => node.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getBuildingFavoriteApps(request, portofolioId, bosId) {
        try {
            const tokenInfo = await (0, authentication_1.checkAndGetTokenInfo)(request);
            let userName = tokenInfo.userInfo.userName;
            const nodes = await services_1.UserListService.getInstance().getFavoriteApps(userName, portofolioId, bosId);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map(node => node.info.get());
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
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