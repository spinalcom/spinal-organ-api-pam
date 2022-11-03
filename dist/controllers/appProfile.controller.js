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
exports.AppProfileController = void 0;
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
const serviceInstance = services_1.AppProfileService.getInstance();
let AppProfileController = class AppProfileController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    createAppProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data.name) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "The profile name is required" };
                }
                const profile = yield serviceInstance.createAppProfile(data);
                this.setStatus(constant_1.HTTP_CODES.CREATED);
                return (0, profileUtils_1._formatProfile)(profile);
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAppProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield serviceInstance.getAppProfile(id);
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
    getAllAppProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = (yield serviceInstance.getAllAppProfile()) || [];
                this.setStatus(constant_1.HTTP_CODES.OK);
                return nodes.map(el => (0, profileUtils_1._formatProfile)(el));
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    updateAppProfile(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield serviceInstance.updateAppProfile(id, data);
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
    deleteAppProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield serviceInstance.deleteAppProfile(id);
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
    getAuthorizedPortofolio(profileId) {
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
    authorizeToAccessPortofolioApis(profileId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.authorizeToAccessPortofolioApisRoute(profileId, data);
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
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAuthorizedPortofolioApis(profileId, portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.getAuthorizedPortofolioApis(profileId, portofolioId);
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
    unauthorizeToAccessPortofolioApis(profileId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.unauthorizeToAccessPortofolioApisRoute(profileId, data);
                if (nodes) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return nodes.filter(el => el);
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
    authorizeToAccessBosApis(profileId, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.authorizeToAccessBosApiRoute(profileId, portofolioId, data);
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
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAuthorizedBosApis(profileId, portofolioId, bosId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.getAuthorizedBosApis(profileId, portofolioId, bosId);
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
    unauthorizeToAccessBosApis(profileId, portofolioId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.unauthorizeToAccessBosApiRoute(profileId, portofolioId, data);
                if (nodes) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return nodes.filter(el => el);
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
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Post)("/create_profile"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "createAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.profile),
    (0, tsoa_1.Get)("/get_profile/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Get)("/get_all_profile"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAllAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Put)("/edit_profile/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "updateAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Delete)("/delete_profile/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "deleteAppProfile", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.profile),
    (0, tsoa_1.Get)("/get_authorized_portofolio/{profileId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAuthorizedPortofolio", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Post)("/authorize_portofolio_apis/{profileId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "authorizeToAccessPortofolioApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.profile),
    (0, tsoa_1.Get)("/get_authorized_portofolio_apis/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAuthorizedPortofolioApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Post)("/unauthorize_portofolio_apis/{profileId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "unauthorizeToAccessPortofolioApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.profile),
    (0, tsoa_1.Get)("/get_authorized_bos/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAuthorizedBos", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Post)("/authorize_bos_apis/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "authorizeToAccessBosApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.profile),
    (0, tsoa_1.Get)("/get_authorized_bos_apis/{profileId}/{portofolioId}/{bosId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppProfileController.prototype, "getAuthorizedBosApis", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Post)("/unauthorize_bos_apis/{profileId}/{portofolioId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
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