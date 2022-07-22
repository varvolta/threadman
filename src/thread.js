import Any               from './any.js'
import Dispatcher        from './dispatcher.js'
import { Worker }        from 'worker_threads'
import { fileURLToPath } from 'url'
import path              from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Thread {
    #pathname = __dirname + '/worker.js'

    events = {
        onStart: [],
        onDone: [],
        onStop: []
    }

    constructor(fn, args, callback, { autoStop } = {}) {
        this.fn = fn
        this.args = args
        this.callback = callback
        this.autoStop = autoStop
    }

    run() {
        return new Promise((resolve, reject) => {
            const worker = new Worker(this.#pathname, { workerData: { fn: Any.encode(this.fn), args: Any.encode(this.args) } })
            worker.once('message', message => this.#message(message, resolve))
            worker.on('error', error => this.#error(error, reject))
            worker.on('exit', code => this.#exit(code, reject))
            this.worker = worker
            Dispatcher.threads.push(this)
            this.fireEvent('onStart')
        })
    }

    stop() {
        if (this.worker === undefined) return
        this.worker.terminate()
        this.worker = undefined
        Dispatcher.threads.splice(Dispatcher.threads.find(thread => thread === this), 1)
        this.fireEvent('onStop')
    }

    addEventListener(event, fn) {
        this.events[event].push(fn)
    }

    removeEventListener(event, fn) {
        this.events[event].splice(this.events[event].indexOf(fn), 1)
    }

    fireEvent(event, args) {
        this.events[event].forEach(fn => fn(args))
    }

    #message(message, resolve) {
        if (Dispatcher.config.logs.enabled)
            Dispatcher.config.logs.logger.info('[ THREADMAN THREAD DONE ]', message)
        if (this.autoStop !== undefined ? this.autoStop : Dispatcher.config.threads.autoStop)
            this.stop()
        resolve(message)
        this.callback?.(message, null)
        this.fireEvent('onDone')
    }

    #error(error, reject) {
        if (Dispatcher.config.logs.enabled)
            Dispatcher.config.logs.logger.error('[ THREADMAN THREAD ERROR ]', error)
        this.stop()
        this.callback?.(null, error)
        reject(error)
    }

    #exit(code, reject) {
        this.stop()
        if (code === 0) return
        const error = new Error(`stopped with ${code} exit code`)
        this.callback?.(null, error)
        reject(error)
    }
}

export default Thread