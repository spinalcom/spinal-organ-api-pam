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

import * as express from "express";
import { ProxyOptions } from "express-http-proxy";
import { SpinalNode } from "spinal-env-viewer-graph-service";
import { BUILDING_API_GROUP_NAME, HTTP_CODES } from "../../constant";
import { IBosAuthRes, IBuilding, IProfileRes } from "../../interfaces";
import { APIService, AppProfileService, BuildingService, TokenService, UserProfileService } from "../../services";
import { Utils } from "../../utils/pam_v1_utils/utils";
import { correspondanceObj } from "./correspondance";
import { APIException } from "../../utils/pam_v1_utils/api_exception";
import { getProfileId } from "../../security/authentication";
import AuthorizationService from "../../services/authorization.service";

const apiServerEndpoint = "/api/v1/";



export function isTryingToDownloadSvf(req: any): boolean {
	if (/\BIM\/file/.test(req.endpoint)) {
		req["endpoint"] = req.endpoint.replace("/api/v1", "");
		return true;
	}

	return false;
}

export function _formatBuildingResponse(building: IBuilding) {
	return {
		name: building.name,
		_id: building.id,
		id: building.id,
		address: building.address,
		description: building.description,
		urlBos: building.bosUrl,
		type: building.type,
		localisation: building.location,
	};
}

export async function getBuildingsAuthorizedToProfile(tokenInfo: any) {
	if (TokenService.getInstance().isAppToken(tokenInfo)) return getAppProfileBuildings(tokenInfo);

	return getUserProfileBuildings(tokenInfo);
}

export async function getAppProfileBuildings(tokenInfo) {
	const instance = AppProfileService.getInstance();
	const profileId = tokenInfo.profile.appProfileBosConfigId;
	const buildings = await instance.getAllAuthorizedBos(profileId);
	return buildings.map((el) => el.info.get());
}

export async function getUserProfileBuildings(tokenInfo) {
	const instance = UserProfileService.getInstance();
	const profileId = tokenInfo.profile.userProfileBosConfigId || tokenInfo.profile.profileId;

	const buildings = await instance.getAllAuthorizedBos(profileId);
	return buildings.map((el) => el.info.get());
}

export function formatUri(argUrl: string, uri: string): string {
	const base = argUrl.replace(new RegExp(`^${uri}*/`), (el) => ""); // Remove the base URI from the start of the URL

	let url = base.split("/").slice(1).join("/"); // Remove the first segment of the URL, which is the building ID
	let query = "";
	// If the URL contains a query string, separate it from the path
	if (url.includes("?")) {
		query = url.slice(url.indexOf("?"));
		url = url.substring(0, url.indexOf("?"));
	}
	const correspondance = _getCorrespondance(url); // Get the corresponding path from the correspondance object
	// Reconstruct the URL with the base path and query string if it exists
	return (/^api\/v1/.test(correspondance) ? "/" + correspondance : apiServerEndpoint + correspondance) + query;
}

export async function canAccess(buildingId: string, api: { method: string; route: string }, profileId: string, isAppProfile: boolean): Promise<boolean> {

	const buildingAccess = await profileHasAccessToBuilding(profileId, buildingId, isAppProfile);
	if (!buildingAccess) return false;
	if (!isAppProfile || tryToAccessBuildingInfo(api)) return true;

	const apiNode = await APIService.getInstance().getApiRouteByRoute(api, BUILDING_API_GROUP_NAME);
	if (!apiNode) return false;
	const buildingHasApi = await BuildingService.getInstance().buildingHasApi(buildingId, apiNode.getId().get());
	if (!buildingHasApi) return false;

	const access = await profileHasAccessToApi(profileId, apiNode.getId().get(), isAppProfile);
	return Boolean(access)

	// const buildingAccess = await profileHasAccessToBuilding(profileId, buildingId, isAppProfile);

	// if (!buildingAccess) return false;
	// if (!isAppProfile || tryToAccessBuildingInfo(api)) return true;

	// if (!apiNode) return false;

	// const hasApi = await BuildingService.getInstance().buildingHasApi(buildingId, apiNode.getId().get());
	// if (!hasApi) return false;


	// const apiAccess = profileHasAccessToApi(profileId, apiNode.getId().get(), isAppProfile);

	// const routeFound = _hasAccessToApiRoute(buildingAccess, api);
	// if (!routeFound) return false;

	// return true;
}

export function tryToAccessBuildingInfo(api: { method: string; route: string }) {
	if (api.method.toUpperCase() !== "GET") return false;

	const reqWithOutApi = api.route.replace("/api/v1", "");
	return reqWithOutApi === "/" || reqWithOutApi.length == 0;
}

export const proxyOptions = (useV1: boolean): ProxyOptions => {
	return {
		memoizeHost: false,
		proxyReqPathResolver: (req: express.Request) => {
			return req["endpoint"];
		},
		proxyReqOptDecorator: (proxyReqOpts, srcReq) => {

			// Add authorization header to autenticate inside BOS_Config
			if ((srcReq as any)._tokenToUse) {
				proxyReqOpts.headers["authorization"] = (srcReq as any)._tokenToUse;
			}
			return proxyReqOpts;
		},
		limit: "500gb",
		// This decorates the response sent to the user (it's used to match PAM V1 response format)
		userResDecorator: (proxyRes, proxyResData) => {
			return new Promise((resolve, reject) => {
				if (!useV1) return resolve(proxyResData); // If not using V1, return the data as is

				// If using V1, format the response
				try {
					if (proxyRes.statusCode >= 400 && proxyRes.statusCode <= 599) {
						throw new APIException(proxyRes.statusCode as any, proxyResData.toString());
					}

					const response = JSON.parse(proxyResData.toString());
					const data = Utils.getReturnObj(null, response, _get_method((<any>proxyRes).req.method, proxyRes.statusCode));
					resolve(data);
				} catch (error) {
					const oErr = Utils.getErrObj(error, "");
					oErr.msg.datas = { ko: {} };
					resolve(oErr.msg);
				}
			});
		},
	};
};

export async function profileHasAccessToBuilding(profileId: string, buildingId: string, isAppProfile: boolean) {
	const instance = isAppProfile ? AppProfileService.getInstance() : UserProfileService.getInstance();
	const profile = await instance.getProfileNode(profileId);
	// return _hasAccessToBuilding(profile, buildingId);
	return AuthorizationService.getInstance().profileHasAccessToNode(profile, buildingId);

}

export async function profileHasAccessToApi(profileId: string, buildingId: string, isAppProfile: boolean) {
	const instance = isAppProfile ? AppProfileService.getInstance() : UserProfileService.getInstance();
	const profile = await instance.getProfileNode(profileId);
	// return _hasAccessToBuilding(profile, buildingId);
	return AuthorizationService.getInstance().profileHasAccessToNode(profile, buildingId);
}

///////////////////////////////////
//            PRIVATES           //
///////////////////////////////////

function _getCorrespondance(url: string) {
	const found = Object.keys(correspondanceObj).find((el) => {
		const t = el.replace(/\{(.*?)\}/g, (el) => "(.*?)");
		const regex = new RegExp(`^${t}$`);
		return url.match(regex);
	});

	if (found) {
		const urls = url.split("/");
		const list = correspondanceObj[found].split("/");
		let final = "";

		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			let item = "";
			if (element.includes("{") && element.includes("}")) item = urls[index];
			else item = list[index];

			final += index === 0 ? item : "/" + item;
		}
		return final;
	}

	return url;
}

function _hasAccessToBuilding(profile: IProfileRes, buildingId: string): IBosAuthRes {
	for (const { buildings } of profile.authorized) {
		const found = buildings.find(({ building }) => building.getId().get() === buildingId);
		if (found) return found;
	}

	return;
}

function _hasAccessToApiRoute(building: IBosAuthRes, apiRoute: { method: string; route: string }): SpinalNode {
	return building.apis.find((node) => {
		const route = node.info.get();
		if (apiRoute.method.toUpperCase() !== route.method.toUpperCase()) return false;

		const routeFormatted = route.name.replace(/\{(.*?)\}/g, (el) => "(.*?)");
		const regex = new RegExp(`^${routeFormatted}$`);
		return apiRoute.route.match(regex);
	});
}

export function _get_method(method: string, statusCode: number) {
	switch (method) {
		case "POST":
			if (statusCode === HTTP_CODES.CREATED) return "ADD";
			return "READ";
		case "DELETE":
			return "DEL";
		default:
			if (statusCode >= 400 && statusCode <= 599) return "ERROR";
			return "READ";
	}
}



export function getProfileIdInTokenInfo(tokenInfo: any): string {
	if (TokenService.getInstance().isAppToken(tokenInfo))
		return tokenInfo.profile.appProfileBosConfigId;


	if (TokenService.getInstance().isUserToken(tokenInfo))
		return tokenInfo.profile.userProfileBosConfigId;

	return tokenInfo.profile.profileId;
}