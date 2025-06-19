import { SpinalContext, SpinalGraph } from "spinal-model-graph";
import { IPamCredential, IAdminCredential } from "../interfaces";
export declare function getOrCreateContext(graph: SpinalGraph, contextName: string, contextType: string): Promise<SpinalContext>;
export declare function getRequestBody(update: boolean, bosCredential: IPamCredential, adminCredential: IAdminCredential): Promise<string>;
