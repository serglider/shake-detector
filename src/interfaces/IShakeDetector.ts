import type { ShakeHandler } from '../types';

export default interface IShakeDetector {
    start: () => IShakeDetector;
    stop: () => IShakeDetector;
    requestPermission: (triggerNode: HTMLElement) => Promise<boolean>;
    confirmPermissionGranted: (this: IShakeDetector) => IShakeDetector;
    subscribe: (listener: ShakeHandler) => IShakeDetector;
    unsubscribe: (listener: ShakeHandler) => IShakeDetector;
}
