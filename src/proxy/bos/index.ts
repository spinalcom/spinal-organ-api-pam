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

import { BOS_BASE_URI_V2, BOS_BASE_URI_V1, BOS_BASE_URI_V1_2, HTTP_CODES, SECURITY_NAME, USER_TYPES, SECURITY_MESSAGES, PAM_BASE_URI } from "../../constant";
import * as express from "express";
import { BuildingService } from '../../services'
import * as proxy from "express-http-proxy";
import { expressAuthentication } from "../../security/authentication"
import { canAccess, formatUri, getProfileBuildings, proxyOptions } from "./utils";
import { Utils } from "../../utils/pam_v1_utils/utils";



interface IApiData { url: string; clientId: string; secretId: string }

export default function configureProxy(app: express.Express, useV1: boolean = false) {
    let apiData: IApiData = { url: "", clientId: "", secretId: "" };
    const uri = !useV1 ? BOS_BASE_URI_V2 : `(${BOS_BASE_URI_V1}|${BOS_BASE_URI_V1_2})`;

    app.all(`${uri}/:building_id/*`, async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        try {
            const { building_id } = req.params;
            const tokenInfo = await expressAuthentication(req, SECURITY_NAME.profile);
            req["endpoint"] = formatUri(req.url, uri);

            const building = await BuildingService.getInstance().getBuildingById(building_id);
            if (!building) return res.status(HTTP_CODES.NOT_FOUND).send(`No building found for ${building_id}`);


            if (tokenInfo.userInfo?.type != USER_TYPES.ADMIN) {

                const isAppProfile = tokenInfo.profile.appProfileBosConfigId ? true : false;
                const profileId = tokenInfo.profile.appProfileBosConfigId || tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId;
                const access = await canAccess(building_id, { method: req.method, route: (<any>req).endpoint }, profileId, isAppProfile)
                if (!access) throw new Error(SECURITY_MESSAGES.UNAUTHORIZED);

            }

            apiData.url = building.info.apiUrl.get();
            next();

        } catch (error) {
            return res.status(HTTP_CODES.UNAUTHORIZED).send(error.message);
        }

    }, proxy((req: express.Request) => apiData.url, proxyOptions(useV1)))


    if (useV1) {
        app.get("/v1/building_list", async (req: express.Request, res: express.Response) => {
            try {
                const tokenInfo = await expressAuthentication(req, SECURITY_NAME.profile);
                let isApp;
                let profileId;
                if (tokenInfo.profile.appProfileBosConfigId) {
                    isApp = true;
                    profileId = tokenInfo.profile.appProfileBosConfigId
                } else if (tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId) {
                    isApp = false;
                    profileId = tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId;
                }

                const buildings = await getProfileBuildings(profileId, isApp);

                const data = Utils.getReturnObj(null, buildings, "READ");
                return res.send(data);
            } catch (error) {
                return res.status(HTTP_CODES.UNAUTHORIZED).send(error.message);
            }
        })

        app.post("/v1/oauth/token", (req: express.Request, res: express.Response) => {
            res.redirect(307, `${PAM_BASE_URI}/auth`)
        })
    }

}



