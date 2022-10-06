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
import { SpinalNode } from 'spinal-env-viewer-graph-service';

export interface IPortofolioAuth {
  portofolioId: string,
  appsIds?: string | string[]
}

export interface IBosAuth {
  buildingId: string,
  appsIds?: string | string[]
}


export interface IProfile {
  name?: string;
  authorizePortofolio?: IPortofolioAuth[];
  unauthorizePortofolio?: IPortofolioAuth[];
  authorizeApis?: string[];
  unauthorizeApis?: string[];
  authorizeBos?: IBosAuth[];
  unauthorizeBos?: IBosAuth[];
}

export interface IPortofolioAuthRes {
  portofolio: SpinalNode;
  apps: SpinalNode[];
}

export interface IBosAuthRes {
  building: SpinalNode;
  apps: SpinalNode[];
}

export interface IAuthRes {
  authorizedPortofolio?: IPortofolioAuthRes[];
  authorizedRoutes?: SpinalNode[];
  authorizedBos?: IBosAuthRes[];
}

export interface IProfileRes extends IAuthRes {
  node: SpinalNode;
}
