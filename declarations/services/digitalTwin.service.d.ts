import { SpinalContext, SpinalGraph } from "spinal-env-viewer-graph-service";
export declare class DigitalTwinService {
    private static instance;
    private _actualDigitalTwin;
    private attrName;
    context: SpinalContext;
    private connectSession;
    private constructor();
    static getInstance(): DigitalTwinService;
    /**
     * Set session to connect to the digital twin.
     * @param {spinal.FileSystem} session
     * @memberof DigitalTwinService
     */
    setConnectSession(session: spinal.FileSystem): void;
    /**
     * Creates or retrieves a Digital Twin graph.
     * If the graph does not exist, it will be created in the specified directory.
     * Also ensures the Portofolio context is added to the graph if not already present.
     *
     * @param {string} name - The name of the digital twin.
     * @param {string} [directoryPath="/__users__/admin/PAM DigitalTwin"] - The directory path where the digital twin is stored.
     * @returns {Promise<SpinalGraph>} - The created or retrieved SpinalGraph instance.
     */
    initDigitalTwin(name: string, directoryPath?: string): Promise<SpinalGraph>;
    private _getOrCreateDigitalTwin;
    private _createFile;
}
