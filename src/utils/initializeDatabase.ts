import { spinalCore } from "spinal-core-connectorjs_type";
import { SpinalGraph } from "spinal-model-graph";
import * as path from "path";
import { CONFIG_FILE_MODEl_TYPE } from "../constant";


/**
 * Initializes the database by loading an existing configuration file or creating a new one.
 *
 * @export
 * @param {spinal.FileSystem} sessionFilesystem
 * @param {string} directory_path
 * @param {string} configFileName
 * @return {*}  {Promise<SpinalGraph>}
 */
export function initializeDatabase(sessionFilesystem: spinal.FileSystem, directory_path: string, configFileName: string): Promise<SpinalGraph> {
    return new Promise((resolve) => {
        spinalCore.load(sessionFilesystem, path.resolve(`${directory_path}/${configFileName}`),
            (graph: SpinalGraph) => resolve(graph),
            () => sessionFilesystem.load_or_make_dir(directory_path, (directory) => {
                resolve(_createFile(directory, configFileName));
            })
        )
    });
}


function _createFile(directory: spinal.Directory, configFileName: string): SpinalGraph {
    const graph = new SpinalGraph(configFileName);
    directory.force_add_file(configFileName, graph, { model_type: CONFIG_FILE_MODEl_TYPE });
    return graph;
}