"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../../constant");
const apps_controller_1 = require("./apps.controller");
function routes(app) {
    app
        .post(`${constant_1.PAM_BASE_URI}/create_app_category`, apps_controller_1.default.createAppCategory)
        .get(`${constant_1.PAM_BASE_URI}/get_app_category/:id`, apps_controller_1.default.getAppCategory)
        .get(`${constant_1.PAM_BASE_URI}/get_all_categories`, apps_controller_1.default.getAllCategories)
        .put(`${constant_1.PAM_BASE_URI}/update_app_category/:id`, apps_controller_1.default.updateAppCategory)
        .delete(`${constant_1.PAM_BASE_URI}/delete_app_category/:id`, apps_controller_1.default.deleteAppCategory)
        .post(`${constant_1.PAM_BASE_URI}/create_app_group/:categoryId`, apps_controller_1.default.createAppGroup)
        .get(`${constant_1.PAM_BASE_URI}/get_all_groups_in_category/:categoryId`, apps_controller_1.default.getAllGroupsInCategory)
        .get(`${constant_1.PAM_BASE_URI}/get_app_group/:categoryId/:groupId`, apps_controller_1.default.getAppGroup)
        .put(`${constant_1.PAM_BASE_URI}/update_app_group/:categoryId/:groupId`, apps_controller_1.default.updateAppGroup)
        .delete(`${constant_1.PAM_BASE_URI}/delete_app_group/:categoryId/:groupId`, apps_controller_1.default.deleteAppGroup)
        .post(`${constant_1.PAM_BASE_URI}/create_app/:categoryId/:groupId`, apps_controller_1.default.createApp)
        .get(`${constant_1.PAM_BASE_URI}/get_all_apps_in_group/:categoryId/:groupId`, apps_controller_1.default.getAllAppsInGroup)
        .get(`${constant_1.PAM_BASE_URI}/get_app/:categoryId/:groupId/:appId`, apps_controller_1.default.getApp)
        .get(`${constant_1.PAM_BASE_URI}/get_all_apps`, apps_controller_1.default.getAllApps)
        .get(`${constant_1.PAM_BASE_URI}/get_app_by_id/:id`, apps_controller_1.default.getAppById)
        .put(`${constant_1.PAM_BASE_URI}/update_app/:categoryId/:groupId/:appId`, apps_controller_1.default.updateApp)
        .delete(`${constant_1.PAM_BASE_URI}/delete_app/:categoryId/:groupId/:appId`, apps_controller_1.default.deleteApp);
}
exports.default = routes;
//# sourceMappingURL=index.js.map