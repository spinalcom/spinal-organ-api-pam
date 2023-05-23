/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
import * as lodash from 'lodash';
import {EventEmitter} from 'events';

export enum Events {
  FINISH = 'finish',
  START = 'start',
}

export class SpinalQueue extends EventEmitter {
  private processed: Array<any> = [];
  private queueList: Array<any> = [];
  private isStopped: boolean = false;
  public percent: number = 0;
  private length: number;
  public isProcessing: boolean = false;

  private debounceStart = lodash.debounce(this.begin, 3000);

  constructor() {
    super();
  }

  public addToQueue(obj: any): number {
    this.queueList.push(obj);
    this.length = this.queueList.length;
    this.debounceStart();
    return this.length;
  }

  public setQueue(queue: any[]): number {
    this.queueList.push(...queue);
    this.length = this.queueList.length;
    this.debounceStart();
    return this.length;
  }

  public dequeue(): any {
    const item = this.queueList.shift();

    if (this.queueList.length === 0) this.finish();
    else this.processed.push(item);

    this.percent = Math.floor((100 * this.processed.length) / this.length);
    return item;
  }

  public refresh() {
    this.queueList = [];
  }

  public pause() {
    this.isStopped = true;
  }

  public resume() {
    let old = this.isStopped;
    this.isStopped = false;

    if (old) this.debounceStart();
  }

  public getQueue(): any[] {
    return [...this.queueList];
  }

  public isEmpty(): boolean {
    return this.queueList.length === 0;
  }

  private begin() {
    if (!this.isProcessing) {
      this.isProcessing = true;
      this.emit(Events.START);
    }
  }

  private finish() {
    if (this.isProcessing) {
      this.isProcessing = false;
      this.emit(Events.FINISH);
    }
  }
}

export default SpinalQueue;
