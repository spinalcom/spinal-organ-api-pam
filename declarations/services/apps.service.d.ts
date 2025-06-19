import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApp } from "../interfaces";
export declare const AppsType: {
    readonly admin: "admin";
    readonly building: "building";
    readonly portofolio: "portofolio";
};
export declare class AppService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): AppService;
    init(graph: SpinalGraph): Promise<SpinalContext<any>>;
    /**
     * Creates a new Admin App node if it does not already exist.
     * @param appInfo - The information for the Admin App.
     * @returns The created or existing SpinalNode.
     */
    createAdminApp(appInfo: IApp): Promise<SpinalNode>;
    /**
     * Creates a new Portofolio App node if it does not already exist.
     * @param appInfo - The information for the Portofolio App.
     * @returns The created or existing SpinalNode.
     */
    createPortofolioApp(appInfo: IApp): Promise<SpinalNode>;
    /**
     * Creates a new Building App node if it does not already exist.
     * @param appInfo - The information for the Building App.
     * @returns The created or existing SpinalNode.
     */
    createBuildingApp(appInfo: IApp): Promise<SpinalNode>;
    /**
     * Retrieves all Admin App nodes.
     * @returns Promise resolving to an array of SpinalNode representing admin apps.
     */
    getAllAdminApps(): Promise<SpinalNode[]>;
    /**
     * Retrieves all Portofolio App nodes.
     * @returns Promise resolving to an array of SpinalNode representing portofolio apps.
     */
    getAllPortofolioApps(): Promise<SpinalNode[]>;
    /**
     * Retrieves all Building App nodes.
     * @returns Promise resolving to an array of SpinalNode representing building apps.
     */
    getAllBuildingApps(): Promise<SpinalNode[]>;
    /**
     * Retrieves a specific Admin App node by its ID.
     * @param appId - The ID of the Admin App.
     * @returns Promise resolving to the SpinalNode or undefined if not found.
     */
    getAdminAppById(appId: string): Promise<SpinalNode>;
    /**
     * Retrieves a specific Portofolio App node by its ID.
     * @param appId - The ID of the Portofolio App.
     * @returns Promise resolving to the SpinalNode or undefined if not found.
     */
    getPortofolioAppById(appId: string): Promise<SpinalNode>;
    /**
     * Retrieves a specific Building App node by its ID.
     * @param appId - The ID of the Building App.
     * @returns Promise resolving to the SpinalNode or undefined if not found.
     */
    getBuildingAppById(appId: string): Promise<SpinalNode>;
    /**
     * Updates an Admin App node with new information.
     * @param appId - The ID of the Admin App to update.
     * @param newInfo - The new information to update the app with.
     * @returns The updated SpinalNode or undefined if not found.
     */
    updateAdminApp(appId: string, newInfo: IApp): Promise<SpinalNode>;
    /**
     * Updates a Portofolio App node with new information.
     * @param appId - The ID of the Portofolio App to update.
     * @param newInfo - The new information to update the app with.
     * @returns The updated SpinalNode or undefined if not found.
     */
    updatePortofolioApp(appId: string, newInfo: IApp): Promise<SpinalNode>;
    /**
     * Updates a Building App node with new information.
     * @param appId - The ID of the Building App to update.
     * @param newInfo - The new information to update the app with.
     * @returns The updated SpinalNode or undefined if not found.
     */
    updateBuildingApp(appId: string, newInfo: IApp): Promise<SpinalNode>;
    /**
     * Deletes an Admin App node by its ID.
     * If the app does not exist, it returns false.
     * @param {string} appId
     * @return {*}  {Promise<boolean>}
     * @memberof AppService
     */
    deleteAdminApp(appId: string): Promise<boolean>;
    /**
     * Deletes a Portofolio App node by its ID.
     * If the app does not exist, it returns false.
     * @param {string} appId
     * @return {*}  {Promise<boolean>}
     * @memberof AppService
     */
    deletePortofolioApp(appId: string): Promise<boolean>;
    /**
     * Deletes a Building App node by its ID.
     * If the app does not exist, it returns false.
     * @param {string} appId
     * @return {*}  {Promise<boolean>}
     * @memberof AppService
     */
    deleteBuildingApp(appId: string): Promise<boolean>;
    /**
     * links a portofolio app to a portfolio.
     * If the app or portfolio does not exist, it returns false.
     * If the app is already linked, it does nothing and returns true.
     * @param {string} portfolioId
     * @param {string} appId
     * @return {*}  {Promise<boolean>}
     * @memberof AppService
     */
    linkAppToPortofolio(portfolioId: string, appId: string): Promise<SpinalNode>;
    /**
     * links a building app to a building.
     * If the app or building does not exist, it returns false.
     * If the app is already linked, it does nothing and returns true.
     * @param {string} buildingId
     * @param {string} appId
     * @return {*}  {Promise<boolean>}
     * @memberof AppService
     */
    linkAppToBuilding(buildingId: string, appId: string): Promise<boolean>;
    uploadApps(appType: string, fileData: Buffer, isExcel?: boolean): Promise<SpinalNode[]>;
    private _getApplicationGroupNode;
}
