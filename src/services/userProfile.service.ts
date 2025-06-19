/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the followi../interfaces/IProfileResitions
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

import { SpinalGraph, SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';
import { CONTEXT_TO_USER_PROFILE_RELATION_NAME, USER_PROFILE_CONTEXT_NAME, USER_PROFILE_CONTEXT_TYPE } from '../constant';

import { AdminProfileService } from './adminProfile.service';
import { ProfileBase } from '../utils/profileBase';


export class UserProfileService extends ProfileBase {
  private static instance: UserProfileService;
  public context: SpinalContext;
  private adminProfile: SpinalNode;

  private constructor() {
    super(CONTEXT_TO_USER_PROFILE_RELATION_NAME);
  }

  public static getInstance(): UserProfileService {
    if (!this.instance) {
      this.instance = new UserProfileService();
    }

    return this.instance;
  }

  public async init(graph: SpinalGraph): Promise<SpinalContext> {
    this.context = await graph.getContext(USER_PROFILE_CONTEXT_NAME);
    if (!this.context) {
      const spinalContext = new SpinalContext(USER_PROFILE_CONTEXT_NAME, USER_PROFILE_CONTEXT_TYPE);
      this.context = await graph.addContext(spinalContext);
    }

    await AdminProfileService.getInstance().init(this.context);
    return this.context;
  }

}
