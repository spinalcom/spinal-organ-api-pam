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

import { ORGAN_LIST_CONTEXT_NAME, ORGAN_LIST_CONTEXT_TYPE } from "../constant";
import { SpinalContext, SpinalGraph } from "spinal-env-viewer-graph-service";

export class OrganListService {
    private static instance: OrganListService;
    public context: SpinalContext;

    private constructor() { }

    public static getInstance() {
        if (!this.instance) this.instance = new OrganListService();

        return this.instance;
    }

    public async init(graph: SpinalGraph): Promise<SpinalContext> {
        this.context = await graph.getContext(ORGAN_LIST_CONTEXT_NAME);
        if (!this.context) {
            const spinalContext = new SpinalContext(ORGAN_LIST_CONTEXT_NAME, ORGAN_LIST_CONTEXT_TYPE);
            this.context = await graph.addContext(spinalContext);
        }
        return this.context;
    }

}