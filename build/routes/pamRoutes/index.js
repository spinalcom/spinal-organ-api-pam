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
const building_1 = require("./building");
const apps_1 = require("./apps");
const apis_1 = require("./apis");
const appProfile_1 = require("./appProfile");
const userProfile_1 = require("./userProfile");
const role_1 = require("./role");
const organList_1 = require("./organList");
const user_1 = require("./user");
function routes(app) {
    (0, building_1.default)(app);
    (0, apps_1.default)(app);
    (0, apis_1.default)(app);
    (0, appProfile_1.default)(app);
    (0, userProfile_1.default)(app);
    (0, role_1.default)(app);
    (0, organList_1.default)(app);
    (0, user_1.default)(app);
}
exports.default = routes;
//# sourceMappingURL=index.js.map