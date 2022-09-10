import { Dispatcher, Thread, Pool } from './index.js'
Dispatcher.config.logs.enabled = true
// Dispatcher.config.threads.statistics = true

const logger = Dispatcher.config.logs.logger

let data = 0
const args = [123, 456]
const fn = (num1: number, num2: number) => num1 + num2
const callback = (result: any) => {
	logger.log(result)
	logger.log(
		'[ THREADMAN TEST RESULT ]',
		data === results ? 'Test Passed' : 'Test Failed',
		'- Result:',
		data
	)
}

const parallel = 2
const pool = new Pool()

for (let i = 0; i < parallel; i++) {
	pool.add(new Thread(fn, args))
}

const results = args.reduce((c, n) => c + n) * parallel
pool.run(callback)
