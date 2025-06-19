import * as express from "express";
import { checkAndGetTokenInfo } from "../../security/authentication";
import { HTTP_CODES } from "../../constant";
import { TokenService } from "../../services";
import { getBuildingsAuthorizedToProfile } from "./utils";
import { Utils } from "../../utils/pam_v1_utils/utils";

export async function getBuildingList(req: express.Request, res: express.Response) {
    try {
        const tokenInfo = await checkAndGetTokenInfo(req);

        const buildings = await getBuildingsAuthorizedToProfile(tokenInfo);
        const data = Utils.getReturnObj(null, buildings, "READ");

        return res.send(data);
    } catch (error) {
        return res.status(HTTP_CODES.UNAUTHORIZED).send({
            statusCode: HTTP_CODES.UNAUTHORIZED,
            status: HTTP_CODES.UNAUTHORIZED,
            code: HTTP_CODES.UNAUTHORIZED,
            message: error.message,
        });
    }
}