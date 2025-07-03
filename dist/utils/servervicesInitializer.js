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
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../constant");
const services_1 = require("../services");
const directory_path = process.env.CONFIG_DIRECTORY_PATH || constant_1.CONFIG_DEFAULT_DIRECTORY_PATH;
const fileName = process.env.CONFIG_FILE_NAME || constant_1.CONFIG_DEFAULT_NAME;
class ServicesInitializer {
    constructor() { }
    static getInstance() {
        if (!ServicesInitializer.instance) {
            ServicesInitializer.instance = new ServicesInitializer();
        }
        return ServicesInitializer.instance;
    }
    async initAllService(graph) {
        this.graph = graph;
        const services = [
            services_1.APIService,
            services_1.AppProfileService,
            services_1.AppService,
            services_1.BuildingService,
            services_1.OrganListService,
            services_1.RoleService,
            services_1.UserProfileService,
            services_1.UserListService,
            services_1.AppListService,
            services_1.PortofolioService,
            services_1.TokenService,
            services_1.LogService,
            services_1.AuthentificationService,
            services_1.SpinalCodeUniqueService
        ];
        return this._initServicesList(services);
    }
    _initServicesList(services) {
        const promises = services.map(service => {
            try {
                const serviceInstance = service.getInstance();
                if (typeof serviceInstance.init === "function")
                    return serviceInstance.init(this.graph);
            }
            catch (error) {
                console.error(error);
            }
        });
        return Promise.all(promises);
    }
}
exports.default = ServicesInitializer;
//# sourceMappingURL=servervicesInitializer.js.map