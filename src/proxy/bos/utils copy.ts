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
import { HTTP_CODES } from "../../constant";
import { IApiRoute, IBosAuthRes, IProfileRes } from "../../interfaces";
import { AppProfileService, UserProfileService } from "../../services";
import { Utils } from "../../utils/pam_v1_utils/utils";
import { correspondanceObj } from "./correspondance";
import { APIException } from "../../utils/pam_v1_utils/api_exception";

const apiServerEndpoint = "/api/v1/";

export function tryToDownloadSvf(req: any): boolean {
	if (/\BIM\/file/.test(req.endpoint)) {
		req["endpoint"] = req.endpoint.replace("/api/v1", "");
		return true;
	}

	return false;
}

export async function getProfileBuildings(profileId: string, isApp: boolean) {
	const instance = isApp ? AppProfileService.getInstance() : UserProfileService.getInstance();
	const buildings = await instance.getAllAuthorizedBos(profileId);
	return buildings.map((el) => el.info.get());
}

export function formatUri(argUrl: string, uri: string): string {
	const base = argUrl.replace(new RegExp(`^${uri}*/`), (el) => "");
	let url = base.split("/").slice(1).join("/");
	let query = "";
	if (url.includes("?")) {
		query = url.slice(url.indexOf("?"));
		url = url.substring(0, url.indexOf("?"));
	}
	const correspondance = _getCorrespondance(url);
	return (/^api\/v1/.test(correspondance) ? "/" + correspondance : apiServerEndpoint + correspondance) + query;
}

export async function canAccess(buildingId: string, api: { method: string; route: string }, profileId: string, isAppProfile): Promise<boolean> {
	const buildingAccess = await profileHasAccessToBuilding(profileId, buildingId, isAppProfile);

	if (!buildingAccess) return false;
	if (!isAppProfile) return true;

	if (api.route.includes("?")) api.route = api.route.substring(0, api.route.indexOf("?"));

	const routeFound = _hasAccessToApiRoute(buildingAccess, api);
	if (!routeFound) return false;

	return true;
}

export const proxyOptions = (useV1: boolean): ProxyOptions => {
	return {
		memoizeHost: false,
		proxyReqPathResolver: (req: express.Request) => {
			return req["endpoint"];
		},
		limit: "500gb",
		userResDecorator: (proxyRes, proxyResData) => {
			return new Promise((resolve, reject) => {
				if (!useV1) return resolve(proxyResData);

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
					// resolve(proxyResData)
				}
			});
		},
	};
};

export async function profileHasAccessToBuilding(profileId: string, buildingId: string, isAppProfile: boolean) {
	const profile = isAppProfile ? await AppProfileService.getInstance().getAppProfile(profileId) : await UserProfileService.getInstance().getUserProfile(profileId);
	return _hasAccessToBuilding(profile, buildingId);
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

function _get_method(method: string, statusCode: number) {
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
