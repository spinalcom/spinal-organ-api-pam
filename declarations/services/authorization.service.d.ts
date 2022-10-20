import { SpinalNode } from "spinal-env-viewer-graph-service";
export default class AuthorizationService {
    private static instance;
    private constructor();
    static getInstance(): AuthorizationService;
    profileHasAccess(profile: SpinalNode, node: SpinalNode): Promise<boolean>;
    authorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioId: string): Promise<SpinalNode>;
    authorizeProfileToAccessPortofolioApp(profile: SpinalNode, portofolioId: string, appIds: string | string[]): Promise<SpinalNode[]>;
    unauthorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioId: string): Promise<boolean>;
    unauthorizeProfileToAccessPortofolioApp(profile: SpinalNode, portofolioId: string, appIds: string | string[]): Promise<SpinalNode[]>;
    getAuthorizedPortofolioFromProfile(profile: SpinalNode): Promise<SpinalNode[]>;
    getAuthorizedPortofolioAppFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]>;
    authorizeProfileToAccessBos(profile: SpinalNode, portofolioId: string, BosId: string): Promise<SpinalNode>;
    authorizeProfileToAccessBosApp(profile: SpinalNode, portofolioId: string, BosId: string, appIds: string | string[]): Promise<SpinalNode[]>;
    unauthorizeProfileToAccessBos(profile: SpinalNode, portofolioId: string, BosId: string): Promise<boolean>;
    unauthorizeProfileToAccessBosApp(profile: SpinalNode, portofolioId: string, BosId: string, appIds: string | string[]): Promise<SpinalNode[]>;
    getAuthorizedBosFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]>;
    getAuthorizedBosAppFromProfile(profile: SpinalNode, portofolioId: string, BosId: string): Promise<SpinalNode[]>;
    authorizeProfileToAccessPortofolioApisRoutes(profile: SpinalNode, portofolioId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]>;
    authorizeProfileToAccessBosApisRoutes(profile: SpinalNode, portofolioId: string, bosId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]>;
    unauthorizeProfileToAccessPortofolioApisRoutes(profile: SpinalNode, portofolioId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]>;
    unauthorizeProfileToAccessBosApisRoutes(profile: SpinalNode, portofolioId: string, bosId: string, apiRoutesIds: string | string[]): Promise<SpinalNode[]>;
    getAuthorizedApisRoutesFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]>;
    getAuthorizedBosApisRoutesFromProfile(profile: SpinalNode, portofolioId: string, BosId: string): Promise<SpinalNode[]>;
    private _getRefTree;
    private _getAuthorizedPortofolioContext;
    private _getAuthorizedApisRoutesContext;
    private _getAuthorizedBosContext;
    private _getOrCreateContext;
    private _getProfileGraph;
    private _getReference;
    private _getRealNode;
    private _createNodeReference;
    private _addRefToNode;
    private _getContextByType;
    private _checkPortofolioValidity;
    private _checkBosValidity;
}
declare const authorizationInstance: AuthorizationService;
export { authorizationInstance, AuthorizationService };
