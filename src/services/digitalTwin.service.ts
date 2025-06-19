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

import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { spinalCore, Ptr } from "spinal-core-connectorjs_type";
import * as path from "path";
import { CONTEXT_TO_DIGITALTWIN_RELATION_NAME, DIGITALTWIN_CONTEXT_NAME, DIGITALTWIN_CONTEXT_TYPE, DIGITALTWIN_TYPE, PORTOFOLIO_CONTEXT_NAME, PTR_LST_TYPE } from "../constant";
import { IDigitalTwin } from "../interfaces";
import { PortofolioService } from "./portofolio.service";
import { set } from "lodash";

export class DigitalTwinService {
    private static instance: DigitalTwinService;

    private _actualDigitalTwin: SpinalNode;
    private attrName: string = "defaultDigitalTwin";
    public context: SpinalContext;
    private connectSession: spinal.FileSystem;

    private constructor() { }

    public static getInstance(): DigitalTwinService {
        if (!this.instance) this.instance = new DigitalTwinService();

        return this.instance;
    }

    /**
     * Set session to connect to the digital twin.
     * @param {spinal.FileSystem} session
     * @memberof DigitalTwinService
     */
    setConnectSession(session: spinal.FileSystem) {
        this.connectSession = session;
    }


    /**
     * Creates or retrieves a Digital Twin graph.
     * If the graph does not exist, it will be created in the specified directory.
     * Also ensures the Portofolio context is added to the graph if not already present.
     * 
     * @param {string} name - The name of the digital twin.
     * @param {string} [directoryPath="/__users__/admin/PAM DigitalTwin"] - The directory path where the digital twin is stored.
     * @returns {Promise<SpinalGraph>} - The created or retrieved SpinalGraph instance.
     */
    public initDigitalTwin(name: string, directoryPath: string = "/__users__/admin/PAM DigitalTwin"): Promise<SpinalGraph> {
        return this._getOrCreateDigitalTwin(name, directoryPath).then(async (graph) => {
            const portofolioContext = PortofolioService.getInstance().context;
            const portofolioContextIsLinked = await graph.getContext(portofolioContext.getName().get());
            if (!portofolioContextIsLinked) await graph.addContext(portofolioContext);
            return graph;
        })
    }

    private _getOrCreateDigitalTwin(name: string, directoryPath: string): Promise<SpinalGraph> {
        return new Promise((resolve, reject) => {
            spinalCore.load(this.connectSession, path.resolve(`${directoryPath}/${name}`),
                (graph: SpinalGraph) => {
                    resolve(graph);
                },
                () => this.connectSession.load_or_make_dir(directoryPath, (directory) => {
                    resolve(this._createFile(directory, name, directoryPath));
                })
            )
        });
    }

    private _createFile(directory: spinal.Directory, fileName: string, folderPath: string): SpinalGraph {
        const graph = new SpinalGraph(fileName);
        directory.force_add_file(fileName, graph, { model_type: DIGITALTWIN_TYPE, path: `${folderPath}/${fileName}`, icon: "" });
        return graph;
    }


}