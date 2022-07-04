"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const constant_1 = require("../../../constant");
const apis_controller_1 = require("./apis.controller");
function routes(app) {
    app
        .post(`${constant_1.PAM_BASE_URI}/create_api_route`, apis_controller_1.default.createApiRoute)
        .post(`${constant_1.PAM_BASE_URI}/upload_apis_routes`, apis_controller_1.default.uploadSwaggerFile)
        .put(`${constant_1.PAM_BASE_URI}/update_api_route/:id`, apis_controller_1.default.updateApiRoute)
        .get(`${constant_1.PAM_BASE_URI}/get_api_route/:id`, apis_controller_1.default.getApiRouteById)
        .get(`${constant_1.PAM_BASE_URI}/get_all_api_route`, apis_controller_1.default.getAllApiRoute)
        .delete(`${constant_1.PAM_BASE_URI}/delete_api_route/:id`, apis_controller_1.default.deleteApiRoute);
}
exports.default = routes;
//# sourceMappingURL=index.js.map