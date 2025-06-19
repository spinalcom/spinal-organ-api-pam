import { SpinalGraph } from "spinal-model-graph";
/**
 * Initializes the database by loading an existing configuration file or creating a new one.
 *
 * @export
 * @param {spinal.FileSystem} sessionFilesystem
 * @param {string} directory_path
 * @param {string} configFileName
 * @return {*}  {Promise<SpinalGraph>}
 */
export declare function initializeDatabase(sessionFilesystem: spinal.FileSystem, directory_path: string, configFileName: string): Promise<SpinalGraph>;
