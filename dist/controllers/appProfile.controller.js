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
exports.AppProfileController = void 0;
const express = require("express");
const constant_1 = require("../constant");
const services_1 = require("../services");
const tsoa_1 = require("tsoa");
const profileUtils_1 = require("../utils/profileUtils");
const authentication_1 = require("../security/authentication");
const AuthError_1 = require("../security/AuthError");
const adminProfile_service_1 = require("../services/adminProfile.service");
const serviceInstance = services_1.AppProfileService.getInstance();
let AppProfileController = class AppProfileController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    async createAppProfile(req, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            if (!data.name) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "The profile name is required" };
            }
            const profile = await serviceInstance.createProfile(data);
            this.setStatus(constant_1.HTTP_CODES.CREATED);
            return (0, profileUtils_1._formatProfile)(profile);
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAppProfile(req, id) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const data = await serviceInstance.getProfileWithAuthorizedPortofolio(id);
            if (data) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return (0, profileUtils_1._formatProfile)(data);
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${id}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAllAppProfile(req) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.getAllProfilesWithAuthorizedPortfolios() || [];
            this.setStatus(constant_1.HTTP_CODES.OK);
            return nodes.map(el => (0, profileUtils_1._formatProfile)(el));
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async updateAppProfile(req, id, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await serviceInstance.updateProfile(id, data);
            if (node) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return (0, profileUtils_1._formatProfile)(node);
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${id}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async deleteAppProfile(req, id) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            await serviceInstance.deleteProfile(id);
            this.setStatus(constant_1.HTTP_CODES.OK);
            return { message: "user profile deleted" };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    ///////////////////
    //   PORTOFOLIO  //
    ///////////////////
    async getAuthorizedPortofolio(req, profileId) {
        try {
            const id = await (0, authentication_1.getProfileId)(req);
            const isAdmin = adminProfile_service_1.AdminProfileService.getInstance().isAdmin(id);
            if (!isAdmin && profileId !== id)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.getPortofolioAuthStructure(profileId);
            if (nodes) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(value => (0, profileUtils_1._formatPortofolioAuthRes)(value));
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${profileId}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async authorizeToAccessPortofolioApis(req, profileId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.authorizeProfileToAccessPortofolioApisRoute(profileId, data);
            if (nodes) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.reduce((liste, { apis }) => {
                    apis.forEach((node) => {
                        if (node)
                            liste.push(...(0, profileUtils_1._getNodeListInfo)([node]));
                    });
                    return liste;
                }, []);
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${profileId}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAuthorizedPortofolioApis(req, profileId, portofolioId) {
        try {
            const id = await (0, authentication_1.getProfileId)(req);
            const isAdmin = adminProfile_service_1.AdminProfileService.getInstance().isAdmin(id);
            if (!isAdmin && profileId !== id)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.getAuthorizedPortofolioApis(profileId, portofolioId);
            if (nodes) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return (0, profileUtils_1._getNodeListInfo)(nodes);
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${profileId}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async unauthorizeToAccessPortofolioApis(req, profileId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.unauthorizeProfileToAccessPortofolioApisRoute(profileId, data);
            if (nodes) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.filter(el => el);
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${profileId}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    ////////////
    //   BOS  //
    ////////////
    async getAuthorizedBos(req, profileId, portofolioId) {
        try {
            const id = await (0, authentication_1.getProfileId)(req);
            const isAdmin = adminProfile_service_1.AdminProfileService.getInstance().isAdmin(id);
            if (!isAdmin && profileId !== id)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.getBosAuthStructure(profileId, portofolioId);
            if (nodes) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(node => (0, profileUtils_1._formatBosAuthRes)(node));
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${profileId}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async authorizeToAccessBosApis(req, profileId, portofolioId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.authorizeProfileToAccessBosApiRoute(profileId, portofolioId, data);
            if (nodes) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.reduce((liste, { apis }) => {
                    apis.forEach((node) => {
                        if (node)
                            liste.push(...(0, profileUtils_1._getNodeListInfo)([node]));
                    });
                    return liste;
                }, []);
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${profileId}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getAuthorizedBosApis(req, profileId, portofolioId, bosId) {
        try {
            const id = await (0, authentication_1.getProfileId)(req);
            const isAdmin = adminProfile_service_1.AdminProfileService.getInstance().isAdmin(id);
            if (!isAdmin && profileId !== id)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.getAuthorizedBosApis(profileId, portofolioId, bosId);
            if (nodes) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return (0, profileUtils_1._getNodeListInfo)(nodes);
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${profileId}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async unauthorizeToAccessBosApis(req, profileId, portofolioId, data) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.unauthorizeProfileToAccessBosApiRoute(profileId, portofolioId, data);
            if (nodes) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.filter(el => el);
            }
            this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${profileId}` };
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
};
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/create_profile"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "createAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_profile/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_all_profile"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAllAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)("/edit_profile/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "updateAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/delete_profile/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "deleteAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_authorized_portofolio/{profileId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAuthorizedPortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/authorize_portofolio_apis/{profileId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "authorizeToAccessPortofolioApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_authorized_portofolio_apis/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAuthorizedPortofolioApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/unauthorize_portofolio_apis/{profileId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "unauthorizeToAccessPortofolioApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_authorized_bos/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAuthorizedBos", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/authorize_bos_apis/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "authorizeToAccessBosApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_authorized_bos_apis/{profileId}/{portofolioId}/{bosId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAuthorizedBosApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/unauthorize_bos_apis/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Array]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "unauthorizeToAccessBosApis", null);
AppProfileController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam/app_profile"),
    (0, tsoa_1.Tags)("App Profiles"),
    __metadata("design:paramtypes", [])
], AppProfileController);
exports.AppProfileController = AppProfileController;
exports.default = new AppProfileController();
//# sourceMappingURL=appProfile.controller.js.map