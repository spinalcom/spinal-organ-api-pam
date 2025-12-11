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
exports.UserProfileController = void 0;
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
const constant_1 = require("../constant");
const services_1 = require("../services");
const tsoa_1 = require("tsoa");
const profileUtils_1 = require("../utils/profileUtils");
const AuthError_1 = require("../security/AuthError");
const authentication_1 = require("../security/authentication");
const adminProfile_service_1 = require("../services/adminProfile.service");
const serviceInstance = services_1.UserProfileService.getInstance();
let UserProfileController = class UserProfileController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    async createUserProfile(req, data, isCompatibleWithBosC) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            if (!data.name) {
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "The profile name is required" };
            }
            const profile = await serviceInstance.createProfile(data, isCompatibleWithBosC);
            this.setStatus(constant_1.HTTP_CODES.CREATED);
            return (0, profileUtils_1._formatProfile)(profile);
        }
        catch (error) {
            this.setStatus(error.code || constant_1.HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
    async getUserProfile(req, id) {
        try {
            const profileId = await (0, authentication_1.getProfileId)(req);
            const isAdmin = adminProfile_service_1.AdminProfileService.getInstance().isAdmin(profileId);
            if (!isAdmin && profileId !== id)
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
    async getAllUserProfile(req) {
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
    async updateUserProfile(req, id, data, isCompatibleWithBosC) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const node = await serviceInstance.updateProfile(id, data, isCompatibleWithBosC);
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
    async deleteUserProfile(req, id) {
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
    async getAuthorizedPortofolioApps(req, profileId) {
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
    async authorizeToAccessPortofolioApps(req, profileId, data, isCompatibleWithBosC) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.authorizeProfileToAccessPortofolioApp(profileId, data, isCompatibleWithBosC);
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
    async getAuthorizedPortofolioApis(req, profileId, portofolioId) {
        try {
            const id = await (0, authentication_1.getProfileId)(req);
            const isAdmin = adminProfile_service_1.AdminProfileService.getInstance().isAdmin(id);
            if (!isAdmin && profileId !== id)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.getAuthorizedPortofolioApp(profileId, portofolioId);
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
    async unauthorizeToAccessPortofolioApps(req, profileId, data, isCompatibleWithBosC) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.unauthorizeProfileToAccessPortofolioApp(profileId, data, isCompatibleWithBosC);
            if (nodes) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.reduce((liste, item) => {
                    if (item)
                        liste.push(item.info.get());
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
    async authorizeToAccessBosApps(req, profileId, portofolioId, data, isCompatibleWithBosC) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.authorizeProfileToAccessBosApp(profileId, portofolioId, data, isCompatibleWithBosC);
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
    async getAuthorizedBosApis(req, profileId, portofolioId, bosId) {
        try {
            const id = await (0, authentication_1.getProfileId)(req);
            const isAdmin = adminProfile_service_1.AdminProfileService.getInstance().isAdmin(id);
            if (!isAdmin && profileId !== id)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.getAuthorizedBosApp(profileId, portofolioId, bosId);
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
    async unauthorizeToAccessBosApp(req, profileId, portofolioId, data, isCompatibleWithBosC) {
        try {
            const isAdmin = await (0, authentication_1.checkIfItIsAdmin)(req);
            if (!isAdmin)
                throw new AuthError_1.AuthError(constant_1.SECURITY_MESSAGES.UNAUTHORIZED);
            const nodes = await serviceInstance.unauthorizeProfileToAccessBosApp(profileId, portofolioId, data, isCompatibleWithBosC);
            if (nodes) {
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.reduce((liste, item) => {
                    if (item)
                        liste.push(item.info.get());
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
};
exports.UserProfileController = UserProfileController;
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/create_profile"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Boolean]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "createUserProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_profile/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getUserProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_all_profile"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getAllUserProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Put)("/edit_profile/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Boolean]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "updateUserProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Delete)("/delete_profile/{id}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "deleteUserProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_authorized_portofolio/{profileId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getAuthorizedPortofolioApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/authorize_portofolio_apps/{profileId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array, Boolean]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "authorizeToAccessPortofolioApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_authorized_portofolio_apps/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getAuthorizedPortofolioApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/unauthorize_portofolio_apps/{profileId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __param(3, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array, Boolean]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "unauthorizeToAccessPortofolioApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_authorized_bos/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getAuthorizedBos", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/authorize_bos_apps/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Body)()),
    __param(4, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Array, Boolean]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "authorizeToAccessBosApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Get)("/get_authorized_bos_apps/{profileId}/{portofolioId}/{bosId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getAuthorizedBosApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.bearerAuth),
    (0, tsoa_1.Post)("/unauthorize_bos_apps/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Body)()),
    __param(4, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Array, Boolean]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "unauthorizeToAccessBosApp", null);
exports.UserProfileController = UserProfileController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam/user_profile"),
    (0, tsoa_1.Tags)("user Profiles"),
    __metadata("design:paramtypes", [])
], UserProfileController);
exports.default = new UserProfileController();
//# sourceMappingURL=userProfile.controller.js.map