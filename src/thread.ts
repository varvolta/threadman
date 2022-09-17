/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/ban-types */

import { ThreadEvents, ThreadOptions } from './interfaces.js'

import { Background } from './background.js'
import { Dispatcher } from './dispatcher.js'
import { Worker } from 'node:worker_threads'

class Thread extends Background {
	id?: number
	priority: number
	worker?: Worker
	fn: Function
	args: unknown[]
	options: ThreadOptions
	running: Boolean = false
	runCallback?: Function
	catchCallback?: Function
	startTime = 0
	endTime = 0

	constructor(
		fn: Function,
		args: unknown[],
		options: ThreadOptions = {},
		priority = 10
	) {
		super()
		if (typeof Worker != 'function')
			throw new Error('worker threads not available')
		this.fn = fn
		this.args = args
		this.options = options
		this.priority = priority
		Dispatcher.register(this)
	}

	run(callback: Function) {
		this.runCallback = callback
		Dispatcher.tryRun()
		return this
	}

	catch(callback: Function) {
		this.catchCallback = callback
		return this
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

	utilization() {
		return this.worker?.performance.eventLoopUtilization()
	}
}

export { Thread, ThreadOptions, ThreadEvents }