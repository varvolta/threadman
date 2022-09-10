import { Thread } from './thread.js'

class Pool {
	threads: Thread[] = []
	counter = 0
	args: any[] = []

	constructor(threads: Thread[] = []) {
		this.threads = threads
	}

	add(thread: Thread) {
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
