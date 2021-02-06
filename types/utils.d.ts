import type { Acceleration, MaybeAcceleration } from './types';
export declare function isAcceleration(acceleration: MaybeAcceleration): acceleration is Acceleration;
export declare function getDelta(a: number, b: number): number;
export declare function isFunc(value: unknown): boolean;
export declare function isDeviceMotionSupported(): boolean;
export declare function isPermissionRequired(): boolean;
