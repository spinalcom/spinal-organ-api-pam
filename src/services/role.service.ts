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

import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from 'spinal-env-viewer-graph-service';
import { CANNOT_CREATE_INTERNAL_ERROR, ROLE_TYPE, ROLES_CONTEXT_NAME, ROLES_CONTEXT_TYPE, PTR_LST_TYPE, CONTEXT_TO_ROLE_RELATION_NAME, DEFAULT_ROLES, ROLE_METHODS } from '../constant';
import { HTTP_METHODS, IRole } from '../interfaces';



/**
 * Service for managing roles within the SpinalGraph context.
 * Implements singleton pattern to ensure a single instance.
 */
export class RoleService {

  private static instance: RoleService;
  public context: SpinalContext;

  // Private constructor to enforce singleton pattern
  private constructor() { }

  /**
   * Returns the singleton instance of RoleService.
   */
  public static getInstance(): RoleService {
    if (!this.instance) {
      this.instance = new RoleService();
    }

    return this.instance;
  }

  /**
   * Initializes the roles context in the provided graph.
   * Creates default roles if they do not exist.
   * @param graph SpinalGraph instance
   */
  public async init(graph: SpinalGraph) {
    this.context = await graph.getContext(ROLES_CONTEXT_NAME);
    if (!this.context) {
      const spinalContext = new SpinalContext(ROLES_CONTEXT_NAME, ROLES_CONTEXT_TYPE);
      this.context = await graph.addContext(spinalContext);
    }

    const promises = DEFAULT_ROLES.map(name => this.createRole({ name, methods: ROLE_METHODS[name] }));
    return Promise.all(promises).then(() => {
      return this.context;
    })
  }

  /**
   * Creates a new role node if it does not already exist.
   * @param argRole Role data
   * @returns The created or existing SpinalNode
   */
  public async createRole(argRole: IRole): Promise<SpinalNode> {
    let role = await this.getRole(argRole.name);
    if (role) return role;

    const nodeId = SpinalGraphService.createNode(argRole, undefined);
    const node = SpinalGraphService.getRealNode(nodeId);
    return this.context.addChildInContext(node, CONTEXT_TO_ROLE_RELATION_NAME, PTR_LST_TYPE, this.context);
  }

  /**
   * Retrieves all role nodes in the context.
   * @returns Promise resolving to an array of SpinalNode
   */
  public getAllRole(): Promise<SpinalNode[]> {
    return this.context.getChildrenInContext(this.context);
  }

  /**
   * Retrieves a role node by its ID or name.
   * @param roleIdOrName Role ID or name
   * @returns Promise resolving to the found SpinalNode or undefined
   */
  public async getRole(roleIdOrName: string): Promise<void | SpinalNode> {
    const children = await this.context.getChildrenInContext(this.context);
    return children.find(node => node.getId().get() === roleIdOrName || node.getName().get() === roleIdOrName)
  }

  /**
   * Updates the name and/or methods of a role.
   * @param roleId Role ID
   * @param newName New name for the role
   * @param roleMethods Optional new methods for the role
   * @returns Promise resolving to the updated SpinalNode or void
   */
  public async updateRole(roleId: string, newName: string, roleMethods?: HTTP_METHODS[]): Promise<SpinalNode | void> {
    const role = await this.getRole(roleId);
    if (!role) throw new Error(`no role found for ${roleId}`);

    if (role && !!newName) {
      role.info.name.set(newName)
    }
    if (roleMethods && roleMethods.length > 0) {
      role.info.methods.set(roleMethods);
    }
    return role;
  }

  /**
   * Deletes a role node from the graph.
   * @param roleId Role ID
   * @returns Promise resolving to the deleted role's ID
   */
  public async deleteRole(roleId: string): Promise<string> {
    const role = await this.getRole(roleId);
    if (!role) throw new Error(`no role found for ${roleId}`);

    await role.removeFromGraph();
    return roleId;
  }
}
