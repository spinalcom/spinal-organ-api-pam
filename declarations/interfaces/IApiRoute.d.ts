/**
 *  @typedef {object} ApiRoute
 *  @property {string} group - Api route group name
 *  @property {string} method - Api route method (GET,POST,PUT,...)
 *  @property {string} route - Api route (ex: /api/v1/create)
 *  @property {string} scoped - Api route scope (READ, WRITE,DELETE,...)
 *  @property {string} tag -
*/
export interface IApiRoute {
    group: string;
    method: string;
    route: string;
    scoped: string;
    tag: string;
    [key: string]: string;
}
