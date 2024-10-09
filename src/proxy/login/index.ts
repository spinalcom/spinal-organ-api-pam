import * as express from "express";
import { AuthentificationService, UserListService } from "../../services";
import { formatUri } from "../bos/utils";
import { HTTP_CODES } from "../../constant";



export async function useLoginProxy(app: express.Application) {

    app.get('/login', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const authPlatformInfo = await AuthentificationService.getInstance().getPamToAdminCredential();

            if (authPlatformInfo) {
                let server_url = authPlatformInfo.urlAdmin;
                const client_id = authPlatformInfo.clientId;

                if (!server_url || !client_id) {
                    return res.send({ status: HTTP_CODES.BAD_REQUEST, message: "Invalid auth server details" });
                }

                server_url = server_url.endsWith("/") ? server_url : server_url + "/"

                const url = server_url + `login/${client_id}`;

                return res.status(HTTP_CODES.REDIRECT).redirect(url);
            }

            res.status(HTTP_CODES.BAD_REQUEST).send({ status: HTTP_CODES.BAD_REQUEST, message: "No Authentification server url found, use /admin endpoint to connect as admin" });


        } catch (error) {
            console.error(error.message);
            res.status(HTTP_CODES.INTERNAL_ERROR).send({ status: HTTP_CODES.INTERNAL_ERROR, message: error.message });
        }

        // let clientUrl = process.env.VUE_CLIENT_URI;

        // if (!clientUrl || !(/^https?:\/\//.test(clientUrl)))
        //     return res.send({ status: HTTP_CODES.BAD_REQUEST, message: "No Authentification server url found, use /admin endpoint to connect as admin" });

        // clientUrl = clientUrl.endsWith("/") ? clientUrl : clientUrl + "/";

        // return res.redirect(clientUrl + "admin");
    });

    app.post("/callback", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const data = JSON.parse(req.body.data);
            const formatData = await UserListService.getInstance().getUserDataFormatted(data);


            const profileId = formatData.profile.userProfileBosConfigId || data.profile.profileId;
            const token = formatData.token;
            const user = btoa(JSON.stringify(formatData.userInfo));

            res.cookie("profileId", profileId);
            res.cookie("token", token);
            res.cookie("user", user);

            const vue_client_uri = process.env.VUE_CLIENT_URI;
            res.redirect(vue_client_uri);

        } catch (error) {
            console.error(error.message);

        }
    });
}


function getAuthServerUrl() {
    let server_url = process.env.AUTH_SERVER_URL;
    let client_id = process.env.AUTH_CLIENT_ID;

    return server_url.endsWith("/") ? `${server_url}login/${client_id}` : `${server_url}/login/${client_id}`;
}