import {
	Dispatcher,
	DispatcherConfig,
	DispatcherConfigLogs,
	DispatcherConfigThreads
} from './dispatcher.js'
import { Thread, ThreadEvents, ThreadOptions } from './thread.js'
import { Pool } from './pool.js'

const Threadman = {
	Thread,
	Dispatcher,
	Pool
}

export { Dispatcher, Thread, Pool }

export type {
	DispatcherConfig,
	DispatcherConfigThreads,
	DispatcherConfigLogs,
	ThreadEvents,
	ThreadOptions
}

export default Threadman
