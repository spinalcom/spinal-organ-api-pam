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
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const configFile_service_1 = require("./configFile.service");
const constant_1 = require("../constant");
const apps_service_1 = require("./apps.service");
const building_service_1 = require("./building.service");
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
    addPortofolio(portofolioName, buildingsIds = [], appsIds = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = new spinal_env_viewer_graph_service_1.SpinalNode(portofolioName, constant_1.PORTOFOLIO_TYPE);
            yield this.context.addChildInContext(node, constant_1.CONTEXT_TO_PORTOFOLIO_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
            const apps = yield this.addAppToPortofolio(node, appsIds);
            const buildings = yield this.addBuildingToPortofolio(node, buildingsIds);
            return {
                node,
                apps,
                buildings
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
            const [apps, buildings] = yield Promise.all([this.getPortofolioApps(node), this.getPortofolioBuildings(node)]);
            return { node, apps, buildings };
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
            return applicationId.reduce((prom, appId) => __awaiter(this, void 0, void 0, function* () {
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
            return applicationId.reduce((prom, appId) => __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    portofolioHasApp(portofolio, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const apps = yield this.getPortofolioApps(portofolio);
            return apps.find(el => el.getId().get() === appId);
        });
    }
    //////////////////////////////////////////////////////
    //                      BUILDINGS                   //
    //////////////////////////////////////////////////////
    addBuildingToPortofolio(portofolio, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof portofolio === "string")
                portofolio = yield this.getPortofolio(portofolio);
            if (!(portofolio instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                throw new Error(`No portofolio found for ${portofolio}`);
            if (!Array.isArray(buildingId))
                buildingId = [buildingId];
            return buildingId.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const buildingNode = yield building_service_1.BuildingService.getInstance().getBuildingById(id);
                if (!(buildingNode instanceof spinal_env_viewer_graph_service_1.SpinalNode))
                    return liste;
                const childrenIds = portofolio.getChildrenIds();
                const isChild = childrenIds.find(el => el === id);
                if (!isChild)
                    portofolio.addChildInContext(buildingNode, constant_1.BUILDING_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
                liste.push(buildingNode);
                return liste;
                //         const appNode = AppService.getInstance().getAppById(appId);
                //         if (!(appNode instanceof SpinalNode)) throw new Error(`No application found for ${appId}`);
            }), Promise.resolve([]));
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
            return buildingId.reduce((prom, id) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const buildingNode = yield building_service_1.BuildingService.getInstance().getBuildingById(id);
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
        });
    }
    portofolioHasBuilding(portofolio, buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const buildings = yield this.getPortofolioBuildings(portofolio);
            return buildings.find(el => el.getId().get() === buildingId);
        });
    }
    _formatDetails(node, apps, buildings) {
        return Object.assign(Object.assign({}, node.info.get()), { buildings: buildings.map(el => el.info.get()), apps: apps.map(el => el.info.get()) });
    }
}
exports.PortofolioService = PortofolioService;
//# sourceMappingURL=portofolio.service.js.map