import { SpinalGraph, SpinalContext } from "spinal-model-graph";
export default class ServicesInitializer {
    private static instance;
    graph: SpinalGraph;
    hubConnect: spinal.FileSystem;
    private constructor();
    static getInstance(): ServicesInitializer;
    initAllService(graph: SpinalGraph): Promise<(SpinalContext | void)[]>;
    private _initServicesList;
}
