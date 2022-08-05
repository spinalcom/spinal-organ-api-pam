export interface IAppTags {
    name: string;
}
export interface IApp {
    name?: string;
    icon: string;
    description: string;
    tags: IAppTags[];
    categoryId: string;
    groupId: string;
    [key: string]: any;
}
