import { SpinalContext, SpinalGraph } from "spinal-env-viewer-graph-service";
export declare class LogService {
    private static instance;
    private context;
    private constructor();
    static getInstance(): LogService;
    init(graph: SpinalGraph): Promise<SpinalContext>;
}
