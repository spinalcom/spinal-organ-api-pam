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
exports.BOS_BASE_URI = exports.PAM_BASE_URI = exports.routesToProxy = exports.CANNOT_CREATE_INTERNAL_ERROR = exports.USER_NOT_FOUND = exports.USER_BASE_EMPTY = exports.ROLE_METHODS = exports.DEFAULT_ROLES = exports.LST_PTR_TYPE = exports.PTR_LST_TYPE = exports.CONTEXT_TO_API_ROUTE = exports.CONTEXT_TO_DIGITAL_TWIN_RELATION_NAME = exports.CONTEXT_TO_USER_RELATION_NAME = exports.CONTEXT_TO_ROLE_RELATION_NAME = exports.CONTEXT_TO_APP_PROFILE_RELATION_NAME = exports.CONTEXT_TO_USER_PROFILE_RELATION_NAME = exports.CONTEXT_TO_APP_RELATION_NAME = exports.APP_GROUP_TO_APP_RELATION_NAME = exports.CATEGORY_TO_APP_GROUP_RELATION_NAME = exports.CONTEXT_TO_APP_CATEGORY = exports.API_ROUTE_TYPE = exports.DIGITAL_TWIN_TYPE = exports.APP_TYPE = exports.APP_GROUP_TYPE = exports.APP_CATEGORY_TYPE = exports.APP_PROFILE_TYPE = exports.USER_PROFILE_TYPE = exports.ROLE_TYPE = exports.ORGAN_LIST_CONTEXT_TYPE = exports.API_ROUTES_CONTEXT_TYPE = exports.DIGITAL_TWIN_CONTEXT_TYPE = exports.APP_LIST_CONTEXT_TYPE = exports.ROLES_CONTEXT_TYPE = exports.USER_LIST_CONTEXT_TYPE = exports.APP_PROFILE_CONTEXT_TYPE = exports.USER_PROFILE_CONTEXT_TYPE = exports.ORGAN_LIST_CONTEXT_NAME = exports.API_ROUTES_CONTEXT_NAME = exports.DIGITAL_TWIN_CONTEXT_NAME = exports.APP_LIST_CONTEXT_NAME = exports.ROLES_CONTEXT_NAME = exports.USER_LIST_CONTEXT_NAME = exports.APP_PROFILE_CONTEXT_NAME = exports.USER_PROFILE_CONTEXT_NAME = exports.CONFIG_GRAPH_NAME = exports.CONFIG_FILE_MODEl_TYPE = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const interfaces_1 = require("./interfaces");
exports.CONFIG_FILE_MODEl_TYPE = "SpinalPAM";
exports.CONFIG_GRAPH_NAME = "pam";
//Contexts names
exports.USER_PROFILE_CONTEXT_NAME = 'UserProfileList';
exports.APP_PROFILE_CONTEXT_NAME = 'AppProfileList';
exports.USER_LIST_CONTEXT_NAME = 'UserList';
exports.ROLES_CONTEXT_NAME = 'RoleList';
exports.APP_LIST_CONTEXT_NAME = 'AppList';
exports.DIGITAL_TWIN_CONTEXT_NAME = 'DigitalTwin';
exports.API_ROUTES_CONTEXT_NAME = 'ApiListContext';
exports.ORGAN_LIST_CONTEXT_NAME = 'OrganListContext';
//Contexts types
exports.USER_PROFILE_CONTEXT_TYPE = 'UserProfileList';
exports.APP_PROFILE_CONTEXT_TYPE = 'AppProfileList';
exports.USER_LIST_CONTEXT_TYPE = 'UserList';
exports.ROLES_CONTEXT_TYPE = 'RoleList';
exports.APP_LIST_CONTEXT_TYPE = 'AppList';
exports.DIGITAL_TWIN_CONTEXT_TYPE = 'DigitalTwinContext';
exports.API_ROUTES_CONTEXT_TYPE = 'ApiListContext';
exports.ORGAN_LIST_CONTEXT_TYPE = 'OrganListContext';
// types
exports.ROLE_TYPE = "role";
exports.USER_PROFILE_TYPE = "UserProfile";
exports.APP_PROFILE_TYPE = "AppProfile";
exports.APP_CATEGORY_TYPE = "AdminAppCategory";
exports.APP_GROUP_TYPE = "AdminAppGroup";
exports.APP_TYPE = 'AdminApp';
exports.DIGITAL_TWIN_TYPE = 'DigitalTwin';
exports.API_ROUTE_TYPE = 'ApiRoute';
// RelationName
exports.CONTEXT_TO_APP_CATEGORY = "hasAppCategory";
exports.CATEGORY_TO_APP_GROUP_RELATION_NAME = 'hasAppGroup';
exports.APP_GROUP_TO_APP_RELATION_NAME = 'groupHasApp';
exports.CONTEXT_TO_APP_RELATION_NAME = 'hasApps';
exports.CONTEXT_TO_USER_PROFILE_RELATION_NAME = 'hasUserProfile';
exports.CONTEXT_TO_APP_PROFILE_RELATION_NAME = 'hasAppProfile';
exports.CONTEXT_TO_ROLE_RELATION_NAME = 'hasRole';
exports.CONTEXT_TO_USER_RELATION_NAME = 'hasUser';
exports.CONTEXT_TO_DIGITAL_TWIN_RELATION_NAME = 'hasDigitalTwin';
exports.CONTEXT_TO_API_ROUTE = 'hasApiRoute';
// Relation Type
exports.PTR_LST_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_PTR_LST_TYPE;
exports.LST_PTR_TYPE = spinal_env_viewer_graph_service_1.SPINAL_RELATION_LST_PTR_TYPE;
exports.DEFAULT_ROLES = Object.freeze(["Read", "Write", "Delete"]);
exports.ROLE_METHODS = Object.freeze({
    Read: [interfaces_1.HTTP_METHODS.GET],
    Write: [interfaces_1.HTTP_METHODS.POST, interfaces_1.HTTP_METHODS.PUT, interfaces_1.HTTP_METHODS.PATCH],
    Delete: [interfaces_1.HTTP_METHODS.DELETE]
});
// Error
const ERROR_PREFIX = 'PAM Admin Service App Error: ';
exports.USER_BASE_EMPTY = 'User Base Empty';
exports.USER_NOT_FOUND = 'User Not Found';
exports.CANNOT_CREATE_INTERNAL_ERROR = ERROR_PREFIX + ' Internal error: cannot create process';
exports.routesToProxy = [
    '/sceen',
    '/get_user_id',
    '/get_admin_id',
    '/get_new_account',
    '/get_confirm_new_account',
    '/get_resend_confirmation',
    '/get_new_password',
    '/get_change_user_password',
    '/get_delete_account',
    '/get_change_user_password_by_admin',
    '/get_delete_account_by_admin',
    '/get_change_account_rights_by_admin',
];
exports.PAM_BASE_URI = "/api/v1/pam";
exports.BOS_BASE_URI = "/api/v1/building";
// export const AUTH_SERVER_URI = 'http://localhost:3054';
// export const SPINALTWIN_CLIENT_ID = 'm9T3YOTHRq';
// export const SPINALTWIN_CLIENT_SECRET = 'kRBmqiUyofHSL9j8zrNI4bUSwcM3eO';
//# sourceMappingURL=constant.js.map