import { Dispatcher, Thread } from './index.js'

const fn = (num1: number, num2: number) => num1 + num2
const args = [123, 456]
let data = 0
const callback = (result: any) => data += result

const thread = new Thread(fn, args)
new Thread(fn, args).run(callback)

const onStop = (result: any) => console.log('onStop', result)

thread.on('stop', onStop)
thread.off('stop', onStop)
thread.offAll()

thread.run().then(callback)

setTimeout(
    () => Dispatcher.config.logs.logger.log(
        '[ THREADMAN TEST RESULT ]',
        data === args[0] + args[1] + args[0] + args[1] ? 'Passed' : 'Error', '- Result:',
        data)
    , 200
)