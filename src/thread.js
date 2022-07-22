import Any               from './any.js'
import Dispatcher        from './dispatcher.js'
import { Worker }        from 'worker_threads'
import { fileURLToPath } from 'url'
import path              from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Thread {
    #pathname = __dirname + '/worker.js'

    #events = {
        start: [],
        stop: [],
        done: [],
        error: []
    }

    constructor(fn, args, { autoStop, delay } = {}) {
        this.fn = fn
        this.args = args
        this.autoStop = autoStop
        this.delay = delay
    }

    run(callback) {
        if (this.running) return new Error(`thread already running`)
        this.running = true
        this.callback = callback
        return new Promise((resolve, reject) => {
            if (this.delay) {
                setTimeout(() => this.#createWorker(resolve, reject), this.delay)
            } else {
                this.#createWorker(resolve, reject)
            }
        })
    }

    stop(result, error) {
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
    on(event, fn) {
        this.#events[event].push(fn)
    }

    off(event, fn) {
        this.#events[event].splice(this.events[event].indexOf(fn), 1)
    }

    fire(event, ...args) {
        this.#events[event].forEach(fn => fn(...args))
    }

    #createWorker(resolve, reject) {
        const worker = new Worker(this.#pathname, { workerData: { fn: Any.encode(this.fn), args: Any.encode(this.args) } })
        worker.once('message', message => this.#message(message, resolve))
        worker.on('error', error => this.#error(error, reject))
        worker.on('exit', code => this.#exit(code, reject))
        this.worker = worker
        Dispatcher.register(this)
        this.fire('start')
    }

    #message(message, resolve) {
        if (Dispatcher.config.logs.enabled)
            Dispatcher.config.logs.logger.info('[ THREADMAN THREAD DONE ]', message)
        if (this.autoStop !== undefined ? this.autoStop : Dispatcher.config.threads.autoStop)
            this.stop(message, null)
        resolve(message)
        this.callback?.(message, null)
        this.fire('done')
    }

    #error(error, reject) {
        if (Dispatcher.config.logs.enabled)
            Dispatcher.config.logs.logger.error('[ THREADMAN THREAD ERROR ]', error)
        this.stop(null, error)
        this.callback?.(null, error)
        reject(error)
    }

    #exit(code, reject) {
        if (code === 0) {
            this.stop(null, null)
        } else {
            const error = new Error(`stopped with ${code} exit code`)
            this.stop(null, error)
            this.callback?.(null, error)
            reject(error)
        }
    }
}

export default Thread