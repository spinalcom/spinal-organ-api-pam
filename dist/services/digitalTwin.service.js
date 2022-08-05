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
class DigitalTwinService {
    constructor() {
        this.attrName = "defaultDigitalTwin";
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new DigitalTwinService();
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.DIGITALTWIN_CONTEXT_NAME);
            if (!this.context)
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.DIGITALTWIN_CONTEXT_NAME, constant_1.DIGITALTWIN_CONTEXT_TYPE);
            yield this.getActualDigitalTwin();
            return this.context;
        });
    }
    createDigitalTwin(name, directoryPath = "/__users__/admin/PAM DigitalTwin") {
        return this._getOrCreateDigitalTwin(name, directoryPath).then((graph) => __awaiter(this, void 0, void 0, function* () {
            const info = { name, path: path.resolve(`${directoryPath}/${name}`), type: constant_1.DIGITALTWIN_TYPE, graph: new spinal_core_connectorjs_type_1.Ptr(graph) };
            const digitalTwinId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, undefined);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(digitalTwinId);
            yield this.context.addChildInContext(node, constant_1.CONTEXT_TO_DIGITALTWIN_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
            return node;
        }));
    }
    getAllDigitalTwins() {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.context.getChildren(constant_1.CONTEXT_TO_DIGITALTWIN_RELATION_NAME);
            return children.map(el => el);
        });
    }
    getDigitalTwin(digitalTwinName, digitalTwinPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const allDigitalTwins = yield this.getAllDigitalTwins();
            return allDigitalTwins.find(el => {
                var _a;
                if (el.getName().get() !== digitalTwinName)
                    return false;
                if (!digitalTwinPath)
                    return true;
                if (digitalTwinPath === ((_a = el.info.path) === null || _a === void 0 ? void 0 : _a.get()))
                    return true;
                return false;
            });
        });
    }
    getDigitalTwinById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(id);
            if (node)
                return node;
            const allDigitalTwins = yield this.getAllDigitalTwins();
            return allDigitalTwins.find(el => el.getId().get() === id);
        });
    }
    renameDigitalTwin(id, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(newName.trim()))
                throw new Error("invalid name");
            const node = yield this.getDigitalTwinById(id);
            if (node)
                node.info.name.set(newName.trim());
            return node;
        });
    }
    removeDigitalTwin(digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this.getDigitalTwinById(digitalTwinId);
            if (node) {
                yield node.removeFromGraph();
                return true;
            }
            throw new Error(`No digitaltwin found for ${digitalTwinId}`);
        });
    }
    setActualDigitalTwin(digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const digitalTwinNode = yield this.getDigitalTwinById(digitalTwinId);
            if (digitalTwinNode) {
                if (this.context.info[this.attrName]) {
                    yield this.removeActualDigitaTwin();
                }
                digitalTwinNode.info.add_attr({ [this.attrName]: true });
                this.context.info.add_attr({ [this.attrName]: new spinal_core_connectorjs_type_1.Ptr(digitalTwinNode) });
                this._actualDigitalTwin = digitalTwinNode;
                return digitalTwinNode;
            }
            throw new Error(`No digitaltwin found for ${digitalTwinId}`);
        });
    }
    getActualDigitalTwin() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!this.context.info[this.attrName])
                return resolve(undefined);
            this.context.info[this.attrName].load((node) => {
                this._actualDigitalTwin = node;
                resolve(node);
            });
        }));
    }
    removeActualDigitaTwin() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.context.info[this.attrName])
                return;
            const defaultDigitalTwin = yield this.getActualDigitalTwin();
            defaultDigitalTwin.info.rem_attr(this.attrName);
            this.context.info.rem_attr(this.attrName);
        });
    }
    getActualDigitalTwinGraph() {
        return new Promise((resolve, reject) => {
            if (!this._actualDigitalTwin || !this._actualDigitalTwin.info.graph)
                return resolve();
            this._actualDigitalTwin.info.graph.load(graph => resolve(graph));
        });
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