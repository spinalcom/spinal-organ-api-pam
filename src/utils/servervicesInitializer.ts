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

import { SpinalGraph, SpinalContext } from "spinal-model-graph";
import { CONFIG_DEFAULT_NAME, CONFIG_FILE_MODEl_TYPE, CONFIG_DEFAULT_DIRECTORY_PATH } from "../constant";

import {
    APIService, AppProfileService,
    AppService, BuildingService,
    OrganListService, RoleService,
    UserProfileService, PortofolioService,
    TokenService, UserListService,
    AppListService, LogService,
    AuthentificationService,
    SpinalCodeUniqueService
} from "../services";


const directory_path = process.env.CONFIG_DIRECTORY_PATH || CONFIG_DEFAULT_DIRECTORY_PATH;
const fileName = process.env.CONFIG_FILE_NAME || CONFIG_DEFAULT_NAME;

export default class ServicesInitializer {
    private static instance: ServicesInitializer;
    public graph: SpinalGraph;
    public hubConnect: spinal.FileSystem;

    private constructor() { }


    public static getInstance(): ServicesInitializer {
        if (!ServicesInitializer.instance) {
            ServicesInitializer.instance = new ServicesInitializer();
        }
        return ServicesInitializer.instance;
    }


    public async initAllService(graph: SpinalGraph): Promise<(SpinalContext | void)[]> {
        this.graph = graph;

        const services = [
            APIService,
            AppProfileService,
            AppService,
            BuildingService,
            OrganListService,
            RoleService,
            UserProfileService,
            UserListService,
            AppListService,
            PortofolioService,
            TokenService,
            LogService,
            AuthentificationService,
            SpinalCodeUniqueService
        ];

        return this._initServicesList(services);
    }


    private _initServicesList(services: any[]): Promise<void[]> {
        const promises = services.map(service => {
            try {
                const serviceInstance = service.getInstance();
                if (typeof serviceInstance.init === "function") return serviceInstance.init(this.graph);

            } catch (error) {
                console.error(error);
            }
        })

        return Promise.all(promises)
    }


}