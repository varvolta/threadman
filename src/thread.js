import Any        from './any.js'
import Dispatcher from './dispatcher.js'
import { Worker } from 'worker_threads'

class Thread {
    #pathname = './src/worker.js'

    static autoStart = true
    static log = false
    static logger = console

    constructor(fn, ...args) {
        this.fn = fn
        this.args = args
        if (Thread.autoStart) return this.run()
    }

    run() {
        return new Promise((resolve, reject) => {
            const worker = new Worker(this.#pathname, { workerData: { fn: Any.encode(this.fn), args: Any.encode(this.args) } })
            worker.once('message', message => this.#message(message, resolve))
            worker.on('error', error => this.#error(error, reject))
            worker.on('exit', code => this.#exit(code, reject))
            this.worker = worker
            Dispatcher.threads.push(this)
        })
    }

    stop() {
        this.worker.terminate()
        this.worker = undefined
        Dispatcher.threads.splice(Dispatcher.threads.find(thread => thread === this), 1)
    }

    #message(message, resolve) {
        Thread.log && Thread.logger.info('[ THREADMAN THREAD DONE ]', message)
        this.stop()
        resolve(message)
    }

    #error(error, reject) {
        Thread.log && Thread.logger.error('[ THREADMAN THREAD ERROR ]', error)
        this.stop()
        reject(error)
    }

    #exit(code, reject) {
        if (code !== 0) {
            this.stop()
            reject(new Error(`stopped with ${code} exit code`))
        }
    }
}

export default Thread