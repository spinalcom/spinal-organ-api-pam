import { SpinalContext, SpinalGraph, SpinalNode } from "spinal-model-graph"
import { IAppCredential, IPlatformInfo, IOAuth2Credential, IPamCredential, IAdminCredential, IAdminUserProfile, IAdminAppProfile } from "../interfaces"
import { AppProfileService, UserProfileService } from "../services";


export async function getOrCreateContext(graph: SpinalGraph, contextName: string, contextType: string): Promise<SpinalContext> {
    let context = await graph.getContext(contextName);
    if (!context) {
        const spinalContext = new SpinalContext(contextName, contextType);
        context = await graph.addContext(spinalContext);
    }
    return context;
}



export async function getRequestBody(update: boolean, bosCredential: IPamCredential, adminCredential: IAdminCredential) {
    return JSON.stringify({
        TokenBosAdmin: bosCredential.tokenPamToAdmin,
        platformId: bosCredential.idPlateform,
        jsonData: await getPlatformInfo(),
        ...(!update && {
            URLBos: ``,
            TokenAdminBos: adminCredential.TokenAdminToPam,
            idPlatformOfAdmin: adminCredential.idPlatformOfAdmin
        }),
    })
}


async function getPlatformInfo(): Promise<IPlatformInfo> {
    return {
        userProfileList: await _formatUserProfiles(),
        appProfileList: await _formatAppProfiles(),
        organList: [],
        // appList: await this._formatAppList()
    }
}

function _formatUserProfiles(): Promise<IAdminUserProfile[]> {
    return UserProfileService.getInstance().getAllProfilesNodes().then((nodes) => {
        return nodes.map(el => ({
            userProfileId: el.info.id.get(),
            label: el.info.name.get()
        }))
    })
}

function _formatAppProfiles(): Promise<IAdminAppProfile[]> {
    return AppProfileService.getInstance().getAllProfilesNodes().then((nodes) => {
        return nodes.map(el => ({
            appProfileId: el.info.id.get(),
            label: el.info.name.get()
        }))
    })
}

function _formatCredentialInfo(info: IAppCredential | IOAuth2Credential): IAppCredential {
    const obj: any = { clientId: undefined, clientSecret: undefined };
    if ("client_id" in info) {
        obj.clientId = info["client_id"];
    }

    if ("client_secret" in info) {
        obj.clientSecret = info["client_secret"];
    }

    return (obj.clientId && obj.clientSecret ? obj : info) as IAppCredential;
}