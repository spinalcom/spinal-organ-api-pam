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
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketProxy = void 0;
const http_proxy_middleware_1 = require("http-proxy-middleware");
function webSocketProxy(app) {
    const customRouter = function (req) {
        // console.log(req)
        return 'https://api-cnp-production-b1.spinalcom.com'; // protocol + host
    };
    const wsProxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
        // target: "https://api-cnp-production-b1.spinalcom.com",
        onProxyReqWs: (proxyReq, req, socket, options, head) => {
            // console.log(proxyReq, req, socket, options, head);
        },
        changeOrigin: true,
        router: customRouter
    });
    app.use(/socket.io/, wsProxy);
    return wsProxy;
}
exports.webSocketProxy = webSocketProxy;
//# sourceMappingURL=websocketProxy.js.map