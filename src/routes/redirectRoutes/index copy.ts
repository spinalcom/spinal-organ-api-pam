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

import { BOS_BASE_URI } from "../../constant";
import * as express from "express";
import { DigitalTwinService } from '../../services'

export default function redirectRoutes(app: express.Express) {
    app.all(`${BOS_BASE_URI}/:building_id/*`, async function (req: express.Request, res: express.Response) {
        try {
            const { building_id } = req.params;
            return res.redirect("http://localhost:3000/api/v1/context/list")

            // const node = await DigitalTwinService.getInstance().getDigitalTwin(building_id);
            // if (node) {
            //     res.redirect("http://google.com")
            // }
            return res.status(404).send(`no building found for ${building_id}`);

        } catch (error) {
            res.status(500).send(error.message);
        }


    })
}