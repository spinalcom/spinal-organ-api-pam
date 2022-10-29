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

import { HTTP_CODES, SECURITY_NAME } from "../constant";
import { IApiRoute, IAppProfile, IBosAuth, IBosData, IPortofolioAuth, IPortofolioData, IProfile, IProfileData, IProfileEdit } from "../interfaces";
import { AppProfileService } from "../services";
import { Route, Tags, Get, Post, Put, Delete, Path, Body, Controller, Security } from 'tsoa';
import { _formatBosAuthRes, _formatPortofolioAuthRes, _formatProfile, _getNodeListInfo } from "../utils/profileUtils";
const serviceInstance = AppProfileService.getInstance();

@Route("/api/v1/pam/app_profile")
@Tags("App Profiles")
export class AppProfileController extends Controller {

    public constructor() {
        super();
    }

    @Security(SECURITY_NAME.admin)
    @Post("/create_profile")
    public async createAppProfile(@Body() data: IProfile): Promise<IProfileData | { message: string }> {
        try {

            if (!data.name) {
                this.setStatus(HTTP_CODES.BAD_REQUEST)
                return { message: "The profile name is required" };
            }

            const profile = await serviceInstance.createAppProfile(data);
            this.setStatus(HTTP_CODES.CREATED)
            return _formatProfile(profile);

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/get_profile/{id}")
    public async getAppProfile(@Path() id: string): Promise<IProfileData | { message: string }> {
        try {
            const data = await serviceInstance.getAppProfile(id);
            if (data) {
                this.setStatus(HTTP_CODES.OK)
                return _formatProfile(data);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${id}` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/get_all_profile")
    public async getAllAppProfile(): Promise<IProfileData[] | { message: string }> {
        try {
            const nodes = await serviceInstance.getAllAppProfile() || [];
            this.setStatus(HTTP_CODES.OK);
            return nodes.map(el => _formatProfile(el));
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Put("/edit_profile/{id}")
    public async updateAppProfile(@Path() id: string, @Body() data: IProfileEdit): Promise<IProfileData | { message: string }> {
        try {
            const node = await serviceInstance.updateAppProfile(id, data);
            if (node) {
                this.setStatus(HTTP_CODES.OK);
                return _formatProfile(node);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${id}` };

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Delete("/delete_profile/{id}")
    public async deleteAppProfile(@Path() id: string): Promise<{ message: string }> {
        try {

            await serviceInstance.deleteAppProfile(id);
            this.setStatus(HTTP_CODES.OK);
            return { message: "user profile deleted" };

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    ///////////////////
    //   PORTOFOLIO  //
    ///////////////////

    @Security(SECURITY_NAME.admin)
    @Get("/get_authorized_portofolio/{profileId}")
    public async getAuthorizedPortofolio(@Path() profileId: string): Promise<IPortofolioData[] | { message: string }> {
        try {
            const nodes = await serviceInstance.getPortofolioAuthStructure(profileId);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return nodes.map(value => _formatPortofolioAuthRes(value));
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${profileId}` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Post("/authorize_portofolio_apis/{profileId}")
    public async authorizeToAccessPortofolioApis(@Path() profileId: string, @Body() data: IPortofolioAuth): Promise<IApiRoute[] | { message: string }> {
        try {
            const nodes = await serviceInstance.authorizeToAccessPortofolioApisRoute(profileId, data);
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
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/get_authorized_portofolio_apis/{profileId}/{portofolioId}")
    public async getAuthorizedPortofolioApis(@Path() profileId: string, @Path() portofolioId: string): Promise<IApiRoute[] | { message: string }> {
        try {
            const nodes = await serviceInstance.getAuthorizedPortofolioApis(profileId, portofolioId);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return _getNodeListInfo(nodes);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Post("/unauthorize_portofolio_apis/{profileId}")
    public async unauthorizeToAccessPortofolioApis(@Path() profileId: string, @Body() data: { apisIds: string[], portofolioId: string }[]): Promise<string[] | { message: string }> {
        try {
            const nodes = await serviceInstance.unauthorizeToAccessPortofolioApisRoute(profileId, data);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return nodes.filter(el => el);
            }


            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }



    ////////////
    //   BOS  //
    ////////////

    @Security(SECURITY_NAME.admin)
    @Get("/get_authorized_bos/{profileId}/{portofolioId}")
    public async getAuthorizedBos(@Path() profileId: string, @Path() portofolioId: string): Promise<IBosData | { message: string }> {
        try {
            const nodes = await serviceInstance.getBosAuthStructure(profileId, portofolioId);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return nodes.map(node => _formatBosAuthRes(node));
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Post("/authorize_bos_apis/{profileId}/{portofolioId}")
    public async authorizeToAccessBosApis(@Path() profileId: string, @Path() portofolioId: string, @Body() data: IBosAuth): Promise<IApiRoute[] | { message: string }> {
        try {
            const nodes = await serviceInstance.authorizeToAccessBosApiRoute(profileId, portofolioId, data);
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
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Security(SECURITY_NAME.admin)
    @Get("/get_authorized_bos_apis/{profileId}/{portofolioId}/{bosId}")
    public async getAuthorizedBosApis(@Path() profileId: string, @Path() portofolioId: string, @Path() bosId: string): Promise<IApiRoute[] | { message: string }> {
        try {
            const nodes = await serviceInstance.getAuthorizedBosApis(profileId, portofolioId, bosId);

            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return _getNodeListInfo(nodes);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


    @Security(SECURITY_NAME.admin)
    @Post("/unauthorize_bos_apis/{profileId}/{portofolioId}")
    public async unauthorizeToAccessBosApis(@Path() profileId: string, @Path() portofolioId: string, @Body() data: { apisIds: string[], buildingId: string }[]): Promise<string[] | { message: string }> {
        try {
            const nodes = await serviceInstance.unauthorizeToAccessBosApiRoute(profileId, portofolioId, data);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return nodes.filter(el => el);
            }


            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }


}



export default new AppProfileController();