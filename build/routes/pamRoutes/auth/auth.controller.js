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
exports.AuthController = void 0;
const services_1 = require("../../../services");
const constant_1 = require("../../../constant");
const serviceInstance = services_1.AuthentificationService.getInstance();
class AuthController {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthController();
        return this.instance;
    }
    registerToAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pamInfo, adminInfo } = req.body;
                const registeredData = yield serviceInstance.registerToAdmin(pamInfo, adminInfo);
                yield serviceInstance.sendDataToAdmin();
                return res.status(constant_1.HTTP_CODES.OK).send(registeredData);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    getBosToAminCredential(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bosCredential = yield serviceInstance.getBosToAminCredential();
                if (bosCredential)
                    return res.status(constant_1.HTTP_CODES.OK).send(bosCredential);
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send("No admin registered");
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    // public editBosCredential(req: express.Request, res: express.Response) {
    //     try {
    //     } catch (error) {
    //         return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message)
    //     }
    // }
    createAdminCredential(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminCredential = yield serviceInstance.createAdminCredential();
                return res.status(constant_1.HTTP_CODES.OK).send(adminCredential);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    // public editAdminCredential(req: express.Request, res: express.Response) {
    //     try {
    //     } catch (error) {
    //         return res.status(HTTP_CODES.INTERNAL_ERROR).send(error.message)
    //     }
    // }
    getAdminCredential(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminCredential = yield serviceInstance.getAdminCredential();
                if (adminCredential)
                    return res.status(constant_1.HTTP_CODES.OK).send(adminCredential);
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send("No admin registered");
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    syncDataToAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield serviceInstance.sendDataToAdmin(true);
                return res.status(constant_1.HTTP_CODES.OK).send(resp.data);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
}
exports.AuthController = AuthController;
exports.default = AuthController.getInstance();
//# sourceMappingURL=auth.controller.js.map