import { Dispatcher, Thread } from './index.js'

const fn = (a, b) => a + b
const a = 123
const b = 456
const args = [a, b]
let data = 0
const callback = result => data += result

new Thread(fn, args).run().then(callback)
new Thread(fn, args).run(callback)

setTimeout(() => Dispatcher.config.logs.logger.log('[ THREADMAN TEST RESULT ]', data === a + b + a + b ? 'Passed' : 'Error', '- Result:', data), 200)