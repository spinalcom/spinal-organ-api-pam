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

import { HTTP_CODES, SECURITY_MESSAGES } from '../constant';

export class AuthError extends Error {
  code: number;
  constructor(message: string, code?: number) {
    super(message);
    if (code) this.code = code;
    else this.setCode(message);
  }

  setCode(message) {
    switch (message) {
      case SECURITY_MESSAGES.INVALID_TOKEN:
      case SECURITY_MESSAGES.UNAUTHORIZED:
        this.code = HTTP_CODES.UNAUTHORIZED;
        break;
      case SECURITY_MESSAGES.NO_PROFILE_FOUND:
        this.code = HTTP_CODES.NOT_FOUND;
        break;
      default:
        this.code = HTTP_CODES.BAD_REQUEST;
    }
  }
}


export class OtherError extends Error {

  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }


}