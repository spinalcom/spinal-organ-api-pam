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


export interface IProfile {
  name: string;
  authorize: IPortofolioAuth[]
}

export interface ItemsIds {
  appsIds?: string[];
  apisIds?: string[];
  unauthorizeAppsIds?: string[];
  unauthorizeApisIds?: string[];
}

export interface IPortofolioAuth extends ItemsIds {
  portofolioId: string;
  building?: IBosAuth[]
}

export interface IBosAuth extends ItemsIds {
  buildingId: string;
}

export interface IProfileRes {
  node: SpinalNode;
  authorized: IPortofolioAuthRes[]
}

export interface IPortofolioAuthRes {
  portofolio: SpinalNode;
  apps?: SpinalNode[];
  apis?: SpinalNode[];
  buildings?: IBosAuthRes[];
}

export interface IBosAuthRes {
  building: SpinalNode;
  apps?: SpinalNode[];
  apis?: SpinalNode[];
}

///////////////////////////////////
//            EDIT               //
//////////////////////////////////

export type IPortofolioAuthEdit = IPortofolioAuth;

export type IBosAuthEdit = IBosAuth;

export interface IProfileEdit {
  name?: string;
  authorize?: (IPortofolioAuthEdit & { unauthorizeBuildingIds?: string[] })[]
}