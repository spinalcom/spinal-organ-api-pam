"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRelationFromReference = exports.removeNodeReferences = void 0;
function removeNodeReferences(node, referenceNode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const references = yield getReferences(node);
            for (let i = 0; i < references.length; i++) {
                const element = references[i];
                if (!referenceNode) {
                    yield element.removeFromGraph();
                }
                else if (referenceNode.getId().get() === element.getId().get()) {
                    yield element.removeFromGraph();
                    references.splice(i);
                    return true;
                }
            }
            if (!referenceNode)
                node.info.rem_attr("references");
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
exports.removeNodeReferences = removeNodeReferences;
function removeRelationFromReference(parentNode, childNode, relationName, relationType) {
    return __awaiter(this, void 0, void 0, function* () {
        const parentReferences = yield getReferences(parentNode);
        const childReferences = yield getReferences(childNode);
        const obj = {};
        for (let i = 0; i < childReferences.length; i++) {
            const el = childReferences[i];
            obj[el.getId().get()] = el;
        }
        for (let i = 0; i < parentReferences.length; i++) {
            const item = parentReferences[i];
            const children = yield item.getChildren(relationName);
            for (const child of children) {
                const node = obj[child.getId().get()];
                if (node) {
                    yield item.removeChild(node, relationName, relationType);
                    yield removeNodeReferences(childNode, node);
                    return;
                }
            }
        }
    });
}
exports.removeRelationFromReference = removeRelationFromReference;
function getReferences(node) {
    var _a;
    if (!((_a = node.info) === null || _a === void 0 ? void 0 : _a.references) || !(node.info.references instanceof spinal.Ptr))
        return Promise.resolve([]);
    return new Promise((resolve, reject) => {
        node.info.references.load((references) => {
            resolve(references);
        });
    });
}
//# sourceMappingURL=utils.js.map