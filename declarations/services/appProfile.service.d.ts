import { SpinalGraph, SpinalContext } from 'spinal-env-viewer-graph-service';
import { ProfileBase } from '../utils/profileBase';
export declare class AppProfileService extends ProfileBase {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): AppProfileService;
    init(graph: SpinalGraph): Promise<SpinalContext>;
}
