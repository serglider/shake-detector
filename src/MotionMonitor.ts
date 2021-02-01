import { isDeviceMotionSupported, isFunc, isPermissionRequired } from './utils';
import { MotionEventHandler, MotionHandlersList } from './types';
import IMotionMonitor from './interfaces/IMotionMonitor';

export default class MotionMonitor implements IMotionMonitor {
    private readonly isSupported: boolean;
    private isPermissionGranted: boolean;
    private listeners: MotionHandlersList = [];

    constructor() {
        this.isSupported = isDeviceMotionSupported();
        this.isPermissionGranted = !isPermissionRequired();
    }

    subscribe(listener: MotionEventHandler) {
        if (isFunc(listener)) {
            this.listeners.push(listener);
        }
        return this;
    }

    unsubscribe(listener: MotionEventHandler) {
        if (isFunc(listener)) {
            this.listeners = this.listeners.filter(handler => handler !== listener);
        }
        return this;
    }

    confirmPermissionGranted() {
        this.isPermissionGranted = true;
        return this;
    }

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

    start() {
        if (this.isSupported && this.isPermissionGranted) {
            window.addEventListener('devicemotion', this.onMotion, false);
        }
        return this;
    }

    stop() {
        if (this.isSupported && this.isPermissionGranted) {
            window.removeEventListener('devicemotion', this.onMotion, false);
        }
        return this;
    }

    private onMotion = (e: DeviceMotionEvent) => {
        this.listeners.forEach(listener => listener(e));
    };
}
