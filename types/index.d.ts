import IShakeMonitor from './interfaces/IShakeMonitor';
import { ShakeMonitorOptions, ShakeHandler } from './types';
export default class ShakeMonitor implements IShakeMonitor {
    private readonly threshold;
    private readonly frequency;
    private readonly motionMonitor;
    private listeners;
    private isRunning;
    private lastTime;
    private lastAcceleration;
    constructor(options: ShakeMonitorOptions);
    subscribe(listener: ShakeHandler): this;
    unsubscribe(listener: ShakeHandler): this;
    confirmPermissionGranted(): this;
    requestPermission(triggerElement?: HTMLElement): Promise<boolean>;
    start(): this;
    stop(): this;
    private onShake;
    private reset;
    private onDeviceMotion;
}
