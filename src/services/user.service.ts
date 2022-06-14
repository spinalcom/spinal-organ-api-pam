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

import { SpinalGraphService, SpinalNode } from 'spinal-env-viewer-graph-service';
import { PTR_LST_TYPE, CONTEXT_TO_USER_RELATION_NAME, USER_BASE_EMPTY, USER_LIST_CONTEXT_NAME, USER_NOT_FOUND } from '../constant';
import { configServiceInstance } from './configFile.service';
import { IUser } from '../interfaces';



export class SpinalTwinAdminUser {

  public createUser(user: IUser): Promise<IUser | string> {
    return this.findEmail(user.email)
      .then(async (exist: boolean): Promise<any> => {
        if (exist) {
          return Promise.resolve(USER_NOT_FOUND);
        }
        const userId = SpinalGraphService.createNode(user, undefined);
        user.id = userId;
        let context = await configServiceInstance.getContext(USER_LIST_CONTEXT_NAME);

        return SpinalGraphService.addChildInContext(
          context.info.id.get(),
          userId,
          context.info.id.get(),
          CONTEXT_TO_USER_RELATION_NAME,
          PTR_LST_TYPE
        ).then(() => {
          return Promise.resolve(user);
        });
      })
      .catch((e) => {
        return Promise.resolve(e);
      });
  }

  public getUserByID(id: string) { }

  public getAllUser(contextId: string) { }


  public async getUser(
    id: string,
    email?: string,
    password?: string
  ): Promise<IUser> {
    let context = await configServiceInstance.getContext(USER_LIST_CONTEXT_NAME);
    if (typeof email === 'string' && typeof password === 'string')
      return this.findUserWithEmailPassword(email, password);
    return SpinalGraphService.getChildren(context.info.id.get(), [
      CONTEXT_TO_USER_RELATION_NAME,
    ])
      .then((children: any[]) => {
        if (children.length < 0) {
          return Promise.reject(USER_BASE_EMPTY);
        }

        for (let i = 0; i < children.length; i = i + 1) {
          if (children[i].hasOwnProperty('id') && children[i].id.get() === id) {
            return Promise.resolve(children[i]);
          }
        }
        return Promise.resolve(USER_NOT_FOUND);
      })
      .catch((e) => {
        console.error(e);
        return Promise.resolve(e);
      });
  }

  public addNode(
    userId: string,
    childId: string,
    relationName: string,
    relationType: string
  ) { }


  private async findEmail(email: string): Promise<boolean> {
    let context = await configServiceInstance.getContext(USER_LIST_CONTEXT_NAME);
    return SpinalGraphService.getChildren(context.info.id.get(), [
      CONTEXT_TO_USER_RELATION_NAME,
    ]).then((children) => {
      if (children.length < 0) {
        return Promise.resolve(false);
      }
      for (let i = 0; i < children.length; i = i + 1) {
        if (
          children[i].hasOwnProperty('email') &&
          children[i].email.get() === email
        ) {
          return Promise.resolve(true);
        }
      }
      return Promise.resolve(false);
    });
  }


  private async findUserWithEmailPassword(
    email: string,
    password: string
  ): Promise<IUser> {
    let context = await configServiceInstance.getContext(USER_LIST_CONTEXT_NAME);
    return SpinalGraphService.getChildren(context.info.id.get(), [
      CONTEXT_TO_USER_RELATION_NAME,
    ])
      .then((children: any[]) => {
        if (children.length < 0) {
          return Promise.reject(USER_BASE_EMPTY);
        }

        for (let i = 0; i < children.length; i = i + 1) {
          if (
            children[i].hasOwnProperty('email') &&
            children[i].email.get() === email &&
            children[i].hasOwnProperty('password') &&
            children[i].password.get() === password
          ) {
            return Promise.resolve(children[i]);
          }
        }
        return Promise.resolve(USER_NOT_FOUND);
      })
      .catch((e) => {
        console.error(e);
        return Promise.resolve(e);
      });
  }

  public addUserProfileToUser(userId: string, userProfileId: string) { }


  public updateUser(user: IUser, userId: string): SpinalNode<any> {
    if (typeof userId === 'undefined' || typeof user === 'undefined') {
      return;
    }
    const node = SpinalGraphService.getRealNode(userId);
    if (node) {
      node.info.name.set(user.name);
      node.info.email.set(user.email);
      node.info.firstname.set(user.firstname);
      node.info.userProfileId.set(user.userProfileId);
    }

    return node;
  }

  public deleteUser(userId: string) { }
}
