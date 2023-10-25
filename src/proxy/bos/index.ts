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
import { AuthentificationService, BuildingService } from '../../services'
import * as proxy from "express-http-proxy";
import { checkAndGetTokenInfo } from "../../security/authentication"
import { canAccess, formatUri, getProfileBuildings, proxyOptions } from "./utils";
import { Utils } from "../../utils/pam_v1_utils/utils";
import axios from "axios";
import { AuthError } from "../../security/AuthError";
import { APIException } from "../../utils/pam_v1_utils/api_exception";
import * as bodyParser from "body-parser";
import * as atob from "atob";

interface IApiData { url: string; clientId: string; secretId: string }

export default function configureProxy(app: express.Express, useV1: boolean = false) {
    let apiData: IApiData = { url: "", clientId: "", secretId: "" };
    const uri = !useV1 ? BOS_BASE_URI_V2 : `(${BOS_BASE_URI_V1}|${BOS_BASE_URI_V1_2})`;

    app.all(`${uri}/:building_id/*`, async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        try {
            const { building_id } = req.params;
            req["endpoint"] = formatUri(req.url, uri);

            const building = await BuildingService.getInstance().getBuildingById(building_id);
            if (!building) return new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            apiData.url = building.info.apiUrl.get();

            if (/\BIM\/file/.test((<any>req).endpoint)) {
                req["endpoint"] = (<any>req).endpoint.replace("/api/v1", "");
                return next();
            }

            const tokenInfo = await checkAndGetTokenInfo(req);

            // const building = await BuildingService.getInstance().getBuildingById(building_id);
            // if (!building) return res.status(HTTP_CODES.NOT_FOUND).send(`No building found for ${building_id}`);

            if (tokenInfo.userInfo?.type != USER_TYPES.ADMIN) {
                const isAppProfile = tokenInfo.profile.appProfileBosConfigId ? true : false;
                const profileId = tokenInfo.profile.appProfileBosConfigId || tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId;
                const access = await canAccess(building_id, { method: req.method, route: (<any>req).endpoint }, profileId, isAppProfile)
                if (!access) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
            }

            apiData.url = building.info.apiUrl.get();
            next();

        } catch (error) {
            if (useV1) {
                const apiExc = new APIException(error.code || HTTP_CODES.UNAUTHORIZED, error.message);
                const err = Utils.getErrObj(apiExc, "");
                return res.status(err.code).send(err.msg);
            }
            return res.status(HTTP_CODES.UNAUTHORIZED).send(error.message);
        }

    }, proxy((req: express.Request) => apiData.url, proxyOptions(useV1)))


    buildingListMiddleware(app, useV1);
}


function buildingListMiddleware(app: express.Application, useV1: boolean = false) {
    if (useV1) {
        app.get("/v1/building_list", async (req: express.Request, res: express.Response) => {
            try {
                const tokenInfo = await checkAndGetTokenInfo(req);
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
                return res.status(HTTP_CODES.UNAUTHORIZED).send({
                    statusCode: HTTP_CODES.UNAUTHORIZED,
                    status: HTTP_CODES.UNAUTHORIZED,
                    code: HTTP_CODES.UNAUTHORIZED,
                    message: error.message
                });
            }
        })

        app.post("/v1/oauth/token", bodyParser.json(), bodyParser.urlencoded({extended: true}) ,async (req: express.Request, res: express.Response) => {
            // res.redirect(307, `${PAM_BASE_URI}/auth`)

            
            try {
                let credential = req.body;
                if (Object.keys(credential).length <= 0) credential = formatViaHeader(req);

                if(!credential || Object.keys(credential).length <= 0) throw {code : HTTP_CODES.BAD_REQUEST, message: "Bad request", description: "Bad request, please check your request"};
                

                const { code, data } = await AuthentificationService.getInstance().authenticate(credential);
                
                return res.status(code).send(formatResponse(data, credential));
            } catch (error) {
                res.status(error.code || HTTP_CODES.UNAUTHORIZED).send({
                    code: error.code || HTTP_CODES.UNAUTHORIZED,
                    message: error.code || "Invalid  client_id or client_secret",
                    description : error.description ||  "Invalid credential"
                })
            }
           

            // {
            //     "client": {
            //         "grants": [
            //         "authorization_code",
            //         "password",
            //         "refresh_token",
            //         "client_credentials"
            //         ],
            //         "_id": "6045f0456ca4c532c16eecc9",
            //         "name": "Mon Building",
            //         "scope": "read-write",
            //         "redirect_uri": "",
            //         "User": "5f7dbd62c2b33acaa6941a0b",
            //         "client_secret": "jsVsl4KLnzGYPcHWrSFo8TbmoL1ERs",
            //         "client_id": "tpqHG6ycrY",
            //         "created_at": "2021-03-08T09:37:09.072Z",
            //         "updated_at": "2021-03-08T09:37:09.072Z",
            //         "__v": 0
            //     },
            //     "user": "5f7dbd62c2b33acaa6941a0b",
            //     "access_token": "48ed6c62a3f0d060fbb36795d728653d7967c5b3",
            //     "accessToken": "48ed6c62a3f0d060fbb36795d728653d7967c5b3",
            //     "accessTokenExpiresAt": "2023-09-26T18:51:04.384Z",
            //     "scope": "read-write"
            // }
        })
    }
}


function formatResponse(data: any, credential: any) {
    return {
        client: {
            grants: ["authorization_code", "password", "refresh_token", "client_credentials"],
            _id: data.applicationId,
            name: data.name,
            scope: "read-write",
            redirect_uri: "",
            User: data.applicationId,
            client_secret: credential.client_secret,
            client_id: credential.client_id,
            created_at: new Date(data.createdToken * 1000).toISOString(),
            updated_at: new Date(data.createdToken * 1000).toISOString(),
            __v: 0
        },
        user:  data.applicationId,
        access_token: data.token,
        accessToken: data.token,
        accessTokenExpiresAt: new Date(data.expieredToken * 1000).toISOString(),
        scope: "read-write"
    }
}


function formatViaHeader(req: express.Request) {
    const auth = req.headers.authorization || "";
    const [,authCode] = auth.split(" ");
    if (!authCode) return;

    const [clientId, clientSecret] = atob(authCode)?.split(":");
    return { clientId, clientSecret };
}