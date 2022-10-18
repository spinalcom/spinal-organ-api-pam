export interface IApp {
    name: string;
    icon: string;
    description: string;
    tags: string[];
    categoryName: string;
    groupName: string;
    hasViewer?: boolean;
    packageName?: string;
    [key: string]: any;
}
export interface IEditApp {
    name?: string;
    icon?: string;
    description?: string;
    tags?: string[];
    categoryName?: string;
    groupName?: string;
    [key: string]: any;
}
