"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../../constant");
const building_controller_1 = require("./building.controller");
function routes(app) {
    app
        .post(`${constant_1.PAM_BASE_URI}/add_building`, building_controller_1.default.addBuilding)
        .get(`${constant_1.PAM_BASE_URI}/get_building/:id`, building_controller_1.default.getBuilding)
        .get(`${constant_1.PAM_BASE_URI}/get_all_buildings`, building_controller_1.default.getAllBuilding)
        .put(`${constant_1.PAM_BASE_URI}/edit_building/:id`, building_controller_1.default.editBuilding)
        .delete(`${constant_1.PAM_BASE_URI}/delete_building/:id`, building_controller_1.default.deleteBuilding);
}
exports.default = routes;
//# sourceMappingURL=index.js.map