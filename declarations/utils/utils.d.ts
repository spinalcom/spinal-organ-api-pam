import { SpinalNode } from "spinal-env-viewer-graph-service";
export declare function removeNodeReferences(node: SpinalNode, referenceNode?: SpinalNode): Promise<boolean>;
export declare function removeRelationFromReference(parentNode: SpinalNode, childNode: SpinalNode, relationName: string, relationType: string): Promise<void>;
