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

import { BOS_BASE_URI, CONTEXT_TO_BUILDING_RELATION_NAME, BUILDING_CONTEXT_NAME, BUILDING_CONTEXT_TYPE, BUILDING_TYPE, PTR_LST_TYPE } from "../constant";
import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { DigitalTwinService } from "./digitalTwin.service";
import { IBuilding, ILocation } from "interfaces";
import * as openGeocoder from "node-open-geocoder";
// const { config: { server_port } } = require("../../config");

import axios from "axios";
const axiosInstance = axios.create({ baseURL: `http://localhost:${process.env.HUB_PORT}` });
// import * as NodeGeocoder from "node-geocoder";


export class BuildingService {
    private static instance: BuildingService;

    private constructor() { }

    public static getInstance(): BuildingService {
        if (!this.instance) this.instance = new BuildingService();

        return this.instance;
    }

    public async getContext(): Promise<SpinalContext> {
        const digitalTwinGraph = await this._getDigitalTwinGraph();
        if (digitalTwinGraph) {
            var context = await digitalTwinGraph.getContext(BUILDING_CONTEXT_NAME);
            if (!context) {
                context = new SpinalContext(BUILDING_CONTEXT_NAME, BUILDING_CONTEXT_TYPE)
                return digitalTwinGraph.addContext(context);
            }
            return context;
        }
    }

    public async addBuilding(buildingInfo: IBuilding): Promise<SpinalNode> {
        const context = await this.getContext();
        if (!context) throw new Error("Make sure you set a default digitalTwin");

        buildingInfo.type = BUILDING_TYPE;

        const buildingId = SpinalGraphService.createNode(buildingInfo, undefined);
        const node = SpinalGraphService.getRealNode(buildingId);

        return context.addChildInContext(node, CONTEXT_TO_BUILDING_RELATION_NAME, PTR_LST_TYPE, context);
    }

    public async getBuilding(buildingId: string): Promise<void | SpinalNode> {
        const context = await this.getContext();
        if (!context) throw new Error("Make sure you set a default digitalTwin");

        const node = SpinalGraphService.getRealNode(buildingId);
        if (node) return node;

        return this._findChildInContext(context, buildingId, context);
    }

    public async getAllBuilding(): Promise<SpinalNode[]> {
        const context = await this.getContext();
        if (!context) throw new Error("Make sure you set a default digitalTwin");

        return context.getChildrenInContext();
    }

    public async updateBuilding(buildingId: string, newData: IBuilding): Promise<SpinalNode> {
        const node = await this.getBuilding(buildingId);
        if (!node) throw new Error(`no Building found for ${buildingId}`);

        for (const key in newData) {
            if (Object.prototype.hasOwnProperty.call(newData, key) && node.info[key]) {
                const element = newData[key];
                node.info[key].set(element);
            }
        }

        return node;
    }

    public async deleteBuilding(buildingId: string): Promise<string> {
        const node = await this.getBuilding(buildingId);
        if (!node) throw new Error(`no building found for ${buildingId}`);
        await node.removeFromGraph();
        return buildingId;
    }

    public validateBuilding(buildingInfo: IBuilding): { isValid: boolean; message?: string } {
        if (!buildingInfo.name) return { isValid: false, message: "The name is required" };
        if (!buildingInfo.address) return { isValid: false, message: "The address is required" };

        return { isValid: true }
    }

    public async setLocation(buildingInfo: IBuilding): Promise<IBuilding> {
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


    public async getBuildingDetails(buildingId: string): Promise<{ [key: string]: number }> {
        const detail: any = await this._getBuildingTypeCount(buildingId);
        detail.area = await this._getBuildingArea(buildingId)

        return detail;
    }


    public async formatBuilding(data: IBuilding): Promise<IBuilding> {
        data.details = await this.getBuildingDetails(data.id);
        return data;
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

    private _getBuildingTypeCount(buildingId: string): Promise<{ [key: string]: number }> {
        return axiosInstance.get(`${BOS_BASE_URI}/${buildingId}/api/v1/geographicContext/tree`)
            .then(res => {
                return this._countTypeHelper(res.data);
            })
            .catch(error => {
                // console.error("try to get Building details, but got", error.message);
                return {}
            });
    }

    private _getBuildingArea(buildingId: string): Promise<number> {
        return axiosInstance
            .get(`${BOS_BASE_URI}/${buildingId}/api/v1/building/read`)
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

    private _getDigitalTwinGraph(): Promise<SpinalGraph | void> {
        return DigitalTwinService.getInstance().getActualDigitalTwinGraph();
    }
}