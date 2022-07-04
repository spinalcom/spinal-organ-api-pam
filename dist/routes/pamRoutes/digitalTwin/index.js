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
const digitalTwin_controller_1 = require("./digitalTwin.controller");
function routes(app) {
    app
        .post(`${constant_1.PAM_BASE_URI}/create_digitaltwin`, digitalTwin_controller_1.default.createDigitalTwin)
        .get(`${constant_1.PAM_BASE_URI}/get_all_digitaltwins`, digitalTwin_controller_1.default.getAllDigitalTwins)
        .get(`${constant_1.PAM_BASE_URI}/get_digitaltwin/:id`, digitalTwin_controller_1.default.getDigitalTwin)
        .put(`${constant_1.PAM_BASE_URI}/rename_digitaltwin/:id`, digitalTwin_controller_1.default.renameDigitalTwin)
        .delete(`${constant_1.PAM_BASE_URI}/remove_digitaltwin/:id`, digitalTwin_controller_1.default.removeDigitalTwin)
        .put(`${constant_1.PAM_BASE_URI}/set_actual_digitalTwin/:id`, digitalTwin_controller_1.default.setActualDigitalTwin)
        .get(`${constant_1.PAM_BASE_URI}/get_actual_digitaltwin`, digitalTwin_controller_1.default.getActualDigitalTwin)
        .delete(`${constant_1.PAM_BASE_URI}/remove_actual_digitatwin`, digitalTwin_controller_1.default.removeActualDigitaTwin);
}
exports.default = routes;
//# sourceMappingURL=index.js.map