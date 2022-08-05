"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../../constant");
const role_controller_1 = require("./role.controller");
function routes(app) {
    app
        .post(`${constant_1.PAM_BASE_URI}/create_role`, role_controller_1.default.createRole)
        .get(`${constant_1.PAM_BASE_URI}/get_all_role`, role_controller_1.default.getAllRole)
        .get(`${constant_1.PAM_BASE_URI}/get_role/:id`, role_controller_1.default.getRole)
        .put(`${constant_1.PAM_BASE_URI}/update_role/:id`, role_controller_1.default.updateRole)
        .delete(`${constant_1.PAM_BASE_URI}/delete_role/:id`, role_controller_1.default.deleteRole);
}
exports.default = routes;
//# sourceMappingURL=index.js.map