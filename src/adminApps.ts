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

import { AppService } from "./services"

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
        name: "Gestion d'applications",
        icon: "mdi-apps",
        description: "Gestion de types d'applications",
        tags: ["APPLICATIONS"],
        categoryName: "Administation",
        groupName: "Administration",
        packageName: "spinal-env-pam-apps-manager"
    },
    {
        name: "Gestion de Routes d'apis",
        icon: "mdi-api",
        description: "Gestion de routes d'api",
        tags: ["APIS"],
        categoryName: "Administation",
        groupName: "Administration",
        packageName: "spinal-env-pam-apis-routes-manager"
    },
    {
        name: "Gestion de Portefeuilles",
        icon: "mdi-office-building-cog",
        description: "Gestion de portefolio",
        tags: ["PORTOFOLIO", "BUILDINGS"],
        categoryName: "Administation",
        groupName: "Administration",
        packageName: "spinal-env-pam-building-manager"
    },
    {
        name: "Surveiller l'état du websocket",
        icon: "mdi-monitor-eye",
        description: "Surveiller l'etat et les logs du websocket",
        tags: ["PAM", "WEB_SOCKET"],
        categoryName: "Administation",
        groupName: "Administration",
        packageName: "spinal-env-pam-websocket-state"
    },
]



export function createDefaultAdminApps() {
    return ADMIN_APPS.reduce(async (prom, app) => {
        const liste = await prom;
        const node = await AppService.getInstance().createAdminApp(app);
        liste.push(node);
        return liste;
    }, Promise.resolve([]))
}