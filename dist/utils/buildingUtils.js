"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuildingGeoPosition = getBuildingGeoPosition;
exports.createBuildingNode = createBuildingNode;
exports.formatBuildingNode = formatBuildingNode;
exports.getBuildingDetail = getBuildingDetail;
exports.formatBuildingStructure = formatBuildingStructure;
exports.validateBuildingInfo = validateBuildingInfo;
const axios_1 = require("axios");
const constant_1 = require("../constant");
const openGeocoder = require("node-open-geocoder");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
async function getBuildingGeoPosition(buildingAddress) {
    if (!buildingAddress)
        return;
    return getLatLngViaAddress(buildingAddress);
}
async function createBuildingNode(buildingInfo) {
    const { appIds, apiIds, ...buildingNodeInfo } = buildingInfo; // Exclude appIds and apiIds from the node creation info
    buildingNodeInfo.apiUrl = buildingNodeInfo.apiUrl.replace(/\/$/, el => ""); // Remove trailing slash from apiUrl
    buildingNodeInfo.type = constant_1.BUILDING_TYPE;
    buildingNodeInfo.detail = await getBuildingDetailsByAPI(buildingNodeInfo.apiUrl, buildingInfo.tokenToUse);
    const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(buildingNodeInfo, undefined);
    return spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
}
function getLatLngViaAddress(address) {
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
async function formatBuildingNode(buildingNode) {
    const buildingInfo = buildingNode.info.get();
    const buildingDetail = await getBuildingDetail(buildingInfo);
    return Object.assign({}, buildingInfo, { detail: buildingDetail });
}
async function getBuildingDetail(buildingInfo) {
    // if (buildingInfo.details) return buildingInfo.details;
    return getBuildingDetailsByAPI(buildingInfo.apiUrl, buildingInfo.tokenToUse);
}
async function getBuildingDetailsByAPI(batimenApiUrl, tokenToUse) {
    const detail = await _getBuildingTypeCount(batimenApiUrl, tokenToUse);
    detail.area = await _getBuildingArea(batimenApiUrl, tokenToUse);
    return detail;
}
function _getBuildingTypeCount(batimentUrl, tokenToUse) {
    // return axios.get(`${batimentUrl}/api/v1/geographicContext/tree`)
    return axios_1.default.get(`${batimentUrl}/api/v1/floor/list`, { headers: { 'Authorization': tokenToUse ? `Bearer ${tokenToUse}` : '' } })
        .then(res => _getBuildingItemsOccurance(res.data))
        .catch(error => ({}));
}
function _getBuildingArea(batimentUrl, tokenToUse) {
    return axios_1.default
        .get(`${batimentUrl}/api/v1/building/read`, { headers: { 'Authorization': tokenToUse ? `Bearer ${tokenToUse}` : '' } })
        .then((response) => response.data.area)
        .catch((err) => 0);
}
function _getBuildingItemsOccurance(buildingItems) {
    const obj = {
        "geographicFloor": buildingItems.length || 0,
    };
    // function countItemOccurance(item: any) {
    //     if (!item) return;
    //     obj[item.type] = obj[item.type] ? obj[item.type] + 1 : 1;
    //     (item.children || []).forEach((element: any) => countItemOccurance(element));
    // }
    // countItemOccurance(buildingItems);
    return obj;
}
async function _findChildInContext(startNode, nodeIdOrName, context) {
    const children = await startNode.getChildrenInContext(context);
    return children.find(el => {
        if (el.getId().get() === nodeIdOrName || el.getName().get() === nodeIdOrName) {
            //@ts-ignore
            spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(el);
            return true;
        }
        return false;
    });
}
function formatBuildingStructure(building) {
    const buildingDetails = building.node.info.get();
    return {
        ...(buildingDetails),
        apps: building.apps.map(el => el.info.get()),
        apis: building.apis.map(el => el.info.get())
    };
}
function validateBuildingInfo(buildingInfo) {
    if (!buildingInfo.name)
        return { isValid: false, message: "The name is required" };
    if (!buildingInfo.address)
        return { isValid: false, message: "The address is required" };
    return { isValid: true };
}
//# sourceMappingURL=buildingUtils.js.map