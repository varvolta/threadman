import { parentPort, workerData } from 'node:worker_threads'

import Any                        from './any.js'

let message

if (workerData?.fn) {
    let args = workerData.args ? Any.decode(workerData.args) : []
    message = await Any.decode(workerData.fn)(...args)
}

parentPort.postMessage(message)