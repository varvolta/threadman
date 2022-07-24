import { ResourceLimits, Worker } from 'worker_threads'

import Any                        from './any.js'
import Dispatcher                 from './dispatcher.js'
import { fileURLToPath }          from 'url'
import path                       from 'path'
import { setTimeout }             from 'timers/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
    #pathname = __dirname + '/worker.js'

    #events: ThreadEvents = {
        start: [],
        stop: [],
        done: [],
        error: []
    }

    id?: number
    worker?: Worker
    fn: Function
    args: any[]
    options: ThreadOptions
    running: Boolean = false
    callback?: Function

    constructor(fn: Function, args: any[], options: ThreadOptions = {}) {
        this.fn = fn
        this.args = args
        this.options = options
    }

    run(callback?: Function) {
        if (this.running) throw new Error(`thread already running`)
        this.running = true
        this.callback = callback
        return new Promise(async (resolve, reject) => {
            if (this.options.delay)
                await setTimeout(this.options.delay)
            this.#createWorker(resolve, reject)
        })
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
        Dispatcher.unregister(this)
        this.running = false
    }

    on(event: string, fn: Function) {
        this.#events[event as keyof ThreadEvents].push(fn)
    }

    off(event: string, fn: Function) {
        const index = this.#events[event as keyof ThreadEvents].indexOf(fn)
        if (index !== -1)
            this.#events[event as keyof ThreadEvents].splice(index, 1)
    }

    offAll() {
        Object.keys(this.#events).forEach(key => this.#events[key as keyof ThreadEvents] = [])
    }

    fire(event: String, ...args: any[]) {
        this.#events[event as keyof ThreadEvents].forEach(fn => fn(...args))
    }

    #createWorker(resolve: Function, reject: Function) {
        const worker = new Worker(this.#pathname, {
            workerData: { fn: Any.encode(this.fn), args: Any.encode(this.args) },
            resourceLimits: this.options.resourceLimits
        })
        worker.once('message', message => this.#message(message, resolve))
        worker.on('error', error => this.#error(error, reject))
        worker.on('exit', code => this.#exit(code, reject))
        this.worker = worker
        this.id = worker.threadId
        Dispatcher.register(this)
        this.fire('start')
    }

    #message(message: string, resolve: Function) {
        if (Dispatcher.config.logs.enabled)
            Dispatcher.config.logs.logger.info('[ THREADMAN THREAD DONE ]', message)
        if (this.options.autoStop !== undefined ? this.options.autoStop : Dispatcher.config.threads.autoStop)
            this.stop(message, undefined)
        resolve(message)
        this.callback?.(message, null)
        this.fire('done')
    }

    #error(error: Error, reject: Function) {
        if (Dispatcher.config.logs.enabled)
            Dispatcher.config.logs.logger.error('[ THREADMAN THREAD ERROR ]', error)
        this.stop(undefined, error)
        this.callback?.(null, error)
        reject(error)
    }

    #exit(code: number, reject: Function) {
        if (code === 0) {
            this.stop(undefined, undefined)
        } else {
            const error = new Error(`stopped with ${code} exit code`)
            this.stop(undefined, error)
            this.callback?.(null, error)
            reject(error)
        }
    }
}

export default Thread