import { SpinalGraph, SpinalContext } from "spinal-model-graph";
export default class ConfigFileService {
    private static instance;
    graph: SpinalGraph;
    hubConnect: spinal.FileSystem;
    private constructor();
    static getInstance(): ConfigFileService;
    init(connect: spinal.FileSystem): Promise<(SpinalContext | void)[]>;
    getContext(contextName: string): Promise<SpinalContext>;
    addContext(contextName: string, contextType?: string): Promise<SpinalContext>;
    private loadOrMakeConfigFile;
    private _createFile;
    private _initServices;
}
export declare const configServiceInstance: ConfigFileService;
