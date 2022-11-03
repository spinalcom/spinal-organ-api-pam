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
exports.createDefaultAdminApps = void 0;
const services_1 = require("./services");
const ADMIN_APPS = [
    {
        name: "Plateforme d'authentification",
        icon: "mdi-shield-crown",
        description: "Gestion de la plateforme d'authentification",
        tags: ["ADMIN"],
        categoryName: "Administation",
        groupName: "Administration",
        packageName: "spinal-env-pam-auth-admin-manager"
    },
    {
        name: "Profils d'utilisateurs",
        icon: "mdi-face-man-profile",
        description: "Gestion de profils d'utilisateurs",
        tags: ["PROFIL D'UTILISATEURS"],
        categoryName: "Administation",
        groupName: "Administration",
        packageName: "spinal-env-pam-user-profile-manager"
    },
    {
        name: "Profils d'applications",
        icon: "mdi-apps-box",
        description: "Gestion de profils d'applications",
        tags: ["PROFIL D'APPLICATIONS"],
        categoryName: "Administation",
        groupName: "Administration",
        packageName: "spinal-env-pam-app-profile-manager"
    },
    {
        name: "Applications",
        icon: "mdi-apps",
        description: "Gestion de types d'applications",
        tags: ["APPLICATIONS"],
        categoryName: "Administation",
        groupName: "Administration",
        packageName: "spinal-env-pam-apps-manager"
    },
    {
        name: "Routes d'apis",
        icon: "mdi-api",
        description: "Gestion de routes d'api",
        tags: ["APIS"],
        categoryName: "Administation",
        groupName: "Administration",
        packageName: "spinal-env-pam-apis-routes-manager"
    },
    {
        name: "GESTION de Portefeuilles",
        icon: "mdi-office-building-cog",
        description: "Gestion de routes d'api",
        tags: ["PORTOFOLIO", "BUILDINGS"],
        categoryName: "Administation",
        groupName: "Administration",
        packageName: "spinal-env-pam-building-manager"
    }
];
function createDefaultAdminApps() {
    return ADMIN_APPS.reduce((prom, app) => __awaiter(this, void 0, void 0, function* () {
        const liste = yield prom;
        const node = yield services_1.AppService.getInstance().createAdminApp(app);
        liste.push(node);
        return liste;
    }), Promise.resolve([]));
}
exports.createDefaultAdminApps = createDefaultAdminApps;
//# sourceMappingURL=adminApps.js.map