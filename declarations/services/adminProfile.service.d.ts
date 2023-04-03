import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IPortofolioAuth, IPortofolioAuthEdit, IPortofolioAuthRes } from "../interfaces";
export declare class AdminProfileService {
    private static instance;
    private _adminNode;
    private constructor();
    static getInstance(): AdminProfileService;
    get adminNode(): SpinalNode<any>;
    init(context: SpinalContext): Promise<SpinalNode>;
    addAppToProfil(app: SpinalNode): Promise<void>;
    addToAdminProfile(data: IPortofolioAuth): Promise<IPortofolioAuthRes>;
    removeFromAdminProfile(data: IPortofolioAuthEdit): Promise<any>;
    syncAdminProfile(): Promise<IPortofolioAuthRes[]>;
    getAdminProfile(argContext?: SpinalContext): Promise<SpinalNode>;
    private _createAdminProfile;
    private _getPortofoliosStructure;
    private _createOrGetAdminPortofolio;
}
