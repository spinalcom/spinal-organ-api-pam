import { SpinalContext } from "spinal-env-viewer-graph-service";
import { IAppCredential, IApplicationToken, IOAuth2Credential } from "../interfaces";
export declare class AppListService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): AppListService;
    init(): Promise<SpinalContext>;
    authenticateApplication(application: IAppCredential | IOAuth2Credential): Promise<{
        code: number;
        data: string | IApplicationToken;
    }>;
    private _addUserToContext;
    private _getProfileInfo;
    private _getApplicationInfo;
    private _getAuthPlateformInfo;
}
