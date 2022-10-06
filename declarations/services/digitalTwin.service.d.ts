import { SpinalContext, SpinalGraph } from "spinal-env-viewer-graph-service";
export declare class DigitalTwinService {
    private static instance;
    private _actualDigitalTwin;
    private attrName;
    context: SpinalContext;
    private constructor();
    static getInstance(): DigitalTwinService;
    createDigitalTwin(name: string, directoryPath?: string): Promise<SpinalGraph>;
    private _getOrCreateDigitalTwin;
    private _createFile;
}
