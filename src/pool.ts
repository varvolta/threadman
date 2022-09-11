import { Thread } from './thread.js'

class Pool {
	static count = 0
	threads: Thread[] = []
	counter = 0
	args: any[] = []
	id: number

	constructor(threads: Thread[] = []) {
		this.threads = threads
		this.id = Pool.count
		Pool.count++
	}

	queue(thread: Thread) {
		this.threads.push(thread)
	}

	done(callback: Function) {
		this.counter -= 1
		if (this.counter === 0) {
			this.args.sort
			callback(this.args.sort((a, b) => a - b).map((item) => item.result))
		}
	}

	run(callback: Function) {
		this.counter = this.threads.length
		for (let i = 0; i < this.threads.length; i++) {
			const thread = this.threads[i]
			thread.run((result: unknown[]) => {
				this.args.push({ id: thread.id, result })
				this.done(callback)
			})
		}
	}

}

export { Pool }
