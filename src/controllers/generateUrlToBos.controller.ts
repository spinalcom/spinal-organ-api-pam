import { Body, Controller, Path, Post, Request, Route, Security, Tags } from "tsoa";
import { HTTP_CODES, SECURITY_NAME } from "../constant";
import * as express from "express";
import { getProfileNode } from "../security/authentication";
import AuthorizationService from "../services/authorization.service";
import { AuthentificationService } from "../services";
import { getToken } from "../security/utils";

@Route("/api/v1/pam")
@Tags("Auth")
export class GenerateUrlToBosController extends Controller {
    public constructor() {
        super();
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Post("/generate_url_to_bos/{buildingId}")
    public async generateUrlToBos(@Request() req: express.Request, @Path() buildingId: string): Promise<{ url: string } | { message: string }> {
        try {
            const profile = await getProfileNode(req);
            const buildingNode = await AuthorizationService.getInstance().profileHasAccessToNode(profile, buildingId);

            if (!buildingNode) {
                this.setStatus(HTTP_CODES.UNAUTHORIZED);
                return { message: "You don't have access to this building" };
            }

            const token = getToken(req);
            const url = await AuthentificationService.getInstance().createRedirectLinkToBosConfig(buildingNode.info.get(), token);
            this.setStatus(HTTP_CODES.OK);

            return { url };

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }
}