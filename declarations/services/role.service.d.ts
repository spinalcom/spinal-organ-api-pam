import { SpinalContext, SpinalGraph, SpinalNode } from 'spinal-env-viewer-graph-service';
import { HTTP_METHODS, IRole } from '../interfaces';
/**
 * Service for managing roles within the SpinalGraph context.
 * Implements singleton pattern to ensure a single instance.
 */
export declare class RoleService {
    private static instance;
    context: SpinalContext;
    private constructor();
    /**
     * Returns the singleton instance of RoleService.
     */
    static getInstance(): RoleService;
    /**
     * Initializes the roles context in the provided graph.
     * Creates default roles if they do not exist.
     * @param graph SpinalGraph instance
     */
    init(graph: SpinalGraph): Promise<SpinalContext<any>>;
    /**
     * Creates a new role node if it does not already exist.
     * @param argRole Role data
     * @returns The created or existing SpinalNode
     */
    createRole(argRole: IRole): Promise<SpinalNode>;
    /**
     * Retrieves all role nodes in the context.
     * @returns Promise resolving to an array of SpinalNode
     */
    getAllRole(): Promise<SpinalNode[]>;
    /**
     * Retrieves a role node by its ID or name.
     * @param roleIdOrName Role ID or name
     * @returns Promise resolving to the found SpinalNode or undefined
     */
    getRole(roleIdOrName: string): Promise<void | SpinalNode>;
    /**
     * Updates the name and/or methods of a role.
     * @param roleId Role ID
     * @param newName New name for the role
     * @param roleMethods Optional new methods for the role
     * @returns Promise resolving to the updated SpinalNode or void
     */
    updateRole(roleId: string, newName: string, roleMethods?: HTTP_METHODS[]): Promise<SpinalNode | void>;
    /**
     * Deletes a role node from the graph.
     * @param roleId Role ID
     * @returns Promise resolving to the deleted role's ID
     */
    deleteRole(roleId: string): Promise<string>;
}
