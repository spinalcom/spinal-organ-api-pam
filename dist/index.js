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
const path = require("path");
require("dotenv").config(path.resolve(__dirname, "../.env"));
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const configFile_service_1 = require("./services/configFile.service");
// const { spinalConnector: { user, password, host, port }, config: { directory_path, fileName } } = require("../config");
const initExpress_1 = require("./initExpress");
// import initSwagger from "./swagger";
// import routes from "./old_routes";
const routes_1 = require("./routes");
const conn = spinal_core_connectorjs_type_1.spinalCore.connect(`http://${process.env.USER_ID}:${process.env.USER_MDP}@${process.env.HUB_HOST}:${process.env.HUB_PORT}/`);
configFile_service_1.configServiceInstance.init(conn).then(() => {
    const { app } = (0, initExpress_1.default)();
    // initSwagger(app);
    (0, routes_1.RegisterRoutes)(app);
}).catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map