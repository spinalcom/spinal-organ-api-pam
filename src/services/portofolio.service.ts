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

import { SpinalContext, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { configServiceInstance } from "./configFile.service";
import { PORTOFOLIO_CONTEXT_NAME, PORTOFOLIO_CONTEXT_TYPE, PORTOFOLIO_TYPE, CONTEXT_TO_PORTOFOLIO_RELATION_NAME, APP_RELATION_NAME, PTR_LST_TYPE, BUILDING_RELATION_NAME } from '../constant'
import { AppService } from './apps.service'
import { IPortofolioDetails } from "../interfaces";
import { async } from "q";
import { BuildingService } from "./building.service";

export class PortofolioService {
    private static instance: PortofolioService;
    public context: SpinalContext;
    constructor() { }

    public static getInstance(): PortofolioService {
        if (!this.instance) this.instance = new PortofolioService();

        return this.instance;
    }

    public async init(): Promise<SpinalContext> {
        this.context = await configServiceInstance.getContext(PORTOFOLIO_CONTEXT_NAME);
        if (!this.context) this.context = await configServiceInstance.addContext(PORTOFOLIO_CONTEXT_NAME, PORTOFOLIO_CONTEXT_TYPE);
        return this.context;
    }

    public async addPortofolio(portofolioName: string, buildingsIds: string[] = [], appsIds: string[] = []): Promise<IPortofolioDetails> {
        const node = new SpinalNode(portofolioName, PORTOFOLIO_TYPE);
        await this.context.addChildInContext(node, CONTEXT_TO_PORTOFOLIO_RELATION_NAME, PTR_LST_TYPE, this.context);

        const apps = await this.addAppToPortofolio(node, appsIds)
        const buildings = await this.addBuildingToPortofolio(node, buildingsIds);

        return {
            node,
            apps,
            buildings
        }
    }

    public async renamePortofolio(portfolioId: string, newName: string): Promise<boolean> {
        const portofolio = await this.getPortofolio(portfolioId);
        if (!portofolio) return false;

        portofolio.info.name.set(newName.trim());
        return true;
    }

    public getAllPortofolio(): Promise<SpinalNode[]> {
        return this.context.getChildren([CONTEXT_TO_PORTOFOLIO_RELATION_NAME]);
    }

    public async getPortofolio(portofolioId: string): Promise<SpinalNode> {
        const portofolios = await this.getAllPortofolio();
        return portofolios.find(el => el.getId().get() === portofolioId);
    }

    public async getPortofolioDetails(portofolio: string | SpinalNode): Promise<IPortofolioDetails> {
        const node = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolio(portofolio);

        if (!node) throw new Error(`No portofolio found for {portofolio}`);

        const [apps, buildings] = await Promise.all([this.getPortofolioApps(node), this.getPortofolioBuildings(node)])

        return { node, apps, buildings };
    }

    public async getAllPortofoliosDetails(): Promise<IPortofolioDetails[]> {
        const portofolios = await this.getAllPortofolio();
        return portofolios.reduce(async (prom, el) => {
            const liste = await prom;
            const details = await this.getPortofolioDetails(el);
            if (details) liste.push(details);
            return liste;
        }, Promise.resolve([]))
    }

    public async removePortofolio(portofolio: string | SpinalNode): Promise<boolean> {
        try {
            const node = portofolio instanceof SpinalNode ? portofolio : await this.getPortofolio(portofolio);
            await this.context.removeChild(node, CONTEXT_TO_PORTOFOLIO_RELATION_NAME, PTR_LST_TYPE);
            return true;
        } catch (error) {
            return false
        }
    }


    //////////////////////////////////////////////////////
    //                      APPS                        //
    //////////////////////////////////////////////////////

    public async addAppToPortofolio(portofolio: string | SpinalNode, applicationId: string | string[]): Promise<SpinalNode[]> {
        if (typeof portofolio === "string") portofolio = await this.getPortofolio(portofolio);
        if (!(portofolio instanceof SpinalNode)) throw new Error(`No portofolio found for ${portofolio}`);

        if (!Array.isArray(applicationId)) applicationId = [applicationId];

        return applicationId.reduce(async (prom, appId: string) => {
            const liste = await prom;
            const appNode = await AppService.getInstance().getPortofolioApp(appId);
            if (!(appNode instanceof SpinalNode)) return liste;

            const childrenIds = (<SpinalNode>portofolio).getChildrenIds();
            const isChild = childrenIds.find(el => el === appId);

            if (!isChild) (<SpinalNode>portofolio).addChildInContext(appNode, APP_RELATION_NAME, PTR_LST_TYPE, this.context);
            liste.push(appNode);
            return liste;

        }, Promise.resolve([]))
    }

    public async getPortofolioApps(portofolio: string | SpinalNode): Promise<SpinalNode[]> {
        if (typeof portofolio === "string") portofolio = await this.getPortofolio(portofolio);
        if (!(portofolio instanceof SpinalNode)) return [];

        return portofolio.getChildren([APP_RELATION_NAME]);
    }

    public async getAppFromPortofolio(portofolio: string | SpinalNode, appId: string): Promise<SpinalNode> {
        if (typeof portofolio === "string") portofolio = await this.getPortofolio(portofolio);
        if (!(portofolio instanceof SpinalNode)) return;

        const children = await portofolio.getChildren([APP_RELATION_NAME]);
        return children.find(el => el.getId().get() === appId);
    }

    public async removeAppFromPortofolio(portofolio: string | SpinalNode, applicationId: string | string[]): Promise<string[]> {
        if (typeof portofolio === "string") portofolio = await this.getPortofolio(portofolio);
        if (!(portofolio instanceof SpinalNode)) throw new Error(`No portofolio found for ${portofolio}`);

        if (!Array.isArray(applicationId)) applicationId = [applicationId];

        return applicationId.reduce(async (prom, appId: string) => {
            const liste = await prom;
            const appNode = await this.getAppFromPortofolio(portofolio, appId);
            if (!(appNode instanceof SpinalNode)) return liste

            try {
                await (<SpinalNode>portofolio).removeChild(appNode, APP_RELATION_NAME, PTR_LST_TYPE);
                liste.push(appId);
            } catch (error) { }

            return liste;

        }, Promise.resolve([]))

    }

    public async portofolioHasApp(portofolio: string | SpinalNode, appId: string): Promise<SpinalNode | void> {
        const apps = await this.getPortofolioApps(portofolio);
        return apps.find(el => el.getId().get() === appId);
    }

    //////////////////////////////////////////////////////
    //                      BUILDINGS                   //
    //////////////////////////////////////////////////////

    public async addBuildingToPortofolio(portofolio: string | SpinalNode, buildingId: string | string[]): Promise<SpinalNode[]> {

        if (typeof portofolio === "string") portofolio = await this.getPortofolio(portofolio);
        if (!(portofolio instanceof SpinalNode)) throw new Error(`No portofolio found for ${portofolio}`);

        if (!Array.isArray(buildingId)) buildingId = [buildingId];

        return buildingId.reduce(async (prom, id: string) => {
            const liste = await prom;
            const buildingNode = await BuildingService.getInstance().getBuildingById(id);
            if (!(buildingNode instanceof SpinalNode)) return liste;

            const childrenIds = (<SpinalNode>portofolio).getChildrenIds();
            const isChild = childrenIds.find(el => el === id);

            if (!isChild) (<SpinalNode>portofolio).addChildInContext(buildingNode, BUILDING_RELATION_NAME, PTR_LST_TYPE, this.context);
            liste.push(buildingNode);
            return liste;
            //         const appNode = AppService.getInstance().getAppById(appId);
            //         if (!(appNode instanceof SpinalNode)) throw new Error(`No application found for ${appId}`);

        }, Promise.resolve([]))
    }

    public async getPortofolioBuildings(portofolio: string | SpinalNode): Promise<SpinalNode[]> {
        if (typeof portofolio === "string") portofolio = await this.getPortofolio(portofolio);
        if (!(portofolio instanceof SpinalNode)) throw new Error(`No portofolio found for ${portofolio}`);

        return portofolio.getChildren([BUILDING_RELATION_NAME]);
    }

    public async removeBuildingFromPortofolio(portofolio: string | SpinalNode, buildingId: string | string[]): Promise<string[]> {
        if (typeof portofolio === "string") portofolio = await this.getPortofolio(portofolio);
        if (!(portofolio instanceof SpinalNode)) throw new Error(`No portofolio found for ${portofolio}`);

        if (!Array.isArray(buildingId)) buildingId = [buildingId];

        return buildingId.reduce(async (prom, id: string) => {
            const liste = await prom;
            const buildingNode = await BuildingService.getInstance().getBuildingById(id);
            if (!(buildingNode instanceof SpinalNode)) return liste;

            try {
                await (<SpinalNode>portofolio).removeChild(buildingNode, BUILDING_RELATION_NAME, PTR_LST_TYPE);
                liste.push(id);
            } catch (error) { }

            return liste;

            //         const appNode = AppService.getInstance().getAppById(appId);
            //         if (!(appNode instanceof SpinalNode)) throw new Error(`No application found for ${appId}`);

        }, Promise.resolve([]));

    }

    public async portofolioHasBuilding(portofolio: string | SpinalNode, buildingId: string): Promise<SpinalNode | void> {
        const buildings = await this.getPortofolioBuildings(portofolio);
        return buildings.find(el => el.getId().get() === buildingId);
    }




    _formatDetails(node: SpinalNode, apps: SpinalNode[], buildings: SpinalNode[]) {
        return {
            ...node.info.get(),
            buildings: buildings.map(el => el.info.get()),
            apps: apps.map(el => el.info.get())
        }
    }
}