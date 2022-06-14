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
import { configServiceInstance } from './configFile.service';



export class RoleService {

  private static instance: RoleService;
  public context: SpinalContext;

  private constructor() { }

  public static getInstance(): RoleService {
    if (!this.instance) {
      this.instance = new RoleService();
    }

    return this.instance;
  }

  public async init() {
    this.context = await configServiceInstance.getContext(ROLES_CONTEXT_NAME);
    if (!this.context) this.context = await configServiceInstance.addContext(ROLES_CONTEXT_NAME, ROLES_CONTEXT_TYPE);

    const promises = DEFAULT_ROLES.map(name => this.createRole({ name, methods: ROLE_METHODS[name] }));
    return Promise.all(promises).then(() => {
      return this.context;
    })
  }

  public async createRole(argRole: IRole): Promise<SpinalNode> {
    let role = await this.getRole(argRole.name);
    if (role) return role;

    const nodeId = SpinalGraphService.createNode(argRole, undefined);
    const node = SpinalGraphService.getRealNode(nodeId);
    return this.context.addChildInContext(node, CONTEXT_TO_ROLE_RELATION_NAME, PTR_LST_TYPE, this.context);
  }


  public getAllRole(): Promise<SpinalNode[]> {
    return this.context.getChildrenInContext(this.context);
  }


  public async getRole(roleIdOrName: string): Promise<void | SpinalNode> {
    const children = await this.context.getChildrenInContext(this.context);
    return children.find(node => node.getId().get() === roleIdOrName || node.getName().get() === roleIdOrName)
  }


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


  public async deleteRole(roleId: string): Promise<string> {
    const role = await this.getRole(roleId);
    if (!role) throw new Error(`no role found for ${roleId}`);

    await role.removeFromGraph();
    return roleId;
  }
}
