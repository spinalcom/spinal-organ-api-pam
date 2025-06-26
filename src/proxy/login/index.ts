import * as express from "express";
import { AuthentificationService, UserListService } from "../../services";
import { formatUri } from "../bos/utils";
import { HTTP_CODES } from "../../constant";
import * as globalCache from "global-cache";
import { v4 as uuidv4 } from "uuid";
import appProfileController from "../../controllers/appProfile.controller";

export async function useLoginProxy(app: express.Application) {

    app.get('/login', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {

            const authPlatformInfo = await AuthentificationService.getInstance().getPamCredentials();

            if (authPlatformInfo) {
                let server_url = authPlatformInfo.urlAdmin;
                const client_id = authPlatformInfo.clientId;

                if (!server_url || !client_id) {
                    return res.send({ status: HTTP_CODES.BAD_REQUEST, message: "Invalid auth server details" });
                }

                let endpoint = server_url.endsWith("/") ? `login/${client_id}` : `/login/${client_id}`;

                return res.status(HTTP_CODES.REDIRECT).redirect(server_url + endpoint);
            }


            /* 
            * If no auth server is found, redirect to the admin connect page
            * Comment this part if you don't want to redirect to the admin page
            */
            let client_uri = process.env.VUE_CLIENT_URI;
            let endpoint = client_uri!.endsWith("/") ? "admin" : "/admin";
            return res.status(HTTP_CODES.REDIRECT).redirect(client_uri + endpoint);


            /*
            * Discomment this part if you comment the above part
            * This will return a bad request if no auth server is found
            */
            // res.status(HTTP_CODES.BAD_REQUEST).send({ status: HTTP_CODES.BAD_REQUEST, message: "No Authentification server url found, use /admin endpoint to connect as admin" });

        } catch (error) {
            console.error(error.message);
            res.status(HTTP_CODES.INTERNAL_ERROR).send({ status: HTTP_CODES.INTERNAL_ERROR, message: error.message });
        }

    });

    app.post("/callback", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
            const formatData = await UserListService.getInstance().getUserDataFormatted(data, null, true);


            const profileId = formatData.profile.userProfileBosConfigId || data.profile.profileId;
            const token = formatData.token;
            const user = Buffer.from(JSON.stringify(formatData.userInfo)).toString("base64");

            const vue_client_uri = process.env.VUE_CLIENT_URI;

            /**
             * Sending cookies doesn't work when the client and server are on different origins.
             * I implemented this temporary method.
             */
            const cookiesId = uuidv4();
            globalCache.set(cookiesId, { uri: vue_client_uri, profileId, token, user }, 30 * 1000); //store data for 30seconds

            return res.redirect(`${vue_client_uri}/login?ref=${cookiesId}`);

            /**
             * found a way to send cookies with a redirect, but it doesn't work in all browsers
             */
            // const options: express.CookieOptions = {
            //     httpOnly: true,
            //     secure: false,
            //     sameSite: 'none',
            // }

            // res.cookie("profileId", profileId, options);
            // res.cookie("token", token, options);
            // res.cookie("user", user, options);

            // console.log(res.getHeaders());

            // return res.redirect(`${vue_client_uri}?ref=${cookiesId}`);
        } catch (error) {
            console.error(error.message);
            res.status(HTTP_CODES.INTERNAL_ERROR).send({ status: HTTP_CODES.INTERNAL_ERROR, message: error.message });
        }
    });

    app.get("/getTokenByRef/:ref", (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const cookiesId = req.params.ref;

        if (!cookiesId)
            return res.status(HTTP_CODES.BAD_REQUEST).send({ status: HTTP_CODES.BAD_REQUEST, message: "No id provided" });


        const data = globalCache.get(cookiesId); // Retrieve the data from the cache using the cookiesId

        if (!data)
            return res.status(HTTP_CODES.NOT_FOUND).send({ status: HTTP_CODES.NOT_FOUND, message: "No found" });


        // Clear the cache after retrieving the data
        globalCache.delete(cookiesId);

        return res.status(HTTP_CODES.OK).send(data);
    })
}