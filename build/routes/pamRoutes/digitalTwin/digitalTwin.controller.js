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
exports.DigitaltwinController = void 0;
const services_1 = require("../../../services");
const constant_1 = require("../../../constant");
const serviceInstance = services_1.DigitalTwinService.getInstance();
class DigitaltwinController {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new DigitaltwinController();
        }
        return this.instance;
    }
    createDigitalTwin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, folderPath } = req.body;
                if (!name || !name.trim())
                    return res.status(constant_1.HTTP_CODES.BAD_REQUEST).send("The file name is mandatory");
                const node = yield serviceInstance.createDigitalTwin(name, folderPath);
                return res.status(constant_1.HTTP_CODES.CREATED).send(node.info.get());
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    getAllDigitalTwins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.getAllDigitalTwins();
                return res.status(constant_1.HTTP_CODES.OK).send(nodes.map(el => el.info.get()));
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    getDigitalTwin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const node = yield serviceInstance.getDigitalTwinById(id);
                if (node)
                    return res.status(constant_1.HTTP_CODES.OK).send(node.info.get());
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`No digitaltwin found for ${id}`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    renameDigitalTwin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { newName } = req.body;
                const { id } = req.params;
                const node = yield serviceInstance.renameDigitalTwin(id, newName);
                if (node)
                    return res.status(constant_1.HTTP_CODES.OK).send(node.info.get());
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`No digitaltwin found for ${id}`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    removeDigitalTwin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield serviceInstance.removeDigitalTwin(id);
                if (deleted)
                    return res.status(constant_1.HTTP_CODES.OK).send(`digitalTwin deleted`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    setActualDigitalTwin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const node = yield serviceInstance.setActualDigitalTwin(id);
                if (node)
                    return res.status(constant_1.HTTP_CODES.OK).send(node.info.get());
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    getActualDigitalTwin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const node = yield serviceInstance.getActualDigitalTwin();
                if (node)
                    return res.status(constant_1.HTTP_CODES.OK).send(node.info.get());
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`No default digitaltwin set`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    removeActualDigitaTwin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield serviceInstance.removeActualDigitaTwin();
                return res.status(constant_1.HTTP_CODES.OK).send(`actual digitalTwin deleted`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
}
exports.DigitaltwinController = DigitaltwinController;
exports.default = DigitaltwinController.getInstance();
//# sourceMappingURL=digitalTwin.controller.js.map