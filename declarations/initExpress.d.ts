/// <reference types="node" />
import * as express from 'express';
export default function initExpress(): {
    server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    app: import("express-serve-static-core").Express;
};
export declare function authorizeRequest(req: express.Request, res: express.Response, next: express.NextFunction): void | express.Response<any, Record<string, any>>;
