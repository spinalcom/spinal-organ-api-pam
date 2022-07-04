"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../../constant");
const appProfile_controller_1 = require("./appProfile.controller");
function routes(app) {
    app
        .post(`${constant_1.PAM_BASE_URI}/app_profile/create_profile`, appProfile_controller_1.default.createAppProfile)
        .get(`${constant_1.PAM_BASE_URI}/app_profile/get_profile/:id`, appProfile_controller_1.default.getAppProfile)
        .get(`${constant_1.PAM_BASE_URI}/app_profile/get_all_profile`, appProfile_controller_1.default.getAllAppProfile)
        .put(`${constant_1.PAM_BASE_URI}/app_profile/edit_profile/:id`, appProfile_controller_1.default.updateAppProfile)
        .delete(`${constant_1.PAM_BASE_URI}/app_profile/delete_profile/:id`, appProfile_controller_1.default.deleteAppProfile)
        .post(`${constant_1.PAM_BASE_URI}/app_profile/authorize_apps/:profileId`, appProfile_controller_1.default.authorizeToAccessApps)
        .post(`${constant_1.PAM_BASE_URI}/app_profile/unauthorize_apps/:profileId`, appProfile_controller_1.default.unauthorizeToAccessApps)
        .get(`${constant_1.PAM_BASE_URI}/app_profile/get_authorized_apps/:profileId`, appProfile_controller_1.default.getAuthorizedApps)
        .post(`${constant_1.PAM_BASE_URI}/app_profile/authorize_apis/:profileId`, appProfile_controller_1.default.authorizeToAccessApis)
        .post(`${constant_1.PAM_BASE_URI}/app_profile/unauthorize_apis/:profileId`, appProfile_controller_1.default.unauthorizeToAccessApis)
        .get(`${constant_1.PAM_BASE_URI}/app_profile/get_authorized_apis/:profileId`, appProfile_controller_1.default.getAuthorizedApis)
        .post(`${constant_1.PAM_BASE_URI}/app_profile/authorize_bos/:profileId`, appProfile_controller_1.default.authorizeProfileToAccessBos)
        .post(`${constant_1.PAM_BASE_URI}/app_profile/unauthorize_bos/:profileId`, appProfile_controller_1.default.unauthorizeProfileToAccessBos)
        .get(`${constant_1.PAM_BASE_URI}/app_profile/get_authorized_bos/:profileId`, appProfile_controller_1.default.getAuthorizedBos);
}
exports.default = routes;
//# sourceMappingURL=index.js.map