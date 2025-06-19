"use strict";
/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
exports.HubSessionService = void 0;
const axios_1 = require("axios");
class HubSessionService {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new HubSessionService();
        return this.instance;
    }
    /**
     * Create a session on the hub
     *
     * @return {*}  {Promise<string>}
     * @memberof HubSessionService
     */
    createSession() {
        let hubUrl = `${process.env.HUB_PROTOCOL}://${process.env.HUB_HOST}:${process.env.HUB_PORT}`;
        let hubId = process.env.USER_ID;
        let hubPwd = process.env.USER_MDP;
        return axios_1.default.post(`${hubUrl}/sceen/_`, `U ${hubId} ${hubPwd} S 1 E `, { headers: { 'Content-Type': 'text/plain' } })
            .then((result) => {
            const rep = result.data;
            return rep.split('\n')[0].split(' = ')[1].split(';')[0];
        });
    }
}
exports.HubSessionService = HubSessionService;
//# sourceMappingURL=hubSession.service.js.map