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
exports.INTERNAL_ERR = exports.NOT_ALLOWED_ERR = exports.BAD_REQUEST_ERR = exports.DATABASE_ERR = exports.TEMPLATE_PATH = exports.NOREPLY_MAIL = exports.PROD_IP = exports.DEV_IP = exports.DEV_PORT = exports.PORT = exports.CONFIG_PATH = exports.API_URI = exports.BASE_URI = void 0;
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
exports.BASE_URI = `/v1`;
exports.API_URI = process.env.API_URI || 'http://localhost:8082';
exports.CONFIG_PATH = path.resolve(__dirname, 'config/');
exports.PORT = normalizePort(process.env.HTTPS_PORT || 3005);
exports.DEV_PORT = normalizePort(process.env.HTTP_PORT || 8082);
exports.DEV_IP = '192.168.1.4';
exports.PROD_IP = '94.23.9.157';
exports.NOREPLY_MAIL = 'noreply@spinalcom.com';
exports.TEMPLATE_PATH = require('path').resolve(__dirname, 'core/email-template');
exports.DATABASE_ERR = `Database error`;
exports.BAD_REQUEST_ERR = `Bad Request`;
exports.NOT_ALLOWED_ERR = `Unauthorized`;
exports.INTERNAL_ERR = `Internal Server Error`;
function normalizePort(val) {
    const port = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(port))
        return val;
    else if (port >= 0)
        return port;
    else
        return false;
}
//# sourceMappingURL=constants.js.map