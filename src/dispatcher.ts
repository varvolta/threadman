/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/ban-types */
import * as os from 'os'

import Any from './any.js'
import Thread from './thread.js'
import { Worker } from 'worker_threads'
import { fileURLToPath } from 'url'
import path from 'path'
import { setTimeout } from 'timers/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Dispatcher {
    static pathname = __dirname + '/worker.js'

    static queue: Thread[] = []

    static config = {
        threads: {
            maxParallel: os.cpus().length,
            autoStop: true,
            statistics: true
        },
        logs: {
            enabled: false,
            logger: console
        }
    }

    static register(thread: Thread) {
        this.queue.push(thread)
    }

    static unregister(thread: Thread | undefined) {
        if (!thread) return
        const index = this.queue.indexOf(thread)
        if (index === -1) return
        thread = undefined
        this.queue.splice(index, 1)
        this.tryRun()
    }

    static tryRun() {
        if (!this.queue.length) return
        if (this.queue.filter(thread => thread.running === true).length >= this.config.threads.maxParallel) return
        this.queue = this.queue.sort((a, b) => a.priority - b.priority)
        const thread = this.queue.find(thread => thread.running === false)
        if (!thread) return
        if (thread.running) thread.stop()
        thread.running = true
        thread.startTime = performance.now()
        return new Promise(async (resolve, reject) => {
            if (thread.options.delay)
                await setTimeout(thread.options.delay)
            this.#createWorker(thread, resolve, reject)
        })
    }

    static #createWorker(thread: Thread, resolve: Function, reject: Function) {
        const worker = new Worker(this.pathname, {
            workerData: { fn: Any.encode(thread.fn), args: Any.encode(thread.args) },
            resourceLimits: thread.options.resourceLimits
        })
        worker.once('message', message => this.#message(thread, message, resolve))
        worker.on('error', error => this.#error(thread, error, reject))
        worker.on('exit', code => this.#exit(thread, code, reject))
        thread.worker = worker
        thread.id = worker.threadId
        thread.fire('start')
    }

    static #message(thread: Thread, message: string, resolve: Function) {
        if (Dispatcher.config.logs.enabled)
            Dispatcher.config.logs.logger.info('[ THREADMAN THREAD DONE ]', 'id: ' + thread.id, ' --- ', message)
        if (thread.options.autoStop !== undefined ? thread.options.autoStop : Dispatcher.config.threads.autoStop)
            thread.stop(message, undefined)
        resolve(message)
        thread.callback?.(message, null)
        thread.endTime = performance.now()
        if (Dispatcher.config.logs.enabled)
            Dispatcher.config.logs.logger.info('[ THREADMAN THREAD STATISTICS ]', 'id: ' + thread.id, ' --- ', Math.ceil(thread.endTime - thread.startTime) + 'ms')
        thread.fire('done')
    }

    static #error(thread: Thread, error: Error, reject: Function) {
        if (Dispatcher.config.logs.enabled)
            Dispatcher.config.logs.logger.error('[ THREADMAN THREAD ERROR ]', 'id: ' + thread.id, ' --- ', error)
        thread.stop(undefined, error)
        thread.callback?.(null, error)
        reject(error)
    }

    static #exit(thread: Thread, code: number, reject: Function) {
        if (code === 0) {
            thread.stop(undefined, undefined)
        } else {
            const error = new Error(`stopped with ${code} exit code`)
            thread.stop(undefined, error)
            thread.callback?.(null, error)
            reject(error)
        }
    }

    static stopAll() {
        this.queue.forEach(thread => thread.stop())
        this.queue = []
    }

}

export default Dispatcher