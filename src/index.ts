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


require("dotenv").config();
import { spinalCore } from 'spinal-core-connectorjs_type';
import { configServiceInstance } from './services/configFile.service';
// const { spinalConnector: { user, password, host, port }, config: { directory_path, fileName } } = require("../config");

import initExpress from './initExpress';
import initSwagger from "./swagger";

import routes from "./routes";

const conn = spinalCore.connect(`http://${process.env.USER_ID}:${process.env.USER_MDP}@${process.env.HUB_HOST}:${process.env.HUB_PORT}/`);


configServiceInstance.init(conn).then((result) => {
  const { app } = initExpress();
  initSwagger(app);
  routes(app);
}).catch((err: Error) => {
  console.error(err);
});
