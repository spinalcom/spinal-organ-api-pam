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
import { BuildingService } from '../../services'
import * as proxy from "express-http-proxy";

interface IApiData { url: string; clientId: string; secretId: string }

export default async function redirectRoutes(app: express.Express) {
    let apiData: IApiData = { url: "", clientId: "", secretId: "" };
    app.use(`${BOS_BASE_URI}/:building_id/*`, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { building_id } = req.params;
        const node = await BuildingService.getInstance().getBuilding(building_id);
        if (!node) return res.status(404).send(`No building found for ${building_id}`);

        apiData = { url: "", clientId: "", secretId: "" };
        apiData.url = node.info.apiUrl.get();
        apiData.clientId = node.info.clientId.get();
        apiData.secretId = node.info.clientSecret.get();
        next();

    }, proxy((req: express.Request) => getProxyHost(apiData), {
        memoizeHost: false,
        proxyReqPathResolver: (req: express.Request) => {
            const base = req.baseUrl.replace(new RegExp(`^${BOS_BASE_URI}*/`), (el) => "");
            return "/" + base.split("/").slice(1).join("/")
        },
    }))
}



function getProxyHost(apiData: IApiData): string {
    return apiData.url;
} 