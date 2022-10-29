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
exports.AuthController = void 0;
const services_1 = require("../services");
const constant_1 = require("../constant");
const tsoa_1 = require("tsoa");
const serviceInstance = services_1.AuthentificationService.getInstance();
let AuthController = class AuthController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    authenticate(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, data } = yield serviceInstance.authenticate(credential);
                this.setStatus(code);
                return data;
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    authenticateAdmin(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, message } = yield serviceInstance.authenticateAdmin(credential);
                this.setStatus(code);
                return message;
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    registerToAdmin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registeredData = yield serviceInstance.registerToAdmin(data.pamInfo, data.adminInfo);
                yield serviceInstance.sendDataToAdmin();
                this.setStatus(constant_1.HTTP_CODES.OK);
                return registeredData;
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getBosToAdminCredential() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bosCredential = yield serviceInstance.getPamToAdminCredential();
                if (bosCredential) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return bosCredential;
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: "No admin registered" };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    // @Post("/create_auth_to_pam_credential")
    // public async createAdminCredential(): Promise<IAdminCredential | { message: string }> {
    //     try {
    //         const adminCredential = await serviceInstance.createAdminCredential();
    //         this.setStatus(HTTP_CODES.OK)
    //         return adminCredential;
    //     } catch (error) {
    //         this.setStatus(HTTP_CODES.INTERNAL_ERROR)
    //         return { message: error.message }
    //     }
    // }
    deleteAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield serviceInstance.deleteCredentials();
                const status = deleted ? constant_1.HTTP_CODES.OK : constant_1.HTTP_CODES.BAD_REQUEST;
                const message = deleted ? "deleted with success" : "something went wrong, please check your input data";
                this.setStatus(status);
                return { message };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAdminCredential() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminCredential = yield serviceInstance.getAdminCredential();
                if (adminCredential) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return adminCredential;
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: "No admin registered" };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    syncDataToAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield serviceInstance.sendDataToAdmin(true);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return { message: "updated" };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/auth"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticate", null);
__decorate([
    (0, tsoa_1.Post)("/auth/admin"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticateAdmin", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Post)("/register_admin"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerToAdmin", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Get)("/get_pam_to_auth_credential"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getBosToAdminCredential", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Delete)("/delete_admin"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteAdmin", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Get)("/get_admin_to_pam_credential"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAdminCredential", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Put)("/update_data"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "syncDataToAdmin", null);
AuthController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam"),
    (0, tsoa_1.Tags)("Auth"),
    __metadata("design:paramtypes", [])
], AuthController);
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map