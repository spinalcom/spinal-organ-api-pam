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
exports.BuildingController = void 0;
const services_1 = require("../services");
const tsoa_1 = require("tsoa");
const constant_1 = require("../constant");
const serviceInstance = services_1.BuildingService.getInstance();
let BuildingController = class BuildingController extends tsoa_1.Controller {
    constructor() {
        super();
    }
    /*
    @Security(SECURITY_NAME.admin)
    @Post("/create_building")
    public async createBuilding(@Body() buildingInfo: IBuilding): Promise<IBuilding | { message: string }> {
        try {

            const validationResult = serviceInstance.validateBuilding(buildingInfo);
            if (!validationResult.isValid) {
                this.setStatus(HTTP_CODES.BAD_REQUEST);
                return { message: validationResult.message }
            };

            await serviceInstance.setLocation(buildingInfo);

            const node = await serviceInstance.createBuilding(buildingInfo);
            // const data = await serviceInstance.formatBuilding(node.info.get());
            this.setStatus(HTTP_CODES.OK);
            return node.getInfo().get();
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }
*/
    getBuildingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield serviceInstance.getBuildingById(id);
                if (node) {
                    const data = yield serviceInstance.formatBuilding(node.info.get());
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return data;
                }
                ;
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `no Building found for ${id}` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    /*
    @Security(SECURITY_NAME.admin)
    @Get("/get_all_buildings")
    public async getAllBuildings(): Promise<IBuilding[] | { message: string }> {
        try {
            const nodes = await serviceInstance.getAllBuildings() || [];

            const promises = nodes.map(el => serviceInstance.formatBuilding(el.info.get()))

            const data = await Promise.all(promises);
            this.setStatus(HTTP_CODES.OK);
            return data;

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR)
            return { message: error.message };
        }
    }*/
    getAllBuildingsApps() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = (yield serviceInstance.getAllBuildingsApps()) || [];
                const promises = nodes.map(({ node, apps }) => __awaiter(this, void 0, void 0, function* () {
                    return Object.assign(Object.assign({}, (yield serviceInstance.formatBuilding(node.info.get()))), { apps: apps.map(el => el.info.get()) });
                }));
                const data = Promise.all(promises);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return data;
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    deleteBuilding(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield serviceInstance.deleteBuilding(id);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return { message: "building deleted" };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    editBuilding(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield serviceInstance.setLocation(data);
                const node = yield serviceInstance.updateBuilding(id, data);
                if (node) {
                    const data = yield serviceInstance.formatBuildingStructure(node);
                    this.setStatus(constant_1.HTTP_CODES.OK);
                    return data;
                }
                ;
                this.setStatus(constant_1.HTTP_CODES.NOT_FOUND);
                return { message: `no building found for ${id}` };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    addAppToBuilding(buildingId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apps = yield serviceInstance.addAppToBuilding(buildingId, data.applicationId);
                if (!apps || apps.length === 0) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "Something went wrong, please check your input data" };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                return apps.map(el => el.info.get());
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAppsFromBuilding(buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apps = yield serviceInstance.getAppsFromBuilding(buildingId);
                if (!apps) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "Something went wrong, please check your input data" };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                return apps.map(el => el.info.get());
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getAppFromBuilding(buildingId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const app = yield serviceInstance.getAppFromBuilding(buildingId, appId);
                if (!app) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "Something went wrong, please check your input data" };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                return app.info.get();
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    removeAppFromBuilding(buildingId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idsDeleted = yield serviceInstance.removeAppFromBuilding(buildingId, data.applicationId);
                if (!idsDeleted || idsDeleted.length === 0) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "Something went wrong, please check your input data" };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                return { message: "application removed with success !", ids: idsDeleted };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    buildingHasApp(buildingId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield serviceInstance.buildingHasApp(buildingId, appId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return success;
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    addApiToBuilding(buildingId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apis = yield serviceInstance.addApiToBuilding(buildingId, data.apisIds);
                if (!apis || apis.length === 0) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "Something went wrong, please check your input data" };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                return apis.map(el => el.info.get());
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getApisFromBuilding(buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apis = yield serviceInstance.getApisFromBuilding(buildingId);
                if (!apis) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "Something went wrong, please check your input data" };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                return apis.map(el => el.info.get());
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    getApiFromBuilding(buildingId, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const api = yield serviceInstance.getApiFromBuilding(buildingId, apiId);
                if (!api) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "Something went wrong, please check your input data" };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                return api.info.get();
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    removeApisFromBuilding(buildingId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idsDeleted = yield serviceInstance.removeApisFromBuilding(buildingId, data.apisIds);
                if (!idsDeleted || idsDeleted.length === 0) {
                    this.setStatus(constant_1.HTTP_CODES.BAD_REQUEST);
                    return { message: "Something went wrong, please check your input data" };
                }
                this.setStatus(constant_1.HTTP_CODES.OK);
                return { message: "application removed with success !", ids: idsDeleted };
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
    buildingHasApi(buildingId, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield serviceInstance.buildingHasApi(buildingId, apiId);
                this.setStatus(constant_1.HTTP_CODES.OK);
                return success;
            }
            catch (error) {
                this.setStatus(constant_1.HTTP_CODES.INTERNAL_ERROR);
                return { message: error.message };
            }
        });
    }
};
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.profile),
    (0, tsoa_1.Post)("/get_building/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getBuildingById", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Get)("/get_all_buildings_apps"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getAllBuildingsApps", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Delete)("/delete_building/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "deleteBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Put)("/edit_building/{id}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "editBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Post)("/add_app_to_building/{buildingId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "addAppToBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.profile),
    (0, tsoa_1.Get)("/get_apps_from_building/{buildingId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getAppsFromBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.profile),
    (0, tsoa_1.Get)("/get_app_from_building/{buildingId}/{appId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getAppFromBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Delete)("/remove_app_from_building/{buildingId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "removeAppFromBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.profile),
    (0, tsoa_1.Get)("/building_has_app/{buildingId}/{appId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "buildingHasApp", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Post)("/add_apiRoute_to_building/{buildingId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "addApiToBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.profile),
    (0, tsoa_1.Get)("/get_apisRoute_from_building/{buildingId}"),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getApisFromBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.profile),
    (0, tsoa_1.Get)("/get_apiRoute_from_building/{buildingId}/{apiId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "getApiFromBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.admin),
    (0, tsoa_1.Delete)("/remove_apiRoute_from_building/{buildingId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "removeApisFromBuilding", null);
__decorate([
    (0, tsoa_1.Security)(constant_1.SECURITY_NAME.profile),
    (0, tsoa_1.Get)("/building_has_apiRoute/{buildingId}/{apiId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BuildingController.prototype, "buildingHasApi", null);
BuildingController = __decorate([
    (0, tsoa_1.Route)("/api/v1/pam"),
    (0, tsoa_1.Tags)("Building"),
    __metadata("design:paramtypes", [])
], BuildingController);
exports.BuildingController = BuildingController;
exports.default = new BuildingController();
//# sourceMappingURL=building.controller.js.map