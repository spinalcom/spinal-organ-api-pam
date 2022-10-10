import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
export declare class TokenService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): TokenService;
    init(): Promise<SpinalContext>;
    addUserToken(userNode: SpinalNode, secret?: string, durationInMin?: number): Promise<any>;
    addTokenToContext(token: string, data: any): Promise<SpinalNode>;
    getTokenData(token: string): Promise<any>;
    deleteToken(token: SpinalNode | string): Promise<boolean>;
    private _generateString;
}
