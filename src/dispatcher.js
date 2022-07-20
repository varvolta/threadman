class Dispatcher {
    static threads = []

    stopAll() {
        threads.forEach(thread => thread.stop())
    }
}

export default Dispatcher