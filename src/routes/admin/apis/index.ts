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
import { PAM_BASE_URI } from '../../../constant';
import * as express from 'express';
import controller from "./apis.controller";

export default function routes(app: express.Express) {

    app
        .post(`${PAM_BASE_URI}/create_api_route`, controller.createApiRoute)
        .post(`${PAM_BASE_URI}/upload_apis_routes`, controller.uploadSwaggerFile)
        .put(`${PAM_BASE_URI}/update_api_route/:id`, controller.updateApiRoute)
        .get(`${PAM_BASE_URI}/get_api_route/:id`, controller.getApiRouteById)
        .get(`${PAM_BASE_URI}/get_all_api_route`, controller.getAllApiRoute)
        .delete(`${PAM_BASE_URI}/delete_api_route/:id`, controller.deleteApiRoute)
}