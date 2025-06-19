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

const path = require("path");

import { spinalCore } from 'spinal-core-connectorjs_type';
import ServicesInitializer from './utils/servervicesInitializer';
import launchExpressServer from './express';
import ConfigFile from "spinal-lib-organ-monitoring";
import { initializeDatabase } from './utils/initializeDatabase';
import { CONFIG_DEFAULT_DIRECTORY_PATH, CONFIG_DEFAULT_NAME } from './constant';
import { DigitalTwinService } from './services';
import { createDefaultAdminApps } from './adminApps';

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });


const organType = "PAM_API"; // The type of the organ, can be changed if needed
const protocol = process.env.HUB_PROTOCOL;
const hubHost = process.env.HUB_HOST;
const hubPort = parseInt(process.env.HUB_PORT);
const userId = process.env.USER_ID;
const userPwd = process.env.USER_MDP;
const config_directory_path = process.env.CONFIG_DIRECTORY_PATH || CONFIG_DEFAULT_DIRECTORY_PATH;
const configFileName = process.env.CONFIG_FILE_NAME || CONFIG_DEFAULT_NAME;

const express_server_port = process.env.SERVER_PORT || "2022";
const express_server_protocol: any = process.env.SERVER_PROTOCOL || "http";

const connectionUrl = `${protocol}://${userId}:${userPwd}@${hubHost}:${hubPort}/`;
const hubSession = spinalCore.connect(connectionUrl); // Connect to the hub


initializeDatabase(hubSession, config_directory_path, configFileName)
  .then(async (graph) => {
    await ServicesInitializer.getInstance().initAllService(graph); // Initialize services
    console.log("All services initialized successfully.");

    const digitalTwinServiceInstance = DigitalTwinService.getInstance();
    digitalTwinServiceInstance.setConnectSession(hubSession); // Set the session for DigitalTwinService

    await digitalTwinServiceInstance.initDigitalTwin("PAM DigitalTwin", CONFIG_DEFAULT_DIRECTORY_PATH); // initialize the default Digital Twin
    console.log("Default Digital Twin initialized successfully.");

    await createDefaultAdminApps(); // create administration apps
    console.log("Default admin apps initialized successfully.");

    await launchExpressServer(express_server_port, express_server_protocol); // launch express server

    await ConfigFile.init(hubSession, process.env.ORGAN_NAME, organType, hubHost, hubPort); // initialize connector in monitoring plateform

  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });

