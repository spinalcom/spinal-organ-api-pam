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

import {
  SPINAL_RELATION_LST_PTR_TYPE,
  SPINAL_RELATION_PTR_LST_TYPE,
} from 'spinal-env-viewer-graph-service';
import {HTTP_METHODS} from './interfaces';

export const CONFIG_FILE_MODEl_TYPE = 'SpinalPAM';
export const CONFIG_DEFAULT_NAME = 'PAMConfig';
export const CONFIG_DEFAULT_DIRECTORY_PATH = '/__users__/admin/';

export const ADMIN_USERNAME = 'admin';
export const ADMIN_USER_TYPE = 'admin';
export const CONTEXT_TO_ADMIN_USER_RELATION = 'hasAdminUser';
export const USER_TYPES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
  APP: 'APP',
  1: 'ADMIN',
  2: 'USER',
});

//Contexts names
export const USER_PROFILE_CONTEXT_NAME = 'UserProfileList';
export const APP_PROFILE_CONTEXT_NAME = 'AppProfileList';
export const USER_LIST_CONTEXT_NAME = 'UserList';
export const ROLES_CONTEXT_NAME = 'RoleList';
export const APP_LIST_CONTEXT_NAME = 'AppList';
export const APP_CONNECTED_LIST_CONTEXT_NAME = 'AppConnectedList';
export const BUILDING_CONTEXT_NAME = 'Buildings';
export const DIGITALTWIN_CONTEXT_NAME = 'DigitalTwins';
export const API_ROUTES_CONTEXT_NAME = 'ApiListContext';
export const ORGAN_LIST_CONTEXT_NAME = 'OrganListContext';
export const AUTHORIZED_PORTOFOLIO_CONTEXT_NAME = 'Authorized Portofolio';
export const AUTHORIZED_API_CONTEXT_NAME = 'Authorized Apis Routes';
export const AUTHORIZED_BOS_CONTEXT_NAME = 'Authorized BOS';
export const PAM_CREDENTIAL_CONTEXT_NAME = 'PAMToAuthCredential';
export const ADMIN_CREDENTIAL_CONTEXT_NAME = 'AdminCredential';
export const PORTOFOLIO_CONTEXT_NAME = 'Portofolio description Context';
export const ADMIN_APPS_GROUP_NAME = 'Admin apps';
export const PORTOFOLIO_APPS_GROUP_NAME = 'Portofolio apps';
export const BUILDING_APPS_GROUP_NAME = 'Building apps';
export const TOKEN_LIST_CONTEXT_NAME = 'Tokens';
export const BUILDING_API_GROUP_NAME = 'Building Apis Routes';
export const PORTOFOLIO_API_GROUP_NAME = 'Portofolio Apis Routes';
export const LOG_CONTEXT_NAME = 'Logs';

//Contexts types
export const USER_PROFILE_CONTEXT_TYPE = 'UserProfileList';
export const APP_PROFILE_CONTEXT_TYPE = 'AppProfileList';
export const USER_LIST_CONTEXT_TYPE = 'UserList';
export const ROLES_CONTEXT_TYPE = 'RoleList';
export const APP_LIST_CONTEXT_TYPE = 'AppList';
export const APP_CONNECTED_LIST_CONTEXT_TYPE = 'AppConnectedList';
export const BUILDING_CONTEXT_TYPE = 'BuildingContextList';
export const DIGITALTWIN_CONTEXT_TYPE = 'DigitalTwinContext';
export const API_ROUTES_CONTEXT_TYPE = 'ApiListContext';
export const ORGAN_LIST_CONTEXT_TYPE = 'OrganListContext';
export const AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE = 'AuthorizedPortofolioContext';
export const AUTHORIZED_API_CONTEXT_TYPE = 'AuthorizedApisContext';
export const AUTHORIZED_BOS_CONTEXT_TYPE = 'AuthorizedBosContext';
export const PAM_CREDENTIAL_CONTEXT_TYPE = 'PamCredential';
export const ADMIN_CREDENTIAL_CONTEXT_TYPE = 'AdminCredential';
export const PORTOFOLIO_CONTEXT_TYPE = 'PortofolioContext';
export const TOKEN_LIST_CONTEXT_TYPE = 'TokenList';
export const LOG_CONTEXT_TYPE = 'LogsContext';

// types
export const ROLE_TYPE = 'role';
export const USER_PROFILE_TYPE = 'UserProfile';
export const APP_PROFILE_TYPE = 'AppProfile';
export const APP_CATEGORY_TYPE = 'AdminAppCategory';
export const APP_GROUP_TYPE = 'AdminAppGroup';
export const APP_TYPE = 'AdminApp';
export const BUILDING_TYPE = 'Building';
export const DIGITALTWIN_TYPE = 'Digital twin';
export const API_ROUTE_TYPE = 'ApiRoute';
export const API_ROUTE_GROUP_TYPE = 'ApiRoute';
export const PORTOFOLIO_TYPE = 'Portofolio';

export const ADMIN_APPS_GROUP_TYPE = 'AdminAppsGroup';
export const PORTOFOLIO_APPS_GROUP_TYPE = 'PortofolioAppsGroup';
export const BUILDING_APPS_GROUP_TYPE = 'BuildingAppsGroup';

export const ADMIN_APP_TYPE = 'AdminApp';
export const PORTOFOLIO_APP_TYPE = 'PortofolioApp';
export const BUILDING_APP_TYPE = 'BuildingApp';
export const TOKEN_TYPE = 'token';

export const BUILDING_API_GROUP_TYPE = 'BuildingApis';
export const PORTOFOLIO_API_GROUP_TYPE = 'PortofolioApis';
export const ADMIN_PROFILE_TYPE = 'AdminProfile';
export const ADMIN_PROFILE_NAME = 'AdminProfile';

// RelationName
// export const CONTEXT_TO_APP_CATEGORY_RELATION_NAME = "hasAppCategory";
// export const CATEGORY_TO_APP_GROUP_RELATION_NAME = 'hasAppGroup';
// export const APP_GROUP_TO_APP_RELATION_NAME = 'groupHasApp';
export const CONTEXT_TO_APP_RELATION_NAME = 'hasApps';
export const CONTEXT_TO_APPS_GROUP = 'hasAppsGroups';
export const CONTEXT_TO_USER_PROFILE_RELATION_NAME = 'hasUserProfile';
export const CONTEXT_TO_APP_PROFILE_RELATION_NAME = 'hasAppProfile';
export const CONTEXT_TO_ROLE_RELATION_NAME = 'hasRole';
export const CONTEXT_TO_USER_RELATION_NAME = 'hasUser';
export const CONTEXT_TO_DIGITALTWIN_RELATION_NAME = 'hasDigitalTwin';
export const CONTEXT_TO_API_ROUTE_GROUP_RELATION_NAME = 'hasApiRouteGroup';
export const API_RELATION_NAME = 'hasApiRoute';
export const CONTEXT_TO_PORTOFOLIO_RELATION_NAME = 'hasPortofolio';
// export const CONTEXT_TO_AUTHORIZED_APPS_RELATION_NAME = "profileHasApps";
export const CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME = 'profileHasApis';
// export const CONTEXT_TO_AUTHORIZED_BOS_RELATION_NAME = "profileHasBos";
export const TOKEN_RELATION_NAME = 'hasToken';

export const APP_RELATION_NAME = 'hasApps';
export const BUILDING_RELATION_NAME = 'hasBuilding';

export const PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION =
  'hasAccessToPortofolio';
export const PROFILE_TO_AUTHORIZED_BOS_RELATION = 'hasAccessToBos';
export const USER_TO_FAVORITE_APP_RELATION = 'hasFavoriteApp';

// Relation Type
export const PTR_LST_TYPE = SPINAL_RELATION_PTR_LST_TYPE;
export const LST_PTR_TYPE = SPINAL_RELATION_LST_PTR_TYPE;

export const DEFAULT_ROLES = Object.freeze(['Read', 'Write', 'Delete']);
export const ROLE_METHODS: {[key: string]: HTTP_METHODS[]} = Object.freeze({
  Read: [HTTP_METHODS.GET],
  Write: [HTTP_METHODS.POST, HTTP_METHODS.PUT, HTTP_METHODS.PATCH],
  Delete: [HTTP_METHODS.DELETE],
});

// Error
const ERROR_PREFIX: string = 'PAM Admin Service App Error: ';
export const USER_BASE_EMPTY = 'User Base Empty';
export const USER_NOT_FOUND = 'User Not Found';
export const CANNOT_CREATE_INTERNAL_ERROR =
  ERROR_PREFIX + ' Internal error: cannot create process';

export const routesToProxy = [
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

export const PAM_BASE_URI = '/api/v1/pam';

export const BOS_BASE_URI_V1 = '/api/v1/building';
export const BOS_BASE_URI_V1_2 = '/v1/building';

export const BOS_BASE_URI_V2 = '/api/v2/building';

export enum HTTP_CODES {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export enum SECURITY_MESSAGES {
  INVALID_TOKEN = 'Invalid or expired token !',
  UNAUTHORIZED = 'Unauthorized',
  NO_PROFILE_FOUND = 'No Profile found for this token',
}

export enum SECURITY_NAME {
  admin = 'admin',
  profile = 'profile',
  bearerAuth = 'bearerAuth',
  all = 'all',
}
