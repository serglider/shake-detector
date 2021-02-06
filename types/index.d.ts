/**
 * The library exposes the ```ShakeDetector``` class.
 * @packageDocumentation
 * @module ShakeDetector
 */
import IShakeDetector from './interfaces/IShakeDetector';
import type { UserOptions, ShakeHandler } from './types';
export default class ShakeDetector implements IShakeDetector {
    static SHAKE_EVENT: string;
    private static defaultOptions;
    private readonly threshold;
    private readonly debounceDelay;
    private readonly motionMonitor;
    private listeners;
    private lastAcceleration;
    private isRunning;
    private lastTime;
    constructor(options: UserOptions);
    /**
     * Adds a handler to the shake event handlers pool
     * @param listener
     */
    subscribe(listener: ShakeHandler): this;
    /**
     * Removes a handler from the shake event handlers pool
     * @param listener
     */
    unsubscribe(listener: ShakeHandler): this;
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
    requestPermission(triggerElement?: HTMLElement): Promise<boolean>;
    /**
     * Notifies the detector that permission to listen to the motion events has already been granted.
     */
    confirmPermissionGranted(): this;
    /**
     * Starts monitoring the motion event
     */
    start(): this;
    /**
     * Stops monitoring the motion event
     */
    stop(): this;
    /**
     * Notifies all the shake event listeners that the shake event happened
     * @private
     */
    private onShake;
    /**
     * Resets previously collected data
     * @private
     */
    private reset;
    /**
     * Listens to the motion events and tries to detect the shake event.
     * @param e
     */
    private onDeviceMotion;
}
