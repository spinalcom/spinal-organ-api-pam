import { SpinalContext, SpinalGraph } from "spinal-env-viewer-graph-service";
export declare class SpinalCodeUniqueService {
    static instance: SpinalCodeUniqueService;
    context: SpinalContext;
    private constructor();
    static getInstance(): SpinalCodeUniqueService;
    init(graph: SpinalGraph): Promise<SpinalContext>;
    consumeCode(code: string): Promise<any>;
    private _getProfileInfo;
    private _getCodeInfo;
    private _addUserToContext;
}
