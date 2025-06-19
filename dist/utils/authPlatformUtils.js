"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateContext = getOrCreateContext;
exports.getRequestBody = getRequestBody;
const spinal_model_graph_1 = require("spinal-model-graph");
const services_1 = require("../services");
async function getOrCreateContext(graph, contextName, contextType) {
    let context = await graph.getContext(contextName);
    if (!context) {
        const spinalContext = new spinal_model_graph_1.SpinalContext(contextName, contextType);
        context = await graph.addContext(spinalContext);
    }
    return context;
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