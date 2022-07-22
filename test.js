import { Dispatcher, Thread } from './index.js'

const fn = (a, b) => a + b
const a = 123
const b = 456
const args = [a, b]
let result = 0
const callback = data => result += data

new Thread(fn, args).run().then(callback)
new Thread(fn, args, callback).run()

setTimeout(() => Dispatcher.config.logs.logger.log('[ THREADMAN TEST RESULT ]', result === a + b + a + b ? 'Passed' : 'Error', '- Result:', result), 200)