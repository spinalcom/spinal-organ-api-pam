"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../../constant");
const appProfile_controller_1 = require("./appProfile.controller");
function routes(app) {
    app
        .post(`${constant_1.PAM_BASE_URI}/create_app_profile`, appProfile_controller_1.default.createAppProfile)
        .get(`${constant_1.PAM_BASE_URI}/get_app_profile/:id`, appProfile_controller_1.default.getAppProfile)
        .get(`${constant_1.PAM_BASE_URI}/get_all_app_profile`, appProfile_controller_1.default.getAllAppProfile)
        .put(`${constant_1.PAM_BASE_URI}/edit_app_profile/:id`, appProfile_controller_1.default.updateAppProfile)
        .delete(`${constant_1.PAM_BASE_URI}/delete_app_profile/:id`, appProfile_controller_1.default.deleteAppProfile);
}
exports.default = routes;
//# sourceMappingURL=index.js.map