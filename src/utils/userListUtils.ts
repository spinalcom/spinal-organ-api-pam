import { SpinalContext, SpinalNode } from "spinal-model-graph";
import * as bcrypt from 'bcrypt';
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { Model } from "spinal-core-connectorjs_type";
import { USER_TYPES } from "../constant";
import { AuthentificationService, UserProfileService } from "../services";
import { IPamCredential } from "../interfaces";
import axios from "axios";


export function checkIfUserExists(userName: string, context: SpinalContext): Promise<boolean> {
    return context.getChildrenInContext().then(users => {
        return users.some(user => user.info.userName?.get() === userName);
    });
}

export async function createNewUserNode(userName: string, password: string): Promise<SpinalNode> {
    const adminNodeElement = new Model({ userName, password: await hashPassword(password) });
    const nodeInfo = { name: userName, userName, type: USER_TYPES.ADMIN, userType: USER_TYPES.ADMIN };

    const nodeId = SpinalGraphService.createNode(nodeInfo, adminNodeElement);
    const node = SpinalGraphService.getRealNode(nodeId);
    return node;
}

export function hashPassword(password: string, saltRounds: number = 10): Promise<string> {
    return bcrypt.hashSync(password, saltRounds);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function generatePassword(length = 10): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let text = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        text += charset.charAt(Math.floor(Math.random() * n));
    }
    return text;
}

// async function _deleteUserToken(userNode: SpinalNode) {
//     const tokens = await userNode.getChildren(TOKEN_RELATION_NAME)
//     const promises = tokens.map(token => TokenService.getInstance().deleteToken(token))
//     return Promise.all(promises);
// }

export async function getAuthorizedAppsAsObj(userProfileId: string, portofolioId: string, buildingId: string): Promise<{ [key: string]: SpinalNode }> {
    let authorizedApps = await getAuthorizedApps(userProfileId, portofolioId, buildingId);
    if (!authorizedApps || authorizedApps.length === 0) return {};

    return _convertListToObj(authorizedApps, "id");
}




export function getProfileInfo(userToken: string, adminCredential: IPamCredential, isUser: boolean = true) {
    let urlAdmin = adminCredential.urlAdmin;
    let endpoint = "/tokens/getUserProfileByToken";
    return axios.post(urlAdmin + endpoint, {
        platformId: adminCredential.idPlateform,
        token: userToken
    }).then((result) => {
        if (!result.data) return;
        const data = result.data;
        delete data.password;
        return data;
    }).catch(err => {
        return {};
    })
}


export function getUserInfo(userId: string, adminCredential: IPamCredential, userToken: string) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // "x-access-token": adminCredential.tokenBosAdmin
            "x-access-token": userToken
        },
    }
    return axios.get(`${adminCredential.urlAdmin}/users/${userId}`, config).then((result) => {
        return result.data;
    }).catch((err) => {
        console.error(err);
    })
}


export function getUserInfoByToken(adminCredential: IPamCredential, userToken: string) {
    const data = { token: userToken }
    return axios.post(`${adminCredential.urlAdmin}/users/userInfo`, data).then((result) => {
        return result.data;
    }).catch((err) => {
        console.error(err);
    })
}


export async function getPamCredentials() {
    const adminCredential = await AuthentificationService.getInstance().getPamCredentials();
    if (!adminCredential) throw new Error("No authentication platform is registered");
    return adminCredential;
}


export function _convertListToObj(liste: SpinalNode[], key: string = "id"): { [key: string]: SpinalNode } {
    return liste.reduce((obj, item) => {
        const id = item.info[key]?.get();
        if (id) obj[id] = item;
        return obj;
    }, {})
}


function getAuthorizedApps(userProfileId: string, portofolioId: string, buildingId: string): Promise<SpinalNode[]> {
    const userProfileInstance = UserProfileService.getInstance();

    if (buildingId) return userProfileInstance.getAuthorizedBosApp(userProfileId, portofolioId, buildingId);

    return userProfileInstance.getAuthorizedPortofolioApp(userProfileId, portofolioId);
}

export function filterReferenceNodes(referencesNode: SpinalNode[], portofolioId: string, buildingId: string): SpinalNode[] {
    return referencesNode.filter((node) => {
        const { portofolioId: nodePortofolioId, buildingId: nodeBuildingId } = node.info.get();
        return nodePortofolioId === portofolioId && nodeBuildingId === buildingId;
    });
}