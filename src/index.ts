import { Dispatcher, DispatcherConfig } from './dispatcher.js'
import { Thread, ThreadEvents, ThreadOptions } from './thread.js'
import { Pool } from './pool.js'
import { DispatcherConfigLogs, DispatcherConfigThreads } from './interfaces.js'

const Threadman = {
	Thread,
	Dispatcher,
	Pool
}

export { Dispatcher, Thread, Pool }

export type {
	ThreadOptions,
	ThreadEvents,
	DispatcherConfigThreads,
	DispatcherConfigLogs,
	DispatcherConfig
}

export default Threadman
