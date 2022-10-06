import { IBosAuth, IPortofolioAuth, IProfile, IProfileRes, IPortofolioAuthRes, IBosAuthRes, IPortofolioData, IBosData } from "../interfaces";
import { SpinalNode } from 'spinal-env-viewer-graph-service';
export declare function _formatProfile(data: IProfileRes): any;
export declare function _formatPortofolioAuthRes(data: IPortofolioAuthRes): IPortofolioData;
export declare function _formatBosAuthRes(data: IBosAuthRes): IBosData;
export declare function _getNodeListInfo(nodes: SpinalNode[]): any[];
export declare function _formatProfileKeys(profile: IProfile): IProfile;
export declare function _formatAuthorizationData(profileData: IProfile): {
    authorizePortofolio: (IPortofolioAuth | IBosAuth)[];
    unauthorizePortofolio: (IPortofolioAuth | IBosAuth)[];
    authorizeApis: string[];
    unauthorizeApis: string[];
    authorizeBos: (IPortofolioAuth | IBosAuth)[];
    unauthorizeBos: (IPortofolioAuth | IBosAuth)[];
};
export declare function _filterApisList(authorizedIds?: string[], unauthorizedIds?: string[]): string[];
export declare function _filterPortofolioList(authorizedPortofolio?: IPortofolioAuth[], unauthorizedPortofolio?: IPortofolioAuth[]): IPortofolioAuth[];
export declare function _filterBosList(authorizedBos?: IBosAuth[], unauthorizedBos?: IBosAuth[]): IBosAuth[];
