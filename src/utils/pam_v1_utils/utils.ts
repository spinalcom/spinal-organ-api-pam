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

import { APIException } from "./api_exception";
import * as UTILS from "./constants";

const chalk = require("chalk");


export class Utils {

	private static getDuplicateError(errmsg: string): string {
		if (errmsg.includes("username") || errmsg.includes("email")) {
			return "ERROR-DUPLICATE_ENTRY_EMAIL";
		}
		if (errmsg.includes("phoneNumber")) {
			return "ERROR-DUPLICATE_ENTRY_PHONE";
		}

		return "ERROR-DUPLICATE_ENTRY";
	}

	public static getReturnObj(err, data = undefined, type = "READ", msg = "") {
		let result;
		switch (type) {
			case "ADD":
				result = new APIException("Created");
				break;
			case "DEL":
				result = new APIException(`Deleted Successfully`, msg);
				break;
			default:
				result = new APIException("OK");
				break;
		}
		if (err !== null && err !== undefined && err.code === 11000) {
			err = Utils.getDuplicateError(err.errmsg);
			throw new APIException("Database error", err);
		}

		if (err) {
			throw new APIException(UTILS.DATABASE_ERR, err._message);
		}
		if (data !== undefined) {
			result.setData(data);
		}

		return result.getAll();
	}

	public static getErrObj(e, functionName = "") {
		const result = { code: 500, msg: null };
		const errorPrefix = `SPINAL-API [${functionName}] => `;
		if (e.constructor.name === "APIException") {
			result.code = e.getAll().code;
			result.msg = e.getAll();
			Utils.logger("error", errorPrefix, e.getAll());
		} else if (e !== null && e !== undefined && e.code === 11000) {
			e = Utils.getDuplicateError(e.errmsg);
			result.msg = new APIException(UTILS.INTERNAL_ERR, e).getAll();
		} else if (e.errors !== undefined && e.errors.name === "ValidatorError" && e.errors.kind === "required") {
			const err = Utils.getDuplicateError(e.errors.path);
			result.msg = new APIException(UTILS.INTERNAL_ERR, err).getAll();
			Utils.logger("error", errorPrefix, err);
		} else {
			result.msg = new APIException(UTILS.INTERNAL_ERR, e.message).getAll();
			Utils.logger("error", errorPrefix, e.message);
		}

		return result;
	}

	/*public static replaceCompanyTemplate(company, _mailTemplate, url = "#") {
		_mailTemplate = _mailTemplate.replace("\{\{logo\}\}", company.logo);
		_mailTemplate = _mailTemplate.replace("\{\{company_url\}\}", company.url);
		while (_mailTemplate.search("\{\{company_name\}\}") !== -1) {
			_mailTemplate = _mailTemplate.replace("\{\{company_name\}\}", company.name);
		}
		_mailTemplate = _mailTemplate.replace("\{\{company_address\}\}", company.address);
		_mailTemplate = _mailTemplate.replace("\{\{site_url\}\}", url);

		return _mailTemplate;
	}*/

	public static logger(sType = "log", ...aMsg: any[]) {
		const now = new Date();
		let loggerTime: string;
		// TODO: Determine if legger should be permanent or only in dev env.
		// if (process.env.NODE_ENV === "dev") {
		switch (sType) {
			case "debug":
				loggerTime = chalk.bgBlack.green.bold(`${now} : `);
				break;
			case "info":
				loggerTime = chalk.bgBlack.blue.bold(`${now} : `);
				break;
			case "error":
				loggerTime = chalk.bgBlack.red.bold(`${now} : `);
				break;
			default:
				loggerTime = chalk.bgBlack.bold(`${now} : `);
				break;
		}
		console.log(loggerTime, ...aMsg);
		// }
	}

	public static preg_quote(str, delimiter) {
		return (str + "")
			.replace(new RegExp("[.\\\\+?\\[\\^\\]$(){}=!<>|:\\" + (delimiter || "") + "-]", "g"), "\\$&");
	}

	public static strpos(haystack: string, needle: string, offset?: number) {
		const i = (haystack + "")
			.indexOf(needle, (offset || 0));
		return i === -1 ? false : i;
	}

	public static isOnGoing(begin: Date, end: Date): boolean {
		const now = new Date();

		if (end === null || (now.getTime() >= begin.getTime() && now.getTime() <= end.getTime())) {
			return true;
		}

		return false;
	}
}
