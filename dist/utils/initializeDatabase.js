"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = void 0;
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_model_graph_1 = require("spinal-model-graph");
const path = require("path");
const constant_1 = require("../constant");
/**
 * Initializes the database by loading an existing configuration file or creating a new one.
 *
 * @export
 * @param {spinal.FileSystem} sessionFilesystem
 * @param {string} directory_path
 * @param {string} configFileName
 * @return {*}  {Promise<SpinalGraph>}
 */
function initializeDatabase(sessionFilesystem, directory_path, configFileName) {
    return new Promise((resolve) => {
        spinal_core_connectorjs_type_1.spinalCore.load(sessionFilesystem, path.resolve(`${directory_path}/${configFileName}`), (graph) => resolve(graph), () => sessionFilesystem.load_or_make_dir(directory_path, (directory) => {
            resolve(_createFile(directory, configFileName));
        }));
    });
}
exports.initializeDatabase = initializeDatabase;
function _createFile(directory, configFileName) {
    const graph = new spinal_model_graph_1.SpinalGraph(configFileName);
    directory.force_add_file(configFileName, graph, { model_type: constant_1.CONFIG_FILE_MODEl_TYPE });
    return graph;
}
//# sourceMappingURL=initializeDatabase.js.map