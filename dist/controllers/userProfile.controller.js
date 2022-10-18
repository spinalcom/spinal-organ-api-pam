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
const constant_1 = require("../constant");
const services_1 = require("../services");
const tsoa_1 = require("tsoa");
const profileUtils_1 = require("../utils/profileUtils");
const serviceInstance = services_1.UserProfileService.getInstance();
let UserProfileController = class UserProfileController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    createUserProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.name) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "The profile name is required" };
                }
                const profile = yield serviceInstance.createUserProfile(data);
                this.setStatus(constant_1.HTTP_CODES.CREATED);
                return (0, profileUtils_1._formatProfile)(profile);
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getUserProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield serviceInstance.getUserProfile(id);
                if (data) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return (0, profileUtils_1._formatProfile)(data);
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `no profile found for ${id}` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAllUserProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = (yield serviceInstance.getAllUserProfile()) || [];
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(el => (0, profileUtils_1._formatProfile)(el));
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    updateUserProfile(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield serviceInstance.updateUserProfile(id, data);
                if (node) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return (0, profileUtils_1._formatProfile)(node);
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `no profile found for ${id}` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    deleteUserProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield serviceInstance.deleteUserProfile(id);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return { message: "user profile deleted" };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    ///////////////////
    //   PORTOFOLIO  //
    ///////////////////
    getAuthorizedPortofolioApps(profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.getPortofolioAuthStructure(profileId);
                if (nodes) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return nodes.map(value => (0, profileUtils_1._formatPortofolioAuthRes)(value));
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `no profile found for ${profileId}` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    authorizeToAccessPortofolioApps(profileId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.authorizeToAccessPortofolioApp(profileId, data);
                if (nodes) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return nodes.map(value => (0, profileUtils_1._formatPortofolioAuthRes)(value));
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `no profile found for ${profileId}` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAuthorizedPortofolioApis(profileId, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.getAuthorizedPortofolioApp(profileId, portofolioId);
                if (nodes) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return (0, profileUtils_1._getNodeListInfo)(nodes);
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `no profile found for ${profileId}` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    unauthorizeToAccessPortofolioApps(profileId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.unauthorizeToAccessPortofolioApp(profileId, data);
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
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    ////////////
    //   BOS  //
    ////////////
    getAuthorizedBos(profileId, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.getBosAuthStructure(profileId, portofolioId);
                if (nodes) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return nodes.map(node => (0, profileUtils_1._formatBosAuthRes)(node));
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `no profile found for ${profileId}` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    authorizeToAccessBosApps(profileId, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.authorizeToAccessBosApp(profileId, portofolioId, data);
                if (nodes) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return nodes.map(node => (0, profileUtils_1._formatBosAuthRes)(node));
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `no profile found for ${profileId}` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAuthorizedBosApis(profileId, portofolioId, bosId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.getAuthorizedBosApp(profileId, portofolioId, bosId);
                if (nodes) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return (0, profileUtils_1._getNodeListInfo)(nodes);
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `no profile found for ${profileId}` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    unauthorizeToAccessBosApp(profileId, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.unauthorizeToAccessBosApp(profileId, portofolioId, data);
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
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/create_profile"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "createUserProfile", null);
__decorate([
    (0, tsoa_1.Get)("/get_profile/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getUserProfile", null);
__decorate([
    (0, tsoa_1.Get)("/get_all_profile"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getAllUserProfile", null);
__decorate([
    (0, tsoa_1.Put)("/edit_profile/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "updateUserProfile", null);
__decorate([
    (0, tsoa_1.Delete)("/delete_profile/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "deleteUserProfile", null);
__decorate([
    (0, tsoa_1.Get)("/get_authorized_portofolio/{profileId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getAuthorizedPortofolioApps", null);
__decorate([
    (0, tsoa_1.Post)("/authorize_portofolio_apps/{profileId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "authorizeToAccessPortofolioApps", null);
__decorate([
    (0, tsoa_1.Get)("/get_authorized_portofolio_apps/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getAuthorizedPortofolioApis", null);
__decorate([
    (0, tsoa_1.Post)("/unauthorize_portofolio_apps/{profileId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "unauthorizeToAccessPortofolioApps", null);
__decorate([
    (0, tsoa_1.Get)("/get_authorized_bos/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getAuthorizedBos", null);
__decorate([
    (0, tsoa_1.Post)("/authorize_bos_apps/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "authorizeToAccessBosApps", null);
__decorate([
    (0, tsoa_1.Get)("/get_authorized_bos_apps/{profileId}/{portofolioId}/{bosId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "getAuthorizedBosApis", null);
__decorate([
    (0, tsoa_1.Post)("/unauthorize_bos_apps/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "unauthorizeToAccessBosApp", null);
UserProfileController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam/user_profile"),
    (0, tsoa_1.Tags)("user Profiles"),
    __metadata("design:paramtypes", [])
], UserProfileController);
exports.UserProfileController = UserProfileController;
exports.default = new UserProfileController();
//# sourceMappingURL=userProfile.controller.js.map