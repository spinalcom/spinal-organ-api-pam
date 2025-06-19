"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuildingList = getBuildingList;
const authentication_1 = require("../../security/authentication");
const constant_1 = require("../../constant");
const utils_1 = require("./utils");
const utils_2 = require("../../utils/pam_v1_utils/utils");
async function getBuildingList(req, res) {
    try {
        const tokenInfo = await (0, authentication_1.checkAndGetTokenInfo)(req);
        const buildings = await (0, utils_1.getBuildingsAuthorizedToProfile)(tokenInfo);
        const data = utils_2.Utils.getReturnObj(null, buildings, "READ");
        return res.send(data);
    }
    catch (error) {
        return res.status(constant_1.HTTP_CODES.UNAUTHORIZED).send({
            statusCode: constant_1.HTTP_CODES.UNAUTHORIZED,
            status: constant_1.HTTP_CODES.UNAUTHORIZED,
            code: constant_1.HTTP_CODES.UNAUTHORIZED,
            message: error.message,
        });
    }
}
//# sourceMappingURL=controllers.js.map