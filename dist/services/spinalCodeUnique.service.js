"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalCodeUniqueService = void 0;
const axios_1 = require("axios");
const constant_1 = require("../constant");
const AuthError_1 = require("../security/AuthError");
const authentification_service_1 = require("./authentification.service");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const token_service_1 = require("./token.service");
class SpinalCodeUniqueService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new SpinalCodeUniqueService();
        return this.instance;
    }
    async init(graph) {
        this.context = await graph.getContext(constant_1.CODE_USED_LIST_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new spinal_env_viewer_graph_service_1.SpinalContext(constant_1.CODE_USED_LIST_CONTEXT_NAME, constant_1.CODE_USED_LIST_CONTEXT_TYPE);
            this.context = await graph.addContext(spinalContext);
        }
        return this.context;
    }
    async consumeCode(code) {
        const bosCredential = await authentification_service_1.AuthentificationService.getInstance().getPamCredentials();
        if (!bosCredential)
            throw new AuthError_1.OtherError(constant_1.HTTP_CODES.NOT_FOUND, `No auth found for code ${code}`);
        return axios_1.default.post(`${bosCredential.urlAdmin}/codes/consume/${code}`, {}, { headers: { 'Content-Type': 'application/json' } })
            .then(async (result) => {
            let data = result.data;
            data.profile = await this._getProfileInfo(data.token, bosCredential);
            data.userInfo = await this._getCodeInfo(code, bosCredential, data.token);
            const type = "code";
            const info = { name: data.userInfo?.name || code, applicationId: data.userInfo?.applicationId, userId: data.userInfo?.userId, type, userType: type };
            const node = await this._addUserToContext(info);
            await token_service_1.TokenService.getInstance().addTokenToContext(data.token, data);
            return data;
        });
    }
    _getProfileInfo(userToken, adminCredential) {
        let urlAdmin = adminCredential.urlAdmin;
        let endpoint = "/tokens/getCodeProfileByToken";
        return axios_1.default.post(urlAdmin + endpoint, {
            platformId: adminCredential.idPlateform,
            token: userToken
        }).then((result) => {
            if (!result.data)
                return;
            const data = result.data;
            return data;
        }).catch(err => {
            return {};
        });
    }
    _getCodeInfo(code, adminCredential, userToken) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // "x-access-token": adminCredential.tokenBosAdmin
                "x-access-token": userToken
            },
        };
        return axios_1.default.get(`${adminCredential.urlAdmin}/codes/getcode/${code}`, config).then((result) => {
            return result.data;
        }).catch((err) => {
            console.error(err);
        });
    }
    async _addUserToContext(info, element) {
        const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, element);
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
        return this.context.addChildInContext(node, constant_1.CONTEXT_TO_CODE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
    }
}
exports.SpinalCodeUniqueService = SpinalCodeUniqueService;
//# sourceMappingURL=spinalCodeUnique.service.js.map