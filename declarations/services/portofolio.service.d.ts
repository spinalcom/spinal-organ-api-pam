/// <reference types="node" />
import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IPortofolioData, IPortofolioDetails } from "../interfaces";
export declare class PortofolioService {
    private static instance;
    context: SpinalContext;
    constructor();
    static getInstance(): PortofolioService;
    init(): Promise<SpinalContext>;
    addPortofolio(portofolioName: string, buildingsIds?: string[], appsIds?: string[], apisIds?: any[]): Promise<IPortofolioDetails>;
    renamePortofolio(portfolioId: string, newName: string): Promise<boolean>;
    getAllPortofolio(): Promise<SpinalNode[]>;
    getPortofolio(portofolioId: string): Promise<SpinalNode>;
    getPortofolioDetails(portofolio: string | SpinalNode): Promise<IPortofolioDetails>;
    getAllPortofoliosDetails(): Promise<IPortofolioDetails[]>;
    removePortofolio(portofolio: string | SpinalNode): Promise<boolean>;
    addAppToPortofolio(portofolio: string | SpinalNode, applicationId: string | string[]): Promise<SpinalNode[]>;
    getPortofolioApps(portofolio: string | SpinalNode): Promise<SpinalNode[]>;
    getAppFromPortofolio(portofolio: string | SpinalNode, appId: string): Promise<SpinalNode>;
    removeAppFromPortofolio(portofolio: string | SpinalNode, applicationId: string | string[]): Promise<string[]>;
    portofolioHasApp(portofolio: string | SpinalNode, appId: string): Promise<SpinalNode | void>;
    addApiToPortofolio(portofolio: string | SpinalNode, apisIds: string | string[]): Promise<SpinalNode[]>;
    getPortofolioApis(portofolio: string | SpinalNode): Promise<SpinalNode[]>;
    getApiFromPortofolio(portofolio: string | SpinalNode, apiId: string): Promise<SpinalNode>;
    removeApiFromPortofolio(portofolio: string | SpinalNode, apisIds: string | string[]): Promise<string[]>;
    portofolioHasApi(portofolio: string | SpinalNode, apiId: string): Promise<SpinalNode | void>;
    uploadSwaggerFile(buffer: Buffer): Promise<any[]>;
    addBuildingToPortofolio(portofolio: string | SpinalNode, buildingId: string | string[]): Promise<SpinalNode[]>;
    getPortofolioBuildings(portofolio: string | SpinalNode): Promise<SpinalNode[]>;
    removeBuildingFromPortofolio(portofolio: string | SpinalNode, buildingId: string | string[]): Promise<string[]>;
    getBuildingFromPortofolio(portofolio: string | SpinalNode, buildingId: string): Promise<SpinalNode | void>;
    _formatDetails(node: SpinalNode, apps: SpinalNode[], buildings: SpinalNode[], apis?: SpinalNode[]): IPortofolioData;
}
