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
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIException = void 0;
const config = require("./config.json");
class APIException {
    constructor(codeMsg = "OK", customErr) {
        this._aCodes = config.RESULT_CODE;
        for (const type in this._aCodes) {
            for (const codes of this._aCodes[type]) {
                if (codes.message === codeMsg) {
                    this.setAll(codes, customErr);
                }
            }
        }
    }
    getCode() {
        return this._code;
    }
    setCode(code) {
        this._code = code;
    }
    getData() {
        return this._data;
    }
    setData(obj) {
        this._data = obj;
    }
    getMessage() {
        return this._message;
    }
    setMessage(msg) {
        this._message = msg;
    }
    getCodeMsg() {
        return this._description;
    }
    setCodeMsg(msg) {
        this._description = msg;
    }
    setAll(codes, customErr) {
        let desc = codes.description;
        if (customErr !== undefined && customErr !== null) {
            desc = customErr;
        }
        this.setCodeMsg(desc);
        this.setMessage(codes.message);
        this.setCode(codes.code);
    }
    getAll() {
        let result;
        result = {
            code: this.getCode(),
            message: this.getMessage(),
            description: this.getCodeMsg()
        };
        if (this.getData() !== undefined) {
            result.datas = this.getData();
        }
        return result;
    }
}
exports.APIException = APIException;
//# sourceMappingURL=api_exception.js.map