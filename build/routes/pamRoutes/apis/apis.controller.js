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
exports.APIController = void 0;
const services_1 = require("../../../services");
const apiService = services_1.APIService.getInstance();
class APIController {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new APIController();
        return this.instance;
    }
    createApiRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const node = yield apiService.createApiRoute(data);
                return res.status(200).send(node.info.get());
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    updateApiRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                const node = yield apiService.updateApiRoute(id, data);
                return res.status(200).send(node.info.get());
            }
            catch (error) {
                console.error(error);
                return res.status(500).send(error.message);
            }
        });
    }
    getApiRouteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const node = yield apiService.getApiRouteById(id);
                if (node)
                    return res.status(200).send(node.info.get());
                return res.status(404).send(`node api route found for ${id}`);
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    getAllApiRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const routes = yield apiService.getAllApiRoute();
                return res.status(200).send(routes.map(el => el.info.get()));
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
    deleteApiRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield apiService.deleteApiRoute(id);
                return res.status(200).send(`api route deleted`);
            }
            catch (error) {
                return res.status(500).send(error.message);
            }
        });
    }
}
exports.APIController = APIController;
exports.default = APIController.getInstance();
//# sourceMappingURL=apis.controller.js.map