import * as os from 'os'

import Thread  from 'thread.js'

class Dispatcher {

    static threads: Thread[] = []

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
        this.threads.push(thread)
    }

    static unregister(thread: Thread) {
        const index = this.threads.indexOf(thread)
        if (index === -1) return
        this.threads.splice(this.threads.indexOf(thread), 1)
    }

    static stopAll() {
        this.threads.forEach(thread => thread.stop())
    }

}

export default Dispatcher