import { SpinalGraph, SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
import { IBosAuth, IPortofolioAuth, IProfile, IProfileRes, IPortofolioAuthRes, IBosAuthRes, IProfileEdit, IPortofolioAuthEdit } from '../interfaces';
export declare class UserProfileService {
    private static instance;
    context: SpinalContext;
    private adminProfile;
    private constructor();
    static getInstance(): UserProfileService;
    init(): Promise<SpinalContext>;
    createUserProfile(userProfile: IProfile): Promise<IProfileRes>;
    getUserProfile(userProfile: string | SpinalNode): Promise<IProfileRes>;
    updateUserProfile(userProfileId: string, userProfile: IProfileEdit): Promise<IProfileRes>;
    getAllUserProfile(): Promise<IProfileRes[]>;
    getAllUserProfileNodes(): Promise<SpinalNode<import("spinal-core-connectorjs").Model>[]>;
    deleteUserProfile(userProfileId: string): Promise<string>;
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
    _authorizeIPortofolioAuth(profile: SpinalNode, portofolioAuth: IPortofolioAuth): Promise<IPortofolioAuthRes>;
    _unauthorizeIPortofolioAuth(profile: SpinalNode, portofolioAuth: IPortofolioAuthEdit): Promise<any>;
    private _authorizeIBosAuth;
    private _unauthorizeIBosAuth;
    _getUserProfileNodeGraph(profileId: string): Promise<SpinalGraph | void>;
    private _findChildInContext;
    private _createUserProfileNode;
    private _getUserProfileNode;
    private _renameProfile;
}
