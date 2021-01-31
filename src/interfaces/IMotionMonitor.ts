import { MotionEventHandler } from '../types';

export default interface IMotionMonitor {
    start: () => IMotionMonitor;
    stop: () => IMotionMonitor;
    subscribe: (listener: MotionEventHandler) => IMotionMonitor;
    unsubscribe: (listener: MotionEventHandler) => IMotionMonitor;
    confirmPermissionGranted: () => IMotionMonitor;
    requestPermission: (triggerNode: HTMLElement) => Promise<boolean>;
}
