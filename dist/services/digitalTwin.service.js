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
exports.DigitalTwinService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
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
    /**
     * Set session to connect to the digital twin.
     * @param {spinal.FileSystem} session
     * @memberof DigitalTwinService
     */
    setConnectSession(session) {
        this.connectSession = session;
    }
    /**
     * Creates or retrieves a Digital Twin graph.
     * If the graph does not exist, it will be created in the specified directory.
     * Also ensures the Portofolio context is added to the graph if not already present.
     *
     * @param {string} name - The name of the digital twin.
     * @param {string} [directoryPath="/__users__/admin/PAM DigitalTwin"] - The directory path where the digital twin is stored.
     * @returns {Promise<SpinalGraph>} - The created or retrieved SpinalGraph instance.
     */
    initDigitalTwin(name, directoryPath = "/__users__/admin/PAM DigitalTwin") {
        return this._getOrCreateDigitalTwin(name, directoryPath).then(async (graph) => {
            const portofolioContext = portofolio_service_1.PortofolioService.getInstance().context;
            const portofolioContextIsLinked = await graph.getContext(portofolioContext.getName().get());
            if (!portofolioContextIsLinked)
                await graph.addContext(portofolioContext);
            return graph;
        });
    }
    _getOrCreateDigitalTwin(name, directoryPath) {
        return new Promise((resolve, reject) => {
            spinal_core_connectorjs_type_1.spinalCore.load(this.connectSession, path.resolve(`${directoryPath}/${name}`), (graph) => {
                resolve(graph);
            }, () => this.connectSession.load_or_make_dir(directoryPath, (directory) => {
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