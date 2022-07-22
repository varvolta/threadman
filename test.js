import { Dispatcher, Thread } from './index.js'

const fn = (num1, num2) => num1 + num2
const args = [123, 456]
let data = 0
const callback = result => data += result

const thread = new Thread(fn, args)
new Thread(fn, args).run(callback)

thread.on('stop', (result) => console.log('onStop', result))
thread.run().then(callback)

setTimeout(
    () => Dispatcher.config.logs.logger.log(
        '[ THREADMAN TEST RESULT ]',
        data === args[0] + args[1] + args[0] + args[1] ? 'Passed' : 'Error', '- Result:',
        data)
    , 200
)