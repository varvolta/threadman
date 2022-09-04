import { Dispatcher, Thread } from './index.js'

const logger = Dispatcher.config.logs.logger

let data = 0
const args = [123, 456]
const factor = 5

for (let i = 0; i < factor; i++) {
    const fn = (num1: number, num2: number) => num1 + num2
    const callback = (result: number) => data += result

    new Thread(fn, args).run(callback)
}

setTimeout(
    () => logger.log(
        '[ THREADMAN TEST RESULT ]',
        data === args[0] * factor + args[1] * factor ? 'Passed' : 'Error', '- Result:',
        data
    )
    , 200
)