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

import * as fs from "fs";
import * as path from "path";
import * as config from './config.json'


export class APIException {
	private _code: number;
	private _data: any;
	private _message: string;
	private _description: string;

	protected _aCodes = config.RESULT_CODE;

	public getCode(): number {
		return this._code;
	}
	public setCode(code: number): void {
		this._code = code;
	}

	public getData(): any {
		return this._data;
	}
	public setData(obj: any): void {
		this._data = obj;
	}

	public getMessage(): string {
		return this._message;
	}
	public setMessage(msg: string): void {
		this._message = msg;
	}

	public getCodeMsg(): string {
		return this._description;
	}

	public setCodeMsg(msg: string): void {
		this._description = msg;
	}

	private setAll(codes, customErr?: string): void {
		let desc = codes.description;
		if (customErr !== undefined && customErr !== null) {
			desc = customErr;
		}
		this.setCodeMsg(desc);
		this.setMessage(codes.message);
		this.setCode(codes.code);
	}

	public getAll() {
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

	constructor(codeMsg = "OK", customErr?: string) {
		for (const type in this._aCodes) {
			for (const codes of this._aCodes[type]) {
				if (codes.message === codeMsg) {
					this.setAll(codes, customErr);
				}
			}
		}
	}
}
