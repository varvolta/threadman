/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/ban-types */

import * as os from 'os'

import Any from './any.js'
import {
	DispatcherConfig
} from './interfaces.js'
import { Thread } from './thread.js'
import { Worker } from 'node:worker_threads'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Dispatcher {
	static pathname = __dirname + '/worker.js'

	static queue: Thread[] = []

	static config: DispatcherConfig = {
		threads: {
			maxParallel: os.cpus().length,
			autoStop: true,
			statistics: false
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
		if (
			this.queue.filter((thread) => thread.running === true).length >=
			this.config.threads.maxParallel
		)
			return
		this.queue = this.queue.sort((a, b) => b.priority - a.priority)
		const thread = this.queue.find((thread) => thread.running === false)
		if (!thread) return
		if (thread.running) thread.stop()
		thread.running = true
		thread.startTime = performance.now()
		setTimeout(() => this.#createWorker(thread), thread.options.delay || 0)
	}

	static #createWorker(thread: Thread) {
		const worker = new Worker(this.pathname, {
			workerData: {
				fn: Any.encode(thread.fn),
				args: Any.encode(thread.args)
			},
			resourceLimits: thread.options.resourceLimits
		})
		worker.once('message', (message) => this.#message(thread, message))
		worker.on('error', (error) => this.#error(thread, error))
		worker.on('exit', (code) => this.#exit(thread, code))
		thread.worker = worker
		thread.id = worker.threadId
		thread.fire('start')
	}

	static #message(thread: Thread, message: string) {
		if (this.config.logs.enabled)
			this.config.logs.logger.info(
				'[ THREADMAN THREAD DONE ]',
				'id: ' + thread.id,
				' --- ',
				message
			)
		if (
			thread.options.autoStop !== undefined
				? thread.options.autoStop
				: Dispatcher.config.threads.autoStop
		)
			thread.stop(message, undefined)
		thread.runCallback?.(message)
		thread.endTime = performance.now()
		if (this.config.logs.enabled && this.config.threads.statistics)
			this.config.logs.logger.info(
				'[ THREADMAN THREAD STATS ]',
				'id: ' + thread.id,
				' --- ',
				Math.ceil(thread.endTime - thread.startTime) + 'ms'
			)
		thread.fire('done')
	}

	static #error(thread: Thread, error: Error) {
		if (this.config.logs.enabled)
			this.config.logs.logger.error(
				'[ THREADMAN THREAD ERROR ]',
				'id: ' + thread.id,
				' --- ',
				error
			)
		thread.stop(undefined, error)
		thread.catchCallback?.(error)
	}

	static #exit(thread: Thread, code: number) {
		if (code !== 0) {
			const error = new Error(`stopped with ${code} exit code`)
			thread.stop(undefined, error)
			thread.catchCallback?.(error)
		}
	}

	static stopAll() {
		this.queue.forEach((thread) => thread.stop())
		this.queue = []
	}
}

export {
	Dispatcher,
	DispatcherConfig
}
