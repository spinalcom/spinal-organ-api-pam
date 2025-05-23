"use strict";
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
exports.SpinalCodeUniqueService = void 0;
const axios_1 = require("axios");
const constant_1 = require("../constant");
const AuthError_1 = require("../security/AuthError");
const authentification_service_1 = require("./authentification.service");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const configFile_service_1 = require("./configFile.service");
const token_service_1 = require("./token.service");
class SpinalCodeUniqueService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new SpinalCodeUniqueService();
        return this.instance;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.context = yield configFile_service_1.configServiceInstance.getContext(constant_1.CODE_USED_LIST_CONTEXT_NAME);
            if (!this.context) {
                this.context = yield configFile_service_1.configServiceInstance.addContext(constant_1.CODE_USED_LIST_CONTEXT_NAME, constant_1.CODE_USED_LIST_CONTEXT_TYPE);
            }
            return this.context;
        });
    }
    consumeCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const bosCredential = yield authentification_service_1.AuthentificationService.getInstance().getPamToAdminCredential();
            if (!bosCredential)
                throw new AuthError_1.OtherError(constant_1.HTTP_CODES.NOT_FOUND, `No auth found for code ${code}`);
            return axios_1.default.post(`${bosCredential.urlAdmin}/codes/consume/${code}`, {}, { headers: { 'Content-Type': 'application/json' } })
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                let data = result.data;
                data.profile = yield this._getProfileInfo(data.token, bosCredential);
                data.userInfo = yield this._getCodeInfo(code, bosCredential, data.token);
                const type = "code";
                const info = { name: ((_a = data.userInfo) === null || _a === void 0 ? void 0 : _a.name) || code, applicationId: (_b = data.userInfo) === null || _b === void 0 ? void 0 : _b.applicationId, userId: (_c = data.userInfo) === null || _c === void 0 ? void 0 : _c.userId, type, userType: type };
                const node = yield this._addUserToContext(info);
                yield token_service_1.TokenService.getInstance().addUserToken(node, data.token, data);
                return data;
            }));
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
    _addUserToContext(info, element) {
        return __awaiter(this, void 0, void 0, function* () {
            const nodeId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode(info, element);
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(nodeId);
            return this.context.addChildInContext(node, constant_1.CONTEXT_TO_CODE_RELATION_NAME, constant_1.PTR_LST_TYPE, this.context);
        });
    }
}
exports.SpinalCodeUniqueService = SpinalCodeUniqueService;
//# sourceMappingURL=codeUnique.service.js.map