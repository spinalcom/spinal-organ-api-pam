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
exports.USER_PROFILE_TYPE = exports.ROLE_TYPE = exports.LOG_CONTEXT_TYPE = exports.TOKEN_LIST_CONTEXT_TYPE = exports.PORTOFOLIO_CONTEXT_TYPE = exports.ADMIN_CREDENTIAL_CONTEXT_TYPE = exports.PAM_CREDENTIAL_CONTEXT_TYPE = exports.AUTHORIZED_BOS_CONTEXT_TYPE = exports.AUTHORIZED_API_CONTEXT_TYPE = exports.AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE = exports.ORGAN_LIST_CONTEXT_TYPE = exports.API_ROUTES_CONTEXT_TYPE = exports.DIGITALTWIN_CONTEXT_TYPE = exports.BUILDING_CONTEXT_TYPE = exports.APP_CONNECTED_LIST_CONTEXT_TYPE = exports.APP_LIST_CONTEXT_TYPE = exports.ROLES_CONTEXT_TYPE = exports.USER_LIST_CONTEXT_TYPE = exports.APP_PROFILE_CONTEXT_TYPE = exports.USER_PROFILE_CONTEXT_TYPE = exports.LOG_CONTEXT_NAME = exports.PORTOFOLIO_API_GROUP_NAME = exports.BUILDING_API_GROUP_NAME = exports.TOKEN_LIST_CONTEXT_NAME = exports.BUILDING_APPS_GROUP_NAME = exports.PORTOFOLIO_APPS_GROUP_NAME = exports.ADMIN_APPS_GROUP_NAME = exports.PORTOFOLIO_CONTEXT_NAME = exports.ADMIN_CREDENTIAL_CONTEXT_NAME = exports.PAM_CREDENTIAL_CONTEXT_NAME = exports.AUTHORIZED_BOS_CONTEXT_NAME = exports.AUTHORIZED_API_CONTEXT_NAME = exports.AUTHORIZED_PORTOFOLIO_CONTEXT_NAME = exports.ORGAN_LIST_CONTEXT_NAME = exports.API_ROUTES_CONTEXT_NAME = exports.DIGITALTWIN_CONTEXT_NAME = exports.BUILDING_CONTEXT_NAME = exports.APP_CONNECTED_LIST_CONTEXT_NAME = exports.APP_LIST_CONTEXT_NAME = exports.ROLES_CONTEXT_NAME = exports.USER_LIST_CONTEXT_NAME = exports.APP_PROFILE_CONTEXT_NAME = exports.USER_PROFILE_CONTEXT_NAME = exports.USER_TYPES = exports.CONTEXT_TO_ADMIN_USER_RELATION = exports.ADMIN_USER_TYPE = exports.ADMIN_USERNAME = exports.CONFIG_DEFAULT_DIRECTORY_PATH = exports.CONFIG_DEFAULT_NAME = exports.CONFIG_FILE_MODEl_TYPE = void 0;
exports.HTTP_CODES = exports.BOS_BASE_URI_V2 = exports.BOS_BASE_URI_V1_2 = exports.BOS_BASE_URI_V1 = exports.PAM_BASE_URI = exports.routesToProxy = exports.CANNOT_CREATE_INTERNAL_ERROR = exports.USER_NOT_FOUND = exports.USER_BASE_EMPTY = exports.ROLE_METHODS = exports.DEFAULT_ROLES = exports.LST_PTR_TYPE = exports.PTR_LST_TYPE = exports.USER_TO_FAVORITE_APP_RELATION = exports.PROFILE_TO_AUTHORIZED_BOS_RELATION = exports.PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION = exports.BUILDING_RELATION_NAME = exports.APP_RELATION_NAME = exports.TOKEN_RELATION_NAME = exports.CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME = exports.CONTEXT_TO_PORTOFOLIO_RELATION_NAME = exports.API_RELATION_NAME = exports.CONTEXT_TO_API_ROUTE_GROUP_RELATION_NAME = exports.CONTEXT_TO_DIGITALTWIN_RELATION_NAME = exports.CONTEXT_TO_USER_RELATION_NAME = exports.CONTEXT_TO_ROLE_RELATION_NAME = exports.CONTEXT_TO_APP_PROFILE_RELATION_NAME = exports.CONTEXT_TO_USER_PROFILE_RELATION_NAME = exports.CONTEXT_TO_APPS_GROUP = exports.CONTEXT_TO_APP_RELATION_NAME = exports.ADMIN_PROFILE_NAME = exports.ADMIN_PROFILE_TYPE = exports.PORTOFOLIO_API_GROUP_TYPE = exports.BUILDING_API_GROUP_TYPE = exports.TOKEN_TYPE = exports.BUILDING_APP_TYPE = exports.PORTOFOLIO_APP_TYPE = exports.ADMIN_APP_TYPE = exports.BUILDING_APPS_GROUP_TYPE = exports.PORTOFOLIO_APPS_GROUP_TYPE = exports.ADMIN_APPS_GROUP_TYPE = exports.PORTOFOLIO_TYPE = exports.API_ROUTE_GROUP_TYPE = exports.API_ROUTE_TYPE = exports.DIGITALTWIN_TYPE = exports.BUILDING_TYPE = exports.APP_TYPE = exports.APP_GROUP_TYPE = exports.APP_CATEGORY_TYPE = exports.APP_PROFILE_TYPE = void 0;
exports.SECURITY_NAME = exports.SECURITY_MESSAGES = void 0;
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const interfaces_1 = require("./interfaces");
exports.CONFIG_FILE_MODEl_TYPE = "SpinalPAM";
exports.CONFIG_DEFAULT_NAME = "PAMConfig";
exports.CONFIG_DEFAULT_DIRECTORY_PATH = "/__users__/admin/";
exports.ADMIN_USERNAME = "admin";
exports.ADMIN_USER_TYPE = "admin";
exports.CONTEXT_TO_ADMIN_USER_RELATION = "hasAdminUser";
exports.USER_TYPES = Object.freeze({
    ADMIN: "ADMIN",
    USER: "USER",
    APP: "APP",
    1: "ADMIN",
    2: "USER"
});
//Contexts names
exports.USER_PROFILE_CONTEXT_NAME = 'UserProfileList';
exports.APP_PROFILE_CONTEXT_NAME = 'AppProfileList';
exports.USER_LIST_CONTEXT_NAME = 'UserList';
exports.ROLES_CONTEXT_NAME = 'RoleList';
exports.APP_LIST_CONTEXT_NAME = 'AppList';
exports.APP_CONNECTED_LIST_CONTEXT_NAME = 'AppConnectedList';
exports.BUILDING_CONTEXT_NAME = 'Buildings';
exports.DIGITALTWIN_CONTEXT_NAME = 'DigitalTwins';
exports.API_ROUTES_CONTEXT_NAME = 'ApiListContext';
exports.ORGAN_LIST_CONTEXT_NAME = 'OrganListContext';
exports.AUTHORIZED_PORTOFOLIO_CONTEXT_NAME = "Authorized Portofolio";
exports.AUTHORIZED_API_CONTEXT_NAME = "Authorized Apis Routes";
exports.AUTHORIZED_BOS_CONTEXT_NAME = "Authorized BOS";
exports.PAM_CREDENTIAL_CONTEXT_NAME = "PAMToAuthCredential";
exports.ADMIN_CREDENTIAL_CONTEXT_NAME = "AdminCredential";
exports.PORTOFOLIO_CONTEXT_NAME = "Portofolio description Context";
exports.ADMIN_APPS_GROUP_NAME = "Admin apps";
exports.PORTOFOLIO_APPS_GROUP_NAME = "Portofolio apps";
exports.BUILDING_APPS_GROUP_NAME = "Building apps";
exports.TOKEN_LIST_CONTEXT_NAME = "Tokens";
exports.BUILDING_API_GROUP_NAME = "Building Apis Routes";
exports.PORTOFOLIO_API_GROUP_NAME = "Portofolio Apis Routes";
exports.LOG_CONTEXT_NAME = "Logs";
//Contexts types
exports.USER_PROFILE_CONTEXT_TYPE = 'UserProfileList';
exports.APP_PROFILE_CONTEXT_TYPE = 'AppProfileList';
exports.USER_LIST_CONTEXT_TYPE = 'UserList';
exports.ROLES_CONTEXT_TYPE = 'RoleList';
exports.APP_LIST_CONTEXT_TYPE = 'AppList';
exports.APP_CONNECTED_LIST_CONTEXT_TYPE = 'AppConnectedList';
exports.BUILDING_CONTEXT_TYPE = 'BuildingContextList';
exports.DIGITALTWIN_CONTEXT_TYPE = 'DigitalTwinContext';
exports.API_ROUTES_CONTEXT_TYPE = 'ApiListContext';
exports.ORGAN_LIST_CONTEXT_TYPE = 'OrganListContext';
exports.AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE = "AuthorizedPortofolioContext";
exports.AUTHORIZED_API_CONTEXT_TYPE = "AuthorizedApisContext";
exports.AUTHORIZED_BOS_CONTEXT_TYPE = "AuthorizedBosContext";
exports.PAM_CREDENTIAL_CONTEXT_TYPE = "PamCredential";
exports.ADMIN_CREDENTIAL_CONTEXT_TYPE = "AdminCredential";
exports.PORTOFOLIO_CONTEXT_TYPE = "PortofolioContext";
exports.TOKEN_LIST_CONTEXT_TYPE = "TokenList";
exports.LOG_CONTEXT_TYPE = "LogsContext";
// types
exports.ROLE_TYPE = "role";
exports.USER_PROFILE_TYPE = "UserProfile";
exports.APP_PROFILE_TYPE = "AppProfile";
exports.APP_CATEGORY_TYPE = "AdminAppCategory";
exports.APP_GROUP_TYPE = "AdminAppGroup";
exports.APP_TYPE = 'AdminApp';
exports.BUILDING_TYPE = 'Building';
exports.DIGITALTWIN_TYPE = 'Digital twin';
exports.API_ROUTE_TYPE = 'ApiRoute';
exports.API_ROUTE_GROUP_TYPE = 'ApiRoute';
exports.PORTOFOLIO_TYPE = 'Portofolio';
exports.ADMIN_APPS_GROUP_TYPE = "AdminAppsGroup";
exports.PORTOFOLIO_APPS_GROUP_TYPE = "PortofolioAppsGroup";
exports.BUILDING_APPS_GROUP_TYPE = "BuildingAppsGroup";
exports.ADMIN_APP_TYPE = "AdminApp";
exports.PORTOFOLIO_APP_TYPE = "PortofolioApp";
exports.BUILDING_APP_TYPE = "BuildingApp";
exports.TOKEN_TYPE = "token";
exports.BUILDING_API_GROUP_TYPE = "BuildingApis";
exports.PORTOFOLIO_API_GROUP_TYPE = "PortofolioApis";
exports.ADMIN_PROFILE_TYPE = "AdminProfile";
exports.ADMIN_PROFILE_NAME = "AdminProfile";
// RelationName
// export const CONTEXT_TO_APP_CATEGORY_RELATION_NAME = "hasAppCategory";
// export const CATEGORY_TO_APP_GROUP_RELATION_NAME = 'hasAppGroup';
// export const APP_GROUP_TO_APP_RELATION_NAME = 'groupHasApp';
exports.CONTEXT_TO_APP_RELATION_NAME = 'hasApps';
exports.CONTEXT_TO_APPS_GROUP = "hasAppsGroups";
exports.CONTEXT_TO_USER_PROFILE_RELATION_NAME = 'hasUserProfile';
exports.CONTEXT_TO_APP_PROFILE_RELATION_NAME = 'hasAppProfile';
exports.CONTEXT_TO_ROLE_RELATION_NAME = 'hasRole';
exports.CONTEXT_TO_USER_RELATION_NAME = 'hasUser';
exports.CONTEXT_TO_DIGITALTWIN_RELATION_NAME = 'hasDigitalTwin';
exports.CONTEXT_TO_API_ROUTE_GROUP_RELATION_NAME = 'hasApiRouteGroup';
exports.API_RELATION_NAME = 'hasApiRoute';
exports.CONTEXT_TO_PORTOFOLIO_RELATION_NAME = "hasPortofolio";
// export const CONTEXT_TO_AUTHORIZED_APPS_RELATION_NAME = "profileHasApps";
exports.CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME = "profileHasApis";
// export const CONTEXT_TO_AUTHORIZED_BOS_RELATION_NAME = "profileHasBos";
exports.TOKEN_RELATION_NAME = "hasToken";
exports.APP_RELATION_NAME = "hasApps";
exports.BUILDING_RELATION_NAME = 'hasBuilding';
exports.PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION = "hasAccessToPortofolio";
exports.PROFILE_TO_AUTHORIZED_BOS_RELATION = "hasAccessToBos";
exports.USER_TO_FAVORITE_APP_RELATION = "hasFavoriteApp";
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
exports.BOS_BASE_URI_V1 = "/api/v1/building";
exports.BOS_BASE_URI_V1_2 = "/v1/building";
exports.BOS_BASE_URI_V2 = "/api/v2/building";
var HTTP_CODES;
(function (HTTP_CODES) {
    HTTP_CODES[HTTP_CODES["OK"] = 200] = "OK";
    HTTP_CODES[HTTP_CODES["CREATED"] = 201] = "CREATED";
    HTTP_CODES[HTTP_CODES["ACCEPTED"] = 202] = "ACCEPTED";
    HTTP_CODES[HTTP_CODES["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTP_CODES[HTTP_CODES["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HTTP_CODES[HTTP_CODES["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTP_CODES[HTTP_CODES["NOT_FOUND"] = 404] = "NOT_FOUND";
    HTTP_CODES[HTTP_CODES["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
})(HTTP_CODES = exports.HTTP_CODES || (exports.HTTP_CODES = {}));
var SECURITY_MESSAGES;
(function (SECURITY_MESSAGES) {
    SECURITY_MESSAGES["INVALID_TOKEN"] = "Invalid or expired token !";
    SECURITY_MESSAGES["UNAUTHORIZED"] = "Unauthorized";
    SECURITY_MESSAGES["NO_PROFILE_FOUND"] = "No Profile found for this token";
})(SECURITY_MESSAGES = exports.SECURITY_MESSAGES || (exports.SECURITY_MESSAGES = {}));
var SECURITY_NAME;
(function (SECURITY_NAME) {
    SECURITY_NAME["admin"] = "admin";
    SECURITY_NAME["profile"] = "profile";
    SECURITY_NAME["bearerAuth"] = "bearerAuth";
    SECURITY_NAME["all"] = "all";
})(SECURITY_NAME = exports.SECURITY_NAME || (exports.SECURITY_NAME = {}));
//# sourceMappingURL=constant.js.map