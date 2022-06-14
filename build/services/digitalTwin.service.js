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
exports.DigitalTwinService = void 0;
const constant_1 = require("../constant");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const configFile_service_1 = require("./configFile.service");
const openGeocoder = require("node-open-geocoder");
const { config: { server_port } } = require("../../config");
const axios_1 = require("axios");
const axiosInstance = axios_1.default.create({ baseURL: `http://localhost:${server_port}` });
// import * as NodeGeocoder from "node-geocoder";
class DigitalTwinService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new DigitalTwinService();
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.DIGITAL_TWIN_CONTEXT_NAME);
            if (!this.context)
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.DIGITAL_TWIN_CONTEXT_NAME, constant_1.DIGITAL_TWIN_CONTEXT_TYPE);
            return this.context;
        });
    }
    addDigitalTwin(digitalTwinInfo) {
        digitalTwinInfo.type = constant_1.DIGITAL_TWIN_TYPE;
        const digitalTwinId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(digitalTwinInfo, undefined);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(digitalTwinId);
        return this.context.addChildInContext(node, constant_1.CONTEXT_TO_DIGITAL_TWIN_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
    }
    getDigitalTwin(digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(digitalTwinId);
            if (node)
                return node;
            return this._findChildInContext(this.context, digitalTwinId);
        });
    }
    getAllDigitalTwin() {
        return this.context.getChildrenInContext();
    }
    updateDigitalTwin(digitalTwinId, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this.getDigitalTwin(digitalTwinId);
            if (!node)
                throw new Error(`no digitalTwin found for ${digitalTwinId}`);
            for (const key in newData) {
                if (Object.prototype.hasOwnProperty.call(newData, key) && node.info[key]) {
                    const element = newData[key];
                    node.info[key].set(element);
                }
            }
            return node;
        });
    }
    deleteDigitalTwin(digitalTwinId) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this.getDigitalTwin(digitalTwinId);
            if (!node)
                throw new Error(`no digitalTwin found for ${digitalTwinId}`);
            yield node.removeFromGraph();
            return digitalTwinId;
        });
    }
    validateDigitalTwin(digitalTwinInfo) {
        if (!digitalTwinInfo.name)
            return { isValid: false, message: "The name is required" };
        if (!digitalTwinInfo.address)
            return { isValid: false, message: "The address is required" };
        return { isValid: true };
    }
    setLocation(digitalTwinInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!digitalTwinInfo.address)
                return;
            if (!digitalTwinInfo.location || !digitalTwinInfo.location.latlng) {
                const { lat, lng } = yield this.getLatLngViaAddress(digitalTwinInfo.address);
                if (!digitalTwinInfo.location)
                    digitalTwinInfo.location = { lat, lng };
                else {
                    digitalTwinInfo.location.lat = lat;
                    digitalTwinInfo.location.lng = lng;
                }
            }
            return digitalTwinInfo;
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
    getDigitalTwinBuildingDetails(buildingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const detail = yield this._getBuildingTypeCount(buildingId);
            detail.area = yield this._getDigitalTwinArea(buildingId);
            return detail;
        });
    }
    formatDigitalTwin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            data.details = yield this.getDigitalTwinBuildingDetails(data.id);
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
    _getDigitalTwinArea(buildingId) {
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
exports.DigitalTwinService = DigitalTwinService;
//# sourceMappingURL=digitalTwin.service.js.map