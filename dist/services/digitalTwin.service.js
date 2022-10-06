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
exports.DigitalTwinService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const configFile_service_1 = require("./configFile.service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const path = require("path");
const constant_1 = require("../constant");
const portofolio_service_1 = require("./portofolio.service");
class DigitalTwinService {
    constructor() {
        this.attrName = "defaultDigitalTwin";
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new DigitalTwinService();
        return this.instance;
    }
    // public async init(): Promise<SpinalContext> {
    //     this.context = await PortofolioService.getInstance().
    //     // if (!this.context) this.context = await configServiceInstance.addContext(DIGITALTWIN_CONTEXT_NAME, DIGITALTWIN_CONTEXT_TYPE);
    //     // await this.getActualDigitalTwin();
    //     return this.context;
    // }
    createDigitalTwin(name, directoryPath = "/__users__/admin/PAM DigitalTwin") {
        return this._getOrCreateDigitalTwin(name, directoryPath).then((graph) => __awaiter(this, void 0, void 0, function* () {
            const portofolioContext = portofolio_service_1.PortofolioService.getInstance().context;
            const _temp = yield graph.getContext(portofolioContext.getName().get());
            if (!_temp)
                yield graph.addContext(portofolioContext);
            return graph;
            // const info = { name, path: path.resolve(`${directoryPath}/${name}`), type: DIGITALTWIN_TYPE, graph: new Ptr(graph) };
            // const digitalTwinId = SpinalGraphService.createNode(info, undefined);
            // const node = SpinalGraphService.getRealNode(digitalTwinId);
            // await this.context.addChildInContext(node, CONTEXT_TO_DIGITALTWIN_RELATION_NAME, PTR_LST_TYPE, this.context);
            // return node;
        }));
    }
    _getOrCreateDigitalTwin(name, directoryPath) {
        const connect = configFile_service_1.configServiceInstance.hubConnect;
        return new Promise((resolve, reject) => {
            spinal_core_connectorjs_type_1.spinalCore.load(connect, path.resolve(`${directoryPath}/${name}`), (graph) => {
                resolve(graph);
            }, () => connect.load_or_make_dir(directoryPath, (directory) => {
                resolve(this._createFile(directory, name, directoryPath));
            }));
        });
    }
    _createFile(directory, fileName, folderPath) {
        const graph = new spinal_env_viewer_graph_service_1.SpinalGraph(fileName);
        directory.force_add_file(fileName, graph, { model_type: constant_1.DIGITALTWIN_TYPE, path: `${folderPath}/${fileName}`, icon: "" });
        return graph;
    }
}
exports.DigitalTwinService = DigitalTwinService;
//# sourceMappingURL=digitalTwin.service.js.map