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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const constant_1 = require("../constant");
const configFile_service_1 = require("./configFile.service");
class RoleService {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new RoleService();
        }
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.ROLES_CONTEXT_NAME);
            if (!this.context)
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.ROLES_CONTEXT_NAME, constant_1.ROLES_CONTEXT_TYPE);
            const promises = constant_1.DEFAULT_ROLES.map(name => this.createRole({ name, methods: constant_1.ROLE_METHODS[name] }));
            return Promise.all(promises).then(() => {
                return this.context;
            });
        });
    }
    createRole(argRole) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield this.getRole(argRole.name);
            if (role)
                return role;
            const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(argRole, undefined);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
            return this.context.addChildInContext(node, constant_1.CONTEXT_TO_ROLE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        });
    }
    getAllRole() {
        return this.context.getChildrenInContext(this.context);
    }
    getRole(roleIdOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.context.getChildrenInContext(this.context);
            return children.find(node => node.getId().get() === roleIdOrName || node.getName().get() === roleIdOrName);
        });
    }
    updateRole(roleId, newName, roleMethods) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.getRole(roleId);
            if (!role)
                throw new Error(`no role found for ${roleId}`);
            if (role && !!newName) {
                role.info.name.set(newName);
            }
            if (roleMethods && roleMethods.length > 0) {
                role.info.methods.set(roleMethods);
            }
            return role;
        });
    }
    deleteRole(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield this.getRole(roleId);
            if (!role)
                throw new Error(`no role found for ${roleId}`);
            yield role.removeFromGraph();
            return roleId;
        });
    }
}
exports.RoleService = RoleService;
//# sourceMappingURL=role.service.js.map