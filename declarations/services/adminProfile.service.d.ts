import { SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
import { IPortofolioAuth, IPortofolioAuthEdit, IPortofolioAuthRes } from '../interfaces';
export declare class AdminProfileService {
    private static instance;
    private _adminNode;
    private constructor();
    static getInstance(): AdminProfileService;
    get adminNode(): SpinalNode<any>;
    init(context: SpinalContext): Promise<SpinalNode>;
    /**
     * Adds an application node to the admin profile's "Administration" portofolio.
     * If the admin portofolio does not exist, it is created.
     * @param app The application SpinalNode to add.
     * @returns The reference node added as a child.
     */
    addAppToAdminProfil(app: SpinalNode): Promise<SpinalNode>;
    /**
     * Authorizes an admin profile to access a specified portfolio.
     *
     * This method delegates the authorization logic to the `UserProfileService`,
     * passing the current admin node and the provided portfolio authorization data.
     *
     * @param data - The portfolio authorization data containing the necessary information
     *               to determine access rights.
     * @returns A promise that resolves with the result of the authorization operation.
     */
    authorizeAdminProfileToAccessPortofolio(data: IPortofolioAuth, isCompatibleWithBosC: boolean): Promise<IPortofolioAuthRes>;
    /**
     * Removes authorization for a profile to access a portfolio from the admin profile.
     *
     * @param profileInfo - The profile information containing authorization details to be removed.
     * @returns A promise that resolves when the profile has been unauthorized from accessing the portfolio.
     */
    removeFromAdminProfile(profileInfo: IPortofolioAuthEdit, isCompatibleWithBosC: boolean): Promise<any>;
    /**
     * Synchronizes the admin profile's access to all existing portofolios.
     * For each portofolio, ensures the admin profile is authorized to access it.
     * @returns A promise resolving to an array of authorization results for each portofolio.
     */
    syncAdminProfile(isCompatibleWithBosC?: boolean): Promise<IPortofolioAuthRes[]>;
    /**
     * Retrieves the admin profile node from the specified context or from the default user profile context.
     *
     * If the admin profile node has already been retrieved and cached, it returns the cached node.
     * Otherwise, it fetches the children of the provided context (or the default context if none is provided),
     * and searches for a node matching the admin profile name and type.
     *
     * @param argContext - (Optional) The context from which to retrieve the admin profile node.
     * @returns A promise that resolves to the admin profile node if found, otherwise `undefined`.
     */
    getAdminProfile(argContext?: SpinalContext): Promise<SpinalNode>;
    /**
     * Determines whether the given profile ID corresponds to the admin profile.
     *
     * @param profileId - The ID of the profile to check.
     * @returns `true` if the provided profile ID matches the admin profile's ID; otherwise, `false`.
     */
    isAdmin(profileId: string): boolean;
    private _createAdminProfileNode;
    private _getPortofoliosStructure;
    private _createOrGetAdminPortofolio;
}
