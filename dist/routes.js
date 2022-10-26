"use strict";
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
exports.RegisterRoutes = void 0;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const apis_controller_1 = require("./controllers/apis.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const appProfile_controller_1 = require("./controllers/appProfile.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const apps_controller_1 = require("./controllers/apps.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const auth_controller_1 = require("./controllers/auth.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const building_controller_1 = require("./controllers/building.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const digitalTwin_controller_1 = require("./controllers/digitalTwin.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const portofolio_controller_1 = require("./controllers/portofolio.controller");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const userProfile_controller_1 = require("./controllers/userProfile.controller");
const authentication_1 = require("./security/authentication");
// @ts-ignore - no great way to install types from subpackage
const promiseAny = require('promise.any');
const multer = require('multer');
const upload = multer();
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "IApiRoute": {
        "dataType": "refObject",
        "properties": {
            "group": { "dataType": "string", "required": true },
            "method": { "dataType": "string", "required": true },
            "route": { "dataType": "string", "required": true },
            "scoped": { "dataType": "string", "required": true },
            "tag": { "dataType": "string", "required": true },
        },
        "additionalProperties": { "dataType": "string" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApp": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "icon": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "tags": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "categoryName": { "dataType": "string", "required": true },
            "groupName": { "dataType": "string", "required": true },
            "hasViewer": { "dataType": "boolean" },
            "packageName": { "dataType": "string" },
        },
        "additionalProperties": { "dataType": "any" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBosData": {
        "dataType": "refObject",
        "properties": {
            "apps": { "dataType": "array", "array": { "dataType": "refObject", "ref": "IApp" } },
            "apis": { "dataType": "array", "array": { "dataType": "refObject", "ref": "IApiRoute" } },
        },
        "additionalProperties": { "dataType": "any" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPortofolioData": {
        "dataType": "refObject",
        "properties": {
            "apps": { "dataType": "array", "array": { "dataType": "refObject", "ref": "IApp" } },
            "apis": { "dataType": "array", "array": { "dataType": "refObject", "ref": "IApiRoute" } },
            "building": { "dataType": "array", "array": { "dataType": "refObject", "ref": "IBosData" } },
        },
        "additionalProperties": { "dataType": "any" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProfileData": {
        "dataType": "refObject",
        "properties": {
            "authorized": { "dataType": "array", "array": { "dataType": "refObject", "ref": "IPortofolioData" } },
        },
        "additionalProperties": { "dataType": "any" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBosAuth": {
        "dataType": "refObject",
        "properties": {
            "buildingId": { "dataType": "string", "required": true },
            "appsIds": { "dataType": "array", "array": { "dataType": "string" } },
            "apisIds": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPortofolioAuth": {
        "dataType": "refObject",
        "properties": {
            "portofolioId": { "dataType": "string", "required": true },
            "appsIds": { "dataType": "array", "array": { "dataType": "string" } },
            "apisIds": { "dataType": "array", "array": { "dataType": "string" } },
            "building": { "dataType": "array", "array": { "dataType": "refObject", "ref": "IBosAuth" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IProfile": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "authorize": { "dataType": "array", "array": { "dataType": "refObject", "ref": "IPortofolioAuth" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IEditApp": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string" },
            "icon": { "dataType": "string" },
            "description": { "dataType": "string" },
            "tags": { "dataType": "array", "array": { "dataType": "string" } },
            "categoryName": { "dataType": "string" },
            "groupName": { "dataType": "string" },
        },
        "additionalProperties": { "dataType": "any" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IApplicationToken": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string" },
            "type": { "dataType": "string" },
            "token": { "dataType": "string" },
            "createdToken": { "dataType": "double" },
            "expieredToken": { "dataType": "double" },
            "applicationId": { "dataType": "string" },
            "applicationProfileList": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserToken": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string" },
            "type": { "dataType": "string" },
            "token": { "dataType": "string" },
            "createdToken": { "dataType": "double" },
            "expieredToken": { "dataType": "double" },
            "userId": { "dataType": "string" },
            "userType": { "dataType": "string", "required": true },
            "userProfileList": { "dataType": "array", "array": { "dataType": "string" } },
            "serverId": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserCredential": {
        "dataType": "refObject",
        "properties": {
            "userName": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAppCredential": {
        "dataType": "refObject",
        "properties": {
            "clientId": { "dataType": "string", "required": true },
            "clientSecret": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPamCredential": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "type": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "statusPlatform": { "dataType": "string", "required": true },
            "address": { "dataType": "string", "required": true },
            "tokenPamToAdmin": { "dataType": "string", "required": true },
            "pamName": { "dataType": "string" },
            "idPlateform": { "dataType": "string" },
            "urlAdmin": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPamInfo": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "url": { "dataType": "string", "required": true },
            "address": { "dataType": "string" },
            "statusPlatform": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["online"] }, { "dataType": "enum", "enums": ["fail"] }, { "dataType": "enum", "enums": ["stop"] }] },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAdmin": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "urlAdmin": { "dataType": "string", "required": true },
            "registerKey": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IAdminCredential": {
        "dataType": "refObject",
        "properties": {
            "TokenAdminToPam": { "dataType": "string", "required": true },
            "idPlatformOfAdmin": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ILocation": {
        "dataType": "refObject",
        "properties": {
            "lat": { "dataType": "double" },
            "lng": { "dataType": "double" },
        },
        "additionalProperties": { "dataType": "any" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBuilding": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "aliasName": { "dataType": "string", "required": true },
            "bosUrl": { "dataType": "string", "required": true },
            "apiUrl": { "dataType": "string", "required": true },
            "clientId": { "dataType": "string" },
            "clientSecret": { "dataType": "string" },
            "address": { "dataType": "string", "required": true },
            "description": { "dataType": "string", "required": true },
            "location": { "ref": "ILocation" },
        },
        "additionalProperties": { "dataType": "any" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IEditBuilding": {
        "dataType": "refAlias",
        "type": { "dataType": "intersection", "subSchemas": [{ "ref": "IBuilding" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "unauthorizeApiIds": { "dataType": "array", "array": { "dataType": "string" } }, "unauthorizeAppIds": { "dataType": "array", "array": { "dataType": "string" } }, "authorizeApiIds": { "dataType": "array", "array": { "dataType": "string" } }, "authorizeAppIds": { "dataType": "array", "array": { "dataType": "string" } } } }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPortofolioInfo": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "appIds": { "dataType": "array", "array": { "dataType": "string" } },
            "apiIds": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IEditProtofolio": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string" },
            "authorizeAppIds": { "dataType": "array", "array": { "dataType": "string" } },
            "unauthorizeAppIds": { "dataType": "array", "array": { "dataType": "string" } },
            "authorizeApiIds": { "dataType": "array", "array": { "dataType": "string" } },
            "unauthorizeApiIds": { "dataType": "array", "array": { "dataType": "string" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBuildingCreation": {
        "dataType": "refAlias",
        "type": { "dataType": "intersection", "subSchemas": [{ "ref": "IBuilding" }, { "dataType": "nestedObjectLiteral", "nestedProperties": { "apiIds": { "dataType": "array", "array": { "dataType": "string" } }, "appIds": { "dataType": "array", "array": { "dataType": "string" } } } }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new runtime_1.ValidationService(models);
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.post('/api/v1/pam/create_portofolio_api_route', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.createPortofolioApiRoute)), function APIController_createPortofolioApiRoute(request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "ref": "IApiRoute" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.createPortofolioApiRoute.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/pam/update_portofolio_api_route/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.updatePortofolioApiRoute)), function APIController_updatePortofolioApiRoute(request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "ref": "IApiRoute" },
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.updatePortofolioApiRoute.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_portofolio_api_route/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.getPortofolioApiRouteById)), function APIController_getPortofolioApiRouteById(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.getPortofolioApiRouteById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_all_portofolio_api_route', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.getAllPortofolioApiRoute)), function APIController_getAllPortofolioApiRoute(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.getAllPortofolioApiRoute.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/delete_portofolio_api_route/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.deletePortofolioApiRoute)), function APIController_deletePortofolioApiRoute(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "any" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.deletePortofolioApiRoute.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/upload_portofolio_apis_routes', authenticateMiddleware([{ "admin": [] }]), upload.single('file'), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.uploadPortofolioSwaggerFile)), function APIController_uploadPortofolioSwaggerFile(request, response, next) {
        const args = {
            file: { "in": "formData", "name": "file", "required": true, "dataType": "file" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.uploadPortofolioSwaggerFile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/create_bos_api_route', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.createBosApiRoute)), function APIController_createBosApiRoute(request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "ref": "IApiRoute" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.createBosApiRoute.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/pam/update_bos_api_route/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.updateBosApiRoute)), function APIController_updateBosApiRoute(request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "ref": "IApiRoute" },
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.updateBosApiRoute.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_bos_api_route/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.getBosApiRouteById)), function APIController_getBosApiRouteById(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.getBosApiRouteById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_all_bos_api_route', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.getAllBosApiRoute)), function APIController_getAllBosApiRoute(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.getAllBosApiRoute.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/delete_bos_api_route/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.deleteBosApiRoute)), function APIController_deleteBosApiRoute(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "any" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.deleteBosApiRoute.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/upload_bos_apis_routes', authenticateMiddleware([{ "admin": [] }]), upload.single('file'), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController)), ...((0, runtime_1.fetchMiddlewares)(apis_controller_1.APIController.prototype.uploadBosSwaggerFile)), function APIController_uploadBosSwaggerFile(request, response, next) {
        const args = {
            file: { "in": "formData", "name": "file", "required": true, "dataType": "file" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apis_controller_1.APIController();
            const promise = controller.uploadBosSwaggerFile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/app_profile/create_profile', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.createAppProfile)), function AppProfileController_createAppProfile(request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "ref": "IProfile" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.createAppProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/app_profile/get_profile/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.getAppProfile)), function AppProfileController_getAppProfile(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.getAppProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/app_profile/get_all_profile', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.getAllAppProfile)), function AppProfileController_getAllAppProfile(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.getAllAppProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/pam/app_profile/edit_profile/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.updateAppProfile)), function AppProfileController_updateAppProfile(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IProfile" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.updateAppProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/app_profile/delete_profile/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.deleteAppProfile)), function AppProfileController_deleteAppProfile(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.deleteAppProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/app_profile/get_authorized_portofolio/:profileId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.getAuthorizedPortofolio)), function AppProfileController_getAuthorizedPortofolio(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.getAuthorizedPortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/app_profile/authorize_portofolio_apis/:profileId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.authorizeToAccessPortofolioApis)), function AppProfileController_authorizeToAccessPortofolioApis(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IPortofolioAuth" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.authorizeToAccessPortofolioApis.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/app_profile/get_authorized_portofolio_apis/:profileId/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.getAuthorizedPortofolioApis)), function AppProfileController_getAuthorizedPortofolioApis(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.getAuthorizedPortofolioApis.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/app_profile/unauthorize_portofolio_apis/:profileId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.unauthorizeToAccessPortofolioApis)), function AppProfileController_unauthorizeToAccessPortofolioApis(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "portofolioId": { "dataType": "string", "required": true }, "apisIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.unauthorizeToAccessPortofolioApis.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/app_profile/get_authorized_bos/:profileId/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.getAuthorizedBos)), function AppProfileController_getAuthorizedBos(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.getAuthorizedBos.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/app_profile/authorize_bos_apis/:profileId/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.authorizeToAccessBosApis)), function AppProfileController_authorizeToAccessBosApis(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IBosAuth" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.authorizeToAccessBosApis.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/app_profile/get_authorized_bos_apis/:profileId/:portofolioId/:bosId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.getAuthorizedBosApis)), function AppProfileController_getAuthorizedBosApis(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            bosId: { "in": "path", "name": "bosId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.getAuthorizedBosApis.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/app_profile/unauthorize_bos_apis/:profileId/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController)), ...((0, runtime_1.fetchMiddlewares)(appProfile_controller_1.AppProfileController.prototype.unauthorizeToAccessBosApis)), function AppProfileController_unauthorizeToAccessBosApis(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "buildingId": { "dataType": "string", "required": true }, "apisIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new appProfile_controller_1.AppProfileController();
            const promise = controller.unauthorizeToAccessBosApis.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/create_admin_app', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.createAdminApp)), function AppsController_createAdminApp(request, response, next) {
        const args = {
            appInfo: { "in": "body", "name": "appInfo", "required": true, "ref": "IApp" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.createAdminApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/create_portofolio_app', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.createPortofolioApp)), function AppsController_createPortofolioApp(request, response, next) {
        const args = {
            appInfo: { "in": "body", "name": "appInfo", "required": true, "ref": "IApp" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.createPortofolioApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/create_building_app', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.createBuildingApp)), function AppsController_createBuildingApp(request, response, next) {
        const args = {
            appInfo: { "in": "body", "name": "appInfo", "required": true, "ref": "IApp" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.createBuildingApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_all_admin_apps', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.getAllAdminApps)), function AppsController_getAllAdminApps(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.getAllAdminApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_all_portofolio_apps', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.getAllPortofolioApps)), function AppsController_getAllPortofolioApps(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.getAllPortofolioApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_all_building_apps', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.getAllBuildingApps)), function AppsController_getAllBuildingApps(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.getAllBuildingApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_admin_app/:appId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.getAdminApp)), function AppsController_getAdminApp(request, response, next) {
        const args = {
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.getAdminApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_portofolio_app/:appId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.getPortofolioApp)), function AppsController_getPortofolioApp(request, response, next) {
        const args = {
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.getPortofolioApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_building_app/:appId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.getBuildingApp)), function AppsController_getBuildingApp(request, response, next) {
        const args = {
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.getBuildingApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/pam/update_admin_app/:appId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.updateAdminApp)), function AppsController_updateAdminApp(request, response, next) {
        const args = {
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
            newInfo: { "in": "body", "name": "newInfo", "required": true, "ref": "IEditApp" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.updateAdminApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/pam/update_portofolio_app/:appId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.updatePortofolioApp)), function AppsController_updatePortofolioApp(request, response, next) {
        const args = {
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
            newInfo: { "in": "body", "name": "newInfo", "required": true, "ref": "IEditApp" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.updatePortofolioApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/pam/update_building_app/:appId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.updateBuildingApp)), function AppsController_updateBuildingApp(request, response, next) {
        const args = {
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
            newInfo: { "in": "body", "name": "newInfo", "required": true, "ref": "IEditApp" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.updateBuildingApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/delete_admin_app/:appId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.deleteAdminApp)), function AppsController_deleteAdminApp(request, response, next) {
        const args = {
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.deleteAdminApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/delete_portofolio_app/:appId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.deletePortofolioApp)), function AppsController_deletePortofolioApp(request, response, next) {
        const args = {
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.deletePortofolioApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/delete_building_app/:appId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.deleteBuildingApp)), function AppsController_deleteBuildingApp(request, response, next) {
        const args = {
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.deleteBuildingApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/upload_admin_apps', authenticateMiddleware([{ "admin": [] }]), upload.single('file'), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.uploadAdminApp)), function AppsController_uploadAdminApp(request, response, next) {
        const args = {
            file: { "in": "formData", "name": "file", "required": true, "dataType": "file" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.uploadAdminApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/upload_portofolio_apps', authenticateMiddleware([{ "admin": [] }]), upload.single('file'), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.uploadPortofolioApp)), function AppsController_uploadPortofolioApp(request, response, next) {
        const args = {
            file: { "in": "formData", "name": "file", "required": true, "dataType": "file" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.uploadPortofolioApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/upload_building_apps', authenticateMiddleware([{ "admin": [] }]), upload.single('file'), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController)), ...((0, runtime_1.fetchMiddlewares)(apps_controller_1.AppsController.prototype.uploadBuildingApp)), function AppsController_uploadBuildingApp(request, response, next) {
        const args = {
            file: { "in": "formData", "name": "file", "required": true, "dataType": "file" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new apps_controller_1.AppsController();
            const promise = controller.uploadBuildingApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/auth', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.authenticate)), function AuthController_authenticate(request, response, next) {
        const args = {
            credential: { "in": "body", "name": "credential", "required": true, "dataType": "union", "subSchemas": [{ "ref": "IUserCredential" }, { "ref": "IAppCredential" }] },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.authenticate.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/auth/admin', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.authenticateAdmin)), function AuthController_authenticateAdmin(request, response, next) {
        const args = {
            credential: { "in": "body", "name": "credential", "required": true, "ref": "IUserCredential" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.authenticateAdmin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/register_admin', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.registerToAdmin)), function AuthController_registerToAdmin(request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "adminInfo": { "ref": "IAdmin", "required": true }, "pamInfo": { "ref": "IPamInfo", "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.registerToAdmin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_pam_to_auth_credential', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.getBosToAdminCredential)), function AuthController_getBosToAdminCredential(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.getBosToAdminCredential.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/delete_admin', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.deleteAdmin)), function AuthController_deleteAdmin(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.deleteAdmin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_admin_to_pam_credential', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.getAdminCredential)), function AuthController_getAdminCredential(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.getAdminCredential.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/pam/update_data', ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController)), ...((0, runtime_1.fetchMiddlewares)(auth_controller_1.AuthController.prototype.syncDataToAdmin)), function AuthController_syncDataToAdmin(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new auth_controller_1.AuthController();
            const promise = controller.syncDataToAdmin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/get_building/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.getBuildingById)), function BuildingController_getBuildingById(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.getBuildingById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_all_buildings_apps', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.getAllBuildingsApps)), function BuildingController_getAllBuildingsApps(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.getAllBuildingsApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/delete_building/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.deleteBuilding)), function BuildingController_deleteBuilding(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.deleteBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/pam/edit_building/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.editBuilding)), function BuildingController_editBuilding(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IEditBuilding" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.editBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/add_app_to_building/:buildingId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.addAppToBuilding)), function BuildingController_addAppToBuilding(request, response, next) {
        const args = {
            buildingId: { "in": "path", "name": "buildingId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "applicationId": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.addAppToBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_apps_from_building/:buildingId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.getAppsFromBuilding)), function BuildingController_getAppsFromBuilding(request, response, next) {
        const args = {
            buildingId: { "in": "path", "name": "buildingId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.getAppsFromBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_app_from_building/:buildingId/:appId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.getAppFromBuilding)), function BuildingController_getAppFromBuilding(request, response, next) {
        const args = {
            buildingId: { "in": "path", "name": "buildingId", "required": true, "dataType": "string" },
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.getAppFromBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/remove_app_from_building/:buildingId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.removeAppFromBuilding)), function BuildingController_removeAppFromBuilding(request, response, next) {
        const args = {
            buildingId: { "in": "path", "name": "buildingId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "applicationId": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.removeAppFromBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/building_has_app/:buildingId/:appId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.buildingHasApp)), function BuildingController_buildingHasApp(request, response, next) {
        const args = {
            buildingId: { "in": "path", "name": "buildingId", "required": true, "dataType": "string" },
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.buildingHasApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/add_apiRoute_to_building/:buildingId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.addApiToBuilding)), function BuildingController_addApiToBuilding(request, response, next) {
        const args = {
            buildingId: { "in": "path", "name": "buildingId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "apisIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.addApiToBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_apisRoute_from_building/:buildingId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.getApisFromBuilding)), function BuildingController_getApisFromBuilding(request, response, next) {
        const args = {
            buildingId: { "in": "path", "name": "buildingId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.getApisFromBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_apiRoute_from_building/:buildingId/:apiId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.getApiFromBuilding)), function BuildingController_getApiFromBuilding(request, response, next) {
        const args = {
            buildingId: { "in": "path", "name": "buildingId", "required": true, "dataType": "string" },
            apiId: { "in": "path", "name": "apiId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.getApiFromBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/remove_apiRoute_from_building/:buildingId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.removeApisFromBuilding)), function BuildingController_removeApisFromBuilding(request, response, next) {
        const args = {
            buildingId: { "in": "path", "name": "buildingId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "apisIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.removeApisFromBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/building_has_apiRoute/:buildingId/:apiId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController)), ...((0, runtime_1.fetchMiddlewares)(building_controller_1.BuildingController.prototype.buildingHasApi)), function BuildingController_buildingHasApi(request, response, next) {
        const args = {
            buildingId: { "in": "path", "name": "buildingId", "required": true, "dataType": "string" },
            apiId: { "in": "path", "name": "apiId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new building_controller_1.BuildingController();
            const promise = controller.buildingHasApi.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/create_digitaltwin', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController)), ...((0, runtime_1.fetchMiddlewares)(digitalTwin_controller_1.DigitaltwinController.prototype.createDigitalTwin)), function DigitaltwinController_createDigitalTwin(request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "folderPath": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new digitalTwin_controller_1.DigitaltwinController();
            const promise = controller.createDigitalTwin.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/add_portofolio', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.addPortofolio)), function PortofolioController_addPortofolio(request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "ref": "IPortofolioInfo" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.addPortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/pam/update_portofolio/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.updatePortofolio)), function PortofolioController_updatePortofolio(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IEditProtofolio" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.updatePortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/pam/rename_portofolio/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.renamePortofolio)), function PortofolioController_renamePortofolio(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "name": { "dataType": "string", "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.renamePortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_all_portofolio', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.getAllPortofolio)), function PortofolioController_getAllPortofolio(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.getAllPortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_portofolio/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.getPortofolio)), function PortofolioController_getPortofolio(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.getPortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_portofolio_details/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.getPortofolioDetails)), function PortofolioController_getPortofolioDetails(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.getPortofolioDetails.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_all_portofolios_details', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.getAllPortofoliosDetails)), function PortofolioController_getAllPortofoliosDetails(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.getAllPortofoliosDetails.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/remove_portofolio/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.removePortofolio)), function PortofolioController_removePortofolio(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.removePortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/add_building_to_portofolio/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.addBuilding)), function PortofolioController_addBuilding(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            body: { "in": "body", "name": "body", "required": true, "ref": "IBuildingCreation" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.addBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_building_from_portofolio/:portofolioId/:appId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.getBuilding)), function PortofolioController_getBuilding(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            appId: { "in": "path", "name": "appId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.getBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_all_buildings_from_portofolio/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.getAllBuilding)), function PortofolioController_getAllBuilding(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.getAllBuilding.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/remove_building_from_portofolio/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.deleteBuildingFromPortofolio)), function PortofolioController_deleteBuildingFromPortofolio(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "buildingIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.deleteBuildingFromPortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/add_app_to_portofolio/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.addAppToPortofolio)), function PortofolioController_addAppToPortofolio(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "applicationsIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.addAppToPortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_apps_from_portofolio/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.getPortofolioApps)), function PortofolioController_getPortofolioApps(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.getPortofolioApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_app_from_portofolio/:portofolioId/:applicationId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.getAppFromPortofolio)), function PortofolioController_getAppFromPortofolio(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            applicationId: { "in": "path", "name": "applicationId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.getAppFromPortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/remove_app_from_portofolio/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.removeAppFromPortofolio)), function PortofolioController_removeAppFromPortofolio(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "applicationId": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.removeAppFromPortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/portofolio_has_app/:portofolioId/:applicationId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.portofolioHasApp)), function PortofolioController_portofolioHasApp(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            applicationId: { "in": "path", "name": "applicationId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.portofolioHasApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/add_apiRoute_to_portofolio/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.addApiToPortofolio)), function PortofolioController_addApiToPortofolio(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "apisIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.addApiToPortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_apisRoute_from_portofolio/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.getPortofolioApis)), function PortofolioController_getPortofolioApis(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.getPortofolioApis.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/get_apiRoute_from_portofolio/:portofolioId/:apiId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.getApiFromPortofolio)), function PortofolioController_getApiFromPortofolio(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            apiId: { "in": "path", "name": "apiId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.getApiFromPortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/remove_apiRoute_from_portofolio/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.removeApiFromPortofolio)), function PortofolioController_removeApiFromPortofolio(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "nestedObjectLiteral", "nestedProperties": { "apisIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.removeApiFromPortofolio.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/portofolio_has_apiRoute/:portofolioId/:apiId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController)), ...((0, runtime_1.fetchMiddlewares)(portofolio_controller_1.PortofolioController.prototype.portofolioHasApi)), function PortofolioController_portofolioHasApi(request, response, next) {
        const args = {
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            apiId: { "in": "path", "name": "apiId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new portofolio_controller_1.PortofolioController();
            const promise = controller.portofolioHasApi.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/user_profile/create_profile', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.createUserProfile)), function UserProfileController_createUserProfile(request, response, next) {
        const args = {
            data: { "in": "body", "name": "data", "required": true, "ref": "IProfile" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.createUserProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/user_profile/get_profile/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.getUserProfile)), function UserProfileController_getUserProfile(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.getUserProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/user_profile/get_all_profile', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.getAllUserProfile)), function UserProfileController_getAllUserProfile(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.getAllUserProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.put('/api/v1/pam/user_profile/edit_profile/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.updateUserProfile)), function UserProfileController_updateUserProfile(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "ref": "IProfile" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.updateUserProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.delete('/api/v1/pam/user_profile/delete_profile/:id', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.deleteUserProfile)), function UserProfileController_deleteUserProfile(request, response, next) {
        const args = {
            id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.deleteUserProfile.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/user_profile/get_authorized_portofolio/:profileId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.getAuthorizedPortofolioApps)), function UserProfileController_getAuthorizedPortofolioApps(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.getAuthorizedPortofolioApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/user_profile/authorize_portofolio_apps/:profileId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.authorizeToAccessPortofolioApps)), function UserProfileController_authorizeToAccessPortofolioApps(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "portofolioId": { "dataType": "string", "required": true }, "appsIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.authorizeToAccessPortofolioApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/user_profile/get_authorized_portofolio_apps/:profileId/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.getAuthorizedPortofolioApis)), function UserProfileController_getAuthorizedPortofolioApis(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.getAuthorizedPortofolioApis.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/user_profile/unauthorize_portofolio_apps/:profileId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.unauthorizeToAccessPortofolioApps)), function UserProfileController_unauthorizeToAccessPortofolioApps(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "portofolioId": { "dataType": "string", "required": true }, "appsIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.unauthorizeToAccessPortofolioApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/user_profile/get_authorized_bos/:profileId/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.getAuthorizedBos)), function UserProfileController_getAuthorizedBos(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.getAuthorizedBos.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/user_profile/authorize_bos_apps/:profileId/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.authorizeToAccessBosApps)), function UserProfileController_authorizeToAccessBosApps(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "array", "array": { "dataType": "refObject", "ref": "IBosAuth" } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.authorizeToAccessBosApps.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/api/v1/pam/user_profile/get_authorized_bos_apps/:profileId/:portofolioId/:bosId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.getAuthorizedBosApis)), function UserProfileController_getAuthorizedBosApis(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            bosId: { "in": "path", "name": "bosId", "required": true, "dataType": "string" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.getAuthorizedBosApis.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/api/v1/pam/user_profile/unauthorize_bos_apps/:profileId/:portofolioId', authenticateMiddleware([{ "admin": [] }]), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController)), ...((0, runtime_1.fetchMiddlewares)(userProfile_controller_1.UserProfileController.prototype.unauthorizeToAccessBosApp)), function UserProfileController_unauthorizeToAccessBosApp(request, response, next) {
        const args = {
            profileId: { "in": "path", "name": "profileId", "required": true, "dataType": "string" },
            portofolioId: { "in": "path", "name": "portofolioId", "required": true, "dataType": "string" },
            data: { "in": "body", "name": "data", "required": true, "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "buildingId": { "dataType": "string", "required": true }, "appsIds": { "dataType": "array", "array": { "dataType": "string" }, "required": true } } } },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new userProfile_controller_1.UserProfileController();
            const promise = controller.unauthorizeToAccessBosApp.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, undefined, next);
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function authenticateMiddleware(security = []) {
        return function runAuthenticationMiddleware(request, _response, next) {
            return __awaiter(this, void 0, void 0, function* () {
                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                // keep track of failed auth attempts so we can hand back the most
                // recent one.  This behavior was previously existing so preserving it
                // here
                const failedAttempts = [];
                const pushAndRethrow = (error) => {
                    failedAttempts.push(error);
                    throw error;
                };
                const secMethodOrPromises = [];
                for (const secMethod of security) {
                    if (Object.keys(secMethod).length > 1) {
                        const secMethodAndPromises = [];
                        for (const name in secMethod) {
                            secMethodAndPromises.push((0, authentication_1.expressAuthentication)(request, name, secMethod[name])
                                .catch(pushAndRethrow));
                        }
                        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                        secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                            .then(users => { return users[0]; }));
                    }
                    else {
                        for (const name in secMethod) {
                            secMethodOrPromises.push((0, authentication_1.expressAuthentication)(request, name, secMethod[name])
                                .catch(pushAndRethrow));
                        }
                    }
                }
                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                try {
                    request['user'] = yield promiseAny(secMethodOrPromises);
                    next();
                }
                catch (err) {
                    // Show most recent error as response
                    const error = failedAttempts.pop();
                    error.status = error.status || 401;
                    next(error);
                }
                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            });
        };
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, response, successStatus, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode = successStatus;
            let headers;
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus() || statusCode;
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            returnHandler(response, statusCode, data, headers);
        })
            .catch((error) => next(error));
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function returnHandler(response, statusCode, data, headers = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        }
        else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        }
        else {
            response.status(statusCode || 204).end();
        }
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function responder(response) {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    }
    ;
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                case 'res':
                    return responder(response);
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new runtime_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
exports.RegisterRoutes = RegisterRoutes;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
//# sourceMappingURL=routes.js.map