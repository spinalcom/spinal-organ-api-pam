import { HTTP_METHODS } from './interfaces';
export declare const CONFIG_FILE_MODEl_TYPE = "SpinalPAM";
export declare const CONFIG_GRAPH_NAME = "pam";
export declare const USER_PROFILE_CONTEXT_NAME = "UserProfileList";
export declare const APP_PROFILE_CONTEXT_NAME = "AppProfileList";
export declare const USER_LIST_CONTEXT_NAME = "UserList";
export declare const ROLES_CONTEXT_NAME = "RoleList";
export declare const APP_LIST_CONTEXT_NAME = "AppList";
export declare const BUILDING_CONTEXT_NAME = "Buildings";
export declare const DIGITALTWIN_CONTEXT_NAME = "DigitalTwins";
export declare const API_ROUTES_CONTEXT_NAME = "ApiListContext";
export declare const ORGAN_LIST_CONTEXT_NAME = "OrganListContext";
export declare const AUTHORIZED_APP_CONTEXT_NAME = "Authorized Apps";
export declare const AUTHORIZED_API_CONTEXT_NAME = "Authorized Apis Routes";
export declare const AUTHORIZED_BOS_CONTEXT_NAME = "Authorized BOS";
export declare const BOS_CREDENTIAL_CONTEXT_NAME = "BosCredential";
export declare const ADMIN_CREDENTIAL_CONTEXT_NAME = "AdminCredential";
export declare const USER_PROFILE_CONTEXT_TYPE = "UserProfileList";
export declare const APP_PROFILE_CONTEXT_TYPE = "AppProfileList";
export declare const USER_LIST_CONTEXT_TYPE = "UserList";
export declare const ROLES_CONTEXT_TYPE = "RoleList";
export declare const APP_LIST_CONTEXT_TYPE = "AppList";
export declare const BUILDING_CONTEXT_TYPE = "BuildingContextList";
export declare const DIGITALTWIN_CONTEXT_TYPE = "DigitalTwinContext";
export declare const API_ROUTES_CONTEXT_TYPE = "ApiListContext";
export declare const ORGAN_LIST_CONTEXT_TYPE = "OrganListContext";
export declare const AUTHORIZED_APPS_CONTEXT_TYPE = "AuthorizedAppContext";
export declare const AUTHORIZED_API_CONTEXT_TYPE = "AuthorizedApisContext";
export declare const AUTHORIZED_BOS_CONTEXT_TYPE = "AuthorizedBosContext";
export declare const BOS_CREDENTIAL_CONTEXT_TYPE = "BosCredential";
export declare const ADMIN_CREDENTIAL_CONTEXT_TYPE = "AdminCredential";
export declare const ROLE_TYPE = "role";
export declare const USER_PROFILE_TYPE = "UserProfile";
export declare const APP_PROFILE_TYPE = "AppProfile";
export declare const APP_CATEGORY_TYPE = "AdminAppCategory";
export declare const APP_GROUP_TYPE = "AdminAppGroup";
export declare const APP_TYPE = "AdminApp";
export declare const BUILDING_TYPE = "Building";
export declare const DIGITALTWIN_TYPE = "PAMDigitalTwin";
export declare const API_ROUTE_TYPE = "ApiRoute";
export declare const CONTEXT_TO_APP_CATEGORY_RELATION_NAME = "hasAppCategory";
export declare const CATEGORY_TO_APP_GROUP_RELATION_NAME = "hasAppGroup";
export declare const APP_GROUP_TO_APP_RELATION_NAME = "groupHasApp";
export declare const CONTEXT_TO_APP_RELATION_NAME = "hasApps";
export declare const CONTEXT_TO_USER_PROFILE_RELATION_NAME = "hasUserProfile";
export declare const CONTEXT_TO_APP_PROFILE_RELATION_NAME = "hasAppProfile";
export declare const CONTEXT_TO_ROLE_RELATION_NAME = "hasRole";
export declare const CONTEXT_TO_USER_RELATION_NAME = "hasUser";
export declare const CONTEXT_TO_BUILDING_RELATION_NAME = "hasBuilding";
export declare const CONTEXT_TO_DIGITALTWIN_RELATION_NAME = "hasDigitalTwin";
export declare const CONTEXT_TO_API_ROUTE_RELATION_NAME = "hasApiRoute";
export declare const CONTEXT_TO_AUTHORIZED_APPS_RELATION_NAME = "profileHasApps";
export declare const CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME = "profileHasApis";
export declare const CONTEXT_TO_AUTHORIZED_BOS_RELATION_NAME = "profileHasBos";
export declare const PTR_LST_TYPE = "PtrLst";
export declare const LST_PTR_TYPE = "LstPtr";
export declare const DEFAULT_ROLES: readonly string[];
export declare const ROLE_METHODS: {
    [key: string]: HTTP_METHODS[];
};
export declare const USER_BASE_EMPTY = "User Base Empty";
export declare const USER_NOT_FOUND = "User Not Found";
export declare const CANNOT_CREATE_INTERNAL_ERROR: string;
export declare const routesToProxy: string[];
export declare const PAM_BASE_URI = "/api/v1/pam";
export declare const BOS_BASE_URI = "/api/v1/building";
export declare enum HTTP_CODES {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500
}
