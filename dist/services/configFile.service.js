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
exports.configServiceInstance = void 0;
const path = require("path");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_model_graph_1 = require("spinal-model-graph");
const constant_1 = require("../constant");
const _1 = require(".");
const adminApps_1 = require("../adminApps");
const codeUnique_service_1 = require("./codeUnique.service");
// const { config: { directory_path, fileName } } = require("../../config");
const directory_path = process.env.CONFIG_DIRECTORY_PATH || constant_1.CONFIG_DEFAULT_DIRECTORY_PATH;
const fileName = process.env.CONFIG_FILE_NAME || constant_1.CONFIG_DEFAULT_NAME;
class ConfigFileService {
    constructor() { }
    static getInstance() {
        if (!ConfigFileService.instance) {
            ConfigFileService.instance = new ConfigFileService();
        }
        return ConfigFileService.instance;
    }
    init(connect) {
        return this.loadOrMakeConfigFile(connect).then((graph) => {
            this.hubConnect = connect;
            this.graph = graph;
            return this._initServices().then((result) => __awaiter(this, void 0, void 0, function* () {
                yield _1.DigitalTwinService.getInstance().createDigitalTwin("PAM DigitalTwin", constant_1.CONFIG_DEFAULT_DIRECTORY_PATH);
                yield (0, adminApps_1.createDefaultAdminApps)();
                return result;
            }));
        });
    }
    getContext(contextName) {
        return this.graph.getContext(contextName);
    }
    addContext(contextName, contextType) {
        const context = new spinal_model_graph_1.SpinalContext(contextName, contextType);
        return this.graph.addContext(context);
    }
    loadOrMakeConfigFile(connect) {
        return new Promise((resolve, reject) => {
            spinal_core_connectorjs_type_1.spinalCore.load(connect, path.resolve(`${directory_path}/${fileName}`), (graph) => resolve(graph), () => connect.load_or_make_dir(directory_path, (directory) => {
                resolve(this._createFile(directory, fileName));
            }));
        });
    }
    _createFile(directory, fileName = constant_1.CONFIG_DEFAULT_NAME) {
        const graph = new spinal_model_graph_1.SpinalGraph(constant_1.CONFIG_DEFAULT_NAME);
        directory.force_add_file(fileName, graph, { model_type: constant_1.CONFIG_FILE_MODEl_TYPE });
        return graph;
    }
    _initServices() {
        const services = [
            _1.APIService,
            _1.AppProfileService,
            _1.AppService,
            _1.BuildingService,
            _1.OrganListService,
            _1.RoleService,
            _1.UserProfileService,
            _1.UserListService,
            _1.AppListService,
            // DigitalTwinService,
            _1.PortofolioService,
            _1.TokenService,
            _1.LogService,
            codeUnique_service_1.SpinalCodeUniqueService,
        ];
        const promises = services.map(service => {
            try {
                const instance = service.getInstance();
                if (typeof instance.init === "function")
                    return instance.init();
            }
            catch (error) {
                console.error(error);
            }
        });
        return Promise.all(promises);
        // .then((result) => {
        // this._initChildrenServices();
        // return result;
        // })
    }
}
exports.default = ConfigFileService;
exports.configServiceInstance = ConfigFileService.getInstance();
//# sourceMappingURL=configFile.service.js.map