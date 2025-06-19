/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { Lst, Ptr } from "spinal-core-connectorjs_type";
import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-env-viewer-graph-service";
import { AUTHORIZED_API_CONTEXT_NAME, AUTHORIZED_API_CONTEXT_TYPE, AUTHORIZED_BOS_CONTEXT_NAME, AUTHORIZED_BOS_CONTEXT_TYPE, AUTHORIZED_PORTOFOLIO_CONTEXT_NAME, AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE } from "../constant";

export async function getOriginalNodeFromReference(referenceNode: SpinalNode): Promise<SpinalNode> {
    const nodeElement = await referenceNode.getElement(true);
    if (nodeElement) return nodeElement;
}

export async function getNodeReferences(originalNode: SpinalNode): Promise<SpinalNode[]> {
    if (!originalNode.info?.references || !(originalNode.info.references instanceof spinal.Ptr)) return Promise.resolve([]);

    return new Promise((resolve, reject) => {
        originalNode.info.references.load((references) => {
            return resolve(converLstToJsArray(references));
        });
    });
}

export async function removeNodeReferences(originalNode: SpinalNode): Promise<SpinalNode[]> {
    const references = await getNodeReferences(originalNode);
    if (!references || references.length === 0) return Promise.resolve([]);

    const promises = references.map((ref) => removeReferenceNode(ref));

    return Promise.all(promises);
}

export async function getNodeReferencesAsSpinalLst(originalNode: SpinalNode): Promise<SpinalNode[]> {
    if (!originalNode.info?.references || !(originalNode.info.references instanceof spinal.Ptr)) return Promise.resolve([]);

    return new Promise((resolve, reject) => {
        originalNode.info.references.load((references) => {
            return resolve(references);
        });
    });
}

export async function getReferenceFromOriginalNode(node: SpinalNode, referenceId: string): Promise<SpinalNode | null> {
    const references = await getNodeReferences(node);
    return references.find((ref) => ref.getId().get() === referenceId) || null;
}

export async function referenceIsMatchingToNode(referenceNode: SpinalNode, originalNodeId: string): Promise<boolean> {
    if (referenceNode.info?.originalId) return referenceNode.info.originalId.get() === originalNodeId;

    const originalNode = await getOriginalNodeFromReference(referenceNode);
    if (!originalNode) return false;

    return originalNode.getId().get() === originalNodeId;
}


export async function findNodeReferenceInProfileTree(profileContext: SpinalContext, startNode: SpinalNode, originalNodeId: string): Promise<SpinalNode> {
    const found = await startNode.findInContextAsyncPredicate(profileContext, (async (node, stop) => {
        const isReference = await referenceIsMatchingToNode(node, originalNodeId)
        if (isReference) {
            stop();
            return true;
        }
        return false;
    }))

    if (!found || found.length === 0) return null;
    return found[0];
}

export async function createNodeReference(originalNode: SpinalNode): Promise<SpinalNode> {
    const referenceNode = new SpinalNode(originalNode.getName().get(), originalNode.getType().get(), originalNode);
    referenceNode.info.name.set(originalNode.info.name); // use the same model as the original node, it will rename itself when the original node is renamed

    await _linkReferenceToOriginalNode(originalNode, referenceNode);
    return referenceNode;
}

export async function removeReferenceNode(referenceNode: SpinalNode): Promise<SpinalNode> {
    await removeReferenceFromOriginalNode(referenceNode);
    await referenceNode.removeFromGraph();
    return referenceNode;
}


export async function removeReferenceFromOriginalNode(referenceNode: SpinalNode): Promise<SpinalNode> {
    const originalNode = await getOriginalNodeFromReference(referenceNode);
    if (!originalNode) return;
    const references = await getNodeReferencesAsSpinalLst(originalNode) || [];

    for (let i = 0; i < references.length; i++) {
        if (references[i].getId().get() === referenceNode.getId().get()) {
            references.splice(i, 1);
            break;
        }
    }

    return referenceNode;
}

async function findReferenceNodeInReferences(references: SpinalNode[], originalNodeId: string): Promise<SpinalNode | null> {
    for (const reference of references) {
        const isMatch = await referenceIsMatchingToNode(reference, originalNodeId);
        if (isMatch) return reference;
    }

    return null;
}


export async function removeRelationFromReference(parentNode: SpinalNode, childNode: SpinalNode, relationName: string, relationType: string) {
    const parentReferences = await getNodeReferences(parentNode);

    const promises = parentReferences.map(async (item) => {
        const children = await item.getChildren(relationName);
        const refFound = await findReferenceNodeInReferences(children, childNode.getId().get());
        if (refFound) removeReferenceNode(refFound);
        return null;
    })

    return Promise.all(promises);

    // const childReferences = await getReferences(childNode);


    // const obj = {};

    // for (let i = 0; i < childReferences.length; i++) {
    //     const el = childReferences[i];
    //     obj[el.getId().get()] = el;
    // }

    // for (let i = 0; i < parentReferences.length; i++) {
    //     const item = parentReferences[i];
    //     const children = await item.getChildren(relationName);
    //     for (const child of children) {
    //         const node = obj[child.getId().get()]
    //         if (node) {
    //             await item.removeChild(node, relationName, relationType);
    //             await removeNodeReferences(childNode, node);
    //             return;
    //         }
    //     }
    // }

}


function _linkReferenceToOriginalNode(originalNode: SpinalNode, referenceNode: SpinalNode) {

    // If the original node has no references, we create a new list and add the reference node to it
    if (!originalNode.info.references) {
        const referencesLst = new Lst([referenceNode]);
        originalNode.info.add_attr({ references: new Ptr(referencesLst) });

        return Promise.resolve(referenceNode);
    }


    // If the original node has references, we load the list and add the reference node to it
    return new Promise((resolve) => {
        originalNode.info.references.load((lst) => {
            lst.push(referenceNode);
            resolve(referenceNode);
        })
    })

}

export async function _getAuthorizedPortofolioContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
    return _getOrCreateContext(profile, AUTHORIZED_PORTOFOLIO_CONTEXT_NAME, createIfNotExist, AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE);
}

async function _getAuthorizedApisRoutesContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
    return _getOrCreateContext(profile, AUTHORIZED_API_CONTEXT_NAME, createIfNotExist, AUTHORIZED_API_CONTEXT_TYPE);
}

async function _getAuthorizedBosContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
    return _getOrCreateContext(profile, AUTHORIZED_BOS_CONTEXT_NAME, createIfNotExist, AUTHORIZED_BOS_CONTEXT_TYPE)
}

async function _getOrCreateContext(profile: SpinalNode, contextName: string, createIfNotExist: boolean, contextType?: string): Promise<SpinalContext> {
    const graph = await _getProfileGraph(profile);
    if (!graph) return;

    let context = await graph.getContext(contextName);
    if (context) return context;

    if (!createIfNotExist) return;

    let newContext = new SpinalContext(contextName, contextType);
    return graph.addContext(newContext);
}

async function _getProfileGraph(profile: SpinalNode): Promise<SpinalGraph | void> {
    if (profile) return profile.getElement();
}

function _getContextByType(profile: SpinalNode, elementType: string): Promise<SpinalContext | void> {
    switch (elementType) {
        case AUTHORIZED_API_CONTEXT_TYPE:
            return _getAuthorizedApisRoutesContext(profile);
        case AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE:
            return _getAuthorizedPortofolioContext(profile);
        case AUTHORIZED_BOS_CONTEXT_TYPE:
            return _getAuthorizedBosContext(profile);

        default:
            break;
    }
}


function converLstToJsArray(lst: spinal.Lst<any>) {
    const result: SpinalNode[] = [];

    for (let i = 0; i < lst.length; i++) {
        result.push(lst[i]);
    }

    return result;
}


export function CleanReferenceTree(context: SpinalContext, startReferenceNode: SpinalNode) {
    return startReferenceNode.findInContextAsyncPredicate(context, (async (node) => {
        await removeReferenceNode(node);
        return true;
    }))
}




// export async function findRefNodeFromProfile(profileContext: SpinalContext, profile: SpinalNode, node: string | SpinalNode): Promise<SpinalNode | null> {
//     const spinalNodeId = typeof node === "string" ? node : node.getId().get();

//     const found = await profile.findInContextAsyncPredicate(profileContext, (async (node, stop) => {
//         const realNode = await getRealNodeFromReference(node);
//         if (!realNode) return false;

//         if (realNode.getId().get() === spinalNodeId) {
//             stop();
//             return true;
//         }

//         return false;
//     }))

//     if (!found || found.length === 0) return null;
//     return found[0];

// }


// export async function removeNodeReferences(node: SpinalNode, referenceNode?: SpinalNode): Promise<boolean> {
//     try {

//         const references = await getReferences(node);

//         for (let i = 0; i < references.length; i++) {
//             const element = references[i];
//             if (!referenceNode) {
//                 await element.removeFromGraph()
//             } else if (referenceNode.getId().get() === element.getId().get()) {
//                 await element.removeFromGraph();
//                 references.splice(i);
//                 return true;
//             }
//         }

//         if (!referenceNode) node.info.rem_attr("references");
//         return true;
//     } catch (error) {
//         return false;
//     }
// }

// export async function removeRelationFromReference(parentNode: SpinalNode, childNode: SpinalNode, relationName: string, relationType: string) {
//     const parentReferences = await getReferences(parentNode);
//     const childReferences = await getReferences(childNode);


//     const obj = {};

//     for (let i = 0; i < childReferences.length; i++) {
//         const el = childReferences[i];
//         obj[el.getId().get()] = el;
//     }

//     for (let i = 0; i < parentReferences.length; i++) {
//         const item = parentReferences[i];
//         const children = await item.getChildren(relationName);
//         for (const child of children) {
//             const node = obj[child.getId().get()]
//             if (node) {
//                 await item.removeChild(node, relationName, relationType);
//                 await removeNodeReferences(childNode, node);
//                 return;
//             }
//         }
//     }

// }



// function getReferences(node: SpinalNode): Promise<spinal.Lst<SpinalNode> | SpinalNode[]> {
//     if (!node.info?.references || !(node.info.references instanceof spinal.Ptr)) return Promise.resolve([]);
//     return new Promise((resolve, reject) => {
//         node.info.references.load((references) => {
//             resolve(references);
//         })
//     });
// }




// export async function _getReferencesTree(profile: SpinalNode, portofolioId?: string, BosId?: string): Promise<{ context?: SpinalNode; portofolioRef?: SpinalNode; bosRef?: SpinalNode }> {
//     const createContextIfNotExist = false;
//     const context = await _getAuthorizedPortofolioContext(profile, createContextIfNotExist);

//     if (!context || !portofolioId) return { context };

//     const portofolioRef = await this._getReference(context, portofolioId);
//     if (!portofolioRef || !BosId) return { context, portofolioRef };

//     const bosRef = await this._getReference(portofolioRef, BosId, [PROFILE_TO_AUTHORIZED_BOS_RELATION]);
//     return { context, portofolioRef, bosRef }
// }

// async function _getAuthorizedPortofolioContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
//     return this._getOrCreateContext(profile, AUTHORIZED_PORTOFOLIO_CONTEXT_NAME, createIfNotExist, AUTHORIZED_PORTOFOLIO_CONTEXT_TYPE);
// }

// async function _getAuthorizedApisRoutesContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
//     return this._getOrCreateContext(profile, AUTHORIZED_API_CONTEXT_NAME, createIfNotExist, AUTHORIZED_API_CONTEXT_TYPE);
// }

// async function _getAuthorizedBosContext(profile: SpinalNode, createIfNotExist: boolean = false): Promise<SpinalContext> {
//     return this._getOrCreateContext(profile, AUTHORIZED_BOS_CONTEXT_NAME, createIfNotExist, AUTHORIZED_BOS_CONTEXT_TYPE)
// }

// async function _getOrCreateContext(profile: SpinalNode, contextName: string, createIfNotExist: boolean, contextType?: string): Promise<SpinalContext> {
//     const graph = await this._getProfileGraph(profile);
//     if (graph) {
//         let context = await graph.getContext(contextName);
//         if (context) return context;
//         if (!createIfNotExist) return;

//         let newContext = new SpinalContext(contextName, contextType);
//         return graph.addContext(newContext);
//     }
// }


