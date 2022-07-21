import { Dispatcher, Thread } from './index.js'

const a = 123
const b = 456
let c

new Thread((a, b) => a + b, [a, b]).then(data => c = data)

setTimeout(() => Dispatcher.config.logs.logger.log('[ THREADMAN TEST RESULT ]', c === a + b ? 'Passed' : 'Error', '- Result:', c), 100)