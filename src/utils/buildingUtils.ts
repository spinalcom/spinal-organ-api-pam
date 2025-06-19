import axios from "axios";
import { BUILDING_TYPE } from "../constant";
import { IBuilding, IBuildingCreation, IBuildingDetails, ILocation } from "../interfaces";
import * as openGeocoder from "node-open-geocoder";
import { SpinalContext, SpinalNode } from "spinal-model-graph";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";


export async function getBuildingGeoPosition(buildingAddress: string): Promise<ILocation> {
    if (!buildingAddress) return;

    return getLatLngViaAddress(buildingAddress);
}


export async function createBuildingNode(buildingInfo: IBuildingCreation): Promise<SpinalNode> {

    const { appIds, apiIds, ...buildingNodeInfo } = buildingInfo; // Exclude appIds and apiIds from the node creation info

    buildingNodeInfo.apiUrl = buildingNodeInfo.apiUrl.replace(/\/$/, el => ""); // Remove trailing slash from apiUrl
    buildingNodeInfo.type = BUILDING_TYPE;
    buildingNodeInfo.detail = await getBuildingDetailsByAPI(buildingNodeInfo.apiUrl);

    const nodeId = SpinalGraphService.createNode(buildingInfo, undefined);
    return SpinalGraphService.getRealNode(nodeId);
}



function getLatLngViaAddress(address: string): Promise<ILocation> {
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

export async function formatBuildingNode(buildingNode: SpinalNode): Promise<IBuilding> {
    const buildingInfo = buildingNode.info.get();
    const buildingDetail = await getBuildingDetail(buildingInfo);
    return Object.assign({}, buildingInfo, { detail: buildingDetail }) as IBuilding;
}

async function getBuildingDetailsByAPI(batimenApiUrl: string): Promise<{ [key: string]: number }> {
    const detail: any = await _getBuildingTypeCount(batimenApiUrl);
    detail.area = await _getBuildingArea(batimenApiUrl);

    return detail;
}

export async function getBuildingDetail(buildingInfo: IBuilding): Promise<any> {
    if (buildingInfo.details) return buildingInfo.details;

    return getBuildingDetailsByAPI(buildingInfo.apiUrl);
}


function _getBuildingTypeCount(batimentUrl: string): Promise<{ [key: string]: number }> {
    return axios.get(`${batimentUrl}/api/v1/geographicContext/tree`)
        .then(res => _getBuildingItemsOccurance(res.data))
        .catch(error => ({}));
}

function _getBuildingArea(batimentUrl: string): Promise<number> {
    return axios
        .get(`${batimentUrl}/api/v1/building/read`)
        .then((response) => response.data.area)
        .catch((err) => 0);
}


function _getBuildingItemsOccurance(buildingItems: any): { [key: string]: number } {
    const obj: { [key: string]: number } = {};

    function countItemOccurance(item: any) {
        if (!item) return;
        obj[item.type] = obj[item.type] ? obj[item.type] + 1 : 1;

        (item.children || []).forEach((element: any) => countItemOccurance(element));
    }

    countItemOccurance(buildingItems);
    return obj;
}

async function _findChildInContext(startNode: SpinalNode, nodeIdOrName: string, context: SpinalContext): Promise<SpinalNode> {
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


export function formatBuildingStructure(building: IBuildingDetails) {
    const buildingDetails = building.node.info.get();

    return {
        ...(buildingDetails),
        apps: building.apps.map(el => el.info.get()),
        apis: building.apis.map(el => el.info.get())
    }
}


export function validateBuildingInfo(buildingInfo: IBuilding): { isValid: boolean; message?: string } {
    if (!buildingInfo.name) return { isValid: false, message: "The name is required" };
    if (!buildingInfo.address) return { isValid: false, message: "The address is required" };

    return { isValid: true }
}