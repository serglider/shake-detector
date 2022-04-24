import { isDeviceMotionSupported, isFunc, isPermissionRequired } from './utils';
import type { MotionEventHandler, MotionHandlersList } from './types';
import IMotionMonitor from './interfaces/IMotionMonitor';

export default class MotionMonitor implements IMotionMonitor {
    private readonly isSupported: boolean;
    private isPermissionGranted: boolean;
    private listeners: MotionHandlersList = [];

    constructor() {
        this.isSupported = isDeviceMotionSupported();
        if (!this.isSupported) {
            console.warn('DeviceMotionEvent event is not supported in your environment');
        }
        this.isPermissionGranted = this.isSupported && !isPermissionRequired();
    }

    /**
     * Adds a handler from the motion event handlers pool
     * @param listener
     */
    subscribe(listener: MotionEventHandler) {
        if (isFunc(listener)) {
            this.listeners.push(listener);
        }
        return this;
    }

    /**
     * Removes a handler from the motion event handlers pool
     * @param listener
     */
    unsubscribe(listener: MotionEventHandler) {
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
        if (!this.isSupported) {
            return Promise.resolve(false);
        }
        if (this.isPermissionGranted) {
            return Promise.resolve(true);
        }
        return new Promise(resolve => {
            const permissionTriggerHandler = () => {
                DeviceMotionEvent.requestPermission().then(permissionState => {
                    this.isPermissionGranted = permissionState === 'granted';
                    if (!this.isPermissionGranted) {
                        console.warn(
                            'The permission to listen to DeviceMotionEvent was not granted'
                        );
                    }
                    triggerElement.removeEventListener('click', permissionTriggerHandler);
                    resolve(this.isPermissionGranted);
                });
            };

            triggerElement.addEventListener('click', permissionTriggerHandler);
        });
    }

    /**
     * Sets the flag that permission to listen to the motion events have already been granted to true
     */
    confirmPermissionGranted() {
        this.isPermissionGranted = true;
        return this;
    }

    /**
     * Adds device motion listener
     */
    start() {
        if (this.isSupported && this.isPermissionGranted) {
            window.addEventListener('devicemotion', this.onMotion, false);
        }
        return this;
    }

    /**
     * Removes device motion listener
     */
    stop() {
        if (this.isSupported && this.isPermissionGranted) {
            window.removeEventListener('devicemotion', this.onMotion, false);
        }
        return this;
    }

    /**
     * Notifies all the motion event listeners that the motion event happened
     * @private
     */
    private onMotion = (e: DeviceMotionEvent) => {
        this.listeners.forEach(listener => listener(e));
    };
}
