import axios from "axios";
import { CODE_USED_LIST_CONTEXT_NAME, CODE_USED_LIST_CONTEXT_TYPE, CONTEXT_TO_CODE_RELATION_NAME, HTTP_CODES, PTR_LST_TYPE } from "../constant";
import { OtherError } from "../security/AuthError";
import { AuthentificationService } from "./authentification.service";
import { IPamCredential } from "../interfaces";
import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { TokenService } from "./token.service";


export class SpinalCodeUniqueService {
    static instance: SpinalCodeUniqueService;
    public context: SpinalContext;

    private constructor() { }

    public static getInstance(): SpinalCodeUniqueService {
        if (!this.instance) this.instance = new SpinalCodeUniqueService();
        return this.instance;
    }

    async init(graph: SpinalGraph): Promise<SpinalContext> {

        this.context = await graph.getContext(CODE_USED_LIST_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new SpinalContext(CODE_USED_LIST_CONTEXT_NAME, CODE_USED_LIST_CONTEXT_TYPE);
            this.context = await graph.addContext(spinalContext);
        }

        return this.context;
    }


    public async consumeCode(code: string) {
        const bosCredential = await AuthentificationService.getInstance().getPamCredentials();
        if (!bosCredential) throw new OtherError(HTTP_CODES.NOT_FOUND, `No auth found for code ${code}`);

        return axios.post(`${bosCredential.urlAdmin}/codes/consume/${code}`,
            {},
            { headers: { 'Content-Type': 'application/json' } })
            .then(async (result) => {
                let data = result.data;
                data.profile = await this._getProfileInfo(data.token, bosCredential);
                data.userInfo = await this._getCodeInfo(code, bosCredential, data.token);

                const type = "code";
                const info = { name: data.userInfo?.name || code, applicationId: data.userInfo?.applicationId, userId: data.userInfo?.userId, type, userType: type }

                const node = await this._addUserToContext(info);
                await TokenService.getInstance().addTokenToContext(data.token, data);

                return data;
            })


    }


    private _getProfileInfo(userToken: string, adminCredential: IPamCredential) {
        let urlAdmin = adminCredential.urlAdmin;
        let endpoint = "/tokens/getCodeProfileByToken";
        return axios.post(urlAdmin + endpoint, {
            platformId: adminCredential.idPlateform,
            token: userToken
        }).then((result) => {
            if (!result.data) return;
            const data = result.data;
            return data;
        }).catch(err => {
            return {};
        })
    }

    private _getCodeInfo(code: string, adminCredential: IPamCredential, userToken: string) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // "x-access-token": adminCredential.tokenBosAdmin
                "x-access-token": userToken
            },
        }
        return axios.get(`${adminCredential.urlAdmin}/codes/getcode/${code}`, config).then((result) => {
            return result.data;
        }).catch((err) => {
            console.error(err);
        })
    }

    private async _addUserToContext(info: { [key: string]: any }, element?: spinal.Model): Promise<SpinalNode> {

        const nodeId = SpinalGraphService.createNode(info, element);
        const node = SpinalGraphService.getRealNode(nodeId);
        return this.context.addChildInContext(node, CONTEXT_TO_CODE_RELATION_NAME, PTR_LST_TYPE, this.context);
    }


}