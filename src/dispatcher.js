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

    stopAll() {
        threads.forEach(thread => thread.stop())
    }

}

export default Dispatcher