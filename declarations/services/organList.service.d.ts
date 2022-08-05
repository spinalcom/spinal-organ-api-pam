import { SpinalContext } from "spinal-env-viewer-graph-service";
export declare class OrganListService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): OrganListService;
    init(): Promise<SpinalContext>;
}
