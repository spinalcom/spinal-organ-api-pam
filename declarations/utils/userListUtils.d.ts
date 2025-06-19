import { SpinalContext, SpinalNode } from "spinal-model-graph";
import { IPamCredential } from "../interfaces";
export declare function checkIfUserExists(userName: string, context: SpinalContext): Promise<boolean>;
export declare function createNewUserNode(userName: string, password: string): Promise<SpinalNode>;
export declare function hashPassword(password: string, saltRounds?: number): Promise<string>;
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
export declare function generatePassword(length?: number): string;
export declare function getAuthorizedAppsAsObj(userProfileId: string, portofolioId: string, buildingId: string): Promise<{
    [key: string]: SpinalNode;
}>;
export declare function getProfileInfo(userToken: string, adminCredential: IPamCredential, isUser?: boolean): Promise<any>;
export declare function getUserInfo(userId: string, adminCredential: IPamCredential, userToken: string): Promise<any>;
export declare function getUserInfoByToken(adminCredential: IPamCredential, userToken: string): Promise<any>;
export declare function getPamCredentials(): Promise<IPamCredential>;
export declare function _convertListToObj(liste: SpinalNode[], key?: string): {
    [key: string]: SpinalNode;
};
export declare function filterReferenceNodes(referencesNode: SpinalNode[], portofolioId: string, buildingId: string): SpinalNode[];
