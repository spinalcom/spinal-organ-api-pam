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
exports.useLoginProxy = void 0;
const services_1 = require("../../services");
const constant_1 = require("../../constant");
function useLoginProxy(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.get('/login', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authPlatformInfo = yield services_1.AuthentificationService.getInstance().getPamToAdminCredential();
                if (authPlatformInfo) {
                    let server_url = authPlatformInfo.urlAdmin;
                    const client_id = authPlatformInfo.clientId;
                    if (!server_url || !client_id) {
                        return res.send({ status: constant_1.HTTP_CODES.BAD_REQUEST, message: "Invalid auth server details" });
                    }
                    server_url = server_url.endsWith("/") ? server_url : server_url + "/";
                    const url = server_url + `login/${client_id}`;
                    return res.status(constant_1.HTTP_CODES.REDIRECT).redirect(url);
                }
                res.status(constant_1.HTTP_CODES.BAD_REQUEST).send({ status: constant_1.HTTP_CODES.BAD_REQUEST, message: "No Authentification server url found, use /admin endpoint to connect as admin" });
            }
            catch (error) {
                console.error(error.message);
                res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send({ status: constant_1.HTTP_CODES.INTERNAL_ERROR, message: error.message });
            }
            // let clientUrl = process.env.VUE_CLIENT_URI;
            // if (!clientUrl || !(/^https?:\/\//.test(clientUrl)))
            //     return res.send({ status: HTTP_CODES.BAD_REQUEST, message: "No Authentification server url found, use /admin endpoint to connect as admin" });
            // clientUrl = clientUrl.endsWith("/") ? clientUrl : clientUrl + "/";
            // return res.redirect(clientUrl + "admin");
        }));
        app.post("/callback", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = JSON.parse(req.body.data);
                const formatData = yield services_1.UserListService.getInstance().getUserDataFormatted(data, null, true);
                const profileId = formatData.profile.userProfileBosConfigId || data.profile.profileId;
                const token = formatData.token;
                const user = btoa(JSON.stringify(formatData.userInfo));
                res.cookie("profileId", profileId);
                res.cookie("token", token);
                res.cookie("user", user);
                const vue_client_uri = process.env.VUE_CLIENT_URI;
                res.redirect(vue_client_uri);
            }
            catch (error) {
                console.error(error.message);
            }
        }));
    });
}
exports.useLoginProxy = useLoginProxy;
function getAuthServerUrl() {
    let server_url = process.env.AUTH_SERVER_URL;
    let client_id = process.env.AUTH_CLIENT_ID;
    return server_url.endsWith("/") ? `${server_url}login/${client_id}` : `${server_url}/login/${client_id}`;
}
//# sourceMappingURL=index.js.map