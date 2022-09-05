import { Dispatcher, Thread } from './index.js'
Dispatcher.config.logs.enabled = true
Dispatcher.config.threads.statistics = true

const logger = Dispatcher.config.logs.logger

let data = 0
const args = [123, 456]
const parallel = 5

for (let i = 0; i < parallel; i++) {
    const fn = (num1: number, num2: number) => num1 + num2
    const callback = (result: number) => data += result

    new Thread(fn, args).run(callback)
}

setTimeout(
    () => logger.log(
        '[ THREADMAN TEST RESULT ]',
        data === args[0] * parallel + args[1] * parallel ? 'Passed' : 'Error', '- Result:',
        data
    )
    , 200
)