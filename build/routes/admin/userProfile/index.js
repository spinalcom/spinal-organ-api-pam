"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../../constant");
const userProfile_controller_1 = require("./userProfile.controller");
function routes(app) {
    app
        .post(`${constant_1.PAM_BASE_URI}/user_profile/create_profile`, userProfile_controller_1.default.createUserProfile)
        .get(`${constant_1.PAM_BASE_URI}/user_profile/get_profile/:id`, userProfile_controller_1.default.getUserProfile)
        .get(`${constant_1.PAM_BASE_URI}/user_profile/get_all_profile`, userProfile_controller_1.default.getAllUserProfile)
        .put(`${constant_1.PAM_BASE_URI}/user_profile/edit_profile/:id`, userProfile_controller_1.default.updateUserProfile)
        .delete(`${constant_1.PAM_BASE_URI}/user_profile/delete_profile/:id`, userProfile_controller_1.default.deleteUserProfile)
        .post(`${constant_1.PAM_BASE_URI}/user_profile/authorize_apps/:profileId`, userProfile_controller_1.default.authorizeToAccessApps)
        .post(`${constant_1.PAM_BASE_URI}/user_profile/unauthorize_apps/:profileId`, userProfile_controller_1.default.unauthorizeToAccessApps)
        .get(`${constant_1.PAM_BASE_URI}/user_profile/get_authorized_apps/:profileId`, userProfile_controller_1.default.getAuthorizedApps)
        .post(`${constant_1.PAM_BASE_URI}/user_profile/authorize_apis/:profileId`, userProfile_controller_1.default.authorizeToAccessApis)
        .post(`${constant_1.PAM_BASE_URI}/user_profile/unauthorize_apis/:profileId`, userProfile_controller_1.default.unauthorizeToAccessApis)
        .get(`${constant_1.PAM_BASE_URI}/user_profile/get_authorized_apis/:profileId`, userProfile_controller_1.default.getAuthorizedApis)
        .post(`${constant_1.PAM_BASE_URI}/user_profile/authorize_bos/:profileId`, userProfile_controller_1.default.authorizeProfileToAccessBos)
        .post(`${constant_1.PAM_BASE_URI}/user_profile/unauthorize_bos/:profileId`, userProfile_controller_1.default.unauthorizeProfileToAccessBos)
        .get(`${constant_1.PAM_BASE_URI}/user_profile/get_authorized_bos/:profileId`, userProfile_controller_1.default.getAuthorizedBos);
}
exports.default = routes;
//# sourceMappingURL=index.js.map