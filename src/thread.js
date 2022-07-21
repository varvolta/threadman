import Any               from './any.js'
import Dispatcher        from './dispatcher.js'
import { Worker }        from 'worker_threads'
import { fileURLToPath } from 'url'
import path              from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Thread {
    #pathname = __dirname + '/worker.js'

    constructor(fn, args, { autoStart, autoStop } = {}) {
        this.fn = fn
        this.args = args
        this.autoStart = autoStart ?? Dispatcher.config.threads.autoStart
        this.autoStop = autoStop ?? Dispatcher.config.threads.autoStop

        if (this.autoStart)
            return this.run()
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
        if (Dispatcher.config.logs.enabled)
            Dispatcher.config.logs.logger.info('[ THREADMAN THREAD DONE ]', message);

        if (this.autoStop)
            this.stop()
        
        resolve(message)
    }

    #error(error, reject) {
        if (Dispatcher.config.logs.enabled)
            Dispatcher.config.logs.logger.error('[ THREADMAN THREAD ERROR ]', error);

        this.stop()
        reject(error)
    }

    #exit(code, reject) {
        if (code === 0)
            return;

        this.stop()
        reject(new Error(`stopped with exit code: ${code}`))
    }
}

export default Thread
