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
import { IBosAuth, IBosData, IPortofolioData, IProfile, IProfileData, IProfileEdit } from "../interfaces";
import { UserProfileService } from "../services";
import { Route, Tags, Controller, Post, Get, Put, Delete, Body, Path, Security, Request } from "tsoa";
import { _formatProfile, _getNodeListInfo, _formatProfileKeys, _formatAuthorizationData, _formatPortofolioAuthRes, _formatBosAuthRes } from '../utils/profileUtils'
import { AuthError } from '../security/AuthError';
import { checkIfItIsAdmin, getProfileId } from '../security/authentication';
import { AdminProfileService } from '../services/adminProfile.service';
const serviceInstance = UserProfileService.getInstance();

@Route("/api/v1/pam/user_profile")
@Tags("user Profiles")
export class UserProfileController extends Controller {

    public constructor() {
        super();
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Post("/create_profile")
    public async createUserProfile(@Request() req: express.Request, @Body() data: IProfile): Promise<IProfileData | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            if (!data.name) {
                this.setStatus(HTTP_CODES.BAD_REQUEST)
                return { message: "The profile name is required" };
            }

            const profile = await serviceInstance.createUserProfile(data);
            this.setStatus(HTTP_CODES.CREATED)
            return _formatProfile(profile);

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_profile/{id}")
    public async getUserProfile(@Request() req: express.Request, @Path() id: string): Promise<IProfileData | { message: string }> {
        try {
            const profileId = await getProfileId(req);
            const isAdmin = AdminProfileService.getInstance().isAdmin(profileId);

            if (!isAdmin && profileId !== id) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const data = await serviceInstance.getUserProfile(id);
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
    public async getAllUserProfile(@Request() req: express.Request,): Promise<IProfileData[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.getAllUserProfile() || [];
            this.setStatus(HTTP_CODES.OK);
            return nodes.map(el => _formatProfile(el));
        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Put("/edit_profile/{id}")
    public async updateUserProfile(@Request() req: express.Request, @Path() id: string, @Body() data: IProfileEdit): Promise<IProfileData | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const node = await serviceInstance.updateUserProfile(id, data);
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
    public async deleteUserProfile(@Request() req: express.Request, @Path() id: string): Promise<{ message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);


            await serviceInstance.deleteUserProfile(id);
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
    public async getAuthorizedPortofolioApps(@Request() req: express.Request, @Path() profileId: string): Promise<IPortofolioData[] | { message: string }> {
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
    @Post("/authorize_portofolio_apps/{profileId}")
    public async authorizeToAccessPortofolioApps(@Request() req: express.Request, @Path() profileId: string, @Body() data: { appsIds: string[], portofolioId: string }[]): Promise<IPortofolioData[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.authorizeToAccessPortofolioApp(profileId, data);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return nodes.map(value => _formatPortofolioAuthRes(value));
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };

        } catch (error) {
            this.setStatus(error.code || HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.bearerAuth)
    @Get("/get_authorized_portofolio_apps/{profileId}/{portofolioId}")
    public async getAuthorizedPortofolioApis(@Request() req: express.Request, @Path() profileId: string, @Path() portofolioId: string): Promise<any | { message: string }> {
        try {
            const id = await getProfileId(req);
            const isAdmin = AdminProfileService.getInstance().isAdmin(id);

            if (!isAdmin && profileId !== id) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.getAuthorizedPortofolioApp(profileId, portofolioId);
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
    @Post("/unauthorize_portofolio_apps/{profileId}")
    public async unauthorizeToAccessPortofolioApps(@Request() req: express.Request, @Path() profileId: string, @Body() data: { appsIds: string[], portofolioId: string }[]): Promise<any | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.unauthorizeToAccessPortofolioApp(profileId, data);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK);
                return nodes.reduce((liste: any[], item) => {
                    if (item) liste.push(item.info.get());

                    return liste;
                }, []);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
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
    public async getAuthorizedBos(@Request() req: express.Request, @Path() profileId: string, @Path() portofolioId: string): Promise<any | { message: string }> {
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
    @Post("/authorize_bos_apps/{profileId}/{portofolioId}")
    public async authorizeToAccessBosApps(@Request() req: express.Request, @Path() profileId: string, @Path() portofolioId: string, @Body() data: IBosAuth[]): Promise<IBosData[] | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.authorizeToAccessBosApp(profileId, portofolioId, data);
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
    @Get("/get_authorized_bos_apps/{profileId}/{portofolioId}/{bosId}")
    public async getAuthorizedBosApis(@Request() req: express.Request, @Path() profileId: string, @Path() portofolioId: string, @Path() bosId: string): Promise<any | { message: string }> {
        try {
            const id = await getProfileId(req);
            const isAdmin = AdminProfileService.getInstance().isAdmin(id);

            if (!isAdmin && profileId !== id) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.getAuthorizedBosApp(profileId, portofolioId, bosId);

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
    @Post("/unauthorize_bos_apps/{profileId}/{portofolioId}")
    public async unauthorizeToAccessBosApp(@Request() req: express.Request, @Path() profileId: string, @Path() portofolioId: string, @Body() data: { appsIds: string[], buildingId: string }[]): Promise<any | { message: string }> {
        try {
            const isAdmin = await checkIfItIsAdmin(req);
            if (!isAdmin) throw new AuthError(SECURITY_MESSAGES.UNAUTHORIZED);

            const nodes = await serviceInstance.unauthorizeToAccessBosApp(profileId, portofolioId, data);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return nodes.reduce((liste: any[], item) => {
                    if (item) liste.push(item.info.get());
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

}


export default new UserProfileController();