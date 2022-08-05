import * as express from "express";
export declare class DigitaltwinController {
    private static instance;
    private constructor();
    static getInstance(): DigitaltwinController;
    createDigitalTwin(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getAllDigitalTwins(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getDigitalTwin(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    renameDigitalTwin(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    removeDigitalTwin(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    setActualDigitalTwin(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    getActualDigitalTwin(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
    removeActualDigitaTwin(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
}
declare const _default: DigitaltwinController;
export default _default;
