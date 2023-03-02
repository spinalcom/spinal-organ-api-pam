import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApplicationToken, IUserToken } from "../interfaces";
export declare class TokenService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): TokenService;
    init(): Promise<SpinalContext>;
    addUserToken(userNode: SpinalNode, token: string, playload: any): Promise<any>;
    getAdminPlayLoad(userNode: SpinalNode, secret?: string, durationInMin?: number): Promise<any>;
    addTokenToContext(token: string, data: any): Promise<SpinalNode>;
    getTokenData(token: string): Promise<any>;
    deleteToken(token: SpinalNode | string): Promise<boolean>;
    tokenIsValid(token: string): Promise<IUserToken | IApplicationToken>;
    private _generateString;
}
