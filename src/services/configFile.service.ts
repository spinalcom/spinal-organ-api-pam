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

import * as path from 'path';
import { spinalCore } from "spinal-core-connectorjs_type";
import { SpinalGraph, SpinalContext } from "spinal-model-graph";
import { CONFIG_GRAPH_NAME, CONFIG_FILE_MODEl_TYPE } from "../constant";

import { APIService, AppProfileService, AppService, BuildingService, OrganListService, RoleService, UserProfileService } from ".";

const { config: { directory_path, fileName } } = require("../../config");


export default class ConfigFileService {
    private static instance: ConfigFileService;
    public graph: SpinalGraph;

    private constructor() { }

    public static getInstance(): ConfigFileService {
        if (!ConfigFileService.instance) {
            ConfigFileService.instance = new ConfigFileService();
        }
        return ConfigFileService.instance;
    }

    public init(connect: spinal.FileSystem) {
        return this.loadOrMakeConfigFile(connect).then((graph: SpinalGraph) => {
            this.graph = graph;
            return this._initServices();
        })
    }

    public getContext(contextName: string): Promise<SpinalContext> {
        return this.graph.getContext(contextName);
    }

    public addContext(contextName: string, contextType?: string): Promise<SpinalContext> {
        const context = new SpinalContext(contextName, contextType)
        return this.graph.addContext(context);
    }

    private loadOrMakeConfigFile(connect: spinal.FileSystem): Promise<SpinalGraph> {
        return new Promise((resolve, reject) => {
            spinalCore.load(connect, path.resolve(`${directory_path}/${fileName}`),
                (graph: SpinalGraph) => resolve(graph),
                () => connect.load_or_make_dir(directory_path, (directory) => {
                    resolve(this._createFile(directory, fileName));
                })
            )
        });
    }

    private _createFile(directory: spinal.Directory, fileName: string = "PAMConfig"): SpinalGraph {
        const graph = new SpinalGraph(CONFIG_GRAPH_NAME);
        directory.force_add_file(fileName, graph, { model_type: CONFIG_FILE_MODEl_TYPE });
        return graph;
    }

    private _initServices() {
        const services = [APIService, AppProfileService, AppService, BuildingService, OrganListService, RoleService, UserProfileService];

        const promises = services.map(service => {
            try {
                const instance = service.getInstance();
                if (typeof instance.init === "function") return instance.init();

            } catch (error) {
                console.error(error);
            }
        })

        return Promise.all(promises);
    }

}


export const configServiceInstance = ConfigFileService.getInstance(); 