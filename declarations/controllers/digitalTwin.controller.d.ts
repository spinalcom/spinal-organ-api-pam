import * as express from "express";
import { Controller } from "tsoa";
export declare class DigitaltwinController extends Controller {
    constructor();
    createDigitalTwin(req: express.Request, data: {
        name: string;
        folderPath: string;
    }): Promise<string | {
        message: any;
    }>;
}
declare const _default: DigitaltwinController;
export default _default;
