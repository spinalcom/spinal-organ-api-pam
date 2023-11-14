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
exports.AdminProfileService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const authorization_service_1 = require("./authorization.service");
const portofolio_service_1 = require("./portofolio.service");
const userProfile_service_1 = require("./userProfile.service");
class AdminProfileService {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AdminProfileService();
        }
        return this.instance;
    }
    get adminNode() {
        return this._adminNode;
    }
    init(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let node = yield this.getAdminProfile(context);
            if (!node) {
                node = this._createAdminProfile();
                yield context.addChildInContext(node, constant_1.CONTEXT_TO_USER_PROFILE_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
            }
            this._adminNode = node;
            yield this.syncAdminProfile();
            return node;
        });
    }
    addAppToProfil(app) {
        return __awaiter(this, void 0, void 0, function* () {
            const { context, portofolio } = yield this._createOrGetAdminPortofolio();
            const reference = new spinal_env_viewer_graph_service_1.SpinalNode(app.getName().get(), app.getType().get(), app);
            yield portofolio.addChildInContext(reference, constant_1.APP_RELATION_NAME, constant_1.PTR_LST_TYPE, context);
        });
    }
    addToAdminProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return userProfile_service_1.UserProfileService.getInstance()._authorizeIPortofolioAuth(this._adminNode, data);
        });
    }
    removeFromAdminProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return userProfile_service_1.UserProfileService.getInstance()._unauthorizeIPortofolioAuth(this._adminNode, data);
        });
    }
    syncAdminProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._getPortofoliosStructure();
            return data.reduce((prom, el) => __awaiter(this, void 0, void 0, function* () {
                const liste = yield prom;
                const res = yield userProfile_service_1.UserProfileService.getInstance()._authorizeIPortofolioAuth(this._adminNode, el);
                liste.push(res);
                return liste;
            }), Promise.resolve([]));
        });
    }
    getAdminProfile(argContext) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._adminNode)
                return this._adminNode;
            const context = argContext || userProfile_service_1.UserProfileService.getInstance().context;
            if (!context)
                return;
            const children = yield context.getChildren();
            return children.find((el) => {
                return (el.getName().get() === constant_1.ADMIN_PROFILE_NAME &&
                    el.getType().get() === constant_1.ADMIN_PROFILE_TYPE);
            });
        });
    }
    isAdmin(profileId) {
        return this._adminNode.getId().get() === profileId;
    }
    _createAdminProfile() {
        const info = {
            name: constant_1.ADMIN_PROFILE_NAME,
            type: constant_1.ADMIN_PROFILE_TYPE,
        };
        const graph = new spinal_env_viewer_graph_service_1.SpinalGraph(constant_1.ADMIN_PROFILE_NAME);
        const profileId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, graph);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(profileId);
        return node;
    }
    _getPortofoliosStructure() {
        return __awaiter(this, void 0, void 0, function* () {
            const details = yield portofolio_service_1.PortofolioService.getInstance().getAllPortofoliosDetails();
            return details.map(({ node, apps, apis, buildings }) => {
                return {
                    portofolioId: node.getId().get(),
                    appsIds: apps.map((el) => el.getId().get()),
                    apisIds: apis.map((el) => el.getId().get()),
                    building: buildings.map((building) => {
                        return {
                            buildingId: building.node.getId().get(),
                            appsIds: building.apps.map((el) => el.getId().get()),
                            apisIds: building.apis.map((el) => el.getId().get()),
                        };
                    }),
                };
            });
        });
    }
    _createOrGetAdminPortofolio() {
        return __awaiter(this, void 0, void 0, function* () {
            const adminPortofolio = 'Administration';
            const context = yield authorization_service_1.default.getInstance()._getAuthorizedPortofolioContext(this._adminNode, true);
            const children = yield context.getChildren();
            let found = children.find((el) => el.getName().get() === adminPortofolio);
            if (found)
                return { context, portofolio: found };
            const node = new spinal_env_viewer_graph_service_1.SpinalNode(adminPortofolio, adminPortofolio);
            const refNode = new spinal_env_viewer_graph_service_1.SpinalNode(adminPortofolio, adminPortofolio, node);
            yield context.addChildInContext(refNode, constant_1.PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, constant_1.PTR_LST_TYPE, context);
            return { context, portofolio: refNode };
        });
    }
}
exports.AdminProfileService = AdminProfileService;
//# sourceMappingURL=adminProfile.service.js.map