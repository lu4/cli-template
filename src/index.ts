import Deque from 'double-ended-queue';

// The code below performs as minimal as possible tweeking of `process.on` / `process.once` / `process.exit` methods
// to support promises and async / await within `process.on` / `process.once`. Currently if you run an
// `async` / `await` operation within `process.on` / `process.once` event you would immediatelly pass control
// to the following event-handler (potentially from 3-rd party library) which in turn can perform `process.exit`
// in short your `await`ed / `promise`d code would not be waited upon and you would not be able to complete
// the work you were expecting to complete. In order to deal with this issue we decorate
// `process.on` / `process.once` / `process.exit` methods that serialize event handler calls with respect to
// `async` / `await` and returned promise.

// tslint:disable: ban-types only-arrow-functions

const executions = { executions: 0 };
const onHandlerOriginal: Function = process.on;
const exitHandlerOriginal: Function = process.exit;
const wrapperToListener: Map<Function, Function> = new Map();
const listenerToWrappers: Map<Function, Set<Function>> = new Map();
const eventHandlerQueueToSignal: Map<string | symbol, Set<Function>> = new Map();

const eventHandlerFactory = (
    eventArguments: Deque<IArguments>,
    eventHandlers: Set<Function>,
    state: { executions: number }
) => async function () {
    state.executions++;
    eventArguments.push(arguments);

    // In order to serialize all event handler calls we need to make sure only one execution path is
    // actually performing event handling logic
    if (state.executions === 1) {
        for (let args = eventArguments.pop(); args; args = eventArguments.pop()) {
            for (const eventHandler of eventHandlers) {
                await Promise.resolve(eventHandler.apply(process, arguments));
            }

            state.executions--;
        }
    }

    if (state.executions === 0 && exiting) {
        // All event handlers completed, we can now safely exit (process first exit call)
        exitHandlerOriginal.apply(process, exitArgs);
    }
};

const on = (event: string, listener: Function): NodeJS.Process => {
    let queue = eventHandlerQueueToSignal.get(event);
    let wrapper = function <T>(this: T) {
        return listener.apply(this, arguments);
    };

    wrapperToListener.set(wrapper, listener);

    const wrappers = listenerToWrappers.get(listener);

    if (wrappers) {
        wrappers.add(wrapper);
    } else {
        listenerToWrappers.set(listener, new Set([wrapper]));
    }

    if (queue) {
        // We use wrapper function to bot support duplicates in a Set and once functionality.
        queue.add(wrapper);
    } else {
        const deque = new Deque<IArguments>();

        // We use wrapper function to bot support duplicates in a Set and once functionality.
        eventHandlerQueueToSignal.set(event, queue = new Set([wrapper]));
        onHandlerOriginal.call(process, event, eventHandlerFactory(deque, queue, executions));
    }

    return process;
};

const once = (event: string, listener: Function): NodeJS.Process => {
    let queue = eventHandlerQueueToSignal.get(event);
    const wrapper = function <T>(this: T) {
        try {
            return listener.apply(this, arguments);
        } finally {
            if (queue) {
                // This is once handler, it should be executed only once
                queue.delete(listener);
            }
        }
    };

    wrapperToListener.set(wrapper, listener);

    const wrappers = listenerToWrappers.get(listener);

    if (wrappers) {
        wrappers.add(wrapper);
    } else {
        listenerToWrappers.set(listener, new Set([wrapper]));
    }

    if (queue) {
        queue.add(wrapper);
        // We use wrapper function to bot support duplicates in a Set and once functionality.
    } else {
        const deque = new Deque<IArguments>();

        // We use wrapper function to bot support duplicates in a Set and once functionality.
        eventHandlerQueueToSignal.set(event, queue = new Set([wrapper]));
        onHandlerOriginal.call(process, event, eventHandlerFactory(deque, queue, executions));
    }

    return process;
};

const removeListener = (event: string, listener: Function): NodeJS.Process => {
    let queue = eventHandlerQueueToSignal.get(event);

    if (queue) {
        const wrappers = listenerToWrappers.get(listener);

        if (wrappers) {
            for (const wrapper of wrappers) {
                queue.delete(wrapper);
                wrapperToListener.delete(wrapper);
            }
        }

        listenerToWrappers.delete(listener);
    }

    return process;
};

const removeAllListeners = (event?: string | symbol): NodeJS.Process => {
    if (event) {
        const queue = eventHandlerQueueToSignal.get(event);

        if (queue) {
            for (const wrapper of queue) {
                const listener = wrapperToListener.get(wrapper);

                if (listener) {
                    const wrappers = listenerToWrappers.get(listener);

                    if (wrappers) {
                        wrappers.delete(wrapper);

                        if (wrappers.size < 1) {
                            listenerToWrappers.delete(listener);
                        }
                    }
                }

                wrapperToListener.delete(wrapper);
            }
        }
    } else {
        wrapperToListener.clear();
        listenerToWrappers.clear();
        eventHandlerQueueToSignal.clear();
    }

    return process;
};

process.on = on;
process.once = once;
process.removeListener = removeListener;
process.removeAllListeners = removeAllListeners;

let exiting = false;
let exitArgs: IArguments | undefined;

const exit: Function = function () {
    if (!exiting) {
        exiting = true;
        exitArgs = arguments;
    }
};

process.exit = exit as any;

import { Runner } from './runner';

Runner.main();