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

import * as express from 'express';
import { HTTP_CODES, SECURITY_MESSAGES, SECURITY_NAME } from "../constant";
import { IApiRoute, IBosAuth, IBosData, IPortofolioAuth, IPortofolioData, IProfile, IProfileData, IProfileEdit } from "../interfaces";
import { AppProfileService } from "../services";
import { Route, Tags, Get, Post, Put, Delete, Path, Body, Controller, Security, Request } from 'tsoa';
import { _formatBosAuthRes, _formatPortofolioAuthRes, _formatProfile, _getNodeListInfo } from "../utils/profileUtils";
import { checkIfItIsAdmin, getProfileId } from "../security/authentication";
import { AuthError } from "../security/AuthError";
import { AdminProfileService } from '../services/adminProfile.service';

const serviceInstance = AppProfileService.getInstance();

@Route("/api/v1/pam/app_profile")
@Tags("App Profiles")
export class AppProfileController extends Controller {

    public constructor() {
        super();
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/create_profile")
    public async createAppProfile(@Request() req: express.Request, @Body() data: IProfile): Promise<IProfileData | { message: string }> {
        try {

            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            if (!data.name) {
                this.setStatus(HTTP_CODES.BAD_REQUEST)
                return { message: "The profile name is required" };
            }

            const profile = await serviceInstance.createProfile(data);
            this.setStatus(HTTP_CODES.CREATED)
            return _formatProfile(profile);

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_profile/{id}")
    public async getAppProfile(@Request() req: express.Request, @Path() id: string): Promise<IProfileData | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const data = await serviceInstance.getProfileWithAuthorizedPortofolio(id);
            if (data) {
                this.setStatus(HTTP_CODES.OK)
                return _formatProfile(data);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${id}` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_all_profile")
    public async getAllAppProfile(@Request() req: express.Request,): Promise<IProfileData[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.getAllProfilesWithAuthorizedPortfolios() || [];
            this.setStatus(HTTP_CODES.OK);
            return nodes.map(el => _formatProfile(el));
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Put("/edit_profile/{id}")
    public async updateAppProfile(@Request() req: express.Request, @Path() id: string, @Body() data: IProfileEdit): Promise<IProfileData | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await serviceInstance.updateProfile(id, data);
            if (node) {
                this.setStatus(HTTP_CODES.OK);
                return _formatProfile(node);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${id}` };

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Delete("/delete_profile/{id}")
    public async deleteAppProfile(@Request() req: express.Request, @Path() id: string): Promise<{ message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            await serviceInstance.deleteProfile(id);
            this.setStatus(HTTP_CODES.OK);
            return { message: "user profile deleted" };

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    ///////////////////
    //   PORTOFOLIO  //
    ///////////////////

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_authorized_portofolio/{profileId}")
    public async getAuthorizedPortofolio(@Request() req: express.Request, @Path() profileId: string): Promise<IPortofolioData[] | { message: string }> {
        try {
            const id = await getProfileId(req);
            const isAdmin = AdminProfileService.getInstance().isAdmin(id);

            if (!isAdmin && profileId !== id) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.getPortofolioAuthStructure(profileId);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return nodes.map(value => _formatPortofolioAuthRes(value));
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${profileId}` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/authorize_portofolio_apis/{profileId}")
    public async authorizeToAccessPortofolioApis(@Request() req: express.Request, @Path() profileId: string, @Body() data: IPortofolioAuth): Promise<IApiRoute[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.authorizeProfileToAccessPortofolioApisRoute(profileId, data);
            if (nodes) {

                this.setStatus(HTTP_CODES.OK)
                return nodes.reduce((liste, { apis }) => {
                    apis.forEach((node) => {
                        if (node) liste.push(..._getNodeListInfo([node]))
                    })

                    return liste;
                }, []);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_authorized_portofolio_apis/{profileId}/{portofolioId}")
    public async getAuthorizedPortofolioApis(@Request() req: express.Request, @Path() profileId: string, @Path() portofolioId: string): Promise<IApiRoute[] | { message: string }> {
        try {

            const id = await getProfileId(req);
            const isAdmin = AdminProfileService.getInstance().isAdmin(id);

            if (!isAdmin && profileId !== id) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.getAuthorizedPortofolioApis(profileId, portofolioId);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return _getNodeListInfo(nodes);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/unauthorize_portofolio_apis/{profileId}")
    public async unauthorizeToAccessPortofolioApis(@Request() req: express.Request, @Path() profileId: string, @Body() data: { apisIds: string[], portofolioId: string }[]): Promise<string[] | { message: string }> {
        try {

            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.unauthorizeProfileToAccessPortofolioApisRoute(profileId, data);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return nodes.filter(el => el);
            }


            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }



    ////////////
    //   BOS  //
    ////////////

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_authorized_bos/{profileId}/{portofolioId}")
    public async getAuthorizedBos(@Request() req: express.Request, @Path() profileId: string, @Path() portofolioId: string): Promise<IBosData | { message: string }> {
        try {
            const id = await getProfileId(req);
            const isAdmin = AdminProfileService.getInstance().isAdmin(id);

            if (!isAdmin && profileId !== id) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.getBosAuthStructure(profileId, portofolioId);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return nodes.map(node => _formatBosAuthRes(node));
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/authorize_bos_apis/{profileId}/{portofolioId}")
    public async authorizeToAccessBosApis(@Request() req: express.Request, @Path() profileId: string, @Path() portofolioId: string, @Body() data: IBosAuth): Promise<IApiRoute[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.authorizeProfileToAccessBosApiRoute(profileId, portofolioId, data);
            if (nodes) {

                this.setStatus(HTTP_CODES.OK)
                return nodes.reduce((liste, { apis }) => {
                    apis.forEach((node) => {
                        if (node) liste.push(..._getNodeListInfo([node]))
                    })

                    return liste;
                }, []);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_authorized_bos_apis/{profileId}/{portofolioId}/{bosId}")
    public async getAuthorizedBosApis(@Request() req: express.Request, @Path() profileId: string, @Path() portofolioId: string, @Path() bosId: string): Promise<IApiRoute[] | { message: string }> {
        try {
            const id = await getProfileId(req);
            const isAdmin = AdminProfileService.getInstance().isAdmin(id);

            if (!isAdmin && profileId !== id) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.getAuthorizedBosApis(profileId, portofolioId, bosId);

            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return _getNodeListInfo(nodes);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.bearerAuth)
    @Post("/unauthorize_bos_apis/{profileId}/{portofolioId}")
    public async unauthorizeToAccessBosApis(@Request() req: express.Request, @Path() profileId: string, @Path() portofolioId: string, @Body() data: { apisIds: string[], buildingId: string }[]): Promise<string[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.unauthorizeProfileToAccessBosApiRoute(profileId, portofolioId, data);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return nodes.filter(el => el);
            }


            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


}



export default new AppProfileController();