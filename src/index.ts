import { isFunc, isAcceleration, getDelta } from './utils';
import MotionMonitor from './MotionMonitor';
import IShakeMonitor from './interfaces/IShakeMonitor';
import { ShakeMonitorOptions, ShakeHandler, ShakeHandlersList, StoredAcceleration } from './types';

// npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease [--preid=<prerelease-id>] | from-git]
// npm version preminor --preid=beta
// 'npm [-v | --version]' to print npm version
// 'npm view <pkg> version' to view a package's published version
// 'npm ls' to inspect current package/dependency versions

const defaultOptions = {
    threshold: 15,
    frequency: 1000,
};

export default class ShakeMonitor implements IShakeMonitor {
    private readonly threshold: number;
    private readonly frequency: number;
    private readonly motionMonitor: MotionMonitor;
    private listeners: ShakeHandlersList = [];
    private isRunning: boolean = false;
    private lastTime!: number;
    private lastAcceleration: StoredAcceleration = {};

    constructor(options: ShakeMonitorOptions) {
        const { threshold, frequency } = Object.assign({}, defaultOptions, options);
        this.threshold = threshold;
        this.frequency = frequency;
        this.motionMonitor = new MotionMonitor().subscribe(this.onDeviceMotion);
    }

    subscribe(listener: ShakeHandler) {
        if (isFunc(listener)) {
            this.listeners.push(listener);
        }
        return this;
    }

    unsubscribe(listener: ShakeHandler) {
        if (isFunc(listener)) {
            this.listeners = this.listeners.filter(handler => handler !== listener);
        }
        return this;
    }

    confirmPermissionGranted() {
        this.motionMonitor.confirmPermissionGranted();
        return this;
    }

    requestPermission(triggerElement = document.documentElement): Promise<boolean> {
        return this.motionMonitor.requestPermission(triggerElement);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.motionMonitor.start();
            this.reset();
        }
        return this;
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            this.motionMonitor.stop();
            this.reset();
        }
        return this;
    }

    private onShake() {
        const currentTime = performance.now();
        if (currentTime - this.lastTime > this.frequency) {
            this.listeners.forEach(listener => listener());
            this.lastTime = currentTime;
        }
    }

    private reset() {
        this.lastTime = performance.now();
        this.lastAcceleration = {};
    }

    private onDeviceMotion = (e: DeviceMotionEvent) => {
        if (!isAcceleration(e.accelerationIncludingGravity)) {
            this.stop();
            return;
        }

        const { x, y, z } = e.accelerationIncludingGravity;

        if (!isAcceleration(this.lastAcceleration)) {
            this.lastAcceleration.x = x;
            this.lastAcceleration.y = y;
            this.lastAcceleration.z = z;
            return;
        }

        const dx = getDelta(this.lastAcceleration.x, x);
        const dy = getDelta(this.lastAcceleration.y, y);
        const dz = getDelta(this.lastAcceleration.z, z);

        if (isShake(dx, dy, dz, this.threshold)) {
            this.onShake();
        }

        this.lastAcceleration.x = x;
        this.lastAcceleration.y = y;
        this.lastAcceleration.z = z;
    };
}

function isShake(dx: number, dy: number, dz: number, tr: number) {
    return (dx > tr && dy > tr) || (dx > tr && dz > tr) || (dy > tr && dz > tr);
}
