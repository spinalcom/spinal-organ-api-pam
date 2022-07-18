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
const constant_1 = require("../../../constant");
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
                if (!data.name)
                    return res.status(constant_1.HTTP_CODES.BAD_REQUEST).send("The profile name is required");
                const profile = yield serviceInstance.createAppProfile(data);
                return res.status(constant_1.HTTP_CODES.CREATED).send(_formatUserProfile(profile));
            }
            catch (error) {
                res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    getAppProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = yield serviceInstance.getAppProfile(id);
                if (data)
                    return res.status(constant_1.HTTP_CODES.OK).send(_formatUserProfile(data));
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`no profile found for ${id}`);
            }
            catch (error) {
                res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    getAllAppProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nodes = yield serviceInstance.getAllAppProfile();
                if (nodes)
                    return res.status(constant_1.HTTP_CODES.OK).send(nodes.map(el => _formatUserProfile(el)));
                return res.status(constant_1.HTTP_CODES.OK).send([]);
            }
            catch (error) {
                res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
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
                    return res.status(constant_1.HTTP_CODES.OK).send(_formatUserProfile(node));
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`no profile found for ${id}`);
            }
            catch (error) {
                res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    deleteAppProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield serviceInstance.deleteAppProfile(id);
                return res.status(constant_1.HTTP_CODES.OK).send("user profile deleted");
            }
            catch (error) {
                res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    authorizeToAccessApps(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId } = req.params;
                const { authorizeApps } = req.body;
                const nodes = yield serviceInstance.authorizeToAccessApps(profileId, authorizeApps);
                if (nodes)
                    return res.status(constant_1.HTTP_CODES.OK).send(_getNodeListInfo(nodes));
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    unauthorizeToAccessApps(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId } = req.params;
                const { unauthorizeApps } = req.body;
                const nodes = yield serviceInstance.unauthorizeToAccessApps(profileId, unauthorizeApps);
                if (nodes)
                    return res.status(constant_1.HTTP_CODES.OK).send(nodes.filter(el => el));
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    getAuthorizedApps(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId } = req.params;
                const nodes = yield serviceInstance.getAuthorizedApps(profileId);
                if (nodes)
                    return res.status(constant_1.HTTP_CODES.OK).send(_getNodeListInfo(nodes));
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    authorizeToAccessApis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId } = req.params;
                const { authorizeApis } = req.body;
                const nodes = yield serviceInstance.authorizeToAccessApis(profileId, authorizeApis);
                if (nodes)
                    return res.status(constant_1.HTTP_CODES.OK).send(_getNodeListInfo(nodes));
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    unauthorizeToAccessApis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId } = req.params;
                const { unauthorizeApis } = req.body;
                const nodes = yield serviceInstance.unauthorizeToAccessApis(profileId, unauthorizeApis);
                if (nodes)
                    return res.status(constant_1.HTTP_CODES.OK).send(nodes.filter(el => el));
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    getAuthorizedApis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId } = req.params;
                const nodes = yield serviceInstance.getAuthorizedApis(profileId);
                if (nodes)
                    return res.status(constant_1.HTTP_CODES.OK).send(_getNodeListInfo(nodes));
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    authorizeProfileToAccessBos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId } = req.params;
                const { authorizeBos } = req.body;
                const nodes = yield serviceInstance.authorizeToAccessBos(profileId, authorizeBos);
                if (nodes)
                    return res.status(constant_1.HTTP_CODES.OK).send(_getNodeListInfo(nodes));
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    unauthorizeProfileToAccessBos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId } = req.params;
                const { unauthorizeBos } = req.body;
                const nodes = yield serviceInstance.unauthorizeToAccessBos(profileId, unauthorizeBos);
                if (nodes)
                    return res.status(constant_1.HTTP_CODES.OK).send(nodes.filter(el => el));
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
    getAuthorizedBos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId } = req.params;
                const nodes = yield serviceInstance.getAuthorizedBos(profileId);
                if (nodes)
                    return res.status(constant_1.HTTP_CODES.OK).send(_getNodeListInfo(nodes));
                return res.status(constant_1.HTTP_CODES.NOT_FOUND).send(`no profile found for ${profileId}`);
            }
            catch (error) {
                return res.status(constant_1.HTTP_CODES.INTERNAL_ERROR).send(error.message);
            }
        });
    }
}
exports.AppProfileController = AppProfileController;
function _formatUserProfile(data) {
    return Object.assign(Object.assign({}, data.node.info.get()), { authorizedApps: _getNodeListInfo(data.authorizedApps), authorizedRoutes: _getNodeListInfo(data.authorizedRoutes), authorizedBos: _getNodeListInfo(data.authorizedBos) });
}
function _getNodeListInfo(nodes) {
    return nodes.map(el => el.info.get());
}
function _formatUserProfileKeys(userProfile) {
    const res = {};
    for (const key in userProfile) {
        if (Object.prototype.hasOwnProperty.call(userProfile, key)) {
            const element = userProfile[key];
            res[key] = typeof element === "string" && element.trim()[0] === "[" ? JSON.parse(element.trim()) : element;
        }
    }
    return res;
}
exports.default = AppProfileController.getInstance();
//# sourceMappingURL=appProfile.controller.js.map