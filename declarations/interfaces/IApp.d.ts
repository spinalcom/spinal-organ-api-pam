export interface IApp {
    name: string;
    icon: string;
    description: string;
    tags: string[];
    categoryName: string;
    groupName: string;
    hasViewer?: boolean;
    documentationLink?: string;
    packageName?: string;
    isExternalApp?: boolean;
    link?: string;
    [key: string]: any;
}
