import { SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
import { HTTP_METHODS, IRole } from '../interfaces';
export declare class RoleService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): RoleService;
    init(): Promise<SpinalContext<any>>;
    createRole(argRole: IRole): Promise<SpinalNode>;
    getAllRole(): Promise<SpinalNode[]>;
    getRole(roleIdOrName: string): Promise<void | SpinalNode>;
    updateRole(roleId: string, newName: string, roleMethods?: HTTP_METHODS[]): Promise<SpinalNode | void>;
    deleteRole(roleId: string): Promise<string>;
}
