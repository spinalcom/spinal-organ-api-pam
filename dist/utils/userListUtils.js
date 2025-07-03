"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterReferenceNodes = exports._convertListToObj = exports.getPamCredentials = exports.getUserInfoByToken = exports.getUserInfo = exports.getProfileInfo = exports.getAuthorizedAppsAsObj = exports.generatePassword = exports.comparePassword = exports.hashPassword = exports.createNewUserNode = exports.checkIfUserExists = void 0;
const bcrypt = require("bcrypt");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const constant_1 = require("../constant");
const services_1 = require("../services");
const axios_1 = require("axios");
function checkIfUserExists(userName, context) {
    return context.getChildrenInContext().then(users => {
        return users.some(user => user.info.userName?.get() === userName);
    });
}
exports.checkIfUserExists = checkIfUserExists;
async function createNewUserNode(userName, password) {
    const adminNodeElement = new spinal_core_connectorjs_type_1.Model({ userName, password: await hashPassword(password) });
    const nodeInfo = { name: userName, userName, type: constant_1.USER_TYPES.ADMIN, userType: constant_1.USER_TYPES.ADMIN };
    const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(nodeInfo, adminNodeElement);
    const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
    return node;
}
exports.createNewUserNode = createNewUserNode;
function hashPassword(password, saltRounds = 10) {
    return bcrypt.hashSync(password, saltRounds);
}
exports.hashPassword = hashPassword;
function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
exports.comparePassword = comparePassword;
function generatePassword(length = 10) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let text = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        text += charset.charAt(Math.floor(Math.random() * n));
    }
    return text;
}
exports.generatePassword = generatePassword;
// async function _deleteUserToken(userNode: SpinalNode) {
//     const tokens = await userNode.getChildren(TOKEN_RELATION_NAME)
//     const promises = tokens.map(token => TokenService.getInstance().deleteToken(token))
//     return Promise.all(promises);
// }
async function getAuthorizedAppsAsObj(userProfileId, portofolioId, buildingId) {
    let authorizedApps = await getAuthorizedApps(userProfileId, portofolioId, buildingId);
    if (!authorizedApps || authorizedApps.length === 0)
        return {};
    return _convertListToObj(authorizedApps, "id");
}
exports.getAuthorizedAppsAsObj = getAuthorizedAppsAsObj;
function getProfileInfo(userToken, adminCredential, isUser = true) {
    let urlAdmin = adminCredential.urlAdmin;
    let endpoint = "/tokens/getUserProfileByToken";
    return axios_1.default.post(urlAdmin + endpoint, {
        platformId: adminCredential.idPlateform,
        token: userToken
    }).then((result) => {
        if (!result.data)
            return;
        const data = result.data;
        delete data.password;
        return data;
    }).catch(err => {
        return {};
    });
}
exports.getProfileInfo = getProfileInfo;
function getUserInfo(userId, adminCredential, userToken) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            // "x-access-token": adminCredential.tokenBosAdmin
            "x-access-token": userToken
        },
    };
    return axios_1.default.get(`${adminCredential.urlAdmin}/users/${userId}`, config).then((result) => {
        return result.data;
    }).catch((err) => {
        console.error(err);
    });
}
exports.getUserInfo = getUserInfo;
function getUserInfoByToken(adminCredential, userToken) {
    const data = { token: userToken };
    return axios_1.default.post(`${adminCredential.urlAdmin}/users/userInfo`, data).then((result) => {
        return result.data;
    }).catch((err) => {
        console.error(err);
    });
}
exports.getUserInfoByToken = getUserInfoByToken;
async function getPamCredentials() {
    const adminCredential = await services_1.AuthentificationService.getInstance().getPamCredentials();
    if (!adminCredential)
        throw new Error("No authentication platform is registered");
    return adminCredential;
}
exports.getPamCredentials = getPamCredentials;
function _convertListToObj(liste, key = "id") {
    return liste.reduce((obj, item) => {
        const id = item.info[key]?.get();
        if (id)
            obj[id] = item;
        return obj;
    }, {});
}
exports._convertListToObj = _convertListToObj;
function getAuthorizedApps(userProfileId, portofolioId, buildingId) {
    const userProfileInstance = services_1.UserProfileService.getInstance();
    if (buildingId)
        return userProfileInstance.getAuthorizedBosApp(userProfileId, portofolioId, buildingId);
    return userProfileInstance.getAuthorizedPortofolioApp(userProfileId, portofolioId);
}
function filterReferenceNodes(referencesNode, portofolioId, buildingId) {
    return referencesNode.filter((node) => {
        const { portofolioId: nodePortofolioId, buildingId: nodeBuildingId } = node.info.get();
        return nodePortofolioId === portofolioId && nodeBuildingId === buildingId;
    });
}
exports.filterReferenceNodes = filterReferenceNodes;
//# sourceMappingURL=userListUtils.js.map