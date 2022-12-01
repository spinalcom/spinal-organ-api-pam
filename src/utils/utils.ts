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

import { SpinalNode } from "spinal-env-viewer-graph-service";

export async function removeNodeReferences(node: SpinalNode, referenceNode?: SpinalNode): Promise<boolean> {
    try {

        const references = await getReferences(node);

        for (let i = 0; i < references.length; i++) {
            const element = references[i];
            if (!referenceNode) {
                await element.removeFromGraph()
            } else if (referenceNode.getId().get() === element.getId().get()) {
                await element.removeFromGraph();
                references.splice(i);
                return true;
            }
        }

        if (!referenceNode) node.info.rem_attr("references");
        return true;
    } catch (error) {
        return false;
    }
}


export async function removeRelationFromReference(parentNode: SpinalNode, childNode: SpinalNode, relationName: string, relationType: string) {
    const parentReferences = await getReferences(parentNode);
    const childReferences = await getReferences(childNode);


    const obj = {};

    for (let i = 0; i < childReferences.length; i++) {
        const el = childReferences[i];
        obj[el.getId().get()] = el;
    }

    for (let i = 0; i < parentReferences.length; i++) {
        const item = parentReferences[i];
        const children = await item.getChildren(relationName);
        for (const child of children) {
            const node = obj[child.getId().get()]
            if (node) {
                await item.removeChild(node, relationName, relationType);
                await removeNodeReferences(childNode, node);
                return;
            }
        }
    }

}


function getReferences(node: SpinalNode): Promise<spinal.Lst<SpinalNode> | SpinalNode[]> {
    if (!node.info?.references || !(node.info.references instanceof spinal.Ptr)) return Promise.resolve([]);
    return new Promise((resolve, reject) => {
        node.info.references.load((references) => {
            resolve(references);
        })
    });
}