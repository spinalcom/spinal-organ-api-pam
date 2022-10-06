import { SpinalNode } from "spinal-env-viewer-graph-service";
export default class AuthorizationService {
    private static instance;
    private constructor();
    static getInstance(): AuthorizationService;
    profileHasAccess(profile: SpinalNode, node: SpinalNode, elementType: string): Promise<boolean>;
    removePortofolioReferences(profile: SpinalNode, portofolioId: string): Promise<void>;
    authorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioId: string): Promise<SpinalNode>;
    unauthorizeProfileToAccessPortofolio(profile: SpinalNode, portofolioId: string): Promise<void>;
    authorizeProfileToAccessPortofolioApp(profile: SpinalNode, portofolioId: string, appIds: string | string[], portofolioRef?: SpinalNode): Promise<SpinalNode[]>;
    unauthorizeProfileToAccessPortofolioApp(profile: SpinalNode, portofolioId: string, appIds: string | string[]): Promise<SpinalNode[]>;
    getAuthorizedPortofolioFromProfile(profile: SpinalNode): Promise<SpinalNode[]>;
    getAuthorizedPortofolioAppFromProfile(profile: SpinalNode, portofolioId: string): Promise<SpinalNode[]>;
    authorizeProfileToAccessApisRoutes(profile: SpinalNode, apiRoutesIds: string | string[]): Promise<SpinalNode[]>;
    unauthorizeProfileToAccessApisRoutes(profile: SpinalNode, apiRoutesIds: string | string[]): Promise<string[]>;
    getAuthorizedApisRoutesFromProfile(profile: SpinalNode): Promise<SpinalNode[]>;
    authorizeProfileToAccessBos(profile: SpinalNode, BosId: string): Promise<SpinalNode>;
    unauthorizeProfileToAccessBos(profile: SpinalNode, BosId: string): Promise<void>;
    authorizeProfileToAccessBosApp(profile: SpinalNode, BosId: string, appIds: string | string[], BosRef?: SpinalNode): Promise<SpinalNode[]>;
    unauthorizeProfileToAccessBosApp(profile: SpinalNode, BosId: string, appIds: string | string[]): Promise<SpinalNode[]>;
    getAuthorizedBosFromProfile(profile: SpinalNode): Promise<SpinalNode[]>;
    getAuthorizedBosAppFromProfile(profile: SpinalNode, bosId: string): Promise<SpinalNode[]>;
    private _getAuthorizedPortofolioContext;
    private _getAuthorizedApisRoutesContext;
    private _getAuthorizedBosContext;
    private _addApiToContext;
    private _removeApiFromContext;
    private _getOrCreateContext;
    private _getProfileGraph;
    private _getReference;
    private _createNodeReference;
    private _getContextByType;
    private _checkPortofolioValidity;
    private _checkBosValidity;
}
declare const authorizationInstance: AuthorizationService;
export { authorizationInstance, AuthorizationService };
