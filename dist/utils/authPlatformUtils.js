"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestBody = exports.getOrCreateContext = void 0;
const spinal_model_graph_1 = require("spinal-model-graph");
const services_1 = require("../services");
const spinal_core_connectorjs_1 = require("spinal-core-connectorjs");
async function getOrCreateContext(graph, contextName, contextType) {
    let context = await graph.getContext(contextName);
    if (!context) {
        const spinalContext = new spinal_model_graph_1.SpinalContext(contextName, contextType);
        context = await graph.addContext(spinalContext);
    }
    await waitServerId(context);
    return context;
}
exports.getOrCreateContext = getOrCreateContext;
function waitServerId(context) {
    let loop = 30 * 1000;
    return new Promise((resolve, reject) => {
        if (loop < 0)
            reject("Timeout");
        let interval = setInterval(() => {
            if (spinal_core_connectorjs_1.FileSystem._objects[context._server_id] !== undefined) {
                clearInterval(interval);
                resolve(context._server_id);
            }
            loop -= 500;
        }, 500);
    });
}
async function getRequestBody(update, bosCredential, adminCredential) {
    return JSON.stringify({
        TokenBosAdmin: bosCredential.tokenPamToAdmin,
        platformId: bosCredential.idPlateform,
        jsonData: await getPlatformInfo(),
        ...(!update && {
            URLBos: ``,
            TokenAdminBos: adminCredential.TokenAdminToPam,
            idPlatformOfAdmin: adminCredential.idPlatformOfAdmin
        }),
    });
}
exports.getRequestBody = getRequestBody;
async function getPlatformInfo() {
    return {
        userProfileList: await _formatUserProfiles(),
        appProfileList: await _formatAppProfiles(),
        organList: [],
        // appList: await this._formatAppList()
    };
}
function _formatUserProfiles() {
    return services_1.UserProfileService.getInstance().getAllProfilesNodes().then((nodes) => {
        return nodes.map(el => ({
            userProfileId: el.info.id.get(),
            label: el.info.name.get()
        }));
    });
}
function _formatAppProfiles() {
    return services_1.AppProfileService.getInstance().getAllProfilesNodes().then((nodes) => {
        return nodes.map(el => ({
            appProfileId: el.info.id.get(),
            label: el.info.name.get()
        }));
    });
}
function _formatCredentialInfo(info) {
    const obj = { clientId: undefined, clientSecret: undefined };
    if ("client_id" in info) {
        obj.clientId = info["client_id"];
    }
    if ("client_secret" in info) {
        obj.clientSecret = info["client_secret"];
    }
    return (obj.clientId && obj.clientSecret ? obj : info);
}
//# sourceMappingURL=authPlatformUtils.js.map