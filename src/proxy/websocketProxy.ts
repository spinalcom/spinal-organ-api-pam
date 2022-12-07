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




import { Application } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";


export function webSocketProxy(app: Application) {

    const customRouter = function (req) {
        // console.log(req)
        return 'https://api-cnp-production-b1.spinalcom.com'; // protocol + host
    };

    const wsProxy = createProxyMiddleware({
        // target: "https://api-cnp-production-b1.spinalcom.com",

        onProxyReqWs: (proxyReq, req, socket, options, head) => {
            // console.log(proxyReq, req, socket, options, head);
        },
        changeOrigin: true,
        router: customRouter

    })

    app.use(/socket.io/, wsProxy);


    return wsProxy;
}