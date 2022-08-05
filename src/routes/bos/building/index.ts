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
// import { PAM_BASE_URI } from "../../../constant";
import controller from "./building.controller";

const PAM_BASE_URI = "/api/v1/bos"

export default function routes(app: express.Express) {
    app
        .post(`${PAM_BASE_URI}/add_building`, controller.addBuilding)
        .get(`${PAM_BASE_URI}/get_building/:id`, controller.getBuilding)
        .get(`${PAM_BASE_URI}/get_all_buildings`, controller.getAllBuilding)
        .put(`${PAM_BASE_URI}/edit_building/:id`, controller.editBuilding)
        .delete(`${PAM_BASE_URI}/delete_building/:id`, controller.deleteBuilding)
}