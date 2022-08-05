export declare enum HTTP_METHODS {
    POST = "POST",
    GET = "GET",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}
export interface IRole {
    id?: string;
    name: string;
    methods: HTTP_METHODS[];
    [key: string]: any;
}
