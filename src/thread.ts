/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/ban-types */

import { ResourceLimits, Worker } from 'node:worker_threads'

import { Dispatcher }             from './dispatcher.js'

interface ThreadOptions {
    autoStop?: boolean,
    delay?: number,
    resourceLimits?: ResourceLimits
}

interface ThreadEvents {
    start: Function[]
    stop: Function[],
    done: Function[],
    error: Function[]
}

class Thread {

    events: ThreadEvents = {
        start: [],
        stop: [],
        done: [],
        error: []
    }

    id?: number
    priority = 1
    worker?: Worker
    fn: Function
    args: unknown[]
    options: ThreadOptions
    running: Boolean = false
    callback?: Function
    startTime = 0
    endTime = 0

    constructor(fn: Function, args: unknown[], options: ThreadOptions = {}, priority = 1) {
        if (typeof Worker != 'function') throw new Error('worker threads not available')
        this.fn = fn
        this.args = args
        this.options = options
        this.priority = priority
        Dispatcher.register(this)
    }

    run(callback?: Function) {
        this.callback = callback
        Dispatcher.tryRun()
    }

    stop(result?: string, error?: Error) {
        if (this.worker === undefined) return
        this.worker.terminate()
        this.worker = undefined
        if (error) {
            this.fire('error', error)
        } else {
            this.fire('stop', result)
        }
        this.running = false
        Dispatcher.unregister(this)
        Dispatcher.tryRun()
    }

    on(event: keyof ThreadEvents, fn: Function) {
        this.events[event].push(fn)
    }

    off(event: keyof ThreadEvents, fn: Function) {
        const index = this.events[event].indexOf(fn)
        if (index !== -1)
            this.events[event].splice(index, 1)
    }

    offAll() {
        this.events.start = []
        this.events.stop = []
        this.events.done = []
        this.events.error = []
    }

    fire(event?: string, ...args: unknown[]) {
        this.events[event as keyof ThreadEvents].forEach(fn => fn(...args))
    }

}

export { Thread, ThreadOptions, ThreadEvents }