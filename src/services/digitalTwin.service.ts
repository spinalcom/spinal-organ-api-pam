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
import { configServiceInstance } from './configFile.service';
import { spinalCore, Ptr } from "spinal-core-connectorjs_type";
import * as path from "path";
import { CONTEXT_TO_DIGITALTWIN_RELATION_NAME, DIGITALTWIN_CONTEXT_NAME, DIGITALTWIN_CONTEXT_TYPE, DIGITALTWIN_TYPE, PORTOFOLIO_CONTEXT_NAME, PTR_LST_TYPE } from "../constant";
import { IDigitalTwin } from "../interfaces";
import { PortofolioService } from "./portofolio.service";

export class DigitalTwinService {
    private static instance: DigitalTwinService;

    private _actualDigitalTwin: SpinalNode;
    private attrName: string = "defaultDigitalTwin";
    public context: SpinalContext;

    private constructor() { }

    public static getInstance(): DigitalTwinService {
        if (!this.instance) this.instance = new DigitalTwinService();

        return this.instance;
    }

    // public async init(): Promise<SpinalContext> {
    //     this.context = await PortofolioService.getInstance().
    //     // if (!this.context) this.context = await configServiceInstance.addContext(DIGITALTWIN_CONTEXT_NAME, DIGITALTWIN_CONTEXT_TYPE);
    //     // await this.getActualDigitalTwin();
    //     return this.context;
    // }

    public createDigitalTwin(name: string, directoryPath: string = "/__users__/admin/PAM DigitalTwin"): Promise<SpinalGraph> {
        return this._getOrCreateDigitalTwin(name, directoryPath).then(async (graph) => {
            const portofolioContext = PortofolioService.getInstance().context;
            const _temp = await graph.getContext(portofolioContext.getName().get());
            if (!_temp) await graph.addContext(portofolioContext);
            return graph;
            // const info = { name, path: path.resolve(`${directoryPath}/${name}`), type: DIGITALTWIN_TYPE, graph: new Ptr(graph) };
            // const digitalTwinId = SpinalGraphService.createNode(info, undefined);
            // const node = SpinalGraphService.getRealNode(digitalTwinId);
            // await this.context.addChildInContext(node, CONTEXT_TO_DIGITALTWIN_RELATION_NAME, PTR_LST_TYPE, this.context);
            // return node;
        })
    }

    private _getOrCreateDigitalTwin(name: string, directoryPath: string): Promise<SpinalGraph> {
        const connect = configServiceInstance.hubConnect;

        return new Promise((resolve, reject) => {
            spinalCore.load(connect, path.resolve(`${directoryPath}/${name}`),
                (graph: SpinalGraph) => {
                    resolve(graph);
                },
                () => connect.load_or_make_dir(directoryPath, (directory) => {
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

    // public async getAllDigitalTwins(): Promise<SpinalNode[]> {
    //     const children = await this.context.getChildren(CONTEXT_TO_DIGITALTWIN_RELATION_NAME);
    //     return children.map(el => el);
    // }

    // public async getDigitalTwin(digitalTwinName: string, digitalTwinPath?: string): Promise<SpinalNode | void> {
    //     const allDigitalTwins = await this.getAllDigitalTwins();
    //     return allDigitalTwins.find(el => {
    //         if (el.getName().get() !== digitalTwinName) return false;
    //         if (!digitalTwinPath) return true;
    //         if (digitalTwinPath === el.info.path?.get()) return true;
    //         return false;
    //     })
    // }

    // public async getDigitalTwinById(id: string): Promise<SpinalNode | void> {
    //     const node = SpinalGraphService.getRealNode(id);
    //     if (node) return node;
    //     const allDigitalTwins = await this.getAllDigitalTwins();
    //     return allDigitalTwins.find(el => el.getId().get() === id);
    // }

    // public async renameDigitalTwin(id: string, newName: string): Promise<SpinalNode | void> {
    //     if (!(newName.trim())) throw new Error("invalid name");

    //     const node = await this.getDigitalTwinById(id);
    //     if (node) node.info.name.set(newName.trim());

    //     return node;
    // }

    // public async removeDigitalTwin(digitalTwinId: string): Promise<boolean> {
    //     const node = await this.getDigitalTwinById(digitalTwinId);
    //     if (node) {
    //         await node.removeFromGraph();
    //         return true;
    //     }

    //     throw new Error(`No digitaltwin found for ${digitalTwinId}`);
    // }

    // public async setActualDigitalTwin(digitalTwinId: string): Promise<SpinalNode | void> {

    //     const digitalTwinNode = await this.getDigitalTwinById(digitalTwinId);
    //     if (digitalTwinNode) {
    //         if (this.context.info[this.attrName]) {
    //             await this.removeActualDigitaTwin();
    //         }
    //         digitalTwinNode.info.add_attr({ [this.attrName]: true });
    //         this.context.info.add_attr({ [this.attrName]: new Ptr(digitalTwinNode) });
    //         this._actualDigitalTwin = digitalTwinNode;
    //         return digitalTwinNode;
    //     }

    //     throw new Error(`No digitaltwin found for ${digitalTwinId}`);
    // }

    // public getActualDigitalTwin(): Promise<SpinalNode> {
    //     return new Promise(async (resolve, reject) => {

    //         if (!this.context.info[this.attrName]) return resolve(undefined);

    //         this.context.info[this.attrName].load((node) => {
    //             this._actualDigitalTwin = node;
    //             resolve(node);
    //         })
    //     });
    // }

    // public async removeActualDigitaTwin(): Promise<void> {
    //     if (!this.context.info[this.attrName]) return;
    //     const defaultDigitalTwin = await this.getActualDigitalTwin();

    //     defaultDigitalTwin.info.rem_attr(this.attrName);
    //     this.context.info.rem_attr(this.attrName);

    // }

    // public getActualDigitalTwinGraph(): Promise<SpinalGraph | void> {
    //     return new Promise((resolve, reject) => {
    //         if (!this._actualDigitalTwin || !this._actualDigitalTwin.info.graph) return resolve();
    //         this._actualDigitalTwin.info.graph.load(graph => resolve(graph));
    //     });

    // }


}