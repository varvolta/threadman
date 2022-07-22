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
        this.threads.splice(this.threads.find(_thread => _thread === thread), 1)
    }

    static stopAll() {
        this.threads.forEach(thread => thread.stop())
    }

}

export default Dispatcher