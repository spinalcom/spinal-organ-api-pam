"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { PAM_BASE_URI } from "../../../constant";
const building_controller_1 = require("./building.controller");
const PAM_BASE_URI = "/api/v1/bos";
function routes(app) {
    app
        .post(`${PAM_BASE_URI}/add_building`, building_controller_1.default.addBuilding)
        .get(`${PAM_BASE_URI}/get_building/:id`, building_controller_1.default.getBuilding)
        .get(`${PAM_BASE_URI}/get_all_buildings`, building_controller_1.default.getAllBuilding)
        .put(`${PAM_BASE_URI}/edit_building/:id`, building_controller_1.default.editBuilding)
        .delete(`${PAM_BASE_URI}/delete_building/:id`, building_controller_1.default.deleteBuilding);
}
exports.default = routes;
//# sourceMappingURL=index.js.map