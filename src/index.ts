// index.ts
/**
 * The library exposes the ```ShakeDetector``` class.
 * @packageDocumentation
 * @module ShakeDetector
 */

import { isFunc, isAcceleration, getDelta } from './utils';
import MotionMonitor from './MotionMonitor';
import IShakeDetector from './interfaces/IShakeDetector';
import type {
    ShakeDetectorOptions,
    UserOptions,
    ShakeHandler,
    ShakeHandlersList,
    StoredAcceleration,
} from './types';

export default class ShakeDetector implements IShakeDetector {
    public static SHAKE_EVENT = 'shake-detected';
    private static defaultOptions: ShakeDetectorOptions = {
        threshold: 15,
        debounceDelay: 1000,
    };
    private readonly threshold: number;
    private readonly debounceDelay: number;
    private readonly motionMonitor: MotionMonitor;
    private listeners: ShakeHandlersList = [];
    private lastAcceleration: StoredAcceleration = {};
    private isRunning: boolean = false;
    private lastTime!: number;

    constructor(options: UserOptions) {
        const { threshold, debounceDelay } = Object.assign(
            {},
            ShakeDetector.defaultOptions,
            options
        );
        this.threshold = threshold;
        this.debounceDelay = debounceDelay;
        this.motionMonitor = new MotionMonitor().subscribe(this.onDeviceMotion);
    }

    /**
     * Adds a handler to the shake event handlers pool
     * @param listener
     */
    subscribe(listener: ShakeHandler) {
        if (isFunc(listener)) {
            this.listeners.push(listener);
        }
        return this;
    }

    /**
     * Removes a handler from the shake event handlers pool
     * @param listener
     */
    unsubscribe(listener: ShakeHandler) {
        if (isFunc(listener)) {
            this.listeners = this.listeners.filter(handler => handler !== listener);
        }
        return this;
    }

    /**
     * IOS (since 12.2) requires a user's permission to listen to the motion events.
     * Such permission could be obtained only in response to user interaction.
     *
     * This method sets a click listener on the provided element (on ```html``` if not provided)
     * and returns a promise. Once the element clicked, it asks for permission.
     * The promise will be resolved with a boolean reflecting the user's decision.
     *
     * If no such permission needed, the method returns resolved promise.
     *
     * @param triggerElement
     */
    requestPermission(triggerElement = document.documentElement): Promise<boolean> {
        return this.motionMonitor.requestPermission(triggerElement);
    }

    /**
     * Notifies the detector that permission to listen to the motion events has already been granted.
     */
    confirmPermissionGranted() {
        this.motionMonitor.confirmPermissionGranted();
        return this;
    }

    /**
     * Starts monitoring the motion event
     */
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.motionMonitor.start();
            this.reset();
        }
        return this;
    }

    /**
     * Stops monitoring the motion event
     */
    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            this.motionMonitor.stop();
            this.reset();
        }
        return this;
    }

    /**
     * Notifies all the shake event listeners that the shake event happened
     * @private
     */
    private onShake() {
        const currentTime = performance.now();
        if (currentTime - this.lastTime > this.debounceDelay) {
            emitShakeEvent();
            this.listeners.forEach(listener => listener());
            this.lastTime = currentTime;
        }
    }

    /**
     * Resets previously collected data
     * @private
     */
    private reset() {
        this.lastTime = performance.now();
        this.lastAcceleration = {};
    }

    /**
     * Listens to the motion events and tries to detect the shake event.
     * @param e
     */
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

/**
 * Fires the shake event on window
 */
function emitShakeEvent() {
    const event = new CustomEvent(ShakeDetector.SHAKE_EVENT);
    window.dispatchEvent(event);
}

/**
 * Compares changes in acceleration with the threshold
 * @param dx change in acceleration on X-axis
 * @param dy change in acceleration on Y-axis
 * @param dz change in acceleration on Z-axis
 * @param tr threshold
 */
function isShake(dx: number, dy: number, dz: number, tr: number) {
    return (dx > tr && dy > tr) || (dx > tr && dz > tr) || (dy > tr && dz > tr);
}
