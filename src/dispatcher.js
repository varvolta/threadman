import os from 'os'

class Dispatcher {

    static threads = []

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

    static register(thread) {
        this.threads.push(thread)
    }

    static unregister(thread) {
        const index = this.threads.indexOf(thread)
        if (index === -1) return
        this.threads.splice(this.threads.indexOf(thread), 1)
    }

    static stopAll() {
        this.threads.forEach(thread => thread.stop())
    }

}

export default Dispatcher