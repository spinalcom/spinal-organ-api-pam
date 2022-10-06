import { Controller } from "tsoa";
export declare class DigitaltwinController extends Controller {
    constructor();
    createDigitalTwin(data: {
        name: string;
        folderPath: string;
    }): Promise<string | {
        message: any;
    }>;
}
declare const _default: DigitaltwinController;
export default _default;
