import { Dispatcher, Thread, Pool } from './index.js'
Dispatcher.config.logs.enabled = true
// Dispatcher.config.threads.statistics = true

const logger = Dispatcher.config.logs.logger

const args = [123, 456]
const fn = (num1: number, num2: number) => num1 + num2
const parallel = 2
const data = args.reduce((c, n) => c + n) * parallel

const callback = (results: any) => {
	logger.log(
		'[ THREADMAN TEST RESULT ]',
		data === results.reduce((c: number, n: number) => c + n) ? 'Test Passed' : 'Test Failed',
		'- Result:',
		data
	)
}

const pool = new Pool()

for (let i = 0; i < parallel; i++) {
	pool.add(new Thread(fn, args))
}

pool.run(callback)
