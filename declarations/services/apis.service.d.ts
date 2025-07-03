/// <reference types="node" />
import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApiRoute } from "../interfaces";
/**
 * Service for managing API routes in the SpinalCom system.
 * Handles CRUD operations for API routes, Swagger file uploads, and context/group management.
 *
 * The `parentType` parameter can be either `BUILDING_API_GROUP_TYPE` ("BuildingApis") or `PORTOFOLIO_API_GROUP_TYPE` ("PortofolioApis").
 */
export declare class APIService {
    private static instance;
    context: SpinalContext;
    private constructor();
    /**
     * Returns the singleton instance of APIService.
     */
    static getInstance(): APIService;
    /**
     * Initializes the API routes context in the given graph.
     * Creates the context if it does not exist.
     * @param graph SpinalGraph instance
     */
    init(graph: SpinalGraph): Promise<SpinalContext>;
    /**
     * Creates a new API route node under the specified group type ("BuildingApis" or "PortofolioApis").
     * If the route already exists, returns the existing node.
     * @param routeInfo Route information
     * @param routeGroupType  group type ("BuildingApis" or "PortofolioApis")
     */
    createApiRoute(routeInfo: IApiRoute, routeGroupType: string): Promise<SpinalNode>;
    /**
     * Updates an existing API route node with new values.
     * @param routeId node Id of the route node
     * @param newValue New route data
     * @param routeGroupType  group type ("BuildingApis" or "PortofolioApis")
     */
    updateApiRoute(routeId: string, routeNewValue: IApiRoute, routeGroupType: string): Promise<SpinalNode>;
    /**
     * Retrieves an API route node by its ID and group type.
     * @param routeId Route node ID
     * @param routeGroupType group type ("BuildingApis" or "PortofolioApis")
     */
    getApiRouteById(routeId: string, routeGroupType: string): Promise<void | SpinalNode>;
    /**
     * Retrieves an API route node by its route and method.
     * @param apiRoute Route information
     * @param routeGroupType Parent group type ("BuildingApis" or "PortofolioApis")
     */
    getApiRouteByRoute(apiRoute: IApiRoute, routeGroupType: string): Promise<void | SpinalNode>;
    /**
     * Retrieves all API route nodes under the specified parent type group.
     * @param routeGroupType group type ("BuildingApis" or "PortofolioApis")
     */
    getAllApiRoute(routeGroupType: string): Promise<SpinalNode[]>;
    /**
     * Deletes an API route node by its ID and group type.
     * @param routeId Route node ID
     * @param routeGroupType group type ("BuildingApis" or "PortofolioApis")
     */
    deleteApiRoute(routeId: string, routeGroupType: string): Promise<string>;
    /**
     * Uploads and parses a Swagger file, creating API route nodes for each route defined.
     * @param buffer Swagger file buffer
     * @param routeGroupType Parent group type ("BuildingApis" or "PortofolioApis")
     */
    createRoutesFromSwaggerFile(buffer: Buffer, routeGroupType: any): Promise<SpinalNode[]>;
    /**
     * Gets or creates the API routes group node for the given type.
     * @param type Group type ("BuildingApis" or "PortofolioApis")
     */
    private _getOrCreateRoutesGroup;
    /**
     * Formats a Swagger file into an array of IApiRoute objects.
     * @param swaggerFile Swagger file object
     */
    private _formatSwaggerFile;
    /**
     * Gets the HTTP method from a Swagger path object.
     * @param path Swagger path object
     */
    private _getRequestMethod;
    /**
     * Gets the first tag from a Swagger path data object.
     * @param item Swagger path data
     */
    private _getRequestTags;
    /**
     * Gets the OAuth scope from a Swagger path data object.
     * @param item Swagger path data
     */
    private _getRequestScope;
    /**
     * Reads and parses a buffer as a Swagger file object.
     * @param buffer Buffer containing Swagger JSON
     */
    private _readBuffer;
    /**
     * Formats a route string into a regular expression for matching.
     * @param route Route string
     */
    private _formatRouteAsRegexp;
}
