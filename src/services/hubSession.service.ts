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

import axios from "axios";

export class HubSessionService {
    private static instance: HubSessionService;

    private constructor() { }

    public static getInstance(): HubSessionService {
        if (!this.instance) this.instance = new HubSessionService();

        return this.instance;
    }

    /**
     * Create a session on the hub
     *
     * @return {*}  {Promise<string>}
     * @memberof HubSessionService
     */
    public createSession(): Promise<string> {
        let hubUrl = `${process.env.HUB_PROTOCOL}://${process.env.HUB_HOST}:${process.env.HUB_PORT}`;
        let hubId = process.env.USER_ID;
        let hubPwd = process.env.USER_MDP;

        return axios.post(`${hubUrl}/sceen/_`,
            `U ${hubId} ${hubPwd} S 1 E `,
            { headers: { 'Content-Type': 'text/plain' } })
            .then((result) => {
                const rep = result.data;
                return rep.split('\n')[0].split(' = ')[1].split(';')[0];
            })
    }


}