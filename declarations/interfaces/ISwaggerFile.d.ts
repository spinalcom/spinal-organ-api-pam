export interface ISwaggerPathData {
    tags: string[];
    security: {
        OauthSecurity: string[];
    }[];
    [key: string]: any;
}
export interface ISwaggerPath {
    [key: string]: ISwaggerPathData;
}
export interface ISwaggerFile {
    paths?: ISwaggerPath[];
    [key: string]: any;
}
