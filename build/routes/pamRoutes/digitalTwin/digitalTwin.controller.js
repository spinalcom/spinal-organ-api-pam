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
exports.DigitalTwinController = void 0;
const services_1 = require("../../../services");
const serviceInstance = services_1.DigitalTwinService.getInstance();
class DigitalTwinController {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new DigitalTwinController();
        return this.instance;
    }
    addDigitalTwin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const digitalTwinInfo = req.body;
                const validationResult = serviceInstance.validateDigitalTwin(digitalTwinInfo);
                if (!validationResult.isValid)
                    return res.status(400).send(validationResult.message);
                yield serviceInstance.setLocation(digitalTwinInfo);
                const node = yield serviceInstance.addDigitalTwin(digitalTwinInfo);
                const data = yield serviceInstance.formatDigitalTwin(node.info.get());
                return res.status(200).send(data);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    getDigitalTwin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const node = yield serviceInstance.getDigitalTwin(id);
                if (node) {
                    const data = yield serviceInstance.formatDigitalTwin(node.info.get());
                    return res.status(200).send(data);
                }
                ;
                return res.status(404).send(`no digitaltwin found for ${id}`);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    getAllDigitalTwin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.getAllDigitalTwin();
                if (nodes) {
                    const promises = nodes.map(el => serviceInstance.formatDigitalTwin(el.info.get()));
                    const data = yield Promise.all(promises);
                    return res.status(200).send(data);
                }
                return res.status(200).send([]);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    editDigitalTwin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                yield serviceInstance.setLocation(data);
                const node = yield serviceInstance.updateDigitalTwin(id, data);
                if (node) {
                    const data = yield serviceInstance.formatDigitalTwin(node.info.get());
                    return res.status(200).send(data);
                }
                ;
                return res.status(404).send(`no digitaltwin found for ${id}`);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    deleteDigitalTwin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield serviceInstance.deleteDigitalTwin(id);
                return res.status(200).send("digitaltwin deleted");
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
}
exports.DigitalTwinController = DigitalTwinController;
exports.default = DigitalTwinController.getInstance();
//# sourceMappingURL=digitalTwin.controller.js.map