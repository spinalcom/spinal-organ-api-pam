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

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();
export const BASE_URI: string = `/v1`;
export const API_URI: string = process.env.API_URI || 'http://localhost:8082';
export const CONFIG_PATH: string = path.resolve(__dirname, 'config/');
export const PORT = normalizePort(process.env.HTTPS_PORT || 3005);
export const DEV_PORT = normalizePort(process.env.HTTP_PORT || 8082);
export const DEV_IP = '192.168.1.4';
export const PROD_IP = '94.23.9.157';
export const NOREPLY_MAIL = 'noreply@spinalcom.com';
export const TEMPLATE_PATH: string = require('path').resolve(
    __dirname,
    'core/email-template'
);
export const DATABASE_ERR = `Database error`;
export const BAD_REQUEST_ERR = `Bad Request`;
export const NOT_ALLOWED_ERR = `Unauthorized`;
export const INTERNAL_ERR = `Internal Server Error`;

function normalizePort(val: number | string): number | string | boolean {
    const port: number = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
}
