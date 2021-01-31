import { ShakeHandler } from '../types';

export default interface IShakeMonitor {
    start: () => IShakeMonitor;
    stop: () => IShakeMonitor;
    requestPermission: (triggerNode: HTMLElement) => Promise<boolean>;
    confirmPermissionGranted: (this: IShakeMonitor) => IShakeMonitor;
    subscribe: (listener: ShakeHandler) => IShakeMonitor;
    unsubscribe: (listener: ShakeHandler) => IShakeMonitor;
}
