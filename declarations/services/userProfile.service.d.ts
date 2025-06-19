import { SpinalGraph, SpinalContext } from 'spinal-env-viewer-graph-service';
import { ProfileBase } from '../utils/profileBase';
export declare class UserProfileService extends ProfileBase {
    private static instance;
    context: SpinalContext;
    private adminProfile;
    private constructor();
    static getInstance(): UserProfileService;
    init(graph: SpinalGraph): Promise<SpinalContext>;
}
