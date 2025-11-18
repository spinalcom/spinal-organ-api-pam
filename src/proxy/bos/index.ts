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
import { AuthentificationService, BuildingService, TokenService } from "../../services";
import * as proxy from "express-http-proxy";
import { checkAndGetTokenInfo } from "../../security/authentication";
import { _formatBuildingResponse, canAccess, formatUri, getBuildingsAuthorizedToProfile, proxyOptions, isTryingToDownloadSvf } from "./utils";
import { Utils } from "../../utils/pam_v1_utils/utils";
import axios from "axios";
import { AuthError } from "../../security/AuthError";
import { APIException } from "../../utils/pam_v1_utils/api_exception";
import * as bodyParser from "body-parser";
import * as atob from "atob";

interface IApiData {
	url: string;
	clientId: string;
	secretId: string;
	token?: string;
}

export default function configureProxy(app: express.Express, useV1: boolean = false) {

	if (useV1) _useV1Routes(app);


	let apiData: IApiData = { url: "", clientId: "", secretId: "", token: "" };

	const uri = !useV1 ? BOS_BASE_URI_V2 : `(${BOS_BASE_URI_V1}|${BOS_BASE_URI_V1_2})`;

	app.all(`(${uri}/:building_id/*|${uri}/:building_id)`, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			const { building_id } = req.params;
			req["endpoint"] = formatUri(req.url, uri);

			//////////////////////////////////////////////
			//   Check if user has access to building
			//////////////////////////////////////////////

			const building = await BuildingService.getInstance().getBuildingById(building_id);
			if (!building) return new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

			// apiData.token = building.info.tokenToUse?.get() || "";
			const url = building.info.apiUrl.get();
			const token = building.info.tokenToUse?.get() || "";

			apiData.url = url;

			(req as any)._bosTargetUrl = url;

			if (token && token.trim().length > 0) (req as any)._tokenToUse = `Bearer ${token}`;

			//////////////////////////////////////////////
			//   Condition to skip .svf file downloading
			//////////////////////////////////////////////
			if (isTryingToDownloadSvf(req)) return next();

			const tokenInfo = await checkAndGetTokenInfo(req);

			const isAppProfile = TokenService.getInstance().isAppToken(tokenInfo);
			const profileId = tokenInfo.profile.appProfileBosConfigId || tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId;
			// if (tokenInfo.userInfo?.type != USER_TYPES.ADMIN) {
			const access = await canAccess(building_id, { method: req.method, route: (<any>req).endpoint }, profileId, isAppProfile);
			if (!access) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);
			// }

			//////////////////////////////////////////////
			//   Condition to check
			//////////////////////////////////////////////
			const reqWithOutApi = (<any>req).endpoint.replace("/api/v1", "");
			if (reqWithOutApi === "/" || reqWithOutApi.length == 0) {
				let data = building.info.get();
				if (useV1) data = Utils.getReturnObj(null, _formatBuildingResponse(data), req.method, "READ");

				return res.status(HTTP_CODES.OK).send(data);
			}

			// apiData.url = building.info.apiUrl.get();
			next();
		} catch (error) {
			if (useV1) {
				const apiExc = new APIException(error.code || HTTP_CODES.UNAUTHORIZED, error.message);
				const err = Utils.getErrObj(apiExc, "");
				return res.status(err.code).send(err.msg);
			}
			return res.status(HTTP_CODES.UNAUTHORIZED).send(error.message);
		}
	}, proxy((req: any) => apiData.url, proxyOptions(useV1)));

}

function _useV1Routes(app: express.Application) {
	app.get("/v1/building_list", async (req: express.Request, res: express.Response) => {
		try {
			const tokenInfo = await checkAndGetTokenInfo(req);
			// let isApp;
			// let profileId;
			// if (tokenInfo.profile.appProfileBosConfigId) {
			// 	isApp = true;
			// 	profileId = tokenInfo.profile.appProfileBosConfigId;
			// } else if (tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId) {
			// 	isApp = false;
			// 	profileId = tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId;
			// }

			const buildings = await getBuildingsAuthorizedToProfile(tokenInfo);

			const data = Utils.getReturnObj(null, buildings, "READ");
			return res.send(data);
		} catch (error) {
			return res.status(HTTP_CODES.UNAUTHORIZED).send({
				statusCode: HTTP_CODES.UNAUTHORIZED,
				status: HTTP_CODES.UNAUTHORIZED,
				code: HTTP_CODES.UNAUTHORIZED,
				message: error.message,
			});
		}
	});

	app.get("/v1/building/:building_id", (req: express.Request, res: express.Response) => {
		const { building_id } = req.params;
	});

	app.post("/v1/oauth/token", bodyParser.json(), bodyParser.urlencoded({ extended: true }), async (req: express.Request, res: express.Response) => {
		// res.redirect(307, `${PAM_BASE_URI}/auth`)

		try {
			let credential = req.body;
			if (Object.keys(credential).length <= 0) credential = formatViaHeader(req);

			if (!credential || Object.keys(credential).length <= 0) throw { code: HTTP_CODES.BAD_REQUEST, message: "Bad request", description: "Bad request, please check your request" };

			const { code, data } = await AuthentificationService.getInstance().authenticate(credential);

			return res.status(code).send(formatResponse(data, credential));
		} catch (error) {
			res.status(error.code || HTTP_CODES.UNAUTHORIZED).send({
				code: error.code || HTTP_CODES.UNAUTHORIZED,
				message: error.code || "Invalid  client_id or client_secret",
				description: error.description || "Invalid credential",
			});
		}

	});

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
			__v: 0,
		},
		user: data.applicationId,
		access_token: data.token,
		accessToken: data.token,
		accessTokenExpiresAt: new Date(data.expieredToken * 1000).toISOString(),
		scope: "read-write",
	};
}

function formatViaHeader(req: express.Request) {
	const auth = req.headers.authorization || "";
	const [, authCode] = auth.split(" ");
	if (!authCode) return;

	const [clientId, clientSecret] = atob(authCode)?.split(":");
	return { clientId, clientSecret };
}
