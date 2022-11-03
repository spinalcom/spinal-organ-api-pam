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

import {
    BUILDING_CONTEXT_NAME, BUILDING_CONTEXT_TYPE, BUILDING_TYPE, BUILDING_RELATION_NAME, PTR_LST_TYPE, APP_RELATION_NAME, BUILDING_API_GROUP_TYPE, API_RELATION_NAME
} from "../constant";
import { SpinalContext, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { IBuilding, IEditBuilding, ILocation, IBuildingCreation, IBuildingDetails } from "../interfaces";
import * as openGeocoder from "node-open-geocoder";
// const { config: { server_port } } = require("../../config");

import axios from "axios";
import { PortofolioService } from "./portofolio.service";
import { APIService, AppService, configServiceInstance } from ".";
import { AdminProfileService } from "./adminProfile.service";
// const axiosInstance = axios.create({ baseURL: `http://localhost:${process.env.SERVER_PORT}` });

// import * as NodeGeocoder from "node-geocoder";
const adminProfileInstance = AdminProfileService.getInstance();


export class BuildingService {
    private static instance: BuildingService;
    public context: SpinalContext;

    private constructor() { }

    public static getInstance(): BuildingService {
        if (!this.instance) this.instance = new BuildingService();

        return this.instance;
    }

    public async init(): Promise<SpinalContext> {
        this.context = await configServiceInstance.getContext(BUILDING_CONTEXT_NAME);
        if (!this.context) this.context = await configServiceInstance.addContext(BUILDING_CONTEXT_NAME, BUILDING_CONTEXT_TYPE);
        return this.context;
    }

    public async createBuilding(buildingInfo: IBuildingCreation): Promise<IBuildingDetails> {

        await this.setLocation(buildingInfo);
        buildingInfo.type = BUILDING_TYPE;
        const appIds = Object.assign([], buildingInfo.appIds);
        const apiIds = Object.assign([], buildingInfo.apiIds);

        delete buildingInfo.appIds;
        delete buildingInfo.apiIds;

        buildingInfo.apiUrl = buildingInfo.apiUrl.replace(/\/$/, el => "");

        const id = SpinalGraphService.createNode(buildingInfo, undefined);
        const detail = await this.getBuildingDetails(buildingInfo.apiUrl);

        const building = SpinalGraphService.getRealNode(id);

        building.info.add_attr({ detail });

        return Promise.all([this.addAppToBuilding(building, appIds || []), this.addApiToBuilding(building, apiIds || [])])
            .then(async ([apps, apis]) => {
                await this.context.addChildInContext(building, BUILDING_RELATION_NAME, PTR_LST_TYPE, this.context);

                return { node: building, apps, apis };
            })

    }

    public async getAllBuildings(): Promise<SpinalNode[]> {
        return this.context.getChildren([BUILDING_RELATION_NAME]);
    }

    public async getAllBuildingsApps(): Promise<{ node: SpinalNode, apps: SpinalNode[] }[]> {
        const buildings = await this.getAllBuildings();
        return buildings.reduce(async (prom, el) => {
            const liste = await prom;
            const apps = await this.getAppsFromBuilding(el);
            if (apps) {
                liste.push({
                    node: el,
                    apps
                })
            }
            return liste;
        }, Promise.resolve([]))
    }

    public async getBuildingById(id: string): Promise<SpinalNode> {
        const children = await this.context.getChildren([BUILDING_RELATION_NAME]);
        return children.find(el => el.getId().get() === id);
    }

    public async deleteBuilding(id: string): Promise<boolean> {
        const building = await this.getBuildingById(id);
        if (building) {
            await building.removeFromGraph();
            return true
        }

        return false;
    }

    public async addBuildingToPortofolio(portfolioId: string, building: IBuildingCreation): Promise<IBuildingDetails> {
        const data = await PortofolioService.getInstance().addBuildingToPortofolio(portfolioId, building);
        return data;
    }

    public async getBuildingFromPortofolio(portofolioId: string, buildingId: string): Promise<void | SpinalNode> {
        return PortofolioService.getInstance().getBuildingFromPortofolio(portofolioId, buildingId);
    }

    public async getAllBuildingsFromPortofolio(portfolioId: string): Promise<SpinalNode[]> {
        return PortofolioService.getInstance().getPortofolioBuildings(portfolioId);
        // const context = await this.getContext();
        // if (!context) throw new Error("Make sure you set a default digitalTwin");

        // return context.getChildrenInContext();
    }

    public async updateBuilding(buildingId: string, newData: IEditBuilding): Promise<IBuildingDetails> {
        const node = await this.getBuildingById(buildingId);
        if (!node) throw new Error(`no Building found for ${buildingId}`);

        const apps = newData.authorizeAppIds || [];
        const apis = newData.authorizeApiIds || [];
        const unauthorizeAppIds = newData.unauthorizeAppIds || [];
        const unauthorizeApiIds = newData.unauthorizeApiIds || [];

        await Promise.all([this.addAppToBuilding(node, apps), this.addApiToBuilding(node, apis)])

        return Promise.all([this.removeAppFromBuilding(node, unauthorizeAppIds), this.removeApisFromBuilding(node, unauthorizeApiIds)])
            .then((result) => {
                delete newData.appIds
                delete newData.apiIds
                delete newData.unauthorizeAppIds
                delete newData.unauthorizeApiIds

                for (const key in newData) {
                    if (Object.prototype.hasOwnProperty.call(newData, key) && node.info[key]) {
                        const element = newData[key];
                        node.info[key].set(element);
                    }
                }

                return this.getBuildingStructure(node);
            })
    }

    public async getBuildingStructure(building: string | SpinalNode): Promise<IBuildingDetails> {
        if (typeof building === "string") building = await this.getBuildingById(building);
        if (!(building instanceof SpinalNode)) return;

        return Promise.all([this.getAppsFromBuilding(building), this.getApisFromBuilding(building)]).then(([apps, apis]) => {
            return {
                node: <SpinalNode>building,
                apps,
                apis
            }
        })

    }

    public formatBuildingStructure(building: IBuildingDetails) {
        return {
            ...(building.node.info.get()),
            apps: building.apps.map(el => el.info.get()),
            apis: building.apis.map(el => el.info.get())
        }
    }

    // public async deleteBuildingFromPortofolio(portofolioId: string, buildingId: string | string[]): Promise<string> {
    // const node = await this.getBuildingFromPortofolio(portofolioId, buildingId);
    // if (!node) throw new Error(`no building found for ${buildingId}`);
    // await node.removeFromGraph();
    // return buildingId;
    // }

    public validateBuilding(buildingInfo: IBuilding): { isValid: boolean; message?: string } {
        if (!buildingInfo.name) return { isValid: false, message: "The name is required" };
        if (!buildingInfo.address) return { isValid: false, message: "The address is required" };

        return { isValid: true }
    }

    public async setLocation(buildingInfo: IBuildingCreation): Promise<IBuildingCreation> {
        if (!buildingInfo.address) return;

        if (!buildingInfo.location || !buildingInfo.location.latlng) {
            const { lat, lng } = await this.getLatLngViaAddress(buildingInfo.address);
            if (!buildingInfo.location) buildingInfo.location = { lat, lng };
            else {
                buildingInfo.location.lat = lat;
                buildingInfo.location.lng = lng;
            }
        }

        return buildingInfo;
    }

    public getLatLngViaAddress(address: string): Promise<ILocation> {
        return new Promise((resolve, reject) => {
            openGeocoder().geocode(address).end((err: any, res: any) => {
                if (err) return reject(err);
                if (res.length === 0) return reject(new Error("Address not found"))

                resolve({
                    lat: res[0].lat,
                    lng: res[0].lon
                })
            })
        });
    }


    public async getBuildingDetails(batimentUrl: string): Promise<{ [key: string]: number }> {
        const detail: any = await this._getBuildingTypeCount(batimentUrl);
        detail.area = await this._getBuildingArea(batimentUrl);

        return detail;
    }


    public async formatBuilding(data: IBuilding): Promise<IBuilding> {
        data.details = await this.getBuildingDetails(data.id);
        return data;
    }


    //////////////////////////////////////////////////////
    //                      APPS                        //
    //////////////////////////////////////////////////////

    public async addAppToBuilding(building: string | SpinalNode, applicationId: string | string[]): Promise<SpinalNode[]> {
        if (typeof building === "string") building = await this.getBuildingById(building);
        if (!(building instanceof SpinalNode)) throw new Error(`No building found for ${building}`);

        if (!Array.isArray(applicationId)) applicationId = [applicationId];

        const data = await applicationId.reduce(async (prom, appId: string) => {
            const liste = await prom;
            const appNode = await AppService.getInstance().getBuildingApp(appId);
            if (!(appNode instanceof SpinalNode)) return liste;

            const childrenIds = (<SpinalNode>building).getChildrenIds();
            const isChild = childrenIds.find(el => el === appId);

            if (!isChild) await (<SpinalNode>building).addChildInContext(appNode, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
            liste.push(appNode);
            return liste;
        }, Promise.resolve([]));

        adminProfileInstance.syncAdminProfile();
        return data;
    }

    public async getAppsFromBuilding(building: string | SpinalNode): Promise<SpinalNode[]> {
        if (typeof building === "string") building = await this.getBuildingById(building);
        if (!(building instanceof SpinalNode)) return [];

        return building.getChildren([APP_RELATION_NAME]);
    }

    public async getAppFromBuilding(building: string | SpinalNode, appId: string): Promise<SpinalNode> {
        const children = await this.getAppsFromBuilding(building);
        return children.find(el => el.getId().get() === appId);
    }

    public async removeAppFromBuilding(building: string | SpinalNode, applicationId: string | string[]): Promise<string[]> {
        if (typeof building === "string") building = await this.getBuildingById(building);
        if (!(building instanceof SpinalNode)) return [];
        if (!Array.isArray(applicationId)) applicationId = [applicationId];

        return applicationId.reduce(async (prom, appId: string) => {

            const liste = await prom;
            const appNode = await this.getAppFromBuilding(building, appId);
            if (!(appNode instanceof SpinalNode)) return liste;

            try {
                await (<SpinalNode>building).removeChild(appNode, APP_RELATION_NAME, PTR_LST_TYPE);
                liste.push(appId);
            } catch (error) { }

            return liste;


        }, Promise.resolve([]))

    }

    public async buildingHasApp(building: string | SpinalNode, appId: string): Promise<boolean> {
        const app = await this.getAppFromBuilding(building, appId);
        return app ? true : false;
    }

    //////////////////////////////////////////////////////
    //                      APIS                        //
    //////////////////////////////////////////////////////

    public async addApiToBuilding(building: string | SpinalNode, apisIds: string | string[]): Promise<SpinalNode[]> {
        if (typeof building === "string") building = await this.getBuildingById(building);
        if (!(building instanceof SpinalNode)) throw new Error(`No building found for ${building}`);

        if (!Array.isArray(apisIds)) apisIds = [apisIds];

        const data = await apisIds.reduce(async (prom, appId: string) => {
            const liste = await prom;
            const apiNode = await APIService.getInstance().getApiRouteById(appId, BUILDING_API_GROUP_TYPE);
            if (!(apiNode instanceof SpinalNode)) return liste;

            const childrenIds = (<SpinalNode>building).getChildrenIds();
            const isChild = childrenIds.find(el => el === appId);

            if (!isChild) await (<SpinalNode>building).addChildInContext(apiNode, API_RELATION_NAME, PTR_LST_TYPE, this.context);
            liste.push(apiNode);
            return liste;
        }, Promise.resolve([]));

        adminProfileInstance.syncAdminProfile();
        return data;

    }

    public async getApisFromBuilding(building: string | SpinalNode): Promise<SpinalNode[]> {
        if (typeof building === "string") building = await this.getBuildingById(building);
        if (!(building instanceof SpinalNode)) return [];

        return building.getChildren([API_RELATION_NAME]);
    }

    public async getApiFromBuilding(building: string | SpinalNode, apiId: string): Promise<SpinalNode> {
        const children = await this.getApisFromBuilding(building);
        return children.find(el => el.getId().get() === apiId);
    }

    public async removeApisFromBuilding(building: string | SpinalNode, apisIds: string | string[]): Promise<string[]> {
        if (typeof building === "string") building = await this.getBuildingById(building);
        if (!(building instanceof SpinalNode)) return [];
        if (!Array.isArray(apisIds)) apisIds = [apisIds];

        return apisIds.reduce(async (prom, apiId: string) => {

            const liste = await prom;
            const apiNode = await this.getApiFromBuilding(building, apiId);
            if (!(apiNode instanceof SpinalNode)) return liste;

            try {
                await (<SpinalNode>building).removeChild(apiNode, API_RELATION_NAME, PTR_LST_TYPE);
                liste.push(apiId);
            } catch (error) { }

            return liste;


        }, Promise.resolve([]))

    }

    public async buildingHasApi(building: string | SpinalNode, apiId: string): Promise<boolean> {
        const app = await this.getApiFromBuilding(building, apiId);
        return app ? true : false;
    }

    public async uploadSwaggerFile(buffer: Buffer): Promise<any[]> {
        return APIService.getInstance().uploadSwaggerFile(buffer, BUILDING_API_GROUP_TYPE);
    }

    /////////////////////////////////////////////////////
    //                  PRIVATES                       //
    /////////////////////////////////////////////////////

    private async _findChildInContext(startNode: SpinalNode, nodeIdOrName: string, context: SpinalContext): Promise<SpinalNode> {
        const children = await startNode.getChildrenInContext(context);
        return children.find(el => {
            if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
                //@ts-ignore
                SpinalGraphService._addNode(el);
                return true;
            }
            return false;
        })
    }

    private _getBuildingTypeCount(batimentUrl: string): Promise<{ [key: string]: number }> {
        return axios
            .get(`${batimentUrl}/api/v1/geographicContext/tree`)
            .then(res => {
                return this._countTypeHelper(res.data);
            })
            .catch(error => {
                // console.error("try to get Building details, but got", error.message);
                return {}
            });
    }

    private _getBuildingArea(batimentUrl: string): Promise<number> {
        return axios
            .get(`${batimentUrl}/api/v1/building/read`)
            .then((response) => {
                return response.data.area;
            })
            .catch((err) => {
                return 0
            });
    }


    private _countTypeHelper(building: { [key: string]: any }): { [key: string]: number } {
        const obj: { [key: string]: number } = {};

        const countType = (item: any) => {
            if (!item) return;
            if (!obj[item.type]) obj[item.type] = 1;
            else obj[item.type] = obj[item.type] + 1;
            (item.children || []).forEach((element: any) => {
                countType(element);
            });
        }

        countType(building);
        return obj;
    }

    // private _getDigitalTwinGraph(): Promise<SpinalGraph | void> {
    //     return DigitalTwinService.getInstance().getActualDigitalTwinGraph();
    // }
}