import type { MotionEventHandler } from './types';
import IMotionMonitor from './interfaces/IMotionMonitor';
export default class MotionMonitor implements IMotionMonitor {
    private readonly isSupported;
    private isPermissionGranted;
    private listeners;
    constructor();
    /**
     * Adds a handler from the motion event handlers pool
     * @param listener
     */
    subscribe(listener: MotionEventHandler): this;
    /**
     * Removes a handler from the motion event handlers pool
     * @param listener
     */
    unsubscribe(listener: MotionEventHandler): this;
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
     * Sets the flag that permission to listen to the motion events have already been granted to true
     */
    confirmPermissionGranted(): this;
    /**
     * Adds device motion listener
     */
    start(): this;
    /**
     * Removes device motion listener
     */
    stop(): this;
    /**
     * Notifies all the motion event listeners that the motion event happened
     * @private
     */
    private onMotion;
}
