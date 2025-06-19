import * as express from 'express';
export declare function useProxyToHub(app: express.Express): void;
export declare function useViewMiddleWare(app: express.Express): void;
export declare function initSwagger(app: express.Express): void;
export declare function useApiMiddleWare(app: express.Express): void;
export declare function errorHandler(err: unknown, req: express.Request, res: express.Response, next: express.NextFunction): express.Response | void;
