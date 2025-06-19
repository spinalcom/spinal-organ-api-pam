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
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const servervicesInitializer_1 = require("./utils/servervicesInitializer");
const express_1 = require("./express");
const spinal_lib_organ_monitoring_1 = require("spinal-lib-organ-monitoring");
const initializeDatabase_1 = require("./utils/initializeDatabase");
const constant_1 = require("./constant");
const services_1 = require("./services");
const adminApps_1 = require("./adminApps");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const organType = "PAM_API"; // The type of the organ, can be changed if needed
const protocol = process.env.HUB_PROTOCOL;
const hubHost = process.env.HUB_HOST;
const hubPort = parseInt(process.env.HUB_PORT);
const userId = process.env.USER_ID;
const userPwd = process.env.USER_MDP;
const config_directory_path = process.env.CONFIG_DIRECTORY_PATH || constant_1.CONFIG_DEFAULT_DIRECTORY_PATH;
const configFileName = process.env.CONFIG_FILE_NAME || constant_1.CONFIG_DEFAULT_NAME;
const express_server_port = process.env.SERVER_PORT || "2022";
const express_server_protocol = process.env.SERVER_PROTOCOL || "http";
const connectionUrl = `${protocol}://${userId}:${userPwd}@${hubHost}:${hubPort}/`;
const hubSession = spinal_core_connectorjs_type_1.spinalCore.connect(connectionUrl); // Connect to the hub
(0, initializeDatabase_1.initializeDatabase)(hubSession, config_directory_path, configFileName)
    .then(async (graph) => {
    await servervicesInitializer_1.default.getInstance().initAllService(graph); // Initialize services
    console.log("All services initialized successfully.");
    const digitalTwinServiceInstance = services_1.DigitalTwinService.getInstance();
    digitalTwinServiceInstance.setConnectSession(hubSession); // Set the session for DigitalTwinService
    await digitalTwinServiceInstance.initDigitalTwin("PAM DigitalTwin", constant_1.CONFIG_DEFAULT_DIRECTORY_PATH); // initialize the default Digital Twin
    console.log("Default Digital Twin initialized successfully.");
    await (0, adminApps_1.createDefaultAdminApps)(); // create administration apps
    console.log("Default admin apps initialized successfully.");
    await (0, express_1.default)(express_server_port, express_server_protocol); // launch express server
    await spinal_lib_organ_monitoring_1.default.init(hubSession, process.env.ORGAN_NAME, organType, hubHost, hubPort); // initialize connector in monitoring plateform
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map