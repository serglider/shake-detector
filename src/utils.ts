import { Acceleration, MaybeAcceleration } from './types';

export function isAcceleration(acceleration: MaybeAcceleration): acceleration is Acceleration {
    if (acceleration === null) {
        return true;
    }
    const { x, y, z } = acceleration;
    return isNumber(x) && isNumber(y) && isNumber(z);
}

function isNumber(num: number | null | undefined): num is number {
    return typeof num === 'number';
}

export function getDelta(a: number, b: number): number {
    return Math.abs(a - b);
}

export function isFunc(value: unknown): boolean {
    return typeof value === 'function';
}

export function isDeviceMotionSupported(): boolean {
    return 'DeviceMotionEvent' in window;
}

export function isPermissionRequired(): boolean {
    return isFunc(DeviceMotionEvent.requestPermission);
}
