"use strict";
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
exports.RoleController = void 0;
const role_service_1 = require("../../../services/role.service");
const roleService = role_service_1.RoleService.getInstance();
class RoleController {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new RoleController();
        }
        return this.instance;
    }
    createRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, methods } = req.body;
                const node = yield roleService.createRole({ name, methods });
                return res.status(201).send(node.info.get());
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    getAllRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield roleService.getAllRole();
                return res.status(201).send(nodes.map(node => node.info.get()));
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    getRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const node = yield roleService.getRole(id);
                if (node)
                    return res.status(200).send(node.info.get());
                return res.status(404).send(`no role found for ${id}`);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    updateRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                const node = yield roleService.updateRole(id, data.name, data.methods);
                if (node)
                    return res.status(200).send(node.info.get());
                return res.status(404).send(`no role found for ${id}`);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
    deleteRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield roleService.deleteRole(id);
                res.status(200).send(`role deleted`);
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
    }
}
exports.RoleController = RoleController;
exports.default = RoleController.getInstance();
//# sourceMappingURL=role.controller.js.map