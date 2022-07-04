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
        .post(`${PAM_BASE_URI}/app_profile/create_profile`, controller.createAppProfile)
        .get(`${PAM_BASE_URI}/app_profile/get_profile/:id`, controller.getAppProfile)
        .get(`${PAM_BASE_URI}/app_profile/get_all_profile`, controller.getAllAppProfile)
        .put(`${PAM_BASE_URI}/app_profile/edit_profile/:id`, controller.updateAppProfile)
        .delete(`${PAM_BASE_URI}/app_profile/delete_profile/:id`, controller.deleteAppProfile)
        .post(`${PAM_BASE_URI}/app_profile/authorize_apps/:profileId`, controller.authorizeToAccessApps)
        .post(`${PAM_BASE_URI}/app_profile/unauthorize_apps/:profileId`, controller.unauthorizeToAccessApps)
        .get(`${PAM_BASE_URI}/app_profile/get_authorized_apps/:profileId`, controller.getAuthorizedApps)
        .post(`${PAM_BASE_URI}/app_profile/authorize_apis/:profileId`, controller.authorizeToAccessApis)
        .post(`${PAM_BASE_URI}/app_profile/unauthorize_apis/:profileId`, controller.unauthorizeToAccessApis)
        .get(`${PAM_BASE_URI}/app_profile/get_authorized_apis/:profileId`, controller.getAuthorizedApis)
        .post(`${PAM_BASE_URI}/app_profile/authorize_bos/:profileId`, controller.authorizeProfileToAccessBos)
        .post(`${PAM_BASE_URI}/app_profile/unauthorize_bos/:profileId`, controller.unauthorizeProfileToAccessBos)
        .get(`${PAM_BASE_URI}/app_profile/get_authorized_bos/:profileId`, controller.getAuthorizedBos)
}