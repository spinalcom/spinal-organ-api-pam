"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../../constant");
const userProfile_controller_1 = require("./userProfile.controller");
function routes(app) {
    app
        .post(`${constant_1.PAM_BASE_URI}/create_user_profile`, userProfile_controller_1.default.createUserProfile)
        .get(`${constant_1.PAM_BASE_URI}/get_user_profile/:id`, userProfile_controller_1.default.getUserProfile)
        .get(`${constant_1.PAM_BASE_URI}/get_all_user_profile`, userProfile_controller_1.default.getAllUserProfile)
        .put(`${constant_1.PAM_BASE_URI}/edit_user_profile/:id`, userProfile_controller_1.default.updateUserProfile)
        .delete(`${constant_1.PAM_BASE_URI}/delete_user_profile/:id`, userProfile_controller_1.default.deleteUserProfile);
}
exports.default = routes;
//# sourceMappingURL=index.js.map