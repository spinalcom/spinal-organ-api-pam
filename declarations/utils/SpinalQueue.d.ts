/// <reference types="node" />
import { EventEmitter } from 'events';
export declare enum Events {
    FINISH = "finish",
    START = "start"
}
export declare class SpinalQueue extends EventEmitter {
    private processed;
    private queueList;
    private isStopped;
    percent: number;
    private length;
    isProcessing: boolean;
    private debounceStart;
    constructor();
    addToQueue(obj: any): number;
    setQueue(queue: any[]): number;
    dequeue(): any;
    refresh(): void;
    pause(): void;
    resume(): void;
    getQueue(): any[];
    isEmpty(): boolean;
    private begin;
    private finish;
}
export default SpinalQueue;
