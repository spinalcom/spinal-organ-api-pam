import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApplicationToken, IUserToken } from "../interfaces";
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
    verifyToken(token: string, actor?: "user" | "app"): Promise<any>;
    private _generateString;
    private _getAllTokens;
    private _scheduleTokenPurge;
}
