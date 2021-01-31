type Collection<T> = T[];

export type ShakeHandler = () => void;

export type ShakeHandlersList = Collection<ShakeHandler>;

export type MotionEventHandler = (e: DeviceMotionEvent) => void;

export type MotionHandlersList = Collection<MotionEventHandler>;

export type ShakeMonitorOptions = {
    threshold?: number;
    frequency?: number;
};

export type Acceleration = {
    x: number;
    y: number;
    z: number;
};

export type StoredAcceleration = Partial<Acceleration>;

export type MaybeAcceleration =
    | StoredAcceleration
    | Acceleration
    | DeviceMotionEventAcceleration
    | null;
