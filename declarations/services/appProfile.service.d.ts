import { SpinalGraph, SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
import { IProfile, IBosAuth, IPortofolioAuth, IPortofolioAuthRes, IBosAuthRes, IProfileRes, IProfileEdit } from '../interfaces';
export declare class AppProfileService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): AppProfileService;
    init(): Promise<SpinalContext>;
    createAppProfile(appProfile: IProfile): Promise<IProfileRes>;
    getAppProfile(appProfile: string | SpinalNode): Promise<IProfileRes>;
    updateAppProfile(appProfileId: string, appProfile: IProfileEdit): Promise<IProfileRes>;
    getAllAppProfile(): Promise<IProfileRes[]>;
    getAllAppProfileNodes(): Promise<SpinalNode<import("spinal-core-connectorjs").Model>[]>;
    deleteAppProfile(appProfileId: string): Promise<string>;
    authorizePortofolio(profile: string | SpinalNode, portofolioId: string | string[]): Promise<SpinalNode[]>;
    unauthorizeToAccessPortofolio(profile: string | SpinalNode, portofolioId: string | string[]): Promise<boolean[]>;
    authorizeToAccessPortofolioApp(profile: string | SpinalNode, data: IPortofolioAuth | IPortofolioAuth[]): Promise<IPortofolioAuthRes[]>;
    unauthorizeToAccessPortofolioApp(profile: string | SpinalNode, data: IPortofolioAuth | IPortofolioAuth[]): Promise<SpinalNode[]>;
    authorizeToAccessPortofolioApisRoute(profile: string | SpinalNode, data: IPortofolioAuth | IPortofolioAuth[]): Promise<IPortofolioAuthRes[]>;
    unauthorizeToAccessPortofolioApisRoute(profile: string | SpinalNode, data: IPortofolioAuth | IPortofolioAuth[]): Promise<string[]>;
    getAuthorizedPortofolio(profile: string | SpinalNode): Promise<SpinalNode[]>;
    getAuthorizedPortofolioApp(profile: string | SpinalNode, portofolioId: string): Promise<SpinalNode[]>;
    getAuthorizedPortofolioApis(profile: string | SpinalNode, portofolioId: string): Promise<SpinalNode[]>;
    getPortofolioAuthStructure(profile: string | SpinalNode): Promise<IPortofolioAuthRes[]>;
    authorizeToAccessBos(profile: SpinalNode | string, portofolioId: string, BosId: string | string[]): Promise<SpinalNode[]>;
    unauthorizeToAccessBos(profile: SpinalNode | string, portofolioId: string, BosId: string | string[]): Promise<boolean[]>;
    authorizeToAccessBosApp(profile: SpinalNode | string, portofolioId: string, data: IBosAuth | IBosAuth[]): Promise<IBosAuthRes[]>;
    unauthorizeToAccessBosApp(profile: SpinalNode | string, portofolioId: string, data: IBosAuth | IBosAuth[]): Promise<SpinalNode[]>;
    authorizeToAccessBosApiRoute(profile: SpinalNode | string, portofolioId: string, data: IBosAuth | IBosAuth[]): Promise<IBosAuthRes[]>;
    unauthorizeToAccessBosApiRoute(profile: SpinalNode | string, portofolioId: string, data: IBosAuth | IBosAuth[]): Promise<string[]>;
    getAuthorizedBos(profile: SpinalNode | string, portofolioId: string): Promise<SpinalNode[]>;
    getAuthorizedBosApp(profile: SpinalNode | string, portofolioId: string, bosId: string): Promise<SpinalNode[]>;
    getAuthorizedBosApis(profile: SpinalNode | string, portofolioId: string, bosId: string): Promise<SpinalNode[]>;
    getBosAuthStructure(profile: string | SpinalNode, portofolioId: string): Promise<IBosAuthRes[]>;
    getAllAuthorizedBos(profile: string | SpinalNode): Promise<SpinalNode[]>;
    profileHasAccessToApi(appProfile: string | SpinalNode, apiId: SpinalNode): Promise<SpinalNode>;
    private _authorizeIPortofolioAuth;
    private _unauthorizeIPortofolioAuth;
    private _authorizeIBosAuth;
    private _unauthorizeIBosAuth;
    _getAppProfileNodeGraph(profileId: string): Promise<SpinalGraph | void>;
    private _findChildInContext;
    private _createAppProfileNode;
    _getAppProfileNode(appProfileId: string): Promise<SpinalNode>;
    private _renameProfile;
}
