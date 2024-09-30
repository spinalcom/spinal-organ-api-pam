import * as express from "express";
import { AuthentificationService, UserListService } from "../../services";
import { formatUri } from "../bos/utils";
import { HTTP_CODES } from "../../constant";



export async function useLoginProxy(app: express.Application) {

    app.get('/login', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const authPlatformIsConnected = await AuthentificationService.getInstance().authPlatformIsConnected;

        if (authPlatformIsConnected) {
            const url = getAuthServerUrl();
            res.redirect(url);
            return;
        }

        res.send({ status: HTTP_CODES.BAD_REQUEST, message: "No Authentification server url found, use /admin endpoint to connect as admin" });
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