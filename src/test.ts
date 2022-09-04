import { Dispatcher, Thread } from './index.js'
// Dispatcher.config.logs.enabled = true

const logger = Dispatcher.config.logs.logger

let data = 0
const args = [123, 456]
const factor = 5

for (let i = 0; i < factor; i++) {
    const fn = (num1: number, num2: number) => num1 + num2
    const callback = (result: number) => data += result

    const thread = new Thread(fn, args)

    // const onStart = () => logger.log('onStart')
    // const onStop = (result: number) => logger.log('onStop', result)

    // thread.on('start', onStart)
    // thread.on('stop', onStop)

    thread.run(callback)
}

setTimeout(
    () => logger.log(
        '[ THREADMAN TEST RESULT ]',
        data === args[0] * factor + args[1] * factor ? 'Passed' : 'Error', '- Result:',
        data
    )
    , 200
)