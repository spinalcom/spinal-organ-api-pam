"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingService = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const configFile_service_1 = require("./configFile.service");
const openGeocoder = require("node-open-geocoder");
const { config: { server_port } } = require("../../config");
const axios_1 = require("axios");
const axiosInstance = axios_1.default.create({ baseURL: `http://localhost:${server_port}` });
// import * as NodeGeocoder from "node-geocoder";
class BuildingService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new BuildingService();
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.BUILDING_CONTEXT_NAME);
            if (!this.context)
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.BUILDING_CONTEXT_NAME, constant_1.BUILDING_CONTEXT_TYPE);
            return this.context;
        });
    }
    addBuilding(buildingInfo) {
        buildingInfo.type = constant_1.BUILDING_TYPE;
        const buildingId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(buildingInfo, undefined);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(buildingId);
        return this.context.addChildInContext(node, constant_1.CONTEXT_TO_BUILDING_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
    }
    getBuilding(buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(buildingId);
            if (node)
                return node;
            return this._findChildInContext(this.context, buildingId);
        });
    }
    getAllBuilding() {
        return this.context.getChildrenInContext();
    }
    updateBuilding(buildingId, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this.getBuilding(buildingId);
            if (!node)
                throw new Error(`no Building found for ${buildingId}`);
            for (const key in newData) {
                if (Object.prototype.hasOwnProperty.call(newData, key) && node.info[key]) {
                    const element = newData[key];
                    node.info[key].set(element);
                }
            }
            return node;
        });
    }
    deleteBuilding(buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this.getBuilding(buildingId);
            if (!node)
                throw new Error(`no building found for ${buildingId}`);
            yield node.removeFromGraph();
            return buildingId;
        });
    }
    validateBuilding(buildingInfo) {
        if (!buildingInfo.name)
            return { isValid: false, message: "The name is required" };
        if (!buildingInfo.address)
            return { isValid: false, message: "The address is required" };
        return { isValid: true };
    }
    setLocation(buildingInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!buildingInfo.address)
                return;
            if (!buildingInfo.location || !buildingInfo.location.latlng) {
                const { lat, lng } = yield this.getLatLngViaAddress(buildingInfo.address);
                if (!buildingInfo.location)
                    buildingInfo.location = { lat, lng };
                else {
                    buildingInfo.location.lat = lat;
                    buildingInfo.location.lng = lng;
                }
            }
            return buildingInfo;
        });
    }
    getLatLngViaAddress(address) {
        return new Promise((resolve, reject) => {
            openGeocoder().geocode(address).end((err, res) => {
                if (err)
                    return reject(err);
                if (res.length === 0)
                    return reject(new Error("Address not found"));
                resolve({
                    lat: res[0].lat,
                    lng: res[0].lon
                });
            });
        });
    }
    getBuildingDetails(buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const detail = yield this._getBuildingTypeCount(buildingId);
            detail.area = yield this._getBuildingArea(buildingId);
            return detail;
        });
    }
    formatBuilding(data) {
        return __awaiter(this, void 0, void 0, function* () {
            data.details = yield this.getBuildingDetails(data.id);
            return data;
        });
    }
    /////////////////////////////////////////////////////
    //                  PRIVATES                       //
    /////////////////////////////////////////////////////
    _findChildInContext(startNode, nodeIdOrName) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield startNode.getChildrenInContext(this.context);
            return children.find(el => {
                if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
                    //@ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(el);
                    return true;
                }
                return false;
            });
        });
    }
    _getBuildingTypeCount(buildingId) {
        return axiosInstance.get(`${constant_1.BOS_BASE_URI}/${buildingId}/api/v1/geographicContext/tree`)
            .then(res => {
            return this._countTypeHelper(res.data);
        })
            .catch(error => {
            console.error(error);
            return {};
        });
    }
    _getBuildingArea(buildingId) {
        return axiosInstance
            .get(`${constant_1.BOS_BASE_URI}/${buildingId}/api/v1/building/read`)
            .then((response) => {
            return response.data.area;
        })
            .catch((err) => {
            return 0;
        });
    }
    _countTypeHelper(building) {
        const obj = {};
        const countType = (item) => {
            if (!item)
                return;
            if (!obj[item.type])
                obj[item.type] = 1;
            else
                obj[item.type] = obj[item.type] + 1;
            (item.children || []).forEach((element) => {
                countType(element);
            });
        };
        countType(building);
        return obj;
    }
}
exports.BuildingService = BuildingService;
//# sourceMappingURL=building.service.js.map