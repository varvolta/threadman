import { ResourceLimits } from 'node:worker_threads'

interface ThreadOptions {
    autoStop?: boolean,
    delay?: number,
    resourceLimits?: ResourceLimits
}

interface ThreadEvents {
    start: Function[]
    stop: Function[],
    done: Function[],
    error: Function[]
}

interface DispatcherConfigThreads {
    maxParallel: number,
    autoStop: boolean,
    statistics: boolean
}

interface DispatcherConfigLogs {
    enabled: boolean,
    logger: any
}

interface DispatcherConfig {
    threads: DispatcherConfigThreads,
    logs: DispatcherConfigLogs,
}

export type {
    ThreadOptions,
    ThreadEvents,
    DispatcherConfigThreads,
    DispatcherConfigLogs,
    DispatcherConfig
}