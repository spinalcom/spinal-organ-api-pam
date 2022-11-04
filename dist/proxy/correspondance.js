"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correspondanceObj = void 0;
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
exports.correspondanceObj = {
    "context/{idContext}/nodeTypeList/{type}": "context/{id}/nodesOfType/{type}",
    "geographicContext": "geographicContext/tree",
    "floor_list": "floor/list",
    "workflow_list": "workflow/list",
    "workflow/{idWorkFlow}/process_list": "workflow/{id}/processList",
    "workflow/{idWorkFlow}/process/{processId}/step_list": "workflow/{workflowId}/process/{processId}/stepList",
    "node/{idNode}/children_node": "relation/{id}/children_node",
    "node/{idNode}/parent_node": "relation/{id}/parent_node"
};
//# sourceMappingURL=correspondance.js.map