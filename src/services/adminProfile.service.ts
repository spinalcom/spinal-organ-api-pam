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

import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { ADMIN_PROFILE_NAME, ADMIN_PROFILE_TYPE, APP_RELATION_NAME, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PORTOFOLIO_TYPE, PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, PTR_LST_TYPE } from '../constant'
import { IPortofolioAuth, IPortofolioAuthEdit, IPortofolioAuthRes } from "../interfaces";
import AuthorizationService from "./authorization.service";
import { PortofolioService } from "./portofolio.service";
import { UserProfileService } from "./userProfile.service";


export class AdminProfileService {
    private static instance: AdminProfileService;
    private _adminNode: SpinalNode;

    private constructor() { }

    public static getInstance(): AdminProfileService {
        if (!this.instance) {
            this.instance = new AdminProfileService();
        }

        return this.instance;
    }

    public async init(context: SpinalContext): Promise<SpinalNode> {
        let node = await this.getAdminProfile(context);

        if (node) {
            this._adminNode = node;
            return node;
        }

        node = this._createAdminProfile();
        this._adminNode = node;
        await context.addChildInContext(node, CONTEXT_TO_USER_PROFILE_RELATION_NAME, PTR_LST_TYPE, context);

        await this.syncAdminProfile();
        return node;
    }

    async addAppToProfil(app: SpinalNode) {
        const { context, portofolio } = await this._createOrGetAdminPortofolio();
        const reference = new SpinalNode(app.getName().get(), app.getType().get(), app);
        await portofolio.addChildInContext(reference, APP_RELATION_NAME, PTR_LST_TYPE, context)
    }


    public async addToAdminProfile(data: IPortofolioAuth) {
        return UserProfileService.getInstance()._authorizeIPortofolioAuth(this._adminNode, data);
    }


    public async removeFromAdminProfile(data: IPortofolioAuthEdit) {
        return UserProfileService.getInstance()._unauthorizeIPortofolioAuth(this._adminNode, data);
    }

    public async syncAdminProfile(): Promise<IPortofolioAuthRes[]> {
        const data = await this._getPortofoliosStructure();

        return data.reduce(async (prom, el: any) => {
            const liste = await prom;
            const res = await UserProfileService.getInstance()._authorizeIPortofolioAuth(this._adminNode, el);
            liste.push(res);
            return liste;
        }, Promise.resolve([]))

    }

    public async getAdminProfile(argContext?: SpinalContext): Promise<SpinalNode> {
        if (this._adminNode) return this._adminNode;

        const context = argContext || UserProfileService.getInstance().context;
        if (!context) return;

        const children = await context.getChildren();

        return children.find(el => {
            return el.getName().get() === ADMIN_PROFILE_NAME && el.getType().get() === ADMIN_PROFILE_TYPE
        })
    }



    private _createAdminProfile(): SpinalNode {
        const info = {
            name: ADMIN_PROFILE_NAME,
            type: ADMIN_PROFILE_TYPE
        }
        const graph = new SpinalGraph(ADMIN_PROFILE_NAME)
        const profileId = SpinalGraphService.createNode(info, graph);

        const node = SpinalGraphService.getRealNode(profileId);
        return node;
    }

    private async _getPortofoliosStructure(): Promise<IPortofolioAuth[]> {
        const details = await PortofolioService.getInstance().getAllPortofoliosDetails();
        return details.map(({ node, apps, apis, buildings }: any) => {
            return {
                portofolioId: node.getId().get(),
                appsIds: apps.map(el => el.getId().get()),
                apisIds: apis.map(el => el.getId().get()),
                building: buildings.map(building => {
                    return {
                        buildingId: building.node.getId().get(),
                        appsIds: building.apps.map(el => el.getId().get()),
                        apisIds: building.apis.map(el => el.getId().get()),
                    }
                })
            }
        })
    }

    private async _createOrGetAdminPortofolio() {
        const adminPortofolio = "Administration";
        const context = await AuthorizationService.getInstance()._getAuthorizedPortofolioContext(this._adminNode, true);
        const children = await context.getChildren();
        let found = children.find(el => el.getName().get() === adminPortofolio);

        if (found) return { context, portofolio: found };

        const node = new SpinalNode(adminPortofolio, adminPortofolio);
        const refNode = new SpinalNode(adminPortofolio, adminPortofolio, node);

        await context.addChildInContext(refNode, PROFILE_TO_AUTHORIZED_PORTOFOLIO_RELATION, PTR_LST_TYPE, context);
        return { context, portofolio: refNode };
    }

}