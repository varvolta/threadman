import { Dispatcher, DispatcherConfig, DispatcherConfigLogs, DispatcherConfigThreads } from './dispatcher.js'
import { Thread, ThreadEvents, ThreadOptions }                                         from './thread.js'

const Threadman = {
    Thread,
    Dispatcher,
}

export {
    Dispatcher,
    Thread
}

export type {
    DispatcherConfig,
    DispatcherConfigThreads,
    DispatcherConfigLogs,
    ThreadEvents,
    ThreadOptions
}

export default Threadman