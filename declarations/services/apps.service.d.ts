import { SpinalContext, SpinalNode } from "spinal-env-viewer-graph-service";
import { IApp } from "../interfaces";
export declare class AppService {
    private static instance;
    context: SpinalContext;
    private constructor();
    static getInstance(): AppService;
    init(): Promise<SpinalContext<any>>;
    createAppCategory(categoryName: string): Promise<SpinalNode>;
    getAppCategory(categoryIdOrName: string): Promise<SpinalNode>;
    getAllCategories(): Promise<SpinalNode[]>;
    updateAppCategory(categoryId: string, newName: string): Promise<SpinalNode>;
    deleteAppCategory(categoryId: string): Promise<string>;
    createAppGroup(categoryId: string, groupName: string): Promise<SpinalNode>;
    getAllGroupsInCategory(categoryId: string): Promise<SpinalNode[]>;
    getAppGroup(categoryIdOrName: string, groupIdOrName: string): Promise<SpinalNode>;
    updateAppGroup(categoryId: string, groupId: string, groupNewName: string): Promise<SpinalNode | void>;
    deleteAppGroup(categoryId: string, groupId: string): Promise<void>;
    createApp(categoryId: string, groupId: string, appInfo: IApp): Promise<SpinalNode>;
    getAllApps(): Promise<SpinalNode[]>;
    getAllAppsInGroup(categoryId: string, groupId: string): Promise<SpinalNode[]>;
    getAppById(appId: string): Promise<void | SpinalNode>;
    getApp(categoryId: string, groupId: string, appId: string): Promise<SpinalNode>;
    updateApp(categoryId: string, groupId: string, appId: string, newInfo: IApp): Promise<SpinalNode>;
    deleteApp(categoryId: string, groupId: string, appId: string): Promise<void>;
    private _findChildInContext;
}
