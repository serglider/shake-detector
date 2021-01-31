import { MotionEventHandler } from './types';
import IMotionMonitor from './interfaces/IMotionMonitor';
export default class MotionMonitor implements IMotionMonitor {
    private readonly isSupported;
    private isPermissionGranted;
    private listeners;
    constructor();
    subscribe(listener: MotionEventHandler): this;
    unsubscribe(listener: MotionEventHandler): this;
    confirmPermissionGranted(): this;
    requestPermission(triggerElement?: HTMLElement): Promise<boolean>;
    start(): this;
    stop(): this;
    private onMotion;
}
