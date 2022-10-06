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

import { HTTP_CODES } from "../constant";
import { IAppProfile, IBosAuth, IBosData, IPortofolioAuth, IPortofolioData, IProfile, IProfileData } from "../interfaces";
import { AppProfileService } from "../services";
import { Route, Tags, Get, Post, Put, Delete, Path, Body, Controller } from 'tsoa';
import { _formatBosAuthRes, _formatPortofolioAuthRes, _formatProfile, _getNodeListInfo } from "../utils/profileUtils";
const serviceInstance = AppProfileService.getInstance();

@Route("/api/v1/pam/app_profile")
@Tags("App Profiles")
export class AppProfileController extends Controller {

    public constructor() {
        super();
    }

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

    @Put("/edit_profile/{id}")
    public async updateAppProfile(@Path() id: string, @Body() data: IProfile): Promise<IProfileData | { message: string }> {
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

    @Post("/authorize_portofolio_apps/{profileId}")
    public async authorizeToAccessPortofolioApps(@Path() profileId: string, @Body() data: IPortofolioAuth[]): Promise<IPortofolioData[] | { message: string }> {
        try {

            const nodes = await serviceInstance.authorizeToAccessPortofolioApp(profileId, data);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return nodes.map(value => _formatPortofolioAuthRes(value));
            }

            this.setStatus(HTTP_CODES.NOT_FOUND)
            return { message: `no profile found for ${profileId}` };

        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Post("/unauthorize_portofolio_apps/{profileId}")
    public async unauthorizeToAccessPortofolioApps(@Path() profileId: string, @Body() data: IPortofolioAuth[]): Promise<any | { message: string }> {
        try {

            const nodes = await serviceInstance.unauthorizeToAccessPortofolioApp(profileId, data);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK);
                return nodes.reduce((liste: any[], items) => {
                    if (items) {
                        let format = items.map(el => el.info.get());
                        liste.push(format);
                    };
                    return liste;
                }, []);
            }

            this.setStatus(HTTP_CODES.NOT_FOUND);
            return { message: `no profile found for ${profileId}` };
        } catch (error) {
            this.setStatus(HTTP_CODES.INTERNAL_ERROR);
            return { message: error.message };
        }
    }

    @Get("/get_authorized_portofolio/{profileId}")
    public async getAuthorizedPortofolioApps(@Path() profileId: string): Promise<IPortofolioData[] | { message: string }> {
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

    @Post("/authorize_apis/{profileId}")
    public async authorizeToAccessApis(@Path() profileId: string, @Body() data: { authorizeApis: string[] }): Promise<any | { message: string }> {
        try {
            const nodes = await serviceInstance.authorizeToAccessApis(profileId, data.authorizeApis);
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

    @Post("/unauthorize_apis/{profileId}")
    public async unauthorizeToAccessApis(@Path() profileId: string, @Body() data: { unauthorizeApis: string[] }): Promise<any | { message: string }> {
        try {
            const nodes = await serviceInstance.unauthorizeToAccessApis(profileId, data.unauthorizeApis);
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

    @Get("/get_authorized_apis/{profileId}")
    public async getAuthorizedApis(@Path() profileId: string): Promise<any | { message: string }> {
        try {
            const nodes = await serviceInstance.getAuthorizedApis(profileId);
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

    @Post("/authorize_bos_apps/{profileId}")
    public async authorizeProfileToAccessBos(@Path() profileId: string, @Body() data: IBosAuth[]): Promise<IBosData[] | { message: string }> {
        try {
            const nodes = await serviceInstance.authorizeToAccessBosApp(profileId, data);
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

    @Post("/unauthorize_bos_apps/{profileId}")
    public async unauthorizeProfileToAccessBos(@Path() profileId: string, @Body() data: IBosAuth[]): Promise<any | { message: string }> {
        try {
            const nodes = await serviceInstance.unauthorizeToAccessBosApp(profileId, data);
            if (nodes) {
                this.setStatus(HTTP_CODES.OK)
                return nodes.reduce((liste: any[], items) => {
                    if (items) {
                        let format = items.map(el => el.info.get());
                        liste.push(format);
                    };
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

    @Get("/get_authorized_bos/{profileId}")
    public async getAuthorizedBos(@Path() profileId: string): Promise<any | { message: string }> {
        try {
            const nodes = await serviceInstance.getBosAuthStructure(profileId);
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


}



export default new AppProfileController();