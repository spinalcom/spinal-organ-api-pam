"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../../constant");
const digitalTwin_controller_1 = require("./digitalTwin.controller");
function routes(app) {
    app
        .post(`${constant_1.PAM_BASE_URI}/add_digitaltwin`, digitalTwin_controller_1.default.addDigitalTwin)
        .get(`${constant_1.PAM_BASE_URI}/get_digitaltwin/:id`, digitalTwin_controller_1.default.getDigitalTwin)
        .get(`${constant_1.PAM_BASE_URI}/get_all_digitaltwin`, digitalTwin_controller_1.default.getAllDigitalTwin)
        .put(`${constant_1.PAM_BASE_URI}/edit_digitaltwin/:id`, digitalTwin_controller_1.default.editDigitalTwin)
        .delete(`${constant_1.PAM_BASE_URI}/delete_digitaltwin/:id`, digitalTwin_controller_1.default.deleteDigitalTwin);
}
exports.default = routes;
//# sourceMappingURL=index.js.map