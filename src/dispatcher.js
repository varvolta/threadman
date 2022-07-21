import os from 'os'

class Dispatcher {

    static log = false
    static logger = console
    static threads = []
    static config = {
        threads: {
            maxConcurrent: os.cpus().length,
            autoStart: true,
            autoStop: true
        }
    }

    stopAll() {
        threads.forEach(thread => thread.stop())
    }

}

export default Dispatcher