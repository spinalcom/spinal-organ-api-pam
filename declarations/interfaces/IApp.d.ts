export interface IAppTags {
    name: string;
}
export interface IApp {
    name: string;
    icon: string;
    description: string;
    tags: IAppTags[];
    categoryName: string;
    groupName: string;
    [key: string]: any;
}
export interface IEditApp {
    name?: string;
    icon?: string;
    description?: string;
    tags?: IAppTags[];
    categoryName?: string;
    groupName?: string;
}
