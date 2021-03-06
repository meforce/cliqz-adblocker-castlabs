/*!
 * Copyright (c) 2017-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
/**
 * Type of an event listener (i.e.: callback). It accepts arbitrary arguments
 * and is not expected to return any result.
 */
declare type EventListener = (...args: any[]) => void;
/**
 * Simple and efficient `EventEmitter` abstraction (following conventions from
 * Node.js) allowing partially typed event emitting. The set of event names is
 * specified as a type parameter while instantiating the event emitter.
 */
export declare class EventEmitter<EventNames> {
    private onceListeners;
    private onListeners;
    /**
     * Register an event listener for `event`.
     */
    on(event: EventNames, callback: EventListener): void;
    /**
     * Register an event listener for `event`; but only listen to first instance
     * of this event. The listener is automatically deleted afterwards.
     */
    once(event: EventNames, callback: EventListener): void;
    /**
     * Remove `callback` from list of listeners for `event`.
     */
    unsubscribe(event: EventNames, callback: EventListener): void;
    /**
     * Emit an event. Call all registered listeners to this event.
     */
    emit(event: EventNames, ...args: any[]): void;
}
export {};
//# sourceMappingURL=events.d.ts.map