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

import { SPINAL_RELATION_LST_PTR_TYPE, SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";
import { HTTP_METHODS } from './interfaces';

export const CONFIG_FILE_MODEl_TYPE = "SpinalPAM";
export const CONFIG_GRAPH_NAME = "pam";


//Contexts names
export const USER_PROFILE_CONTEXT_NAME = 'UserProfileList';
export const APP_PROFILE_CONTEXT_NAME = 'AppProfileList';
export const USER_LIST_CONTEXT_NAME = 'UserList';
export const ROLES_CONTEXT_NAME = 'RoleList';
export const APP_LIST_CONTEXT_NAME = 'AppList';
export const BUILDING_CONTEXT_NAME = 'Buildings';
export const DIGITALTWIN_CONTEXT_NAME = 'DigitalTwins';
export const API_ROUTES_CONTEXT_NAME = 'ApiListContext';
export const ORGAN_LIST_CONTEXT_NAME = 'OrganListContext';

//Contexts types
export const USER_PROFILE_CONTEXT_TYPE = 'UserProfileList';
export const APP_PROFILE_CONTEXT_TYPE = 'AppProfileList';
export const USER_LIST_CONTEXT_TYPE = 'UserList';
export const ROLES_CONTEXT_TYPE = 'RoleList';
export const APP_LIST_CONTEXT_TYPE = 'AppList';
export const BUILDING_CONTEXT_TYPE = 'BuildingContextList';
export const DIGITALTWIN_CONTEXT_TYPE = 'DigitalTwinContext';
export const API_ROUTES_CONTEXT_TYPE = 'ApiListContext';
export const ORGAN_LIST_CONTEXT_TYPE = 'OrganListContext';



// types
export const ROLE_TYPE = "role";
export const USER_PROFILE_TYPE = "UserProfile";
export const APP_PROFILE_TYPE = "AppProfile";
export const APP_CATEGORY_TYPE = "AdminAppCategory";
export const APP_GROUP_TYPE = "AdminAppGroup";
export const APP_TYPE = 'AdminApp';
export const BUILDING_TYPE = 'Building';
export const DIGITALTWIN_TYPE = 'DigitalTwin';
export const API_ROUTE_TYPE = 'ApiRoute';


// RelationName
export const CONTEXT_TO_APP_CATEGORY = "hasAppCategory";
export const CATEGORY_TO_APP_GROUP_RELATION_NAME = 'hasAppGroup';
export const APP_GROUP_TO_APP_RELATION_NAME = 'groupHasApp';
export const CONTEXT_TO_APP_RELATION_NAME = 'hasApps';
export const CONTEXT_TO_USER_PROFILE_RELATION_NAME = 'hasUserProfile';
export const CONTEXT_TO_APP_PROFILE_RELATION_NAME = 'hasAppProfile';
export const CONTEXT_TO_ROLE_RELATION_NAME = 'hasRole';
export const CONTEXT_TO_USER_RELATION_NAME = 'hasUser';
export const CONTEXT_TO_BUILDING_RELATION_NAME = 'hasBuilding';
export const CONTEXT_TO_DIGITALTWIN_RELATION_NAME = 'hasDigitalTwin';
export const CONTEXT_TO_API_ROUTE = 'hasApiRoute';

// Relation Type
export const PTR_LST_TYPE = SPINAL_RELATION_PTR_LST_TYPE;
export const LST_PTR_TYPE = SPINAL_RELATION_LST_PTR_TYPE;

export const DEFAULT_ROLES = Object.freeze(["Read", "Write", "Delete"]);
export const ROLE_METHODS: { [key: string]: HTTP_METHODS[] } = Object.freeze({
    Read: [HTTP_METHODS.GET],
    Write: [HTTP_METHODS.POST, HTTP_METHODS.PUT, HTTP_METHODS.PATCH],
    Delete: [HTTP_METHODS.DELETE]
})


// Error
const ERROR_PREFIX: string = 'PAM Admin Service App Error: ';
export const USER_BASE_EMPTY = 'User Base Empty';
export const USER_NOT_FOUND = 'User Not Found';
export const CANNOT_CREATE_INTERNAL_ERROR = ERROR_PREFIX + ' Internal error: cannot create process';



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

export const PAM_BASE_URI = "/api/v1/pam";
export const BOS_BASE_URI = "/api/v1/building"

// export const AUTH_SERVER_URI = 'http://localhost:3054';

// export const SPINALTWIN_CLIENT_ID = 'm9T3YOTHRq';
// export const SPINALTWIN_CLIENT_SECRET = 'kRBmqiUyofHSL9j8zrNI4bUSwcM3eO';