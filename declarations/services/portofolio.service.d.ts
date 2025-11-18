/// <reference types="node" />
import { SpinalContext, SpinalGraph, SpinalNode } from 'spinal-env-viewer-graph-service';
import { IEditPortofolio, IPortofolioData, IPortofolioDetails, IBuildingCreation, IBuildingDetails } from '../interfaces';
export declare class PortofolioService {
    private static instance;
    context: SpinalContext;
    constructor();
    static getInstance(): PortofolioService;
    init(graph: SpinalGraph): Promise<SpinalContext>;
    /**
     * Creates a new portfolio node with the specified name, links the provided applications and APIs to it,
     * adds the node to the context, and synchronizes the admin profile.
     *
     * @param portofolioName - The name of the portfolio to create.
     * @param appsIds - An optional array of application IDs to link to the portfolio. Defaults to an empty array.
     * @param apisIds - An optional array of API IDs to link to the portfolio. Defaults to an empty array.
     * @returns A promise that resolves to the details of the created portfolio, including the node, linked apps, empty buildings array, and linked APIs.
     */
    createPortofolio(portofolioName: string, appsIds?: string[], apisIds?: any[]): Promise<IPortofolioDetails>;
    /**
     * Renames a portfolio node with the specified new name.
     *
     * @param portfolioId - The unique identifier of the portfolio to rename.
     * @param newName - The new name to assign to the portfolio.
     * @returns A promise that resolves to `true` if the portfolio was successfully renamed,
     *          or `false` if the new name is empty or the portfolio node could not be found.
     */
    renamePortofolio(portfolioId: string, newName: string): Promise<boolean>;
    /**
     * Updates a portfolio node with new data, including renaming, linking/unlinking apps and APIs.
     *
     * @param portofolioId - The unique identifier of the portfolio to update.
     * @param newData - The new data to apply to the portfolio.
     * @returns A promise that resolves to the updated portfolio details, or undefined if the portfolio does not exist.
     */
    updatePortofolio(portofolioId: string, newData: IEditPortofolio): Promise<IPortofolioDetails>;
    /**
     * Retrieves all portfolio nodes from the context.
     *
     * @returns A promise that resolves to an array of SpinalNode instances representing all portfolios.
     */
    getAllPortofolio(): Promise<SpinalNode[]>;
    /**
     * Retrieves a portfolio node by its ID.
     *
     * @param {string} portofolioId
     * @return {*}  {Promise<SpinalNode>}
     * @memberof PortofolioService
     */
    getPortofolioNode(portofolioId: string): Promise<SpinalNode>;
    /**
     * Retrieves the details of a portfolio, including its node, linked applications, buildings, and APIs.
     *
     * @param {string | SpinalNode} portofolio - The ID or SpinalNode of the portfolio to retrieve.
     * @return {*}  {Promise<IPortofolioDetails>}
     * @memberof PortofolioService
     */
    getPortofolioDetails(portofolio: string | SpinalNode): Promise<IPortofolioDetails>;
    /**
     * Retrieves the details of all portfolios in the context.
     *
     * @returns A promise that resolves to an array of IPortofolioDetails for each portfolio.
     */
    getAllPortofoliosDetails(): Promise<IPortofolioDetails[]>;
    /**
     * Removes a portfolio and all its associated buildings from the system.
     *
     * This method accepts either a portfolio node or a portfolio identifier. It retrieves the corresponding
     * portfolio node, fetches all buildings linked to it, and deletes each building. After removing all
     * associated buildings, it removes the portfolio node from its parent context and cleans up any remaining
     * references to the node.
     *
     * @param portofolio - The portfolio to remove, specified as either a string identifier or a SpinalNode instance.
     * @returns A promise that resolves to `true` if the portfolio and its references were successfully removed,
     *          or `false` if an error occurred during the process.
     */
    removePortofolio(portofolio: string | SpinalNode): Promise<boolean>;
    /**
     * Links a single application to a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param applicationId - The ID of the application to link.
     * @returns A promise that resolves to the linked SpinalNode instance, or undefined if not found or already linked.
     */
    linkAppToPortofolio(portofolio: string | SpinalNode, applicationId: string): Promise<SpinalNode>;
    /**
     * Links multiple applications to a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param applicationIds - An array of application IDs to link to the portfolio.
     * @returns A promise that resolves to an array of linked SpinalNode instances.
     */
    linkSeveralAppsToPortofolio(portofolio: string | SpinalNode, applicationIds: string[]): Promise<SpinalNode[]>;
    /**
     * Retrieves the list of application nodes associated with a given portfolio.
     *
     * @param portofolio - The portfolio identifier or a SpinalNode instance representing the portfolio.
     * @returns A promise that resolves to an array of SpinalNode instances representing the applications under the specified portfolio.
     *
     * If the provided portfolio cannot be resolved to a SpinalNode, an empty array is returned.
     */
    getPortofolioApps(portofolio: string | SpinalNode): Promise<SpinalNode[]>;
    /**
     * Retrieves an application node from a given portfolio by its application ID.
     *
     * @param portofolio - The portfolio to search within, either as a string identifier or a `SpinalNode` instance.
     * @param appId - The unique identifier of the application to retrieve.
     * @returns A promise that resolves to the `SpinalNode` representing the application if found, or `undefined` if not found.
     */
    getAppFromPortofolio(portofolio: string | SpinalNode, appId: string): Promise<SpinalNode>;
    /**
     * Removes a single application from a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param applicationId - The ID of the application to remove.
     * @returns A promise that resolves to the application ID if successfully removed, or undefined if not found.
     */
    removeAppFromPortofolio(portofolio: string | SpinalNode, applicationId: string): Promise<string>;
    /**
     * Removes multiple applications from a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param applicationIds - An array or single application ID to remove from the portfolio.
     * @returns A promise that resolves to an array of removed application IDs.
     */
    removeSeveralAppsFromPortofolio(portofolio: string | SpinalNode, applicationIds: string | string[]): Promise<string[]>;
    /**
     * Checks if a given portfolio contains an application with the specified appId.
     *
     * @param portofolio - The portfolio to check, either as a string identifier or a SpinalNode instance.
     * @param appId - The unique identifier of the application to search for.
     * @returns A promise that resolves to the SpinalNode representing the application if found, or void if not found.
     */
    portofolioHasApp(portofolio: string | SpinalNode, appId: string): Promise<SpinalNode | void>;
    /**
     * Links a single API to a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param apiId - The ID of the API to link.
     * @returns A promise that resolves to the linked SpinalNode instance, or undefined if not found or already linked.
     */
    linkApiToPortofolio(portofolio: string | SpinalNode, apiId: string): Promise<SpinalNode>;
    /**
     * Links multiple APIs to a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param apisIds - An array or single API ID to link to the portfolio.
     * @returns A promise that resolves to an array of linked SpinalNode instances.
     */
    linkSeveralApisToPortofolio(portofolio: string | SpinalNode, apisIds: string | string[]): Promise<SpinalNode[]>;
    /**
     * Retrieves the list of API nodes associated with a given portfolio.
     *
     * @param portofolio - The portfolio identifier or a SpinalNode instance representing the portfolio.
     * @returns A promise that resolves to an array of SpinalNode objects representing the APIs linked to the portfolio.
     *
     * If the provided portfolio cannot be resolved to a valid SpinalNode, an empty array is returned.
     */
    getPortofolioApis(portofolio: string | SpinalNode): Promise<SpinalNode[]>;
    /**
     * Retrieves a specific API node linked to a given portfolio by its API ID.
     *
     * @param portofolio - The portfolio identifier or a SpinalNode instance representing the portfolio.
     * @param apiId - The unique identifier of the API to retrieve.
     * @returns A promise that resolves to the SpinalNode representing the API if found, or `undefined` if not found.
     */
    getApiFromPortofolio(portofolio: string | SpinalNode, apiId: string): Promise<SpinalNode>;
    /**
     * Removes an API node from the specified portfolio.
     *
     * @param portofolio - The portfolio identifier or SpinalNode instance from which the API should be removed.
     * @param apiId - The unique identifier of the API to remove from the portfolio.
     * @returns A promise that resolves to the removed API's ID if successful.
     * @throws Will throw an error if the portfolio node cannot be found.
     */
    removeApiFromPortofolio(portofolio: string | SpinalNode, apiId: string): Promise<string>;
    /**
     * Removes multiple APIs from a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param apisIds - An array or single API ID to remove from the portfolio.
     * @returns A promise that resolves to an array of removed API IDs.
     */
    removeSeveralApisFromPortofolio(portofolio: string | SpinalNode, apisIds: string | string[]): Promise<string[]>;
    /**
     * Checks if a given portfolio contains an API with the specified ID.
     *
     * @param portofolio - The portfolio to check, either as a string identifier or a SpinalNode instance.
     * @param apiId - The unique identifier of the API to search for within the portfolio.
     * @returns A promise that resolves to the SpinalNode representing the API if found, or void if not found.
     */
    portofolioHasApi(portofolio: string | SpinalNode, apiId: string): Promise<SpinalNode | void>;
    uploadSwaggerFile(buffer: Buffer): Promise<any[]>;
    /**
     * Links a newly created building to a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param buildingInfo - The information required to create the building.
     * @returns A promise that resolves to the details of the created building.
     * @throws Will throw an error if the portfolio node cannot be found.
     */
    linkBuildingToPortofolio(portofolio: string | SpinalNode, buildingInfo: IBuildingCreation): Promise<IBuildingDetails>;
    /**
     * Retrieves the list of building nodes associated with a given portfolio.
     *
     * @param portofolio - The portfolio identifier or a SpinalNode instance representing the portfolio.
     * @returns A promise that resolves to an array of SpinalNode instances representing the buildings under the specified portfolio.
     * @throws {Error} If the portfolio cannot be found.
     */
    getPortofolioBuildings(portofolio: string | SpinalNode): Promise<SpinalNode[]>;
    /**
     * Removes a single building from a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param buildingId - The ID of the building to remove.
     * @param syncAdmin - Whether to synchronize the admin profile after removal (default: true).
     * @returns A promise that resolves to the building ID if successfully removed, or undefined if not found.
     */
    removeBuildingFromPortofolio(portofolio: string | SpinalNode, buildingId: string, syncAdmin?: boolean): Promise<string>;
    /**
     * Removes multiple buildings from a portfolio node.
     *
     * @param portofolio - The portfolio node or its ID.
     * @param buildingId - An array or single building ID to remove from the portfolio.
     * @returns A promise that resolves to an array of removed building IDs.
     */
    removeSeveralBuildingsFromPortofolio(portofolio: string | SpinalNode, buildingId: string | string[]): Promise<string[]>;
    /**
     * Retrieves a building node from a given portfolio by its building ID.
     *
     * @param portofolio - The portfolio to search within, either as a string identifier or a SpinalNode instance.
     * @param buildingId - The unique identifier of the building to retrieve.
     * @returns A promise that resolves to the matching SpinalNode if found, or void if not found.
     */
    getBuildingFromPortofolio(portofolio: string | SpinalNode, buildingId: string): Promise<SpinalNode | void>;
    _formatDetails(data: IPortofolioDetails): IPortofolioData;
}
