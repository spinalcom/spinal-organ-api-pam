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
import * as express from 'express';
import { PAM_BASE_URI } from "../../../constant";
import controller from "./appProfile.controller";


export default function routes(app: express.Express) {
    app
        .post(`${PAM_BASE_URI}/create_app_profile`, controller.createAppProfile)
        .get(`${PAM_BASE_URI}/get_app_profile/:id`, controller.getAppProfile)
        .get(`${PAM_BASE_URI}/get_all_app_profile`, controller.getAllAppProfile)
        .put(`${PAM_BASE_URI}/edit_app_profile/:id`, controller.updateAppProfile)
        .delete(`${PAM_BASE_URI}/delete_app_profile/:id`, controller.deleteAppProfile)
}