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
exports.AppProfileController = void 0;
const services_1 = require("../../../services");
const serviceInstance = services_1.AppProfileService.getInstance();
class AppProfileController {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AppProfileController();
        }
        return this.instance;
    }
    createAppProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const node = yield serviceInstance.createAppProfile(data);
                return res.status(200).send(node.info.get());
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    getAppProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const node = yield serviceInstance.getAppProfile(id);
                if (node)
                    return res.status(200).send(node.info.get());
                return res.status(404).send(`no profile found for ${id}`);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    getAllAppProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.getAllAppProfile();
                if (nodes)
                    return res.status(200).send(nodes.map(el => el.info.get()));
                return res.status(200).send([]);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    updateAppProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                const node = yield serviceInstance.updateAppProfile(id, data);
                if (node)
                    return res.status(200).send(node.info.get());
                return res.status(404).send(`no profile found for ${id}`);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    deleteAppProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield serviceInstance.deleteAppProfile(id);
                return res.status(200).send("app profile deleted");
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
}
exports.AppProfileController = AppProfileController;
exports.default = AppProfileController.getInstance();
//# sourceMappingURL=appProfile.controller.js.map