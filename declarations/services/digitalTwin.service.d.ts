import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
export declare class DigitalTwinService {
    private static instance;
    private _actualDigitalTwin;
    private attrName;
    context: SpinalContext;
    private constructor();
    static getInstance(): DigitalTwinService;
    init(): Promise<SpinalContext>;
    createDigitalTwin(name: string, directoryPath?: string): Promise<SpinalNode>;
    getAllDigitalTwins(): Promise<SpinalNode[]>;
    getDigitalTwin(digitalTwinName: string, digitalTwinPath?: string): Promise<SpinalNode | void>;
    getDigitalTwinById(id: string): Promise<SpinalNode | void>;
    renameDigitalTwin(id: string, newName: string): Promise<SpinalNode | void>;
    removeDigitalTwin(digitalTwinId: string): Promise<boolean>;
    setActualDigitalTwin(digitalTwinId: string): Promise<SpinalNode | void>;
    getActualDigitalTwin(): Promise<SpinalNode>;
    removeActualDigitaTwin(): Promise<void>;
    getActualDigitalTwinGraph(): Promise<SpinalGraph | void>;
    private _getOrCreateDigitalTwin;
    private _createFile;
}
