import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { IEditBuilding, IBuildingCreation, IBuildingDetails } from "../interfaces";
export declare class BuildingService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): BuildingService;
    init(graph: SpinalGraph): Promise<SpinalContext>;
    /**
     * Creates a new building node with the provided building information, including geolocation coord, applications, and APIs.
     * If the location is not specified, it attempts to retrieve the geographical position based on the address.
     * Links the specified applications and APIs to the newly created building node, and adds the node to the context.
     *
     * @param buildingInfo - The information required to create the building, including address, location, appIds, and apiIds.
     * @returns A promise that resolves to the details of the created building, including the node, linked applications, and APIs.
     */
    createBuilding(buildingInfo: IBuildingCreation): Promise<IBuildingDetails>;
    /**
     * Retrieves all buildings nodes from the context.
     *
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof BuildingService
     */
    getAllBuildings(): Promise<SpinalNode[]>;
    /**
     * gets a building node by its ID.
     *
     * @param {string} id
     * @return {*}  {Promise<SpinalNode>}
     * @memberof BuildingService
     */
    getBuildingById(id: string): Promise<SpinalNode>;
    /**
     * Deletes a building node by its ID.
     *
     * @param {string} id
     * @return {*}  {Promise<boolean>}
     * @memberof BuildingService
     */
    deleteBuildingById(id: string): Promise<boolean>;
    /**
     * Retrieves all buildings and their associated applications.
     *
     * @return {*}  {Promise<{ buildingNode: SpinalNode, apps: SpinalNode[] }[]>}
     * @memberof BuildingService
     */
    getAllBuildingsAndTheirApps(): Promise<{
        buildingNode: SpinalNode;
        apps: SpinalNode[];
    }[]>;
    /**
     * Links a building to a portfolio.
     *
     * @param {string} portfolioId
     * @param {IBuildingCreation} building
     * @return {*}  {Promise<IBuildingDetails>}
     * @memberof BuildingService
     */
    linkBuildingToPortofolio(portfolioId: string, building: IBuildingCreation): Promise<IBuildingDetails>;
    /**
     * Retrieves a building from a portfolio by its ID.
     *
     * @param {string} portofolioId
     * @param {string} buildingId
     * @return {*}  {(Promise<void | SpinalNode>)}
     * @memberof BuildingService
     */
    getBuildingFromPortofolio(portofolioId: string, buildingId: string): Promise<void | SpinalNode>;
    /**
     * Retrieves all buildings from a portfolio by its ID.
     *
     * @param {string} portfolioId
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof BuildingService
     */
    getAllBuildingsFromPortofolio(portfolioId: string): Promise<SpinalNode[]>;
    /**
     * Updates a building's information and its linked applications and APIs.
     *
     * @param {string} buildingId - The ID of the building to update.
     * @param {IEditBuilding} newData - The new data to update the building with.
     * @return {*}  {Promise<IBuildingDetails>} - The updated building details.
     * @memberof BuildingService
     */
    updateBuilding(buildingId: string, buildingNewData: IEditBuilding): Promise<IBuildingDetails>;
    /**
     * Retrieves the structure of a building, including its applications and APIs.
     *
     * @param {(string | SpinalNode)} building
     * @return {*}  {Promise<IBuildingDetails>}
     * @memberof BuildingService
     */
    getBuildingStructure(building: string | SpinalNode): Promise<IBuildingDetails>;
    /**
     * Links applications to a building.
     *
     * @param {(string | SpinalNode)} building
     * @param {(string | string[])} applicationIds
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof BuildingService
     */
    linkApplicationToBuilding(building: string | SpinalNode, applicationIds: string | string[]): Promise<SpinalNode[]>;
    /**
     * Retrieves all applications linked to a building.
     *
     * @param {(string | SpinalNode)} building
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof BuildingService
     */
    getAppsLinkedToBuilding(building: string | SpinalNode): Promise<SpinalNode[]>;
    /**
     * Retrieves a specific application linked to a building by its ID.
     *
     * @param {(string | SpinalNode)} building
     * @param {string} appId
     * @return {*}  {Promise<SpinalNode>}
     * @memberof BuildingService
     */
    getAppFromBuilding(building: string | SpinalNode, appId: string): Promise<SpinalNode>;
    /**
     * Removes applications from a building.
     *
     * @param {(string | SpinalNode)} building
     * @param {(string | string[])} applicationId
     * @return {*}  {Promise<string[]>}
     * @memberof BuildingService
     */
    removeAppFromBuilding(building: string | SpinalNode, applicationId: string | string[]): Promise<string[]>;
    /**
     * Checks if a building has a specific application linked to it.
     *
     * @param {(string | SpinalNode)} building
     * @param {string} appId
     * @return {*}  {Promise<boolean>}
     * @memberof BuildingService
     */
    buildingHasApp(building: string | SpinalNode, appId: string): Promise<boolean>;
    /**
     * Links APIs to a building.
     *
     * @param {(string | SpinalNode)} building
     * @param {(string | string[])} apisIds
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof BuildingService
     */
    linkApiToBuilding(building: string | SpinalNode, apisIds: string | string[]): Promise<SpinalNode[]>;
    /**
     * Removes APIs from a building.
     *
     * @param {(string | SpinalNode)} building
     * @param {(string | string[])} apisIds
     * @return {*}  {Promise<string[]>}
     * @memberof BuildingService
     */
    removeApisFromBuilding(building: string | SpinalNode, apisIds: string | string[]): Promise<string[]>;
    /**
     * Retrieves all APIs linked to a building.
     *
     * @param {(string | SpinalNode)} building
     * @return {*}  {Promise<SpinalNode[]>}
     * @memberof BuildingService
     */
    getApisFromBuilding(building: string | SpinalNode): Promise<SpinalNode[]>;
    /**
     * Retrieves a specific API linked to a building by its ID.
     *
     * @param {(string | SpinalNode)} building
     * @param {string} apiId
     * @return {*}  {Promise<SpinalNode>}
     * @memberof BuildingService
     */
    getApiFromBuilding(building: string | SpinalNode, apiId: string): Promise<SpinalNode>;
    /**
     * Checks if a building has a specific API linked to it.
     *
     * @param {(string | SpinalNode)} building
     * @param {string} apiId
     * @return {*}  {Promise<boolean>}
     * @memberof BuildingService
     */
    buildingHasApi(building: string | SpinalNode, apiId: string): Promise<boolean>;
    /**
     * Uploads a Swagger file to create routes for a building.
     *
     * @param {Buffer} buffer
     * @return {*}  {Promise<any[]>}
     * @memberof BuildingService
     */
    uploadSwaggerFile(buffer: Buffer): Promise<any[]>;
    private _unlinkUnauthorizedAppsAndApis;
    private _linkNewAppsAndApis;
    private _filterApps;
    private _filterApis;
}
