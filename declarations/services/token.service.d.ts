import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApplicationToken, IPamCredential, IUserToken } from "../interfaces";
export declare class TokenService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): TokenService;
    init(): Promise<SpinalContext>;
    purgeToken(): Promise<(IUserToken | IApplicationToken)[]>;
    addUserToken(userNode: SpinalNode, token: string, playload: any): Promise<any>;
    getAdminPlayLoad(userNode: SpinalNode, secret?: string, durationInMin?: number): Promise<any>;
    addTokenToContext(token: string, data: any): Promise<SpinalNode>;
    getTokenData(token: string): Promise<any>;
    deleteToken(token: SpinalNode | string): Promise<boolean>;
    tokenIsValid(token: string, deleteIfExpired?: boolean): Promise<IUserToken | IApplicationToken>;
    getProfileIdByToken(token: string): Promise<string>;
    formatAndSaveOrganAuthToken(apiResponseData: any, adminCredential: IPamCredential, actor?: "user" | "app" | "code"): Promise<any>;
    private _generateString;
    private _getAllTokens;
    private _scheduleTokenPurge;
    private _getProfileInfo;
    private _getConnexionInfo;
    private _getInfo;
    private _getActor;
}
