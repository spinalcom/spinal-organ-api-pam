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
import controller from "./apps.controller";

export default function routes(app: express.Express) {
    app
        .post(`${PAM_BASE_URI}/create_app_category`, controller.createAppCategory)
        .get(`${PAM_BASE_URI}/get_app_category/:id`, controller.getAppCategory)
        .get(`${PAM_BASE_URI}/get_all_categories`, controller.getAllCategories)
        .put(`${PAM_BASE_URI}/update_app_category/:id`, controller.updateAppCategory)
        .delete(`${PAM_BASE_URI}/delete_app_category/:id`, controller.deleteAppCategory)
        .post(`${PAM_BASE_URI}/create_app_group/:categoryId`, controller.createAppGroup)
        .get(`${PAM_BASE_URI}/get_all_groups_in_category/:categoryId`, controller.getAllGroupsInCategory)
        .get(`${PAM_BASE_URI}/get_app_group/:categoryId/:groupId`, controller.getAppGroup)
        .put(`${PAM_BASE_URI}/update_app_group/:categoryId/:groupId`, controller.updateAppGroup)
        .delete(`${PAM_BASE_URI}/delete_app_group/:categoryId/:groupId`, controller.deleteAppGroup)
        .post(`${PAM_BASE_URI}/create_app/:categoryId/:groupId`, controller.createApp)
        .get(`${PAM_BASE_URI}/get_all_apps_in_group/:categoryId/:groupId`, controller.getAllAppsInGroup)
        .get(`${PAM_BASE_URI}/get_app/:categoryId/:groupId/:appId`, controller.getApp)
        .get(`${PAM_BASE_URI}/get_all_apps`, controller.getAllApps)
        .get(`${PAM_BASE_URI}/get_app_by_id/:id`, controller.getAppById)
        .put(`${PAM_BASE_URI}/update_app/:categoryId/:groupId/:appId`, controller.updateApp)
        .delete(`${PAM_BASE_URI}/delete_app/:categoryId/:groupId/:appId`, controller.deleteApp)
}