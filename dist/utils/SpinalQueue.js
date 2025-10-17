"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinalQueue = exports.Events = void 0;
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
const lodash = require("lodash");
const events_1 = require("events");
var Events;
(function (Events) {
    Events["FINISH"] = "finish";
    Events["START"] = "start";
})(Events || (exports.Events = Events = {}));
class SpinalQueue extends events_1.EventEmitter {
    constructor() {
        super();
        this.processed = [];
        this.queueList = [];
        this.isStopped = false;
        this.percent = 0;
        this.isProcessing = false;
        this.debounceStart = lodash.debounce(this.begin, 3000);
    }
    addToQueue(obj) {
        this.queueList.push(obj);
        this.length = this.queueList.length;
        this.debounceStart();
        return this.length;
    }
    setQueue(queue) {
        this.queueList.push(...queue);
        this.length = this.queueList.length;
        this.debounceStart();
        return this.length;
    }
    dequeue() {
        const item = this.queueList.shift();
        if (this.queueList.length === 0)
            this.finish();
        else
            this.processed.push(item);
        this.percent = Math.floor((100 * this.processed.length) / this.length);
        return item;
    }
    refresh() {
        this.queueList = [];
    }
    pause() {
        this.isStopped = true;
    }
    resume() {
        let old = this.isStopped;
        this.isStopped = false;
        if (old)
            this.debounceStart();
    }
    getQueue() {
        return [...this.queueList];
    }
    isEmpty() {
        return this.queueList.length === 0;
    }
    begin() {
        if (!this.isProcessing) {
            this.isProcessing = true;
            this.emit(Events.START);
        }
    }
    finish() {
        if (this.isProcessing) {
            this.isProcessing = false;
            this.emit(Events.FINISH);
        }
    }
}
exports.SpinalQueue = SpinalQueue;
exports.default = SpinalQueue;
//# sourceMappingURL=SpinalQueue.js.map