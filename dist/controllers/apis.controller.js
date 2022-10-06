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
exports.APIController = void 0;
const tsoa_1 = require("tsoa");
const services_1 = require("../services");
const constant_1 = require("../constant");
const apiService = services_1.APIService.getInstance();
let APIController = class APIController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    /**
     * Adds a route to the list of available routes
     */
    createApiRoute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const data = req.body;
                const node = yield apiService.createApiRoute(data);
                this.setStatus(constant_1.HTTP_CODES.CREATED);
                return node.info.get();
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    updateApiRoute(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield apiService.updateApiRoute(id, data);
                this.setStatus(constant_1.HTTP_CODES.ACCEPTED);
                return node.info.get();
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getApiRouteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield apiService.getApiRouteById(id);
                if (node) {
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return node.info.get();
                }
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `No api route found for ${id}` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAllApiRoute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const routes = yield apiService.getAllApiRoute();
                this.setStatus(constant_1.HTTP_CODES.OK);
                return routes.map(el => el.info.get());
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    deleteApiRoute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield apiService.deleteApiRoute(id);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return { message: `${id} api route has been deleted` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    uploadSwaggerFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!file) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "No file uploaded" };
                }
                // const firstFile = Object.keys(files)[0];
                if (file) {
                    // const file = files[firstFile];
                    if (!/.*\.json$/.test(file.originalname)) {
                        this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                        return { message: "The selected file must be a json file" };
                    }
                    const apis = yield apiService.uploadSwaggerFile(file.buffer);
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return apis.map(el => el.info.get());
                }
                this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                return { message: "No file uploaded" };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/create_api_route"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], APIController.prototype, "createApiRoute", null);
__decorate([
    (0, tsoa_1.Put)("/update_api_route/{id}"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], APIController.prototype, "updateApiRoute", null);
__decorate([
    (0, tsoa_1.Get)("/get_api_route/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], APIController.prototype, "getApiRouteById", null);
__decorate([
    (0, tsoa_1.Get)("/get_all_api_route"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], APIController.prototype, "getAllApiRoute", null);
__decorate([
    (0, tsoa_1.Delete)("/delete_api_route/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], APIController.prototype, "deleteApiRoute", null);
__decorate([
    (0, tsoa_1.Post)("/upload_apis_routes"),
    __param(0, (0, tsoa_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], APIController.prototype, "uploadSwaggerFile", null);
APIController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam/"),
    (0, tsoa_1.Tags)("Apis"),
    __metadata("design:paramtypes", [])
], APIController);
exports.APIController = APIController;
exports.default = new APIController();
//# sourceMappingURL=apis.controller.js.map