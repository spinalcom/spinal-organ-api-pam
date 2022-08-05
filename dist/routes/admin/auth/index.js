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
const constant_1 = require("../../../constant");
const auth_controller_1 = require("./auth.controller");
function routes(app) {
    app
        .post(`/api/auth`, auth_controller_1.default.authenticate)
        .post(`${constant_1.PAM_BASE_URI}/register_admin`, auth_controller_1.default.registerToAdmin)
        .get(`${constant_1.PAM_BASE_URI}/get_bos_credential`, auth_controller_1.default.getBosToAdminCredential)
        .post(`${constant_1.PAM_BASE_URI}/create_admin_credential`, auth_controller_1.default.createAdminCredential)
        .get(`${constant_1.PAM_BASE_URI}/getAdminCredential`, auth_controller_1.default.getAdminCredential)
        .put(`${constant_1.PAM_BASE_URI}/update_data`, auth_controller_1.default.syncDataToAdmin);
}
exports.default = routes;
//# sourceMappingURL=index.js.map