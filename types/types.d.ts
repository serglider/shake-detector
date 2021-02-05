declare type Collection<T> = T[];
export declare type ShakeHandler = () => void;
export declare type ShakeHandlersList = Collection<ShakeHandler>;
export declare type MotionEventHandler = (e: DeviceMotionEvent) => void;
export declare type MotionHandlersList = Collection<MotionEventHandler>;
export declare type ShakeDetectorOptions = {
    threshold: number;
    debounceDelay: number;
};
export declare type UserOptions = Partial<ShakeDetectorOptions>;
export declare type Acceleration = {
    x: number;
    y: number;
    z: number;
};
export declare type StoredAcceleration = Partial<Acceleration>;
export declare type MaybeAcceleration = StoredAcceleration | Acceleration | DeviceMotionEventAcceleration | null;
export {};
