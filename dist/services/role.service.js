"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
/**
 * Service for managing roles within the SpinalGraph context.
 * Implements singleton pattern to ensure a single instance.
 */
class RoleService {
    // Private constructor to enforce singleton pattern
    constructor() { }
    /**
     * Returns the singleton instance of RoleService.
     */
    static getInstance() {
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
    async init(graph) {
        this.context = await graph.getContext(constant_1.ROLES_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.ROLES_CONTEXT_NAME, constant_1.ROLES_CONTEXT_TYPE);
            this.context = await graph.addContext(spinalContext);
        }
        const promises = constant_1.DEFAULT_ROLES.map(name => this.createRole({ name, methods: constant_1.ROLE_METHODS[name] }));
        return Promise.all(promises).then(() => {
            return this.context;
        });
    }
    /**
     * Creates a new role node if it does not already exist.
     * @param argRole Role data
     * @returns The created or existing SpinalNode
     */
    async createRole(argRole) {
        let role = await this.getRole(argRole.name);
        if (role)
            return role;
        const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(argRole, undefined);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
        return this.context.addChildInContext(node, constant_1.CONTEXT_TO_ROLE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
    }
    /**
     * Retrieves all role nodes in the context.
     * @returns Promise resolving to an array of SpinalNode
     */
    getAllRole() {
        return this.context.getChildrenInContext(this.context);
    }
    /**
     * Retrieves a role node by its ID or name.
     * @param roleIdOrName Role ID or name
     * @returns Promise resolving to the found SpinalNode or undefined
     */
    async getRole(roleIdOrName) {
        const children = await this.context.getChildrenInContext(this.context);
        return children.find(node => node.getId().get() === roleIdOrName || node.getName().get() === roleIdOrName);
    }
    /**
     * Updates the name and/or methods of a role.
     * @param roleId Role ID
     * @param newName New name for the role
     * @param roleMethods Optional new methods for the role
     * @returns Promise resolving to the updated SpinalNode or void
     */
    async updateRole(roleId, newName, roleMethods) {
        const role = await this.getRole(roleId);
        if (!role)
            throw new Error(`no role found for ${roleId}`);
        if (role && !!newName) {
            role.info.name.set(newName);
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
    async deleteRole(roleId) {
        const role = await this.getRole(roleId);
        if (!role)
            throw new Error(`no role found for ${roleId}`);
        await role.removeFromGraph();
        return roleId;
    }
}
exports.RoleService = RoleService;
//# sourceMappingURL=role.service.js.map