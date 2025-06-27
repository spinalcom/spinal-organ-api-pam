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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const configFile_service_1 = require("./services/configFile.service");
const server_1 = require("./server");
const spinal_lib_organ_monitoring_1 = require("spinal-lib-organ-monitoring");
const conn = spinal_core_connectorjs_type_1.spinalCore.connect(`${process.env.HUB_PROTOCOL}://${process.env.USER_ID}:${process.env.USER_MDP}@${process.env.HUB_HOST}:${process.env.HUB_PORT}/`);
configFile_service_1.configServiceInstance.init(conn).then(() => __awaiter(void 0, void 0, void 0, function* () {
    const { app } = yield (0, server_1.default)(conn);
    yield spinal_lib_organ_monitoring_1.default.init(conn, process.env.ORGAN_NAME, "PAM_API", process.env.HUB_HOST, parseInt(process.env.HUB_PORT));
})).catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map