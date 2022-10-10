import { HTTP_METHODS } from './interfaces';
export declare const CONFIG_FILE_MODEl_TYPE = "SpinalPAM";
export declare const CONFIG_DEFAULT_NAME = "PAMConfig";
export declare const CONFIG_DEFAULT_DIRECTORY_PATH = "/__users__/admin/";
export declare const ADMIN_USERNAME = "admin";
export declare const ADMIN_USER_TYPE = "admin";
export declare const CONTEXT_TO_ADMIN_USER_RELATION = "hasAdminUser";
export declare const USER_TYPES: Readonly<{
    ADMIN: "1";
    USER: "2";
    1: "ADMIN";
    2: "USER";
}>;
export declare const USER_PROFILE_CONTEXT_NAME = "UserProfileList";
export declare const APP_PROFILE_CONTEXT_NAME = "AppProfileList";
export declare const USER_LIST_CONTEXT_NAME = "UserList";
export declare const ROLES_CONTEXT_NAME = "RoleList";
export declare const APP_LIST_CONTEXT_NAME = "AppList";
export declare const BUILDING_CONTEXT_NAME = "Buildings";
export declare const DIGITALTWIN_CONTEXT_NAME = "DigitalTwins";
export declare const API_ROUTES_CONTEXT_NAME = "ApiListContext";
export declare const ORGAN_LIST_CONTEXT_NAME = "OrganListContext";
export declare const AUTHORIZED_PORTOFOLIO_CONTEXT_NAME = "Authorized Portofolio";
export declare const AUTHORIZED_API_CONTEXT_NAME = "Authorized Apis Routes";
export declare const AUTHORIZED_BOS_CONTEXT_NAME = "Authorized BOS";
export declare const PAM_CREDENTIAL_CONTEXT_NAME = "PAMToAuthCredential";
export declare const ADMIN_CREDENTIAL_CONTEXT_NAME = "AdminCredential";
export declare const PORTOFOLIO_CONTEXT_NAME = "Portofolio description Context";
export declare const ADMIN_APPS_GROUP_NAME = "Admin apps";
export declare const PORTOFOLIO_APPS_GROUP_NAME = "Portofolio apps";
export declare const BUILDING_APPS_GROUP_NAME = "Building apps";
export declare const TOKEN_LIST_CONTEXT_NAME = "Tokens";
export declare const USER_PROFILE_CONTEXT_TYPE = "UserProfileList";
export declare const APP_PROFILE_CONTEXT_TYPE = "AppProfileList";
export declare const USER_LIST_CONTEXT_TYPE = "UserList";
export declare const ROLES_CONTEXT_TYPE = "RoleList";
export declare const APP_LIST_CONTEXT_TYPE = "AppList";
export declare const BUILDING_CONTEXT_TYPE = "BuildingContextList";
export declare const DIGITALTWIN_CONTEXT_TYPE = "DigitalTwinContext";
export declare const API_ROUTES_CONTEXT_TYPE = "ApiListContext";
export declare const ORGAN_LIST_CONTEXT_TYPE = "OrganListContext";
export declare const AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE = "AuthorizedPortofolioContext";
export declare const AUTHORIZED_API_CONTEXT_TYPE = "AuthorizedApisContext";
export declare const AUTHORIZED_BOS_CONTEXT_TYPE = "AuthorizedBosContext";
export declare const PAM_CREDENTIAL_CONTEXT_TYPE = "PamCredential";
export declare const ADMIN_CREDENTIAL_CONTEXT_TYPE = "AdminCredential";
export declare const PORTOFOLIO_CONTEXT_TYPE = "PortofolioContext";
export declare const TOKEN_LIST_CONTEXT_TYPE = "TokenList";
export declare const ROLE_TYPE = "role";
export declare const USER_PROFILE_TYPE = "UserProfile";
export declare const APP_PROFILE_TYPE = "AppProfile";
export declare const APP_CATEGORY_TYPE = "AdminAppCategory";
export declare const APP_GROUP_TYPE = "AdminAppGroup";
export declare const APP_TYPE = "AdminApp";
export declare const BUILDING_TYPE = "Building";
export declare const DIGITALTWIN_TYPE = "Digital twin";
export declare const API_ROUTE_TYPE = "ApiRoute";
export declare const PORTOFOLIO_TYPE = "Portofolio";
export declare const ADMIN_APPS_GROUP_TYPE = "AdminAppsGroup";
export declare const PORTOFOLIO_APPS_GROUP_TYPE = "PortofolioAppsGroup";
export declare const BUILDING_APPS_GROUP_TYPE = "BuildingAppsGroup";
export declare const ADMIN_APP_TYPE = "AdminApp";
export declare const PORTOFOLIO_APP_TYPE = "PortofolioApp";
export declare const BUILDING_APP_TYPE = "BuildingApp";
export declare const TOKEN_TYPE = "token";
export declare const CONTEXT_TO_APPS_GROUP = "hasAppsGroups";
export declare const CONTEXT_TO_USER_PROFILE_RELATION_NAME = "hasUserProfile";
export declare const CONTEXT_TO_APP_PROFILE_RELATION_NAME = "hasAppProfile";
export declare const CONTEXT_TO_ROLE_RELATION_NAME = "hasRole";
export declare const CONTEXT_TO_USER_RELATION_NAME = "hasUser";
export declare const CONTEXT_TO_DIGITALTWIN_RELATION_NAME = "hasDigitalTwin";
export declare const CONTEXT_TO_API_ROUTE_RELATION_NAME = "hasApiRoute";
export declare const CONTEXT_TO_PORTOFOLIO_RELATION_NAME = "hasPortofolio";
export declare const CONTEXT_TO_AUTHORIZED_APIS_RELATION_NAME = "profileHasApis";
export declare const TOKEN_RELATION_NAME = "hasToken";
export declare const APP_RELATION_NAME = "hasApps";
export declare const BUILDING_RELATION_NAME = "hasBuilding";
export declare const PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION = "hasAccessToPortofolio";
export declare const PROFILE_TO_AUTHORIZED_BOS_RELATION = "hasAccessToBos";
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
