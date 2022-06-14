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

import { SpinalGraphService, SpinalGraph, SpinalContext, SpinalNode } from 'spinal-env-viewer-graph-service';

import {
  CONTEXT_TO_ROLE_RELATION_NAME,
  PTR_LST_TYPE,
} from '../constant';

/**
 *
 * @export
 * @class SpinalTwinAdminGraph
 */
export class GraphService {

  private static instance: GraphService;

  private constructor() { }

  public static getInstance(): GraphService {
    if (!this.instance) {
      this.instance = new GraphService();
    }

    return this.instance;
  }

  init(
    directory: spinal.Directory<any>, filename: string): Promise<SpinalGraph<any>> {
    let promises = [];
    const graph = new SpinalGraph('BosConfig');

    const DataListContext = new SpinalContext('DigitalTwin');
    const SpinaltwinDescContext = new SpinalContext('SpinalTwinDescription');
    const UserProfileContext = new SpinalContext('UserProfileList');
    const AppProfileContext = new SpinalContext('AppProfileList');
    const ApiContext = new SpinalContext('ApiList');
    const OrganContext = new SpinalContext('OrganList');
    const RoleListContext = new SpinalContext('RoleList');
    const RegisterAdminContext = new SpinalContext('RegisterAdmin');
    const CredentialBosToAdminContext = new SpinalContext('CredentialBosAdmin');
    const CredentialAdminToBosContext = new SpinalContext('CredentialAdminBos');

    promises.push(
      graph.addContext(DataListContext),
      graph.addContext(SpinaltwinDescContext),
      graph.addContext(AppProfileContext),
      graph.addContext(UserProfileContext),
      graph.addContext(RoleListContext),
      graph.addContext(RegisterAdminContext),
      graph.addContext(ApiContext),
      graph.addContext(OrganContext),
      graph.addContext(CredentialBosToAdminContext),
      graph.addContext(CredentialAdminToBosContext)
    );
    const read = new SpinalNode('Lecture');
    const write = new SpinalNode('Ecriture');
    const deleted = new SpinalNode('Suppression');

    promises.push(
      RoleListContext.addChildInContext(
        read,
        CONTEXT_TO_ROLE_RELATION_NAME,
        PTR_LST_TYPE
      ),
      RoleListContext.addChildInContext(
        write,
        CONTEXT_TO_ROLE_RELATION_NAME,
        PTR_LST_TYPE
      ),
      RoleListContext.addChildInContext(
        deleted,
        CONTEXT_TO_ROLE_RELATION_NAME,
        PTR_LST_TYPE
      )
    );

    const dataRoomNode = new SpinalNode('DataRoom');
    const maintenanceBookNode = new SpinalNode('MaintenanceBook');
    const operationCenterNode = new SpinalNode('OperationCenter');

    promises.push(
      SpinaltwinDescContext.addChildInContext(
        dataRoomNode,
        'hasGroupApplication',
        'PtrLst'
      ),
      SpinaltwinDescContext.addChildInContext(
        maintenanceBookNode,
        'hasGroupApplication',
        'PtrLst'
      ),
      SpinaltwinDescContext.addChildInContext(
        operationCenterNode,
        'hasGroupApplication',
        'PtrLst'
      )
    );
    // App for DataRoom
    const EquipmentCenter = new SpinalNode('Equipment');
    const DescriptionCenter = new SpinalNode('Description');
    const SpaceCenter = new SpinalNode('Space');

    promises.push(
      dataRoomNode.addChildInContext(
        EquipmentCenter,
        'hasApplicationDataRoom',
        'PtrLst',
        SpinaltwinDescContext
      ),
      dataRoomNode.addChildInContext(
        DescriptionCenter,
        'hasApplicationDataRoom',
        'PtrLst',
        SpinaltwinDescContext
      ),
      dataRoomNode.addChildInContext(
        SpaceCenter,
        'hasApplicationDataRoom',
        'PtrLst',
        SpinaltwinDescContext
      )
    );
    // App for MaintenanceBook
    const TicketCenter = new SpinalNode('Ticket');
    const NoteCenter = new SpinalNode('Note');
    const AgendaCenter = new SpinalNode('Agenda');

    promises.push(
      maintenanceBookNode.addChildInContext(
        TicketCenter,
        'hasApplicationMaintenanceBook',
        'PtrLst',
        SpinaltwinDescContext
      ),
      maintenanceBookNode.addChildInContext(
        NoteCenter,
        'hasApplicationMaintenanceBook',
        'PtrLst',
        SpinaltwinDescContext
      ),
      maintenanceBookNode.addChildInContext(
        AgendaCenter,
        'hasApplicationMaintenanceBook',
        'PtrLst',
        SpinaltwinDescContext
      )
    );
    // App for OperationCenter
    const InsightCenter = new SpinalNode('Insight');
    const ControlCenter = new SpinalNode('Control');
    const AlarmCenter = new SpinalNode('Alarm');
    const EnergyCenter = new SpinalNode('Energy');

    promises.push(
      operationCenterNode.addChildInContext(
        InsightCenter,
        'hasApplicationOperation',
        'PtrLst',
        SpinaltwinDescContext
      ),
      operationCenterNode.addChildInContext(
        ControlCenter,
        'hasApplicationOperation',
        'PtrLst',
        SpinaltwinDescContext
      ),
      operationCenterNode.addChildInContext(
        AlarmCenter,
        'hasApplicationOperation',
        'PtrLst',
        SpinaltwinDescContext
      ),
      operationCenterNode.addChildInContext(
        EnergyCenter,
        'hasApplicationOperation',
        'PtrLst',
        SpinaltwinDescContext
      )
    );

    directory.force_add_file(filename, graph, {
      model_type: 'SpinalTwin Admin',
    });

    return Promise.all(promises).then(() => {
      return graph;
    });
  }

  public async getContext(name?: string): Promise<SpinalNode<any>> {
    const graph = SpinalGraphService.getGraph();
    const contexts = await graph.getContext(name);
    /*if (name && name.trim().length > 0) {
            const found: any = contexts.filter(el => el.getName().get() === name);
            return found ? found.info.get() : undefined;
        }*/
    return contexts;
  }
}
