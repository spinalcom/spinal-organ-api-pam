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
exports.PortofolioService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const configFile_service_1 = require("./configFile.service");
const constant_1 = require("../constant");
const apps_service_1 = require("./apps.service");
const building_service_1 = require("./building.service");
const apis_service_1 = require("./apis.service");
const adminProfile_service_1 = require("./adminProfile.service");
const adminProfileInstance = adminProfile_service_1.AdminProfileService.getInstance();
class PortofolioService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new PortofolioService();
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.PORTOFOLIO_CONTEXT_NAME);
            if (!this.context)
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.PORTOFOLIO_CONTEXT_NAME, constant_1.PORTOFOLIO_CONTEXT_TYPE);
            return this.context;
        });
    }
    addPortofolio(portofolioName, appsIds = [], apisIds = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = new spinal_env_viewer_graph_service_1.SpinalNode(portofolioName, constant_1.PORTOFOLIO_TYPE);
            yield this.context.addChildInContext(node, constant_1.CONTEXT_TO_PORTOFOLIO_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
            const apps = yield this.addAppToPortofolio(node, appsIds);
            const apis = yield this.addApiToPortofolio(node, apisIds);
            // const buildings = await this.addBuildingToPortofolio(node, buildingsIds);
            adminProfileInstance.syncAdminProfile();
            return {
                node,
                apps,
                buildings: [],
                apis
            };
        });
    }
    renamePortofolio(portfolioId, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            const portofolio = yield this.getPortofolio(portfolioId);
            if (!portofolio)
                return false;
            portofolio.info.name.set(newName.trim());
            return true;
        });
    }
    updateProtofolio(portofolioId, newData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this.getPortofolio(portofolioId);
            if (!node)
                return;
            if ((_a = newData.name) === null || _a === void 0 ? void 0 : _a.trim())
                node.info.name.set(newData.name.trim());
            if (newData.authorizeAppIds)
                yield this.addAppToPortofolio(node, newData.authorizeAppIds);
            if (newData.authorizeApiIds)
                yield this.addApiToPortofolio(node, newData.authorizeApiIds);
            if (newData.unauthorizeAppIds)
                yield this.removeAppFromPortofolio(node, newData.unauthorizeAppIds);
            if (newData.unauthorizeApiIds)
                yield this.removeApiFromPortofolio(node, newData.unauthorizeApiIds);
            return this.getPortofolioDetails(node);
        });
    }
    getAllPortofolio() {
        return this.context.getChildren([constant_1.CONTEXT_TO_PORTOFOLIO_RELATION_NAME]);
    }
    getPortofolio(portofolioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const portofolios = yield this.getAllPortofolio();
            return portofolios.find(el => el.getId().get() === portofolioId);
        });
    }
    getPortofolioDetails(portofolio) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : yield this.getPortofolio(portofolio);
            if (!node)
                throw new Error(`No portofolio found for {portofolio}`);
            const [apps, buildings, apis] = yield Promise.all([this.getPortofolioApps(node), this.getPortofolioBuildings(node), this.getPortofolioApis(node)]);
            return {
                node,
                apps,
                buildings: yield Promise.all(buildings.map(el => building_service_1.BuildingService.getInstance().getBuildingStructure(el))),
                apis
            };
        });
    }
    getAllPortofoliosDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const portofolios = yield this.getAllPortofolio();
            return portofolios.reduce((prom, el) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const details = yield this.getPortofolioDetails(el);
                if (details)
                    liste.push(details);
                return liste;
            }), Promise.resolve([]));
        });
    }
    removePortofolio(portofolio) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode ? portofolio : yield this.getPortofolio(portofolio);
                const buildings = yield this.getPortofolioBuildings(node);
                yield Promise.all(buildings.map(el => building_service_1.BuildingService.getInstance().deleteBuilding(el.getId().get())));
                yield this.context.removeChild(node, constant_1.CONTEXT_TO_PORTOFOLIO_RELATION_NAME, constant_1.PTR_LST_TYPE);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    //////////////////////////////////////////////////////
    //                      APPS                        //
    //////////////////////////////////////////////////////
    addAppToPortofolio(portofolio, applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof portofolio === "string")
                portofolio = yield this.getPortofolio(portofolio);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                throw new Error(`No portofolio found for ${portofolio}`);
            if (!Array.isArray(applicationId))
                applicationId = [applicationId];
            const data = yield applicationId.reduce((prom, appId) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const appNode = yield apps_service_1.AppService.getInstance().getPortofolioApp(appId);
                if (!(appNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                    return liste;
                const childrenIds = portofolio.getChildrenIds();
                const isChild = childrenIds.find(el => el === appId);
                if (!isChild)
                    portofolio.addChildInContext(appNode, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
                liste.push(appNode);
                return liste;
            }), Promise.resolve([]));
            adminProfileInstance.syncAdminProfile();
            return data;
        });
    }
    getPortofolioApps(portofolio) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof portofolio === "string")
                portofolio = yield this.getPortofolio(portofolio);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return [];
            return portofolio.getChildren([constant_1.APP_RELATION_NAME]);
        });
    }
    getAppFromPortofolio(portofolio, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof portofolio === "string")
                portofolio = yield this.getPortofolio(portofolio);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const children = yield portofolio.getChildren([constant_1.APP_RELATION_NAME]);
            return children.find(el => el.getId().get() === appId);
        });
    }
    removeAppFromPortofolio(portofolio, applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof portofolio === "string")
                portofolio = yield this.getPortofolio(portofolio);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                throw new Error(`No portofolio found for ${portofolio}`);
            if (!Array.isArray(applicationId))
                applicationId = [applicationId];
            const data = yield applicationId.reduce((prom, appId) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const appNode = yield this.getAppFromPortofolio(portofolio, appId);
                if (!(appNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                    return liste;
                try {
                    yield portofolio.removeChild(appNode, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE);
                    liste.push(appId);
                }
                catch (error) { }
                return liste;
            }), Promise.resolve([]));
            adminProfileInstance.syncAdminProfile();
            return data;
        });
    }
    portofolioHasApp(portofolio, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const apps = yield this.getPortofolioApps(portofolio);
            return apps.find(el => el.getId().get() === appId);
        });
    }
    //////////////////////////////////////////////////////
    //                      APIS                        //
    //////////////////////////////////////////////////////
    addApiToPortofolio(portofolio, apisIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof portofolio === "string")
                portofolio = yield this.getPortofolio(portofolio);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                throw new Error(`No portofolio found for ${portofolio}`);
            if (!Array.isArray(apisIds))
                apisIds = [apisIds];
            const data = yield apisIds.reduce((prom, apiId) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const apiNode = yield apis_service_1.APIService.getInstance().getApiRouteById(apiId, constant_1.PORTOFOLIO_API_GROUP_TYPE);
                if (!(apiNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                    return liste;
                const childrenIds = portofolio.getChildrenIds();
                const isChild = childrenIds.find(el => el === apiId);
                if (!isChild)
                    portofolio.addChildInContext(apiNode, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
                liste.push(apiNode);
                return liste;
            }), Promise.resolve([]));
            adminProfileInstance.syncAdminProfile();
            return data;
        });
    }
    getPortofolioApis(portofolio) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof portofolio === "string")
                portofolio = yield this.getPortofolio(portofolio);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return [];
            return portofolio.getChildren([constant_1.API_RELATION_NAME]);
        });
    }
    getApiFromPortofolio(portofolio, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof portofolio === "string")
                portofolio = yield this.getPortofolio(portofolio);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                return;
            const children = yield this.getPortofolioApis(portofolio);
            return children.find(el => el.getId().get() === apiId);
        });
    }
    removeApiFromPortofolio(portofolio, apisIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof portofolio === "string")
                portofolio = yield this.getPortofolio(portofolio);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                throw new Error(`No portofolio found for ${portofolio}`);
            if (!Array.isArray(apisIds))
                apisIds = [apisIds];
            const data = yield apisIds.reduce((prom, apiId) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const appNode = yield this.getApiFromPortofolio(portofolio, apiId);
                if (!(appNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                    return liste;
                try {
                    yield portofolio.removeChild(appNode, constant_1.API_RELATION_NAME, constant_1.PTR_LST_TYPE);
                    liste.push(apiId);
                }
                catch (error) { }
                return liste;
            }), Promise.resolve([]));
            adminProfileInstance.removeFromAdminProfile({ portofolioId: portofolio.getId().get(), unauthorizeApisIds: apisIds });
            return data;
        });
    }
    portofolioHasApi(portofolio, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            const apps = yield this.getPortofolioApis(portofolio);
            return apps.find(el => el.getId().get() === apiId);
        });
    }
    uploadSwaggerFile(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            return apis_service_1.APIService.getInstance().uploadSwaggerFile(buffer, constant_1.PORTOFOLIO_API_GROUP_TYPE);
        });
    }
    //////////////////////////////////////////////////////
    //                      BUILDINGS                   //
    //////////////////////////////////////////////////////
    addBuildingToPortofolio(portofolio, buildingInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof portofolio === "string")
                portofolio = yield this.getPortofolio(portofolio);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                throw new Error(`No portofolio found for ${portofolio}`);
            // if (!Array.isArray(buildingId)) buildingId = [buildingId];
            const structure = yield building_service_1.BuildingService.getInstance().createBuilding(buildingInfo);
            yield portofolio.addChildInContext(structure.node, constant_1.BUILDING_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
            adminProfileInstance.syncAdminProfile();
            return structure;
            // return buildingId.reduce(async (prom, id: string) => {
            //     const liste = await prom;
            //     const buildingNode = await BuildingService.getInstance().getBuildingById(id);
            //     if (!(buildingNode instanceof SpinalNode)) return liste;
            //     const childrenIds = (<SpinalNode>portofolio).getChildrenIds();
            //     const isChild = childrenIds.find(el => el === id);
            //     if (!isChild) (<SpinalNode>portofolio).addChildInContext(buildingNode, BUILDING_RELATION_NAME, PTR_LST_TYPE, this.context);
            //     liste.push(buildingNode);
            //     return liste;
            //     //         const appNode = AppService.getInstance().getAppById(appId);
            //     //         if (!(appNode instanceof SpinalNode)) throw new Error(`No application found for ${appId}`);
            // }, Promise.resolve([]))
        });
    }
    getPortofolioBuildings(portofolio) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof portofolio === "string")
                portofolio = yield this.getPortofolio(portofolio);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                throw new Error(`No portofolio found for ${portofolio}`);
            return portofolio.getChildren([constant_1.BUILDING_RELATION_NAME]);
        });
    }
    removeBuildingFromPortofolio(portofolio, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof portofolio === "string")
                portofolio = yield this.getPortofolio(portofolio);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                throw new Error(`No portofolio found for ${portofolio}`);
            if (!Array.isArray(buildingId))
                buildingId = [buildingId];
            const data = yield buildingId.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const buildingNode = yield this.getBuildingFromPortofolio(portofolio, id);
                if (!(buildingNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                    return liste;
                try {
                    yield portofolio.removeChild(buildingNode, constant_1.BUILDING_RELATION_NAME, constant_1.PTR_LST_TYPE);
                    liste.push(id);
                }
                catch (error) { }
                return liste;
                //         const appNode = AppService.getInstance().getAppById(appId);
                //         if (!(appNode instanceof SpinalNode)) throw new Error(`No application found for ${appId}`);
            }), Promise.resolve([]));
            return data;
        });
    }
    getBuildingFromPortofolio(portofolio, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const buildings = yield this.getPortofolioBuildings(portofolio);
            return buildings.find(el => el.getId().get() === buildingId);
        });
    }
    _formatDetails(data) {
        return Object.assign(Object.assign({}, (data.node.info.get())), { buildings: data.buildings.map(el => building_service_1.BuildingService.getInstance().formatBuildingStructure(el)), apps: data.apps.map(el => el.info.get()), apis: data.apis.map(el => el.info.get()) });
    }
}
exports.PortofolioService = PortofolioService;
//# sourceMappingURL=portofolio.service.js.map