import * as os from 'os'

import Thread  from 'thread.js'

class Dispatcher {

    static queue: Thread[] = []

    static config = {
        threads: {
            maxConcurrent: os.cpus().length,
            autoStop: true
        },
        logs: {
            enabled: false,
            logger: console
        }
    }

    static register(thread: Thread) {
        this.queue.push(thread)
        this.#checkAndRun()
    }

    static unregister(thread: Thread) {
        const index = this.queue.indexOf(thread)
        if (index === -1) return
        this.queue.splice(index, 1)
        this.#checkAndRun()
    }

    static #checkAndRun() {
        this.queue = this.queue.sort((a, b) => a.priority - b.priority)
        //add queue start and after maxConcurrent is allowed
    }

    static stopAll() {
        this.queue.forEach(thread => thread.stop())
    }

}

export default Dispatcher